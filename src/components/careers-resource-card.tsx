"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { CareersResource } from "@/types/data";

type CareersResourceCardProps = {
  resource: CareersResource;
};

export function CareersResourceCard({ resource }: CareersResourceCardProps) {
  const { t } = useLanguage();

  return (
    <article className="rounded-xl border border-zinc-800/80 bg-zinc-900/35 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-tight text-zinc-100">
          {resource.name}
        </h3>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-md border border-zinc-700 bg-zinc-950/50 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500/35 hover:text-emerald-200"
        >
          {t("visitCta")}
        </a>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        {resource.description}
      </p>
      <p className="mt-2 text-xs text-zinc-500">
        <span className="text-zinc-400">{t("bestForLabel")}</span>{" "}
        {resource.bestFor}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {resource.tags.slice(0, 4).map((tag) => (
          <span
            key={`${resource.name}-${tag}`}
            className="rounded border border-zinc-800 bg-zinc-950/50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
