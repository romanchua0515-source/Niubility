import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ADMIN_COOKIE, ADMIN_COOKIE_VALUE } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";
const ANTHROPIC_VERSION = "2023-06-01";
const SYSTEM_PROMPT =
  "You are a tool curator for Niubility, a Web3 and AI tools aggregator. Generate a tool listing based on the tool name provided. Use your knowledge about this tool to fill in accurate details. If you are not confident about a field, make a reasonable inference. Return ONLY valid JSON, no markdown, no explanation.";

const LOG = "[import-tool]";

// -----------------------------------------------------------------------------
// Alias maps — bridge the AI's canonical names to current DB slugs.
// Round 2 will rename DB slugs (e.g. "culture" → "media-community"), at which
// point the matching alias entry can be deleted. Until then, the AI is taught
// the canonical names in the prompt and the server translates on publish.
// -----------------------------------------------------------------------------
const CATEGORY_ALIASES: Record<string, string> = {
  security: "security-stack",
  "wallets-browsers": "wallets",
  "media-community": "culture",
};

const SUBCATEGORY_ALIASES: Record<string, string> = {
  "social-networks": "community",
  "web3-social": "community",
  "publishing-platforms": "media",
  newsletters: "media",
  newsletter: "media",
};

// Reverse map: DB slug → canonical name used in the prompt / by the client form.
const DB_TO_CANONICAL_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_ALIASES).map(([canonical, db]) => [db, canonical]),
);

type Action = "generate" | "checkOnly" | "publish";

type GeneratedTool = {
  name: string;
  name_zh: string;
  description: string;
  description_zh: string;
  best_for: string;
  best_for_zh: string;
  pricing: string;
  tags: string[];
  category_slug: string;
  subcategory_slug: string;
  website_url: string;
};

type Taxonomy = {
  categories: Array<{ slug: string; title: string }>;
  categorySlugs: Set<string>;
  subcategoriesByCategory: Map<string, Set<string>>;
};

type Resolved = { dbSlug: string; alias: string | null };

function err(status: number, message: string, detail?: string) {
  return NextResponse.json(
    detail ? { error: message, detail } : { error: message },
    { status },
  );
}

function extractJson(text: string): GeneratedTool | null {
  const direct = safeParse(text);
  if (direct) return direct;
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    const cleaned = safeParse(fence[1]);
    if (cleaned) return cleaned;
  }
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    return safeParse(text.slice(first, last + 1));
  }
  return null;
}

