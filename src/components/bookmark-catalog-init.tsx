"use client";

import type { DirectoryListing } from "@/types/data";
import { setBookmarkListings } from "@/lib/bookmarks";

export function BookmarkCatalogInit({
  listings,
}: {
  listings: DirectoryListing[];
}) {
  setBookmarkListings(listings);
  return null;
}
