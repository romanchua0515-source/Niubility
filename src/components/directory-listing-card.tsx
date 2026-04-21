"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useUserState } from "@/context/UserStateContext";
import type { DirectoryListing } from "@/types/data";
import { getListingBookmarkKey } from "@/lib/bookmarks";
import { trackEvent } from "@/lib/posthog";
import { Bookmark } from "lucide-react";

type DirectoryListingCardProps = {
  listing: DirectoryListing;
  /** When set, clicking the card (not bookmark / inline visit) opens the tool detail modal instead of navigating. */
  onClick?: () => void;
};

export function DirectoryListingCard({
  listing,
  onClick,
}: DirectoryListingCardProps) {
  const { lang, t } = useLanguage();
  const { toggleBookmark, addRecent, isBookmarked } = useUserState();
  const zh = lang === "zh";
  const bookmarkKey = getListingBookmarkKey(listing);
  const saved = isBookmarked(bookmarkKey);

  const subcategory =
    zh && listing.subcategoryZh ? listing.subcategoryZh : listing.subcategory;
  const description =
    zh && listing.descriptionZh ? listing.descriptionZh : listing.description;
  const bestFor =
    zh && listing.bestForZh ? listing.bestForZh : listing.bestFor;
  const pricingNorm = listing.pricing.trim().toLowerCase();
  const pricingIsFree =
    pricingNorm === "free" || listing.pricing.trim() === "免费";

  return (
    <article
      className="relative cursor-pointer rounded-xl border border-zinc-800/80 bg-zinc-900/35 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] transition-colors hover:border-zinc-700/60 hover:bg-zinc-900/80"
      onClick={onClick ? () => onClick() : undefined}
    >
      {!onClick ? (
        <Link
          href={`/tools/${listing.slug}`}
          className="absolute inset-0 rounded-xl"
          aria-label={listing.name}
        />
      ) : null}
      <button
        type="button"
        className="absolute right-3 top-3 z-20 rounded-md border border-zinc-800/90 bg-zinc-950/80 p-1.5 text-zinc-400 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
        aria-label={t("bookmarkToggleAria")}
        aria-pressed={saved}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleBookmark(bookmarkKey);
        }}
      >
        <Bookmark
          className={`h-3.5 w-3.5 ${saved ? "fill-emerald-400 text-emerald-400" : ""}`}
          strokeWidth={2}
        />
      </button>
      <div className="pointer-events-none relative flex items-start justify-between gap-3 pr-10">
        <div className="min-w-0">
          <h3 className="text-base font-medium tracking-tight text-zinc-100">
            {listing.name}
          </h3>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span>{subcategory}</span>
            <span
              className={`rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium ${
                pricingIsFree ? "text-emerald-400" : "text-zinc-400"
              }`}
            >
              {listing.pricing}
            </span>
          </div>
        </div>
        <a
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto relative z-20 shrink-0 rounded-md border border-zinc-700 bg-zinc-950/50 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500/35 hover:text-emerald-200"
          onMouseDown={() =>
            trackEvent("tool_clicked", {
              tool_id: listing.slug,
              tool_name: listing.name,
              category: listing.category,
              subcategory: listing.subcategory,
            })
          }
          onClick={(e) => {
            e.stopPropagation();
            addRecent(bookmarkKey);
          }}
        >
          {t("visitCta")}
        </a>
      </div>
      <p className="pointer-events-none relative mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-400">
        {description}
      </p>
      <p className="pointer-events-none relative mt-2 text-xs text-zinc-500">
        <span className="text-zinc-400">{t("bestForLabel")}</span> {bestFor}
      </p>
      {listing.tags.length > 0 ? (
        <div className="pointer-events-none relative mt-3 flex flex-wrap gap-1.5">
          {listing.tags.slice(0, 4).map((tag) => (
            <span
              key={`${listing.slug}-${tag}`}
              className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
