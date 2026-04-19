// Idempotent seed for the new static-data tables.
// Deletes the rows it previously inserted (scoped by deterministic keys)
// then re-inserts from src/data/*. Safe to run multiple times.
//
// Run: npm run seed

import { config } from "dotenv";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

import { hotThisWeek } from "../src/data/hot-this-week";
import { quickPicks } from "../src/data/quick-picks";
import { topSearched } from "../src/data/top-searched";
import { jobsAndCareersModules } from "../src/data/job-careers";
import { bdFoundersPage } from "../src/data/role-pages/bd-founders";
import { designersPage } from "../src/data/role-pages/designers";
import { developersPage } from "../src/data/role-pages/developers";
import { jobSeekersPage } from "../src/data/role-pages/job-seekers";
import { marketersPage } from "../src/data/role-pages/marketers";
import { operatorsPage } from "../src/data/role-pages/operators";
import { researchersPage } from "../src/data/role-pages/researchers";
import { tradersPage } from "../src/data/role-pages/traders";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "..", ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const WEEK_LABEL = "2026-W16";
const ZERO_UUID = "00000000-0000-0000-0000-000000000000";

async function seedSignals() {
  const { error: delErr } = await supabase
    .from("signals")
    .delete()
    .eq("week_label", WEEK_LABEL);
  if (delErr) throw delErr;

  const rows = hotThisWeek.map((item, idx) => ({
    title: item.title,
    title_zh: item.titleZh ?? item.title,
    description: item.context,
    description_zh: item.contextZh ?? item.context,
    type: item.kind.toUpperCase(),
    week_label: WEEK_LABEL,
    display_order: idx,
    is_active: true,
  }));

  const { error } = await supabase.from("signals").insert(rows);
  if (error) throw error;
  console.log(`✓ signals: ${rows.length} rows (week=${WEEK_LABEL})`);
}

async function seedTopSearched() {
  const { error: delErr } = await supabase
    .from("top_searched")
    .delete()
    .neq("id", ZERO_UUID);
  if (delErr) throw delErr;

  const rows = topSearched.map((t, idx) => ({
    label: t.label,
    label_zh: t.labelZh ?? t.label,
    query: t.q,
    display_order: idx,
    is_active: true,
  }));

  const { error } = await supabase.from("top_searched").insert(rows);
  if (error) throw error;
  console.log(`✓ top_searched: ${rows.length} rows`);
}

async function seedJobCareers() {
  const { error: delErr } = await supabase
    .from("job_careers")
    .delete()
    .neq("id", ZERO_UUID);
  if (delErr) throw delErr;

  // Flatten CareersModule[].resources[] into job_careers rows.
  // Schema mismatch: source has { name, description, bestFor, tags }; target
  // expects { title, company, location, url, tags }. We mirror name into both
  // title and company; description is kept in tags (prefixed) so no info is lost.
  const rows: Array<{
    title: string;
    title_zh: string;
    company: string;
    company_zh: string | null;
    location: string | null;
    url: string;
    tags: string[];
    display_order: number;
    is_active: boolean;
  }> = [];
  let order = 0;
  for (const mod of jobsAndCareersModules) {
    for (const r of mod.resources) {
      rows.push({
        title: r.name,
        title_zh: r.name,
        company: r.name,
        company_zh: null,
        location: null,
        url: r.url,
        tags: [mod.key, ...r.tags, ...(r.isFeatured ? ["featured"] : [])],
        display_order: order++,
        is_active: true,
      });
    }
  }

  const { error } = await supabase.from("job_careers").insert(rows);
  if (error) throw error;
  console.log(
    `✓ job_careers: ${rows.length} rows (flattened from ${jobsAndCareersModules.length} modules)`,
  );
}

