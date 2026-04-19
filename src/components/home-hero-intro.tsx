"use client";

import { HeroQuickActions } from "@/components/hero-quick-actions";
import { HeroSearch } from "@/components/hero-search";
import { useLanguage } from "@/context/LanguageContext";
import type { Category, DirectoryListing } from "@/types/data";

type HomeHeroIntroProps = {
  listings: DirectoryListing[];
  leafCategories: Category[];
};

export function HomeHeroIntro({ listings, leafCategories }: HomeHeroIntroProps) {
  const { t } = useLanguage();

  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
        {t("heroEyebrow")}
      </p>
      <h1 className="mt-2 max-w-xl text-2xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-3xl sm:leading-tight md:text-[2rem] md:leading-tight">
        {t("heroTitle")}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400 md:text-base md:leading-relaxed">
        {t("heroSubtitle")}
      </p>
      <HeroSearch listings={listings} leafCategories={leafCategories} />
      <HeroQuickActions />
    </div>
  );
}
