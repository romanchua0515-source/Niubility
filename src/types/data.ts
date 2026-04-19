/**
 * Consolidated data types previously scattered across src/data/*.ts.
 * All component/lib files should import from here instead of src/data/.
 */

import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Listings (from src/data/listings.ts)
// ---------------------------------------------------------------------------

export type ListingCategory =
  | "job-boards"
  | "ai-tools"
  | "research"
  | "trends-news"
  | "security"
  | "browsers"
  | "media"
  | "community";

export type RoleTag =
  | "operators"
  | "bd-founders"
  | "marketers"
  | "researchers"
  | "traders"
  | "developers"
  | "designers"
  | "job-seekers";

type ListingBase = {
  slug: string;
  name: string;
  category: ListingCategory;
  subcategory: string;
  subcategoryZh?: string;
  url: string;
  description: string;
  descriptionZh?: string;
  tags: string[];
  bestFor: string;
  bestForZh?: string;
  pricing: string;
  isFeatured: boolean;
  featuredOrder: number;
  bannerImageUrl?: string;
  isAffiliate: boolean;
  roleTags: RoleTag[];
};

export type AIToolListing = ListingBase & {
  category: "ai-tools";
  useCase: string;
};

export type NonAIToolListing = ListingBase & {
  category: Exclude<ListingCategory, "ai-tools">;
  useCase?: never;
};

export type DirectoryListing = AIToolListing | NonAIToolListing;

// ---------------------------------------------------------------------------
// Featured tools (from src/data/featured-tools.ts)
// ---------------------------------------------------------------------------

export type FeaturedTool = {
  id: string;
  name: string;
  tagline: string;
  taglineZh?: string;
  category: string;
  categoryZh?: string;
  href: string;
  coverImage?: string;
};

// ---------------------------------------------------------------------------
// Hot items / signals (from src/data/hot-this-week.ts)
// ---------------------------------------------------------------------------

export type HotItem = {
  id: string;
  title: string;
  titleZh?: string;
  context: string;
  contextZh?: string;
  kind: "Topic" | "Tool" | "Resource";
};

// ---------------------------------------------------------------------------
// Quick picks (from src/data/quick-picks.ts)
// ---------------------------------------------------------------------------

export type QuickPick = {
  id: string;
  title: string;
  titleZh?: string;
  subtitle: string;
  subtitleZh?: string;
  href: string;
  icon: LucideIcon;
};

// ---------------------------------------------------------------------------
// Categories (from src/data/categories.ts)
// ---------------------------------------------------------------------------

export type Category = {
  slug: string;
  title: string;
  description: string;
  titleZh?: string;
  descriptionZh?: string;
};

export type ExploreSubcategory = {
  slug: string;
  name: string;
  nameZh: string;
};

export type ExploreCategory = {
  slug: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  coverImage: string;
  subcategories: ExploreSubcategory[];
};

// ---------------------------------------------------------------------------
// Roles (from src/data/roles.ts)
// ---------------------------------------------------------------------------

export type Role = {
  slug: string;
  title: string;
  description: string;
  titleZh?: string;
  descriptionZh?: string;
  icon: LucideIcon;
};

// ---------------------------------------------------------------------------
// Top searched (from src/data/top-searched.ts)
// ---------------------------------------------------------------------------

export type TopSearchTerm = {
  label: string;
  q: string;
  labelZh?: string;
};

// ---------------------------------------------------------------------------
// Job / careers (from src/data/job-careers.ts)
// ---------------------------------------------------------------------------

export type CareersModuleKey =
  | "job-boards"
  | "recruiters-hiring-channels"
  | "career-pages"
  | "market-intelligence"
  | "guides-and-safety";

export type CareersResource = {
  name: string;
  url: string;
  description: string;
  tags: string[];
  bestFor: string;
  isFeatured?: boolean;
};

export type CareersModule = {
  key: CareersModuleKey;
  title: string;
  description: string;
  resources: CareersResource[];
};
