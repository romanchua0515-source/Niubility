"use client";

import { useLanguage } from "@/context/LanguageContext";
import { categoryText } from "@/i18n/localized";
import type { Category } from "@/types/data";
import { getLeafCategoryIcon } from "@/lib/category-metadata";
import { trackEvent } from "@/lib/posthog";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type CategoryCardProps = {
  category: Category;
  compact?: boolean;
};

export function CategoryCard({ category, compact = false }: CategoryCardProps) {
  const { t, lang } = useLanguage();
  const { title, description } = categoryText(category, lang);
  const Icon = getLeafCategoryIcon(category.slug);

  if (compact) {
    return (
      <Link
        href={`/categories/${category.slug}`}
        className="group flex h-full min-h-[140px] flex-col justify-between gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/35 p-4 transition-transform hover:scale-[1.02] hover:border-zinc-700/60 hover:bg-zinc-900/80"
        onClick={() =>
          trackEvent("category_clicked", {
            category_slug: category.slug,
            category_name: category.title,
          })
        }
      >
        <div className="space-y-2">
          <span className="inline-flex w-fit rounded-full border border-zinc-800 bg-zinc-950/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500 group-hover:border-zinc-700 group-hover:text-zinc-400">
            {t("cardBadgeIndex")}
          </span>
          <div className="flex items-start gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/60 text-emerald-400/90 group-hover:border-emerald-500/30">
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            </span>
            <h3 className="text-base font-semibold leading-snug tracking-tight text-zinc-100">
              {title}
            </h3>
          </div>
          <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">
            {description}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400/90 group-hover:text-emerald-300">
          {t("cardExplore")}
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex flex-col gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] transition-transform duration-300 hover:scale-[1.02] hover:border-zinc-700/60 hover:bg-zinc-900/80"
      onClick={() =>
        trackEvent("category_clicked", {
          category_slug: category.slug,
          category_name: category.title,
        })
      }
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-700/80 bg-zinc-950/60 text-emerald-400/90 transition-colors group-hover:border-emerald-500/35 group-hover:text-emerald-300">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <span className="rounded-full border border-zinc-800 bg-zinc-950/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500 transition-colors group-hover:border-zinc-700 group-hover:text-zinc-400">
          {t("cardExplore")}
        </span>
      </div>
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-zinc-400">
          {description}
        </p>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-violet-500/[0.05] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Link>
  );
}
