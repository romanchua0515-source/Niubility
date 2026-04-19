import type { DirectoryListing } from "@/types/data";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fieldMatches(text: string, token: string): boolean {
  const t = token.trim();
  if (!t) return false;
  const n = t.length;
  const escaped = escapeRegex(t);
  if (n <= 2) {
    return new RegExp(`\\b${escaped}\\b`, "i").test(text);
  }
  if (n <= 4) {
    return new RegExp(`\\b${escaped}`, "i").test(text);
  }
  return text.toLowerCase().includes(t.toLowerCase());
}

function descriptionAndUseCaseText(listing: DirectoryListing): string {
  const desc = listing.description;
  if (listing.category === "ai-tools") {
    return `${desc} ${listing.useCase}`;
  }
  return desc;
}

function scoreToken(listing: DirectoryListing, token: string): number {
  const t = token.trim();
  if (!t) return 0;

  if (fieldMatches(listing.name, token)) return 100;

  if (listing.tags.some((tag) => fieldMatches(tag, token))) return 50;

  if (
    fieldMatches(listing.subcategory, token) ||
    fieldMatches(listing.bestFor, token)
  ) {
    return 20;
  }

  const blur = descriptionAndUseCaseText(listing);
  if (fieldMatches(blur, token)) return 5;

  return 0;
}

export function filterListingsByQuery(
  query: string,
  listings: DirectoryListing[],
  limit = 12,
): DirectoryListing[] {
  const raw = query.trim();
  if (!raw) return [];

  const tokens = raw.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const scored: { listing: DirectoryListing; score: number }[] = [];

  for (const listing of listings) {
    let total = 0;
    let ok = true;
    for (const token of tokens) {
      const s = scoreToken(listing, token);
      if (s === 0) {
        ok = false;
        break;
      }
      total += s;
    }
    if (ok && total > 0) {
      scored.push({ listing, score: total });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.listing);
}
