import { cache } from "react";
import { directoryListingToFeaturedTool } from "@/data/featured-tools";
import type { FeaturedTool } from "@/data/featured-tools";
import {
  filterListingsByQuery,
  type DirectoryListing,
  type ListingCategory,
  type RoleTag,
} from "@/data/listings";
import type { Category, ExploreCategory } from "@/data/categories";
import { supabase } from "@/lib/supabase";
import {
  exploreCategoryDescription,
  leafCategoryDescription,
} from "@/lib/category-metadata";

type SubcategoryRow = {
  slug: string;
  name: string;
  name_zh: string | null;
};

type CategoryRow = {
  slug: string;
  title: string;
  title_zh: string | null;
  cover_image: string;
  subcategories: SubcategoryRow[] | null;
};

type ToolRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  description_zh: string | null;
  best_for: string;
  best_for_zh: string | null;
  category_slug: string;
  subcategory_slug: string;
  website_url: string;
  affiliate_url: string | null;
  pricing: string;
  tags: string[];
  is_featured: boolean;
  featured_order?: number | null;
  banner_image_url?: string | null;
};

const USE_CASE_SEP = "\n\nUse case: ";

const ROLE_TAG_SET = new Set<string>([
  "operators",
  "bd-founders",
  "marketers",
  "researchers",
  "traders",
  "developers",
  "designers",
  "job-seekers",
]);

const LISTING_LEAVES: ListingCategory[] = [
  "job-boards",
  "ai-tools",
  "research",
  "trends-news",
  "security",
  "browsers",
  "media",
  "community",
];

function isListingCategory(s: string): s is ListingCategory {
  return (LISTING_LEAVES as readonly string[]).includes(s);
}

function rowToDirectoryListing(
  row: ToolRow,
  subName?: string,
  subNameZh?: string | null,
): DirectoryListing {
  const leaf = row.subcategory_slug;
  if (!isListingCategory(leaf)) {
    throw new Error(`Unsupported subcategory_slug for listing: ${leaf}`);
  }

  let description = row.description;
  let useCase = "";
  if (leaf === "ai-tools") {
    const i = description.indexOf(USE_CASE_SEP);
    if (i !== -1) {
      useCase = description.slice(i + USE_CASE_SEP.length);
      description = description.slice(0, i);
    }
  }

  const roleTags = row.tags.filter((t): t is RoleTag => ROLE_TAG_SET.has(t));

  const base = {
    slug: row.slug,
    name: row.name,
    category: leaf,
    subcategory: subName ?? row.subcategory_slug,
    subcategoryZh: subNameZh ?? undefined,
    url: row.website_url,
    description,
    descriptionZh: row.description_zh ?? undefined,
    tags: row.tags,
    bestFor: row.best_for,
    bestForZh: row.best_for_zh ?? undefined,
    pricing: row.pricing,
    isFeatured: row.is_featured,
    featuredOrder: row.featured_order ?? 0,
    bannerImageUrl: row.banner_image_url ?? undefined,
    isAffiliate: !!row.affiliate_url,
    roleTags,
  };

  if (leaf === "ai-tools") {
    return { ...base, category: "ai-tools" as const, useCase };
  }
  return { ...base, category: leaf } as DirectoryListing;
}

async function loadTools(): Promise<DirectoryListing[]> {
  const { data: tools, error: e1 } = await supabase.from("tools").select("*");
  if (e1) throw e1;
  const { data: subs, error: e2 } = await supabase
    .from("subcategories")
    .select("slug, name, name_zh");
  if (e2) throw e2;

  const subMap = new Map(
    (subs ?? []).map((s) => [s.slug, s] as const),
  );

  const mapped = (tools ?? []).map((raw) => {
    const row = raw as ToolRow;
    const sub = subMap.get(row.subcategory_slug);
    return rowToDirectoryListing(row, sub?.name, sub?.name_zh);
  });

  mapped.sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    if (a.isFeatured && b.isFeatured) {
      return (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0);
    }
    return a.name.localeCompare(b.name);
  });

  return mapped;
}

export const getTools = cache(loadTools);

export async function getToolBySlug(slug: string): Promise<DirectoryListing | null> {
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const row = data as ToolRow;
  const { data: sub } = await supabase
    .from("subcategories")
    .select("name, name_zh")
    .eq("slug", row.subcategory_slug)
    .maybeSingle();

  return rowToDirectoryListing(row, sub?.name, sub?.name_zh);
}

