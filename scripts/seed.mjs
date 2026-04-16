/**
 * Seeds Supabase from src/data/categories.ts (explore) and src/data/listings.ts.
 * Requires SUPABASE_SERVICE_ROLE_KEY plus NEXT_PUBLIC_SUPABASE_URL in .env.local.
 * Run: npm run db:seed
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const { exploreCategories } = await import("../src/data/categories.ts");
const { directoryListings } = await import("../src/data/listings.ts");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** Maps leaf listing category (e.g. job-boards) to explore parent slug (e.g. jobs). */
const LEAF_TO_PARENT = {
  "job-boards": "jobs",
  "ai-tools": "ai",
  research: "research-insights",
  "trends-news": "research-insights",
  security: "security-stack",
  browsers: "wallets",
  media: "culture",
  community: "culture",
};

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mergeTags(listing) {
  const set = new Set([...listing.tags, ...listing.roleTags]);
  return [...set];
}

function buildDescription(listing) {
  if (listing.category === "ai-tools" && listing.useCase) {
    return `${listing.description}\n\nUse case: ${listing.useCase}`;
  }
  return listing.description;
}

function buildDescriptionZh(listing) {
  return listing.descriptionZh ?? null;
}

async function seedCategoriesAndSubcategories() {
  for (const ec of exploreCategories) {
    const { data: catRow, error: catErr } = await supabase
      .from("categories")
      .upsert(
        {
          slug: ec.slug,
          title: ec.title,
          title_zh: ec.titleZh,
          cover_image: ec.coverImage,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();

    if (catErr) throw catErr;

    for (const sub of ec.subcategories) {
      const { error: subErr } = await supabase.from("subcategories").upsert(
        {
          slug: sub.slug,
          name: sub.name,
          name_zh: sub.nameZh,
          category_id: catRow.id,
        },
        { onConflict: "slug" },
      );
      if (subErr) throw subErr;
    }
  }
}

async function seedTools() {
  const usedSlugs = new Map();

  for (const listing of directoryListings) {
    let base = slugify(listing.name);
    let slug = base;
    let n = 1;
    while (usedSlugs.has(slug)) {
      n += 1;
      slug = `${base}-${n}`;
    }
    usedSlugs.set(slug, true);

    const parentSlug = LEAF_TO_PARENT[listing.category];
    if (!parentSlug) {
      throw new Error(`No parent slug for category: ${listing.category}`);
    }

    const row = {
      slug,
      name: listing.name,
      description: buildDescription(listing),
      description_zh: buildDescriptionZh(listing),
      best_for: listing.bestFor,
      best_for_zh: listing.bestForZh ?? null,
      category_slug: parentSlug,
      subcategory_slug: listing.category,
      website_url: listing.url,
      affiliate_url: listing.isAffiliate ? listing.url : null,
      pricing: listing.pricing,
      tags: mergeTags(listing),
      is_featured: listing.isFeatured,
    };

    const { error } = await supabase.from("tools").upsert(row, {
      onConflict: "slug",
    });
    if (error) throw error;
  }
}

try {
  await seedCategoriesAndSubcategories();
  await seedTools();
  console.log("Seed completed successfully.");
} catch (e) {
  console.error(e);
  process.exit(1);
}
