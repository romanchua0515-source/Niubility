"use client";

import { HeroQuickActions } from "@/components/hero-quick-actions";
import { HeroSearch } from "@/components/hero-search";
import { useLanguage } from "@/context/LanguageContext";
import type { Category } from "@/data/categories";
import type { DirectoryListing } from "@/data/listings";

type HomeHeroIntroProps = {
  listings: DirectoryListing[];
  leafCategories: Category[];
};

export function HomeHeroIntro({ listings, leafCategories }: HomeHeroIntroProps) {
  const { t } = useLanguage();

  return (
    <div className="lg:col-span-7">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
        {t("heroEyebrow")}
      </p>
      <h1 className="mt-2 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-[2rem] sm:leading-tight">
        {t("heroTitle")}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
        {t("heroSubtitle")}
      </p>
      <HeroSearch listings={listings} leafCategories={leafCategories} />
      <HeroQuickActions />
    </div>
  );
}