export async function getFeaturedTools(): Promise<FeaturedTool[]> {
  const all = await getTools();
  return all
    .filter((l) => l.isFeatured)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
    .map(directoryListingToFeaturedTool);
}

export async function searchTools(
  query: string,
  limit = 12,
): Promise<DirectoryListing[]> {
  const listings = await getTools();
  return filterListingsByQuery(query, listings, limit);
}

/** Nested explore hubs (parents) + subcategories from Supabase, merged with static copy. */
async function loadExploreCategories(): Promise<ExploreCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      slug,
      title,
      title_zh,
      cover_image,
      subcategories (
        slug,
        name,
        name_zh
      )
    `,
    )
    .order("slug");
  if (error) throw error;

  const rows = (data ?? []) as CategoryRow[];

  return rows.map((row) => {
    const copy = exploreCategoryDescription[row.slug];
    const subs = (row.subcategories ?? []).map((s) => ({
      slug: s.slug,
      name: s.name,
      nameZh: s.name_zh ?? "",
    }));
    return {
      slug: row.slug,
      title: row.title,
      titleZh: row.title_zh ?? row.title,
      description: copy?.en ?? "",
      descriptionZh: copy?.zh ?? "",
      coverImage: row.cover_image,
      subcategories: subs,
    };
  });
}

export const getCategories = cache(loadExploreCategories);

export async function getExploreCategoryBySlug(
  slug: string,
): Promise<ExploreCategory | null> {
  const all = await getCategories();
  return all.find((c) => c.slug === slug) ?? null;
}

/** Leaf categories for cards / hero (icons + long descriptions from metadata). */
async function loadLeafCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("subcategories")
    .select("slug, name, name_zh");
  if (error) throw error;

  return (data ?? []).map((row) => {
    const copy = leafCategoryDescription[row.slug];
    return {
      slug: row.slug,
      title: row.name,
      titleZh: row.name_zh ?? undefined,
      description: copy?.en ?? row.name,
      descriptionZh: copy?.zh,
    };
  });
}

export const getLeafCategories = cache(loadLeafCategories);

export async function getCategoriesBySlugs(slugs: string[]): Promise<Category[]> {
  const all = await getLeafCategories();
  const map = new Map(all.map((c) => [c.slug, c] as const));
  return slugs.map((s) => map.get(s)).filter((c): c is Category => c != null);
}

export async function getListingsForLeaf(
  leafSlug: string,
): Promise<DirectoryListing[]> {
  const all = await getTools();
  return all.filter((l) => l.category === leafSlug);
}

export async function getListingsForExploreParent(
  parentSlug: string,
): Promise<DirectoryListing[]> {
  const { data: cat, error } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", parentSlug)
    .maybeSingle();
  if (error) throw error;
  if (!cat) return [];

  const { data: subs } = await supabase
    .from("subcategories")
    .select("slug")
    .eq("category_id", cat.id);
  const leafSet = new Set((subs ?? []).map((s) => s.slug));

  const all = await getTools();
  return all.filter((l) => leafSet.has(l.category));
}

export async function getAllCategoryRouteSlugs(): Promise<string[]> {
  const { data: parents } = await supabase.from("categories").select("slug");
  const { data: leaves } = await supabase.from("subcategories").select("slug");
  const out = new Set<string>();
  for (const p of parents ?? []) out.add(p.slug);
  for (const l of leaves ?? []) out.add(l.slug);
  return [...out];
}

/** Admin: parent categories with subcategory counts for /admin/categories. */
export type AdminCategoryListItem = {
  id: string;
  slug: string;
  title: string;
  title_zh: string | null;
  cover_image: string;
  subcategoryCount: number;
};

type AdminCategoryRow = {
  id: string;
  slug: string;
  title: string;
  title_zh: string | null;
  cover_image: string;
  subcategories: { id: string }[] | null;
};

async function loadAdminCategoryList(): Promise<AdminCategoryListItem[]> {
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      slug,
      title,
      title_zh,
      cover_image,
      subcategories ( id )
    `,
    )
    .order("title");
  if (error) throw error;

  const rows = (data ?? []) as AdminCategoryRow[];
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    title_zh: row.title_zh,
    cover_image: row.cover_image,
    subcategoryCount: row.subcategories?.length ?? 0,
  }));
}

export const getAdminCategoryList = cache(loadAdminCategoryList);
