import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
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

const FALLBACK_SUBCATEGORY = "ai-tools";

/**
 * AI-generated `subcategory_slug` values sometimes invent leaves that don't
 * exist in the `subcategories` table (e.g. "ai-search"). Insertion would
 * fail on the foreign-key constraint, so we resolve to a valid slug:
 *   1. Use the proposed slug if it exists.
 *   2. Otherwise, fall back to the first subcategory under the given parent.
 *   3. Otherwise, use FALLBACK_SUBCATEGORY as a final safe default.
 */
async function resolveSubcategorySlug(
  svc: ReturnType<typeof createServiceClient>,
  proposed: string,
  categorySlug: string,
): Promise<string> {
  if (!svc) return proposed;

  const { data: exact } = await svc
    .from("subcategories")
    .select("slug")
    .eq("slug", proposed)
    .maybeSingle();
  if (exact?.slug) return exact.slug as string;

  const { data: parent } = await svc
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();
  if (parent?.id) {
    const { data: siblings } = await svc
      .from("subcategories")
      .select("slug")
      .eq("category_id", parent.id)
      .limit(1);
    const first = siblings?.[0]?.slug;
    if (typeof first === "string" && first.length > 0) {
      console.warn(
        `${LOG} subcategory_slug "${proposed}" not found; falling back to "${first}" under category "${categorySlug}"`,
      );
      return first;
    }
  }

  console.warn(
    `${LOG} subcategory_slug "${proposed}" not found and no sibling available; using "${FALLBACK_SUBCATEGORY}"`,
  );
  return FALLBACK_SUBCATEGORY;
}

/**
 * A row matches if its website_url equals `url` OR its slug equals `slug`.
 * Done as two independent .eq() queries instead of a single .or() filter so
 * we don't have to worry about comma/URL-encoding quirks in PostgREST's
 * `or` param (URLs contain `/`, `&`, `?`, `=` that can break or-string parsing).
 */
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
  // Backwards-compat: older clients used { checkOnly: true } without an action.
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
    const adminCookieValue = cookieStore.get(ADMIN_COOKIE)?.value;
    const cookieOk = adminCookieValue === ADMIN_COOKIE_VALUE;
    if (!bearerOk && !cookieOk) {
      const cookieNames = cookieStore.getAll().map((c) => c.name);
      console.warn(
        `${LOG} 401 — no valid bearer or admin cookie. ` +
          `cookies_present=[${cookieNames.join(",")}] ` +
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
    console.log(`${LOG} action=${action}`);

    // --------------------------------------------------------------
    // action: "publish" — server-side insert via service role client
    // (bypasses RLS so the admin console doesn't need anon write grants)
    // --------------------------------------------------------------
    if (action === "publish") {
      return handlePublish(body);
    }

    // ---- The remaining actions (generate + checkOnly) need a url ----
    const url = str(body.url);
    if (!url || !/^https?:\/\//i.test(url)) {
      return err(400, "Body must include a valid http(s) url");
    }

    // If the client supplied a name (batch does; legacy `{checkOnly: true, url}`
    // may not), derive the slug and also block slug collisions so we never hit
    // "duplicate key value violates unique constraint tools_slug_key".
    const incomingName = str(body.name);
    const incomingSlug = incomingName ? slugify(incomingName) : undefined;

    // Duplicate detection runs for both checkOnly and generate.
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
// handleGenerate — Claude API call that drafts a tool listing from name+url
// -----------------------------------------------------------------------------
async function handleGenerate(name: string, url: string, apiKey: string) {
  const userPrompt = `Tool name: ${name}
Official URL: ${url}

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
  "category_slug": "ai | research-insights | security | wallets-browsers | jobs | media-community",
  "subcategory_slug": "suggest based on category",
  "website_url": "${url}"
}`;

  const requestBody = {
    model: MODEL,
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  };

  console.log(
    `${LOG} calling Anthropic — endpoint=${ANTHROPIC_URL} model=${MODEL}`,
  );

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

    console.log(
      `${LOG} Anthropic response status=${aiRes.status} ${aiRes.statusText}`,
    );

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
      return err(500, "AI generation failed", "empty content in response");
    }
  } catch (e) {
    const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    console.error(`${LOG} Anthropic fetch threw:`, msg, e);
    return err(500, "AI generation failed", msg);
  }

  const parsed = extractJson(aiText);
  if (!parsed) {
    console.error(
      `${LOG} 422 — could not extract JSON from AI text:`,
      aiText.slice(0, 500),
    );
    return err(422, "Could not parse AI response");
  }

  parsed.website_url = url;
  console.log(`${LOG} 200 — generated tool "${parsed.name}"`);
  return NextResponse.json(parsed, { status: 200 });
}

// -----------------------------------------------------------------------------
// handlePublish — takes already-reviewed tool data and inserts via service role
// client. All batch/single inserts now route through here so the anon key never
// tries a write (RLS keeps public anon read-only).
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

  const name = str(body.name);
  const description = str(body.description);
  const website_url = str(body.website_url);
  const category_slug = str(body.category_slug);
  const proposed_subcategory_slug =
    str(body.subcategory_slug) ?? FALLBACK_SUBCATEGORY;
  const pricing = str(body.pricing) ?? "Unknown";
  const best_for = str(body.best_for) ?? "TBD";

  if (!name) return err(400, "publish: name is required");
  if (!description) return err(400, "publish: description is required");
  if (!website_url || !/^https?:\/\//i.test(website_url)) {
    return err(400, "publish: website_url must be a valid http(s) URL");
  }
  if (!category_slug) return err(400, "publish: category_slug is required");

  const subcategory_slug = await resolveSubcategorySlug(
    svc,
    proposed_subcategory_slug,
    category_slug,
  );

  // Re-check duplicate server-side — defends against concurrent inserts AND
  // against slug collisions (two tools with different URLs whose names
  // slugify to the same value would violate tools_slug_key otherwise).
  const slug = slugify(name);
  const existing = await findDuplicate(website_url, slug);
  if (existing) {
    console.log(
      `${LOG} 409 — publish blocked on ${existing.conflict} collision with "${existing.name}"`,
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

  // Only include name_zh when it's a real value, so inserts still succeed
  // even if the column is missing from an older DB schema.
  const nameZh = str(body.name_zh);
  if (nameZh) payload.name_zh = nameZh;

  const { error: dbError, data: inserted } = await svc
    .from("tools")
    .insert(payload)
    .select("id, slug, name")
    .single();

  if (dbError) {
    console.error(`${LOG} publish insert failed:`, dbError.message);
    return err(500, "Publish failed", dbError.message);
  }

  console.log(`${LOG} 200 — published "${inserted?.name ?? name}"`);
  return NextResponse.json(
    { ok: true, id: inserted?.id, slug: inserted?.slug, name: inserted?.name },
    { status: 200 },
  );
}
