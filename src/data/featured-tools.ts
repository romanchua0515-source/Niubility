import type { DirectoryListing } from "@/data/listings";

export type FeaturedTool = {
  id: string;
  name: string;
  tagline: string;
  taglineZh?: string;
  category: string;
  categoryZh?: string;
  href: string;
  /** Brand logo for carousel / cards (Clearbit-style domain path) */
  coverImage?: string;
};

export function directoryListingToFeaturedTool(
  l: DirectoryListing,
): FeaturedTool {
  const tagline =
    l.category === "ai-tools"
      ? `${l.description} ${l.useCase}`.replace(/\s+/g, " ").trim()
      : l.description;
  return {
    id: l.slug,
    name: l.name,
    tagline,
    taglineZh: l.descriptionZh,
    category: l.subcategory,
    categoryZh: l.subcategoryZh,
    href: l.url,
    coverImage: l.bannerImageUrl,
  };
}