function safeParse(raw: string): GeneratedTool | null {
  try {
    const parsed = JSON.parse(raw.trim());
    if (parsed && typeof parsed === "object") return parsed as GeneratedTool;
  } catch {
    /* ignore */
  }
  return null;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function str(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed.length > 0 ? trimmed : null;
}

// -----------------------------------------------------------------------------
// Taxonomy — loaded once per request from Supabase via service role client.
// Drives both prompt construction (what slugs to teach the AI) and strict
// validation at publish time (what slugs the DB will actually accept).
// -----------------------------------------------------------------------------
async function loadTaxonomy(svc: SupabaseClient): Promise<Taxonomy> {
  const { data: cats, error: catErr } = await svc
    .from("categories")
    .select("id, slug, title");
  if (catErr) throw new Error(`categories fetch failed: ${catErr.message}`);

  const { data: subs, error: subErr } = await svc
    .from("subcategories")
    .select("slug, category_id");
  if (subErr) throw new Error(`subcategories fetch failed: ${subErr.message}`);

  const catsById = new Map<string, { slug: string; title: string }>();
  const categorySlugs = new Set<string>();
  for (const c of cats ?? []) {
    const row = c as { id: string; slug: string; title: string };
    catsById.set(row.id, { slug: row.slug, title: row.title });
    categorySlugs.add(row.slug);
  }

  const subcategoriesByCategory = new Map<string, Set<string>>();
  for (const s of subs ?? []) {
    const row = s as { slug: string; category_id: string };
    const cat = catsById.get(row.category_id);
    if (!cat) continue;
    let set = subcategoriesByCategory.get(cat.slug);
    if (!set) {
      set = new Set();
      subcategoriesByCategory.set(cat.slug, set);
    }
    set.add(row.slug);
  }

  return {
    categories: Array.from(catsById.values()),
    categorySlugs,
    subcategoriesByCategory,
  };
}

/**
 * Resolve a proposed category_slug to a DB-valid slug.
 *  - If proposed is already a DB slug → return it unchanged.
 *  - If proposed matches an alias entry whose target is a DB slug → use it.
 *  - Else return null; caller rejects with 422.
 */
function resolveCategorySlug(
  proposed: string,
  taxonomy: Taxonomy,
): Resolved | null {
  if (taxonomy.categorySlugs.has(proposed)) {
    return { dbSlug: proposed, alias: null };
  }
  const aliased = CATEGORY_ALIASES[proposed];
  if (aliased && taxonomy.categorySlugs.has(aliased)) {
    return { dbSlug: aliased, alias: proposed };
  }
  return null;
}

/**
 * Resolve a proposed subcategory_slug. Must be valid *under the resolved
 * category's* subcategory set — a subcategory slug that exists globally but
 * under a different parent is rejected (prevents cross-category orphans).
 */
function resolveSubcategorySlug(
  proposed: string,
  categoryDbSlug: string,
  taxonomy: Taxonomy,
): Resolved | null {
  const valid = taxonomy.subcategoriesByCategory.get(categoryDbSlug);
  if (!valid || valid.size === 0) return null;
  if (valid.has(proposed)) {
    return { dbSlug: proposed, alias: null };
  }
  const aliased = SUBCATEGORY_ALIASES[proposed];
  if (aliased && valid.has(aliased)) {
    return { dbSlug: aliased, alias: proposed };
  }
  return null;
}

/**
 * Build the per-call user prompt. Category list uses canonical names (alias
 * keys where an alias exists, otherwise the DB slug). Subcategory list shows
 * the real DB slugs under each canonical category so the AI can't invent new
 * leaves.
 */
function buildUserPrompt(
  name: string,
  url: string,
  taxonomy: Taxonomy,
): string {
  const categoryPairs = taxonomy.categories.map((c) => ({
    canonical: DB_TO_CANONICAL_CATEGORY[c.slug] ?? c.slug,
    dbSlug: c.slug,
  }));
  const categoryList = categoryPairs.map((p) => p.canonical).join(", ");
  const subcategoryBlock = categoryPairs
    .map(({ canonical, dbSlug }) => {
      const subs = Array.from(
        taxonomy.subcategoriesByCategory.get(dbSlug) ?? [],
      );
      return `- ${canonical}: ${subs.length > 0 ? subs.join(", ") : "(no subcategories defined)"}`;
    })
    .join("\n");

  return `Tool name: ${name}
Official URL: ${url}

Valid category_slug values: ${categoryList}

Valid subcategory_slug per category:
${subcategoryBlock}

Return ONLY this JSON structure:
{
  "name": "Tool name in English",
  "name_zh": "工具中文名称",
  "description": "One paragraph description in English, max 150 chars",
  "description_zh": "中文描述，最多150字",
  "best_for": "Who this tool is best for, max 80 chars",
  "best_for_zh": "最适合谁使用，最多80字",
  "pricing": "Free | Freemium | Paid | Enterprise",
  "tags": ["tag1", "tag2", "tag3"],
  "category_slug": "one value from the category list above",
  "subcategory_slug": "one value from the subcategory list for the chosen category",
  "website_url": "${url}"
}`;
}

/**
 * Structured single-line log for every import attempt. One line per request
 * makes it trivial to `grep result=FAIL` in Vercel logs.
 */
function logAttempt(fields: {
  action: Action;
  name: string;
  proposedCat: string | null;
  finalCat: string | null;
  proposedSub: string | null;
  finalSub: string | null;
  result: string;
}) {
  const q = (v: string | null) => `"${v ?? "-"}"`;
  console.log(
    `${LOG} ${fields.action} | name=${q(fields.name)} | ` +
      `proposed_cat=${q(fields.proposedCat)} | final_cat=${q(fields.finalCat)} | ` +
      `proposed_sub=${q(fields.proposedSub)} | final_sub=${q(fields.finalSub)} | ` +
      `result=${fields.result}`,
  );
}

function logAlias(kind: "category" | "subcategory", from: string, to: string) {
  console.log(`${LOG} alias-applied: ${kind} "${from}" → "${to}"`);
}

// -----------------------------------------------------------------------------
// Duplicate detection — two independent .eq() queries (PostgREST's `or` param
// chokes on URLs with `/`, `&`, `?`, `=`).
// -----------------------------------------------------------------------------
async function findDuplicate(
  url: string,
  slug?: string,
): Promise<{ id: string; name: string; conflict: "url" | "slug" } | null> {
  const svc = createServiceClient();
  if (!svc) {
    console.warn(
      `${LOG} service client unavailable — skipping duplicate check`,
    );
    return null;
  }

  const { data: byUrl, error: urlErr } = await svc
    .from("tools")
    .select("id, name")
    .eq("website_url", url)
    .maybeSingle();
  if (urlErr) {
    console.warn(`${LOG} duplicate (url) lookup error:`, urlErr.message);
  }
  if (byUrl) {
    return {
      id: byUrl.id as string,
      name: byUrl.name as string,
      conflict: "url",
    };
  }

  if (slug) {
    const { data: bySlug, error: slugErr } = await svc
      .from("tools")
      .select("id, name")
      .eq("slug", slug)
      .maybeSingle();
    if (slugErr) {
      console.warn(`${LOG} duplicate (slug) lookup error:`, slugErr.message);
    }
    if (bySlug) {
      return {
        id: bySlug.id as string,
        name: bySlug.name as string,
        conflict: "slug",
      };
    }
  }

  return null;
}

function resolveAction(body: Record<string, unknown>): Action {
  const explicit = body.action;
  if (explicit === "generate" || explicit === "checkOnly" || explicit === "publish") {
    return explicit;
  }
  if (body.checkOnly === true) return "checkOnly";
  return "generate";
}

export async function POST(req: NextRequest) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

    const authHeader = req.headers.get("authorization") ?? "";
    const bearerOk =
      adminPassword !== undefined &&
      adminPassword !== "" &&
      authHeader === `Bearer ${adminPassword}`;
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const adminAuthCookies = allCookies.filter((c) => c.name === ADMIN_COOKIE);
    const adminCookieValue = cookieStore.get(ADMIN_COOKIE)?.value;
    const cookieOk = adminCookieValue === ADMIN_COOKIE_VALUE;

    // Diagnostic log — runs on EVERY request (PASS and FAIL) so we can diff
    // the PASS request just before a FAIL and see what actually changed in
    // the cookie jar at the moment the 401 started happening. Keep the 401
    // warn below intact so existing grep alerts still fire on failure.
    console.log(
      `${LOG} AUTH-CHECK | ` +
        `result=${cookieOk || bearerOk ? "PASS" : "FAIL"} | ` +
        `total_cookies=${allCookies.length} | ` +
        `cookie_names=[${allCookies.map((c) => c.name).join(",")}] | ` +
        `admin_auth_count=${adminAuthCookies.length} | ` +
        `admin_auth_values=[${adminAuthCookies.map((c) => `"${c.value}"`).join(",")}] | ` +
        `has_bearer=${authHeader.length > 0 ? "yes" : "no"} | ` +
        `region=${process.env.VERCEL_REGION ?? "unknown"} | ` +
        `request_id=${req.headers.get("x-vercel-id") ?? "unknown"}`,
    );

    if (!bearerOk && !cookieOk) {
      console.warn(
        `${LOG} 401 — no valid bearer or admin cookie. ` +
          `cookies_present=[${allCookies.map((c) => c.name).join(",")}] ` +
          `admin_cookie_seen=${adminCookieValue !== undefined} ` +
          `has_auth_header=${authHeader.length > 0}`,
      );
      return err(401, "Unauthorized");
    }

    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch (e) {
      console.warn(`${LOG} 400 — invalid JSON body`, e);
      return err(400, "Invalid JSON body");
    }

    const action = resolveAction(body);

    if (action === "publish") {
      return handlePublish(body);
    }

    const url = str(body.url);
    if (!url || !/^https?:\/\//i.test(url)) {
      return err(400, "Body must include a valid http(s) url");
    }

    const incomingName = str(body.name);
    const incomingSlug = incomingName ? slugify(incomingName) : undefined;

    const existing = await findDuplicate(url, incomingSlug);
    if (existing) {
      console.log(
        `${LOG} 409 — duplicate ${existing.conflict}=${existing.conflict === "url" ? url : incomingSlug} existing="${existing.name}"`,
      );
      return NextResponse.json(
        {
          error: "duplicate",
          message: "Already exists",
          existing_name: existing.name,
          conflict: existing.conflict,
        },
        { status: 409 },
      );
    }

    if (action === "checkOnly") {
      console.log(`${LOG} 200 — checkOnly pass, no duplicate for ${url}`);
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // action === "generate"
    const name = str(body.name);
    if (!name) {
      return err(400, "Body must include a non-empty name");
    }
    if (!apiKey) {
      console.error(`${LOG} 500 — ANTHROPIC_API_KEY missing from environment`);
      return err(500, "ANTHROPIC_API_KEY is not configured on the server");
    }

    return handleGenerate(name, url, apiKey);
  } catch (e) {
    const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    console.error(`${LOG} unexpected server error:`, msg, e);
    return err(500, "Unexpected server error", msg);
  }
}

