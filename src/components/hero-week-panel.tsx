"use client";

import type { HotItem } from "@/data/hot-this-week";
import { topSearched } from "@/data/top-searched";
import { useLanguage } from "@/context/LanguageContext";
import { hotItemText, topSearchLabel } from "@/i18n/localized";
import { ArrowUpRight, Flame } from "lucide-react";
import Link from "next/link";

type HeroWeekPanelProps = {
  trends: HotItem[];
};

export function HeroWeekPanel({ trends }: HeroWeekPanelProps) {
  const { t, lang } = useLanguage();
  const top3 = trends.slice(0, 3);

  return (
    <aside className="flex flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/45 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800/70 pb-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          {t("panelThisWeek")}
        </h2>
        <Link
          href="/signals"
          className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-400/90 hover:text-emerald-300"
        >
          {t("panelViewAll")}
          <ArrowUpRight className="h-3 w-3" aria-hidden />
        </Link>
      </div>

      <ul className="mt-3 space-y-2">
        {top3.map((item, i) => {
          const { title } = hotItemText(item, lang);
          return (
            <li key={item.id} className="flex gap-2">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950/60">
                {i === 0 ? (
                  <Flame className="h-3 w-3 text-orange-400/90" aria-hidden />
                ) : (
                  <span className="font-mono text-[10px] text-zinc-600">
                    {i + 1}
                  </span>
                )}
              </span>
              <p className="min-w-0 text-xs font-medium leading-snug text-zinc-200">
                {title}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 border-t border-zinc-800/70 pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          {t("panelTopSearched")}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {topSearched.map((term) => (
            <Link
              key={term.q}
              href={`/search?q=${encodeURIComponent(term.q)}`}
              className="rounded-md border border-zinc-800 bg-zinc-950/50 px-2 py-0.5 text-[11px] text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
            >
              {topSearchLabel(term, lang)}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
