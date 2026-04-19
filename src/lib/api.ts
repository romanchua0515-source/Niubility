import { cache } from "react";
import { directoryListingToFeaturedTool } from "@/lib/listing-utils";
import { filterListingsByQuery } from "@/lib/search";
import type {
  Category,
  DirectoryListing,
  ExploreCategory,
  FeaturedTool,
  ListingCategory,
  RoleTag,
} from "@/types/data";
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
  is_hot?: boolean | null;
  hot_order?: number | null;
  is_quick_pick?: boolean | null;
  quick_pick_order?: number | null;
  health_status?: "healthy" | "flagged" | "unknown" | null;
  health_fail_count?: number | null;
  health_last_checked?: string | null;
  health_last_failure?: string | null;
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

export type ToolDetail = DirectoryListing & {
  nameZh: string | null;
  healthStatus: "healthy" | "flagged" | "unknown";
};

export async function getToolDetailBySlug(
  slug: string,
): Promise<ToolDetail | null> {
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const row = data as ToolRow & { name_zh?: string | null };
  const { data: sub } = await supabase
    .from("subcategories")
    .select("name, name_zh")
    .eq("slug", row.subcategory_slug)
    .maybeSingle();

  // Tools with a subcategory_slug that isn't in the public listing whitelist
  // (e.g. admin-only experimental leaves) can't be rendered as public
  // DirectoryListings — return null so the detail page 404s cleanly instead
  // of throwing during prerender.
  let base: DirectoryListing;
  try {
    base = rowToDirectoryListing(row, sub?.name, sub?.name_zh);
  } catch {
    return null;
  }
  return {
    ...base,
    nameZh: row.name_zh ?? null,
    healthStatus: (row.health_status ?? "unknown") as
      | "healthy"
      | "flagged"
      | "unknown",
  };
}

export async function getAllToolSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("tools").select("slug");
  if (error) throw error;
  return (data ?? []).map((r) => r.slug as string);
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

// =============================================================================
// Static-data-migrated getters: signals, hot tools, quick picks, role sections,
// job careers, top searched. Public reads via the anon client.
// =============================================================================

async function loadToolsByFlag(
  flagColumn: "is_hot" | "is_quick_pick",
  orderColumn: "hot_order" | "quick_pick_order",
): Promise<DirectoryListing[]> {
  const { data: tools, error } = await supabase
    .from("tools")
    .select("*")
    .eq(flagColumn, true)
    .order(orderColumn, { ascending: true });
  if (error) throw error;

  const { data: subs } = await supabase
    .from("subcategories")
    .select("slug, name, name_zh");
  const subMap = new Map((subs ?? []).map((s) => [s.slug, s] as const));

  return (tools ?? []).map((raw) => {
    const row = raw as ToolRow;
    const sub = subMap.get(row.subcategory_slug);
    return rowToDirectoryListing(row, sub?.name, sub?.name_zh);
  });
}

export const getHotThisWeek = cache(() =>
  loadToolsByFlag("is_hot", "hot_order"),
);

export const getQuickPicks = cache(() =>
  loadToolsByFlag("is_quick_pick", "quick_pick_order"),
);

export type HealthStatus = "healthy" | "flagged" | "unknown";

export type AdminToolView = DirectoryListing & {
  isHot: boolean;
  hotOrder: number;
  isQuickPick: boolean;
  quickPickOrder: number;
  healthStatus: HealthStatus;
  healthFailCount: number;
  healthLastChecked: string | null;
  healthLastFailure: string | null;
};