// -----------------------------------------------------------------------------
// handleGenerate — loads taxonomy, builds a dynamic prompt, calls Anthropic.
// The AI's response is returned to the client *without* alias resolution so
// the form stays in canonical-slug space (matching CATEGORY_OPTIONS on the
// client). The publish path does the final resolution + strict validation.
// We still preview-validate here so the log flags bad AI output early.
// -----------------------------------------------------------------------------
async function handleGenerate(name: string, url: string, apiKey: string) {
  const svc = createServiceClient();
  if (!svc) {
    console.error(
      `${LOG} 500 — service client unavailable; cannot load taxonomy for prompt`,
    );
    return err(
      500,
      "Server is missing Supabase service role credentials",
      "SUPABASE_SERVICE_ROLE_KEY is required to build the category prompt",
    );
  }

  let taxonomy: Taxonomy;
  try {
    taxonomy = await loadTaxonomy(svc);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`${LOG} 500 — taxonomy load failed:`, msg);
    return err(500, "Could not load category taxonomy", msg);
  }

  const userPrompt = buildUserPrompt(name, url, taxonomy);

  const requestBody = {
    model: MODEL,
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  };

  let aiText = "";
  try {
    const aiRes = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify(requestBody),
    });

    if (!aiRes.ok) {
      const rawText = await aiRes.text();
      console.error(`${LOG} Anthropic error body:`, rawText.slice(0, 2000));
      let detail: string | undefined;
      try {
        const parsed = JSON.parse(rawText) as {
          error?: { type?: string; message?: string };
        };
        if (parsed?.error?.message) {
          detail = `${parsed.error.type ?? "error"}: ${parsed.error.message}`;
        }
      } catch {
        detail = rawText.slice(0, 500);
      }
      logAttempt({
        action: "generate",
        name,
        proposedCat: null,
        finalCat: null,
        proposedSub: null,
        finalSub: null,
        result: `FAIL_ANTHROPIC_${aiRes.status}`,
      });
      return err(
        500,
        "AI generation failed",
        detail ?? `upstream status ${aiRes.status}`,
      );
    }

    const aiJson = (await aiRes.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };
    aiText = (aiJson.content ?? [])
      .filter((c) => c.type === "text" && typeof c.text === "string")
      .map((c) => c.text as string)
      .join("\n")
      .trim();
    if (!aiText) {
      console.error(`${LOG} Anthropic returned empty content`, aiJson);
      logAttempt({
        action: "generate",
        name,
        proposedCat: null,
        finalCat: null,
        proposedSub: null,
        finalSub: null,
        result: "FAIL_EMPTY_AI",
      });
      return err(500, "AI generation failed", "empty content in response");
    }
  } catch (e) {
    const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    console.error(`${LOG} Anthropic fetch threw:`, msg, e);
    logAttempt({
      action: "generate",
      name,
      proposedCat: null,
      finalCat: null,
      proposedSub: null,
      finalSub: null,
      result: "FAIL_FETCH",
    });
    return err(500, "AI generation failed", msg);
  }

  const parsed = extractJson(aiText);
  if (!parsed) {
    console.error(
      `${LOG} 422 — could not extract JSON from AI text:`,
      aiText.slice(0, 500),
    );
    logAttempt({
      action: "generate",
      name,
      proposedCat: null,
      finalCat: null,
      proposedSub: null,
      finalSub: null,
      result: "FAIL_PARSE",
    });
    return err(422, "Could not parse AI response");
  }

  parsed.website_url = url;

  const proposedCat = str(parsed.category_slug);
  const proposedSub = str(parsed.subcategory_slug);
  const catRes = proposedCat ? resolveCategorySlug(proposedCat, taxonomy) : null;
  const subRes =
    catRes && proposedSub
      ? resolveSubcategorySlug(proposedSub, catRes.dbSlug, taxonomy)
      : null;

  logAttempt({
    action: "generate",
    name: parsed.name ?? name,
    proposedCat,
    finalCat: catRes?.dbSlug ?? null,
    proposedSub,
    finalSub: subRes?.dbSlug ?? null,
    result: catRes && subRes ? "OK" : "WARN_UNRESOLVED",
  });

  return NextResponse.json(parsed, { status: 200 });
}

