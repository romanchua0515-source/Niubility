"use client";

import type { DirectoryListing } from "@/data/listings";
import { setBookmarkListings } from "@/lib/bookmarks";

export function BookmarkCatalogInit({
  listings,
}: {
  listings: DirectoryListing[];
}) {
  setBookmarkListings(listings);
  return null;
}
