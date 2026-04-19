"use client";

import type { HotItem, TopSearchTerm } from "@/types/data";
import { useLanguage } from "@/context/LanguageContext";
import { hotItemText, topSearchLabel } from "@/i18n/localized";
import { ArrowUpRight, Flame } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function getTimeUntilMonday(): string {
  const now = new Date();
  const nextMonday = new Date();
  nextMonday.setUTCDate(
    now.getUTCDate() + ((8 - now.getUTCDay()) % 7 || 7),
  );
  nextMonday.setUTCHours(0, 0, 0, 0);
  const diff = nextMonday.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (diff < 3600000) return "Updating soon...";
  if (days > 0) return `Updates in ${days}d ${hours}h ${minutes}m`;
  return `Updates in ${hours}h ${minutes}m`;
}

function WeekSignalsCountdown() {
  const [label, setLabel] = useState(getTimeUntilMonday);

  useEffect(() => {
    setLabel(getTimeUntilMonday());
    const id = window.setInterval(() => {
      setLabel(getTimeUntilMonday());
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="text-right text-xs text-zinc-500" aria-live="polite">
      {label}
    </p>
  );
}

type HeroWeekPanelProps = {
  className?: string;
  trends: HotItem[];
  topSearched: TopSearchTerm[];
};

export function HeroWeekPanel({
  className,
  trends,
  topSearched,
}: HeroWeekPanelProps) {
  const { t, lang } = useLanguage();
  const top3 = trends.slice(0, 3);

  return (
    <aside
      className={[
        "flex min-h-[22rem] flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/45 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] lg:min-h-full lg:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        <div className="flex items-start justify-between gap-3 border-b border-zinc-800/70 pb-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {t("panelThisWeek")}
          </h2>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <WeekSignalsCountdown />
            <Link
              href="/signals"
              className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-400/90 hover:text-emerald-300"
            >
              {t("panelViewAll")}
              <ArrowUpRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>
        </div>

        <ul className="mt-3 space-y-2 lg:mt-4">
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
      </div>

      <div className="mt-4 border-t border-zinc-800/70 pt-3 lg:mt-auto">
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