// -----------------------------------------------------------------------------
// handlePublish — strict validation before insert. No silent fallback: invalid
// slugs are rejected with 422 so the failure surfaces in the UI instead of
// silently producing orphaned tools under the wrong category.
// -----------------------------------------------------------------------------
async function handlePublish(body: Record<string, unknown>) {
  const svc = createServiceClient();
  if (!svc) {
    console.error(
      `${LOG} 500 — SUPABASE_SERVICE_ROLE_KEY (or URL) missing; cannot publish`,
    );
    return err(
      500,
      "Server is missing Supabase service role credentials",
      "SUPABASE_SERVICE_ROLE_KEY is required to bypass RLS for admin writes",
    );
  }

  let taxonomy: Taxonomy;
  try {
    taxonomy = await loadTaxonomy(svc);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`${LOG} 500 — taxonomy load failed:`, msg);
    return err(500, "Could not load category taxonomy", msg);
  }

  const name = str(body.name);
  const description = str(body.description);
  const website_url = str(body.website_url);
  const proposedCat = str(body.category_slug);
  const proposedSub = str(body.subcategory_slug);
  const pricing = str(body.pricing) ?? "Unknown";
  const best_for = str(body.best_for) ?? "TBD";

  if (!name) return err(400, "publish: name is required");
  if (!description) return err(400, "publish: description is required");
  if (!website_url || !/^https?:\/\//i.test(website_url)) {
    return err(400, "publish: website_url must be a valid http(s) URL");
  }
  if (!proposedCat) return err(400, "publish: category_slug is required");
  if (!proposedSub) return err(400, "publish: subcategory_slug is required");

  const catRes = resolveCategorySlug(proposedCat, taxonomy);
  if (!catRes) {
    const validList = Array.from(taxonomy.categorySlugs)
      .map((db) => DB_TO_CANONICAL_CATEGORY[db] ?? db)
      .join(", ");
    logAttempt({
      action: "publish",
      name,
      proposedCat,
      finalCat: null,
      proposedSub,
      finalSub: null,
      result: "FAIL_INVALID_CATEGORY",
    });
    return err(
      422,
      `Invalid category_slug "${proposedCat}". Valid options: ${validList}`,
    );
  }
  if (catRes.alias) logAlias("category", catRes.alias, catRes.dbSlug);

  const subRes = resolveSubcategorySlug(proposedSub, catRes.dbSlug, taxonomy);
  if (!subRes) {
    const validSubs = Array.from(
      taxonomy.subcategoriesByCategory.get(catRes.dbSlug) ?? [],
    ).join(", ");
    logAttempt({
      action: "publish",
      name,
      proposedCat,
      finalCat: catRes.dbSlug,
      proposedSub,
      finalSub: null,
      result: "FAIL_INVALID_SUBCATEGORY",
    });
    return err(
      422,
      `Invalid subcategory_slug "${proposedSub}" for category "${catRes.dbSlug}". Valid options: ${validSubs || "(none)"}`,
    );
  }
  if (subRes.alias) logAlias("subcategory", subRes.alias, subRes.dbSlug);

  const category_slug = catRes.dbSlug;
  const subcategory_slug = subRes.dbSlug;

  const slug = slugify(name);
  const existing = await findDuplicate(website_url, slug);
  if (existing) {
    logAttempt({
      action: "publish",
      name,
      proposedCat,
      finalCat: category_slug,
      proposedSub,
      finalSub: subcategory_slug,
      result: `DUPLICATE_${existing.conflict.toUpperCase()}`,
    });
    return NextResponse.json(
      {
        error: "duplicate",
        message: "Already exists",
        existing_name: existing.name,
        conflict: existing.conflict,
      },
      { status: 409 },
    );
  }

  const tagsRaw = body.tags;
  const tags: string[] = Array.isArray(tagsRaw)
    ? tagsRaw.filter((t): t is string => typeof t === "string")
    : typeof tagsRaw === "string"
      ? tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : [];

  const payload: Record<string, unknown> = {
    slug,
    name,
    description,
    description_zh: str(body.description_zh),
    best_for,
    best_for_zh: str(body.best_for_zh),
    pricing,
    tags,
    category_slug,
    subcategory_slug,
    website_url,
    affiliate_url: str(body.affiliate_url),
    is_featured: false,
    featured_order: 0,
    is_hot: false,
    hot_order: 0,
    is_quick_pick: false,
    quick_pick_order: 0,
  };

  const nameZh = str(body.name_zh);
  if (nameZh) payload.name_zh = nameZh;

  const { error: dbError, data: inserted } = await svc
    .from("tools")
    .insert(payload)
    .select("id, slug, name")
    .single();

  if (dbError) {
    console.error(`${LOG} publish insert failed:`, dbError.message);
    logAttempt({
      action: "publish",
      name,
      proposedCat,
      finalCat: category_slug,
      proposedSub,
      finalSub: subcategory_slug,
      result: `FAIL_DB_${dbError.code ?? "UNKNOWN"}`,
    });
    return err(500, "Publish failed", dbError.message);
  }

  logAttempt({
    action: "publish",
    name: inserted?.name ?? name,
    proposedCat,
    finalCat: category_slug,
    proposedSub,
    finalSub: subcategory_slug,
    result: "OK",
  });

  // Server-side cache invalidation — the client intentionally does NOT call
  // router.refresh() anymore because that forces the protected layout to
  // re-run server-side, and Vercel's edge→function cookie-drop bug
  // occasionally makes it redirect to /admin/login for a frame. Marking the
  // path stale lets the list refresh on the user's next navigation without
  // the flicker.
  revalidatePath("/admin/tools");

  return NextResponse.json(
    { ok: true, id: inserted?.id, slug: inserted?.slug, name: inserted?.name },
    { status: 200 },
  );
}
