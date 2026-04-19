"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { ExploreCategory } from "@/types/data";
import { exploreCategoryText } from "@/i18n/localized";
import { getExploreCategoryIcon } from "@/lib/category-metadata";
import Image from "next/image";
import Link from "next/link";

type ExploreCategoryCardProps = {
  group: ExploreCategory;
};

export function ExploreCategoryCard({ group }: ExploreCategoryCardProps) {
  const { t, lang } = useLanguage();
  const { title, description } = exploreCategoryText(group, lang);
  const Icon = getExploreCategoryIcon(group.slug);
  const n = group.subcategories.length;
  const badge = t("subcategoriesBadge").replace("{{n}}", String(n));

  return (
    <Link
      href={`/categories/${group.slug}`}
      className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] outline-none ring-emerald-500/0 transition-[transform,box-shadow] duration-300 hover:border-emerald-500/30 hover:shadow-[0_24px_60px_-28px_rgba(16,185,129,0.35)] focus-visible:ring-2 focus-visible:ring-emerald-500/40"
    >
      <Image
        src={group.coverImage}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        priority={false}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"
        aria-hidden
      />
      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-black/30 text-emerald-300/95 backdrop-blur-sm">
          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-bold leading-tight tracking-tight text-white sm:text-xl">
            {title}
          </h2>
          <p className="mt-1 line-clamp-2 text-xs leading-snug text-white/75 sm:text-sm">
            {description}
          </p>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-300/90">
            {badge}
          </p>
        </div>
      </div>
    </Link>
  );
}