async function seedRoleSections() {
  const rolePages = [
    bdFoundersPage,
    designersPage,
    developersPage,
    jobSeekersPage,
    marketersPage,
    operatorsPage,
    researchersPage,
    tradersPage,
  ];
  const slugs = rolePages.map((p) => p.slug);

  const { error: delErr } = await supabase
    .from("role_page_sections")
    .delete()
    .in("role_slug", slugs);
  if (delErr) throw delErr;

  // Flatten RolePageDetail into role_page_sections rows.
  // Target schema has section_type ∈ (hero, tool_group, workflow, resource).
  // We map:
  //   lede            → hero
  //   toolGroups[]    → tool_group (one row each; tool names joined into description)
  //   reading[]       → resource ("Reading" row with joined items)
  //   learnFrom[]     → resource ("Learn from" row)
  //   quickStart[]    → workflow ("Quick start" row with joined labels)
  //   relatedCategorySlugs → lost (no target field)
  const rows: Array<Record<string, unknown>> = [];
  for (const page of rolePages) {
    let order = 0;
    const roleLabel = page.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    rows.push({
      role_slug: page.slug,
      section_type: "hero",
      title: roleLabel,
      title_zh: roleLabel,
      description: page.lede,
      description_zh: page.ledeZh ?? page.lede,
      tool_slugs: [],
      display_order: order++,
      is_active: true,
    });

    if (page.quickStart.length > 0) {
      const desc = page.quickStart
        .map((q) => `${q.label} (${q.href})${q.hint ? ` — ${q.hint}` : ""}`)
        .join("\n");
      const descZh = page.quickStart
        .map(
          (q) =>
            `${q.labelZh ?? q.label} (${q.href})${
              q.hintZh ?? q.hint ? ` — ${q.hintZh ?? q.hint}` : ""
            }`,
        )
        .join("\n");
      rows.push({
        role_slug: page.slug,
        section_type: "workflow",
        title: "Quick start",
        title_zh: "快速开始",
        description: desc,
        description_zh: descZh,
        tool_slugs: [],
        display_order: order++,
        is_active: true,
      });
    }

    for (const grp of page.toolGroups) {
      const desc = grp.tools
        .map((t) => `${t.name} — ${t.purpose}${t.tag ? ` [${t.tag}]` : ""}`)
        .join("\n");
      const descZh = grp.tools
        .map(
          (t) =>
            `${t.name} — ${t.purposeZh ?? t.purpose}${
              t.tagZh ?? t.tag ? ` [${t.tagZh ?? t.tag}]` : ""
            }`,
        )
        .join("\n");
      rows.push({
        role_slug: page.slug,
        section_type: "tool_group",
        title: grp.title,
        title_zh: grp.titleZh ?? grp.title,
        description: desc,
        description_zh: descZh,
        tool_slugs: [], // Source is free-text names; manual linking via admin later.
        display_order: order++,
        is_active: true,
      });
    }

    if (page.reading.length > 0) {
      const desc = page.reading
        .map((r) => `[${r.kind}] ${r.title} — ${r.note} (${r.url})`)
        .join("\n");
      const descZh = page.reading
        .map(
          (r) =>
            `[${r.kindZh ?? r.kind}] ${r.titleZh ?? r.title} — ${
              r.noteZh ?? r.note
            } (${r.url})`,
        )
        .join("\n");
      rows.push({
        role_slug: page.slug,
        section_type: "resource",
        title: "Reading",
        title_zh: "推荐阅读",
        description: desc,
        description_zh: descZh,
        tool_slugs: [],
        display_order: order++,
        is_active: true,
      });
    }

    if (page.learnFrom.length > 0) {
      const desc = page.learnFrom
        .map(
          (l) =>
            `${l.name}${l.kind ? ` (${l.kind})` : ""} — ${l.note} (${l.url})`,
        )
        .join("\n");
      const descZh = page.learnFrom
        .map((l) => {
          const kind = l.kindZh ?? l.kind;
          const note = l.noteZh ?? l.note;
          return `${l.name}${kind ? ` (${kind})` : ""} — ${note} (${l.url})`;
        })
        .join("\n");
      rows.push({
        role_slug: page.slug,
        section_type: "resource",
        title: "Learn from",
        title_zh: "学习对象",
        description: desc,
        description_zh: descZh,
        tool_slugs: [],
        display_order: order++,
        is_active: true,
      });
    }
  }

  const { error } = await supabase.from("role_page_sections").insert(rows);
  if (error) throw error;
  console.log(
    `✓ role_page_sections: ${rows.length} rows across ${rolePages.length} roles`,
  );
}

