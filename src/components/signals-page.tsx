"use client";

import { HotThisWeekList } from "@/components/hot-this-week";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/context/LanguageContext";
import type { Signal } from "@/lib/api";
import type { HotItem } from "@/types/data";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SignalsPageProps = {
  signals: Signal[];
};

function compareWeekLabelsDesc(a: string, b: string): number {
  const parse = (s: string) => {
    const m = /^(\d{4})-W(\d{2})$/.exec(s.trim());
    if (!m) return [0, 0] as const;
    return [Number(m[1]), Number(m[2])] as const;
  };
  const [ay, aw] = parse(a);
  const [by, bw] = parse(b);
  if (ay !== by) return by - ay;
  return bw - aw;
}

function signalToHotItem(s: Signal): HotItem {
  const kind: HotItem["kind"] =
    s.type === "TOPIC" ? "Topic" : s.type === "TOOL" ? "Tool" : "Resource";
  return {
    id: s.id,
    title: s.title,
    titleZh: s.titleZh,
    context: s.description,
    contextZh: s.descriptionZh,
    kind,
  };
}

export function SignalsPage({ signals }: SignalsPageProps) {
  const { t } = useLanguage();

  const weekPills = useMemo(() => {
    const uniq = [...new Set(signals.map((s) => s.weekLabel))];
    uniq.sort(compareWeekLabelsDesc);
    return uniq;
  }, [signals]);

  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  useEffect(() => {
    if (weekPills.length === 0) {
      setSelectedWeek(null);
      return;
    }
    setSelectedWeek((prev) =>
      prev && weekPills.includes(prev) ? prev : weekPills[0],
    );
  }, [weekPills]);

  const filteredItems = useMemo(() => {
    if (!selectedWeek) return [];
    return signals
      .filter((s) => s.weekLabel === selectedWeek)
      .map(signalToHotItem);
  }, [signals, selectedWeek]);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#050506]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.08),transparent)]"
        aria-hidden
      />
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          {t("linkBackShort")}
        </Link>
        <header className="mt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/85">
            {t("signalsEyebrow")}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            {t("signalsPageTitle")}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">{t("signalsPageSubtitle")}</p>
        </header>

        {weekPills.length > 0 ? (
          <div
            className="mt-6 flex flex-wrap gap-2"
            role="tablist"
            aria-label="Week"
          >
            {weekPills.map((week) => {
              const active = selectedWeek === week;
              return (
                <button
                  key={week}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedWeek(week)}
                  className={
                    active
                      ? "rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-medium text-zinc-950"
                      : "rounded-full bg-zinc-800 px-4 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-700"
                  }
                >
                  {week}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mt-8">
          {filteredItems.length > 0 ? (
            <HotThisWeekList items={filteredItems} />
          ) : (
            <p className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 px-4 py-8 text-center text-sm text-zinc-500">
              {signals.length === 0
                ? t("signalsPageSubtitle")
                : "No signals for this week."}
            </p>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
