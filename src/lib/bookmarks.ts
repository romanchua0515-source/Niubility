import { directoryListingToFeaturedTool } from "@/lib/listing-utils";
import type { DirectoryListing, FeaturedTool, ListingCategory } from "@/types/data";

let catalog: DirectoryListing[] = [];

/** Called from `BookmarkCatalogInit` with the full directory from Supabase. */
export function setBookmarkListings(listings: DirectoryListing[]) {
  catalog = listings;
}

function getCatalog(): DirectoryListing[] {
  return catalog;
}

export function getFeaturedBookmarkKey(tool: FeaturedTool): string {
  return `tool:${tool.id}`;
}

export function getListingBookmarkKey(listing: DirectoryListing): string {
  return `tool:${listing.slug}`;
}

/** Legacy id from `directoryListingToFeaturedTool` before slugs: `${category}-${name}` */
function legacyFeaturedStyleId(listing: DirectoryListing): string {
  return `${listing.category}-${listing.name}`.replace(/\s+/g, "-");
}

export type ResolvedBookmark =
  | { type: "featured"; tool: FeaturedTool; key: string }
  | { type: "listing"; listing: DirectoryListing; key: string };

export function resolveBookmarkKey(key: string): ResolvedBookmark | null {
  const listings = getCatalog();

  if (key.startsWith("tool:")) {
    const slug = key.slice("tool:".length);
    const listing = listings.find((l) => l.slug === slug);
    if (!listing) return null;
    return {
      type: "featured",
      tool: directoryListingToFeaturedTool(listing),
      key,
    };
  }

  if (key.startsWith("featured:")) {
    const id = key.slice("featured:".length);
    const bySlug = listings.find((l) => l.slug === id);
    if (bySlug) {
      return {
        type: "featured",
        tool: directoryListingToFeaturedTool(bySlug),
        key,
      };
    }
    const hit = listings.find((l) => legacyFeaturedStyleId(l) === id);
    if (hit) {
      return {
        type: "featured",
        tool: directoryListingToFeaturedTool(hit),
        key,
      };
    }
    return null;
  }

  if (key.startsWith("listing:")) {
    const rest = key.slice("listing:".length);
    const idx = rest.indexOf(":");
    if (idx === -1) return null;
    const category = rest.slice(0, idx) as ListingCategory;
    const name = decodeURIComponent(rest.slice(idx + 1));
    const listing = listings.find(
      (l) => l.category === category && l.name === name,
    );
    if (!listing) return null;
    return { type: "listing", listing, key };
  }

  return null;
}

export function canonicalBookmarkKey(key: string): string | null {
  const resolved = resolveBookmarkKey(key);
  if (!resolved) return null;
  if (resolved.type === "featured") {
    return getFeaturedBookmarkKey(resolved.tool);
  }
  return getListingBookmarkKey(resolved.listing);
}
