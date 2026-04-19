import type { DirectoryListing, FeaturedTool, ListingCategory } from "@/types/data";

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

export function getListingsByCategory(
  listings: DirectoryListing[],
  category: ListingCategory,
): DirectoryListing[] {
  return listings.filter((listing) => listing.category === category);
}

export function leafSlugToListingCategory(
  slug: string,
): ListingCategory | null {
  const valid: ListingCategory[] = [
    "job-boards",
    "ai-tools",
    "research",
    "trends-news",
    "security",
    "browsers",
    "media",
    "community",
  ];
  return (valid as readonly string[]).includes(slug)
    ? (slug as ListingCategory)
    : null;
}

export function listingsForExploreSubSlugs(
  listings: DirectoryListing[],
  subSlugs: string[],
): DirectoryListing[] {
  const set = new Set(subSlugs);
  const seen = new Set<string>();
  const out: DirectoryListing[] = [];
  for (const l of listings) {
    if (!set.has(l.category)) continue;
    const key = `${l.category}:${l.name}:${l.url}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(l);
    }
  }
  return out;
}