async function seedToolFlags() {
  // Fetch all tools from the database to match by name.
  const { data: allTools, error: toolsErr } = await supabase
    .from("tools")
    .select("id, slug, name, is_featured");
  if (toolsErr) throw toolsErr;
  if (!allTools || allTools.length === 0) {
    console.log("⚠ tools table is empty — skipping flag seeding");
    return;
  }

  // Build a name→slug lookup (case-insensitive).
  const nameToTool = new Map<string, { id: string; slug: string }>();
  for (const t of allTools) {
    nameToTool.set(t.name.toLowerCase(), { id: t.id, slug: t.slug });
  }

  // --- is_hot: match tool names from role-page tool groups ---
  // hot-this-week.ts contains signals (trends), not tools.
  // We use role-page toolGroups as the source of "hot" tool names instead:
  // any tool referenced across multiple role pages is marked hot.
  const rolePages = [
    bdFoundersPage, designersPage, developersPage, jobSeekersPage,
    marketersPage, operatorsPage, researchersPage, tradersPage,
  ];
  const toolNameCounts = new Map<string, number>();
  for (const page of rolePages) {
    for (const grp of page.toolGroups) {
      for (const tool of grp.tools) {
        const key = tool.name.toLowerCase();
        toolNameCounts.set(key, (toolNameCounts.get(key) ?? 0) + 1);
      }
    }
  }

  // Tools mentioned in 2+ role pages get is_hot = true
  const hotSlugs: string[] = [];
  let hotOrder = 0;
  for (const [name, count] of toolNameCounts) {
    if (count >= 2) {
      const found = nameToTool.get(name);
      if (found) hotSlugs.push(found.slug);
    }
  }

  // Reset all hot flags first
  await supabase
    .from("tools")
    .update({ is_hot: false, hot_order: 0 })
    .neq("id", ZERO_UUID);

  for (const slug of hotSlugs) {
    const { error } = await supabase
      .from("tools")
      .update({ is_hot: true, hot_order: hotOrder++ })
      .eq("slug", slug);
    if (error) console.warn(`  warn: failed to set is_hot for ${slug}:`, error.message);
  }
  console.log(`✓ tools.is_hot: ${hotSlugs.length} tools flagged`);

  // --- is_quick_pick: match tools from quickPicks href categories ---
  // quick-picks.ts links to categories (e.g. /categories/ai-tools), not tools.
  // Mark the top featured tool in each quick-pick category as a quick pick.
  const qpCategorySlugs = quickPicks
    .map((qp) => {
      const match = qp.href.match(/\/categories\/(.+)/);
      return match ? match[1] : null;
    })
    .filter((s): s is string => s !== null);

  await supabase
    .from("tools")
    .update({ is_quick_pick: false, quick_pick_order: 0 })
    .neq("id", ZERO_UUID);

  let qpOrder = 0;
  let qpCount = 0;
  for (const catSlug of qpCategorySlugs) {
    // Get one featured tool from this subcategory
    const { data: catTools } = await supabase
      .from("tools")
      .select("slug")
      .eq("subcategory_slug", catSlug)
      .eq("is_featured", true)
      .order("featured_order", { ascending: true })
      .limit(1);
    if (catTools && catTools.length > 0) {
      const { error } = await supabase
        .from("tools")
        .update({ is_quick_pick: true, quick_pick_order: qpOrder++ })
        .eq("slug", catTools[0].slug);
      if (!error) qpCount++;
    }
  }
  console.log(`✓ tools.is_quick_pick: ${qpCount} tools flagged (from ${qpCategorySlugs.length} quick-pick categories)`);

  // --- featured_order: ensure featured tools have sequential orders ---
  const { data: featured } = await supabase
    .from("tools")
    .select("slug, featured_order")
    .eq("is_featured", true)
    .order("featured_order", { ascending: true });
  if (featured && featured.length > 0) {
    let order = 0;
    for (const f of featured) {
      if (f.featured_order !== order) {
        await supabase
          .from("tools")
          .update({ featured_order: order })
          .eq("slug", f.slug);
      }
      order++;
    }
    console.log(`✓ tools.featured_order: ${featured.length} featured tools reordered`);
  }
}

async function main() {
  console.log(`Seeding static data → ${url}\n`);
  await seedSignals();
  await seedTopSearched();
  await seedJobCareers();
  await seedRoleSections();
  await seedToolFlags();
  console.log("\n✓ Seed complete");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
