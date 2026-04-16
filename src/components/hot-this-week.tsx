"use client";

import { useLanguage } from "@/context/LanguageContext";
import { hotItemText } from "@/i18n/localized";
import type { HotItem } from "@/data/hot-this-week";
import { Flame } from "lucide-react";

type HotThisWeekProps = {
  items: HotItem[];
  compact?: boolean;
};

const kindKeys = {
  Topic: "kindTopic" as const,
  Tool: "kindTool" as const,
  Resource: "kindResource" as const,
};

const kindStyles: Record<HotItem["kind"], string> = {
  Topic: "border-amber-500/25 bg-amber-500/10 text-amber-200/90",
  Tool: "border-cyan-500/25 bg-cyan-500/10 text-cyan-200/90",
  Resource: "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-200/90",
};

export function HotThisWeekList({ items, compact = false }: HotThisWeekProps) {
  const { t, lang } = useLanguage();
  const py = compact ? "py-2.5" : "py-4";
  const px = compact ? "px-4" : "px-5";
  const gap = compact ? "gap-2" : "gap-3";

  return (
    <div className="divide-y divide-zinc-800/80 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
      {items.map((item, i) => {
        const { title, context } = hotItemText(item, lang);
        return (
          <div
            key={item.id}
            className={`flex flex-col ${gap} ${px} ${py} transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-zinc-900/50 sm:flex-row sm:items-start sm:justify-between`}
          >
            <div className="flex min-w-0 flex-1 gap-2.5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950/60 text-zinc-500">
                {i === 0 ? (
                  <Flame className="h-3.5 w-3.5 text-orange-400/90" aria-hidden />
                ) : (
                  <span className="font-mono text-[10px] text-zinc-600">
                    {i + 1}
                  </span>
                )}
              </span>
              <div className="min-w-0">
                <p
                  className={`font-medium leading-snug text-zinc-100 ${compact ? "text-sm" : ""}`}
                >
                  {title}
                </p>
                <p
                  className={`mt-0.5 text-zinc-500 ${compact ? "text-xs leading-relaxed" : "text-sm"}`}
                >
                  {context}
                </p>
              </div>
            </div>
            <span
              className={`shrink-0 self-start rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${kindStyles[item.kind]}`}
            >
              {t(kindKeys[item.kind])}
            </span>
          </div>
        );
      })}
    </div>
  );
}
