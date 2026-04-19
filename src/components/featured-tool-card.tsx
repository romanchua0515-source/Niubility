"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useUserState } from "@/context/UserStateContext";
import type { FeaturedTool } from "@/types/data";
import { getFeaturedBookmarkKey } from "@/lib/bookmarks";
import { ArrowUpRight, Bookmark } from "lucide-react";

type FeaturedToolCardProps = {
  tool: FeaturedTool;
};

export function FeaturedToolCard({ tool }: FeaturedToolCardProps) {
  const { lang, t } = useLanguage();
  const { toggleBookmark, addRecent, isBookmarked } = useUserState();
  const zh = lang === "zh";
  const tagline = zh && tool.taglineZh ? tool.taglineZh : tool.tagline;
  const category = zh && tool.categoryZh ? tool.categoryZh : tool.category;
  const bookmarkKey = getFeaturedBookmarkKey(tool);
  const saved = isBookmarked(bookmarkKey);

  return (
    <div className="group relative aspect-[4/5] w-full min-w-0 overflow-hidden rounded-xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/50 to-zinc-950/80 transition-all duration-200 hover:scale-[1.01] hover:border-emerald-500/30 hover:shadow-[0_16px_48px_-28px_rgba(16,185,129,0.4)]">
      <button
        type="button"
        className="absolute right-2 top-2 z-20 rounded-md border border-zinc-800/90 bg-zinc-950/85 p-1.5 text-zinc-400 shadow-sm backdrop-blur-sm transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
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
      <a
        href={tool.href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 flex h-full min-h-0 flex-col justify-between gap-3 p-4"
        onClick={() => addRecent(bookmarkKey)}
      >
        <div className="min-h-0 space-y-2 pr-8">
          <span className="inline-flex w-fit rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
            {category}
          </span>
          <h3 className="text-base font-semibold leading-snug tracking-tight text-zinc-100">
            {tool.name}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500 group-hover:text-zinc-400">
            {tagline}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400/90 group-hover:text-emerald-300">
          {t("openCta")}
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        </span>
      </a>
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl" />
    </div>
  );
}
