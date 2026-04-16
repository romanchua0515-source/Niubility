"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useUserState } from "@/context/UserStateContext";
import type { DirectoryListing } from "@/data/listings";
import { getListingBookmarkKey } from "@/lib/bookmarks";
import { Bookmark } from "lucide-react";

type DirectoryListingCardProps = {
  listing: DirectoryListing;
};

export function DirectoryListingCard({ listing }: DirectoryListingCardProps) {
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

  return (
    <article className="relative rounded-xl border border-zinc-800/80 bg-zinc-900/35 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
      <button
        type="button"
        className="absolute right-3 top-3 z-10 rounded-md border border-zinc-800/90 bg-zinc-950/80 p-1.5 text-zinc-400 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
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
      <div className="flex items-start justify-between gap-3 pr-10">
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight text-zinc-100">
            {listing.name}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">{subcategory}</p>
        </div>
        <a
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-md border border-zinc-700 bg-zinc-950/50 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500/35 hover:text-emerald-200"
          onClick={() => addRecent(bookmarkKey)}
        >
          {t("visitCta")}
        </a>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{description}</p>
      <p className="mt-2 text-xs text-zinc-500">
        <span className="text-zinc-400">{t("bestForLabel")}</span> {bestFor}
      </p>
      {listing.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {listing.tags.slice(0, 4).map((tag) => (
            <span
              key={`${listing.slug}-${tag}`}
              className="rounded border border-zinc-800 bg-zinc-950/50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
