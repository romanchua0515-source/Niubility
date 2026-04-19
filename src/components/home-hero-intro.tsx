"use client";

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
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
        {t("heroEyebrow")}
      </p>
      <h1 className="mt-4 max-w-xl text-5xl font-bold leading-tight tracking-tight text-zinc-100 md:text-6xl lg:text-7xl">
        {t("heroTitle")}
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-400">
        {t("heroSubtitle")}
      </p>
      <HeroSearch
        listings={listings}
        leafCategories={leafCategories}
        variant="hero"
      />
    </div>
  );
}
