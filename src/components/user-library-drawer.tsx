"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useUserState } from "@/context/UserStateContext";
import { resolveBookmarkKey } from "@/lib/bookmarks";
import { Bookmark, X } from "lucide-react";
import Link from "next/link";

type UserLibraryDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function UserLibraryDrawer({ open, onClose }: UserLibraryDrawerProps) {
  const { t, lang } = useLanguage();
  const { bookmarkedSlugs, recentSlugs, toggleBookmark } = useUserState();
  const zh = lang === "zh";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label={t("libraryCloseAria")}
        onClick={onClose}
      />
      <aside
        className="relative flex h-full w-full max-w-md flex-col border-l border-zinc-800/90 bg-zinc-950/98 shadow-[-24px_0_48px_rgba(0,0,0,0.5)]"
        role="dialog"
        aria-labelledby="library-drawer-title"
      >
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-4">
          <div className="flex items-center gap-2">
            <Bookmark
              className="h-5 w-5 text-emerald-400/90"
              strokeWidth={2}
              aria-hidden
            />
            <h2
              id="library-drawer-title"
              className="text-base font-semibold tracking-tight text-zinc-100"
            >
              {t("libraryTitle")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800/80 hover:text-zinc-200"
            aria-label={t("libraryCloseAria")}
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <section aria-labelledby="bookmarks-heading">
            <h3
              id="bookmarks-heading"
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
            >
              {t("libraryBookmarks")}
            </h3>
            {bookmarkedSlugs.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-600">{t("libraryEmptyBookmarks")}</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {bookmarkedSlugs.map((key) => (
                  <LibraryRow
                    key={key}
                    itemKey={key}
                    onUnbookmark={() => toggleBookmark(key)}
                    zh={zh}
                  />
                ))}
              </ul>
            )}
          </section>

          <section className="mt-8" aria-labelledby="recents-heading">
            <h3
              id="recents-heading"
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
            >
              {t("libraryRecents")}
            </h3>
            {recentSlugs.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-600">{t("libraryEmptyRecents")}</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {recentSlugs.map((key) => (
                  <LibraryRow key={key} itemKey={key} zh={zh} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}

function LibraryRow({
  itemKey,
  onUnbookmark,
  zh,
}: {
  itemKey: string;
  onUnbookmark?: () => void;
  zh: boolean;
}) {
  const { t } = useLanguage();
  const resolved = resolveBookmarkKey(itemKey);
  if (!resolved) {
    return (
      <li className="flex items-center justify-between gap-2 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-2.5">
        <span className="text-xs text-zinc-500">{itemKey}</span>
        {onUnbookmark ? (
          <button
            type="button"
            onClick={onUnbookmark}
            className="text-[11px] text-zinc-500 hover:text-zinc-300"
          >
            {t("libraryRemoveLabel")}
          </button>
        ) : null}
      </li>
    );
  }

  if (resolved.type === "featured") {
    const { tool } = resolved;
    const tagline = zh && tool.taglineZh ? tool.taglineZh : tool.tagline;
    return (
      <li className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-200">{tool.name}</p>
            <p className="mt-0.5 line-clamp-2 text-[11px] text-zinc-500">
              {tagline}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Link
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-zinc-700 px-2 py-1 text-[11px] text-emerald-400/90 hover:border-emerald-500/40"
            >
              {t("openCta")}
            </Link>
            {onUnbookmark ? (
              <button
                type="button"
                onClick={onUnbookmark}
                className="rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                aria-label={t("libraryRemoveBookmarkAria")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      </li>
    );
  }

  const { listing } = resolved;
  const desc =
    zh && listing.descriptionZh ? listing.descriptionZh : listing.description;
  const sub =
    zh && listing.subcategoryZh ? listing.subcategoryZh : listing.subcategory;

  return (
    <li className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-zinc-200">{listing.name}</p>
          <p className="mt-0.5 text-[10px] text-zinc-600">{sub}</p>
          <p className="mt-1 line-clamp-2 text-[11px] text-zinc-500">{desc}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-zinc-700 px-2 py-1 text-[11px] text-emerald-400/90 hover:border-emerald-500/40"
          >
            {t("openCta")}
          </Link>
          {onUnbookmark ? (
            <button
              type="button"
              onClick={onUnbookmark}
              className="rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
              aria-label={t("libraryRemoveBookmarkAria")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>
    </li>
  );
}