export async function getAdminTools(): Promise<AdminToolView[]> {
  const { data: tools, error: e1 } = await supabase.from("tools").select("*");
  if (e1) throw e1;
  const { data: subs, error: e2 } = await supabase
    .from("subcategories")
    .select("slug, name, name_zh");
  if (e2) throw e2;

  const subMap = new Map((subs ?? []).map((s) => [s.slug, s] as const));

  const mapped = (tools ?? []).map((raw) => {
    const row = raw as ToolRow;
    const sub = subMap.get(row.subcategory_slug);
    const base = rowToDirectoryListing(row, sub?.name, sub?.name_zh);
    return {
      ...base,
      isHot: row.is_hot ?? false,
      hotOrder: row.hot_order ?? 0,
      isQuickPick: row.is_quick_pick ?? false,
      quickPickOrder: row.quick_pick_order ?? 0,
      healthStatus: (row.health_status ?? "unknown") as HealthStatus,
      healthFailCount: row.health_fail_count ?? 0,
      healthLastChecked: row.health_last_checked ?? null,
      healthLastFailure: row.health_last_failure ?? null,
    } as AdminToolView;
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

export type Signal = {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  type: "TOPIC" | "TOOL" | "RESOURCE";
  weekLabel: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
};

type SignalRow = {
  id: string;
  title: string;
  title_zh: string;
  description: string;
  description_zh: string;
  type: "TOPIC" | "TOOL" | "RESOURCE";
  week_label: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

function rowToSignal(row: SignalRow): Signal {
  return {
    id: row.id,
    title: row.title,
    titleZh: row.title_zh,
    description: row.description,
    descriptionZh: row.description_zh,
    type: row.type,
    weekLabel: row.week_label,
    displayOrder: row.display_order,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

export async function getSignals(weekLabel?: string): Promise<Signal[]> {
  let targetWeek = weekLabel;
  if (!targetWeek) {
    const { data: latest, error: latestErr } = await supabase
      .from("signals")
      .select("week_label")
      .eq("is_active", true)
      .order("week_label", { ascending: false })
      .limit(1);
    if (latestErr) throw latestErr;
    targetWeek = latest?.[0]?.week_label;
    if (!targetWeek) return [];
  }

  const { data, error } = await supabase
    .from("signals")
    .select("*")
    .eq("is_active", true)
    .eq("week_label", targetWeek)
    .order("display_order", { ascending: true });
  if (error) throw error;

  return ((data ?? []) as SignalRow[]).map(rowToSignal);
}

export type RolePageSection = {
  id: string;
  roleSlug: string;
  sectionType: "hero" | "tool_group" | "workflow" | "resource";
  title: string;
  titleZh: string;
  description: string | null;
  descriptionZh: string | null;
  toolSlugs: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
};

type RolePageSectionRow = {
  id: string;
  role_slug: string;
  section_type: "hero" | "tool_group" | "workflow" | "resource";
  title: string;
  title_zh: string;
  description: string | null;
  description_zh: string | null;
  tool_slugs: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
};

function rowToRolePageSection(row: RolePageSectionRow): RolePageSection {
  return {
    id: row.id,
    roleSlug: row.role_slug,
    sectionType: row.section_type,
    title: row.title,
    titleZh: row.title_zh,
    description: row.description,
    descriptionZh: row.description_zh,
    toolSlugs: row.tool_slugs ?? [],
    displayOrder: row.display_order,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

export async function getRolePageSections(
  roleSlug: string,
): Promise<RolePageSection[]> {
  const { data, error } = await supabase
    .from("role_page_sections")
    .select("*")
    .eq("role_slug", roleSlug)
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (error) throw error;

  return ((data ?? []) as RolePageSectionRow[]).map(rowToRolePageSection);
}

export type JobCareer = {
  id: string;
  title: string;
  titleZh: string;
  company: string;
  companyZh: string | null;
  location: string | null;
  url: string;
  tags: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
};

type JobCareerRow = {
  id: string;
  title: string;
  title_zh: string;
  company: string;
  company_zh: string | null;
  location: string | null;
  url: string;
  tags: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
};

function rowToJobCareer(row: JobCareerRow): JobCareer {
  return {
    id: row.id,
    title: row.title,
    titleZh: row.title_zh,
    company: row.company,
    companyZh: row.company_zh,
    location: row.location,
    url: row.url,
    tags: row.tags ?? [],
    displayOrder: row.display_order,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

export async function getJobCareers(): Promise<JobCareer[]> {
  const { data, error } = await supabase
    .from("job_careers")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (error) throw error;

  return ((data ?? []) as JobCareerRow[]).map(rowToJobCareer);
}

export type TopSearched = {
  id: string;
  label: string;
  labelZh: string;
  query: string;
  displayOrder: number;
  isActive: boolean;
};

type TopSearchedRow = {
  id: string;
  label: string;
  label_zh: string;
  query: string;
  display_order: number;
  is_active: boolean;
};

function rowToTopSearched(row: TopSearchedRow): TopSearched {
  return {
    id: row.id,
    label: row.label,
    labelZh: row.label_zh,
    query: row.query,
    displayOrder: row.display_order,
    isActive: row.is_active,
  };
}

export async function getTopSearched(): Promise<TopSearched[]> {
  const { data, error } = await supabase
    .from("top_searched")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (error) throw error;

  return ((data ?? []) as TopSearchedRow[]).map(rowToTopSearched);
}

// Admin-facing getters (no is_active filter — admin manages inactive rows too).
export async function getAdminSignals(): Promise<Signal[]> {
  const { data, error } = await supabase
    .from("signals")
    .select("*")
    .order("week_label", { ascending: false })
    .order("display_order", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as SignalRow[]).map(rowToSignal);
}

export async function getAdminRolePageSections(
  roleSlug: string,
): Promise<RolePageSection[]> {
  const { data, error } = await supabase
    .from("role_page_sections")
    .select("*")
    .eq("role_slug", roleSlug)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as RolePageSectionRow[]).map(rowToRolePageSection);
}

export async function getAdminJobCareers(): Promise<JobCareer[]> {
  const { data, error } = await supabase
    .from("job_careers")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as JobCareerRow[]).map(rowToJobCareer);
}

// =============================================================================
// People + Guides
// =============================================================================

export type Person = {
  id: string;
  name: string;
  name_zh: string | null;
  avatar_url: string | null;
  role: string;
  bio: string;
  bio_zh: string;
  twitter_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  notable_work: string;
  notable_work_zh: string;
  is_featured: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

export type Guide = {
  id: string;
  guide_slug: string;
  category: string;
  title: string;
  title_zh: string;
  content: string;
  content_zh: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

export async function getFeaturedPeople(): Promise<Person[]> {
  const { data, error } = await supabase
    .from("people")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Person[];
}

export async function getPeopleByRole(role: string): Promise<Person[]> {
  const { data, error } = await supabase
    .from("people")
    .select("*")
    .eq("role", role)
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Person[];
}

export async function getAdminPeople(): Promise<Person[]> {
  const { data, error } = await supabase
    .from("people")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Person[];
}

export async function getGuidesBySlug(slug: string): Promise<Guide[]> {
  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .eq("guide_slug", slug)
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Guide[];
}

export async function getGuidesByCategory(
  slug: string,
  category: string,
): Promise<Guide[]> {
  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .eq("guide_slug", slug)
    .eq("category", category)
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Guide[];
}

export async function getAdminGuides(): Promise<Guide[]> {
  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .order("guide_slug", { ascending: true })
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Guide[];
}
