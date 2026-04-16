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

/** Explore parent hub (DB + static copy); icons come from `getExploreCategoryIcon`. */
export type ExploreCategory = {
  slug: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  coverImage: string;
  subcategories: ExploreSubcategory[];
};

/** @deprecated Use `getLeafCategories()` / `getCategories()` from `@/lib/api`. */
export const homepageCategorySlugs: readonly string[] = [
  "ai-tools",
  "job-boards",
  "security",
  "research",
];

/** @deprecated */
export const categories: Category[] = [];

/** @deprecated */
export const exploreCategories: ExploreCategory[] = [];
