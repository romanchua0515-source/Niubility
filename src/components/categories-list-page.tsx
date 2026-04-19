"use client";

import { ExploreCategoryCard } from "@/components/explore-category-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/context/LanguageContext";
import type { ExploreCategory } from "@/types/data";
import Link from "next/link";

type CategoriesListPageProps = {
  exploreCategories: ExploreCategory[];
};

export function CategoriesListPage({
  exploreCategories,
}: CategoriesListPageProps) {
  const { t } = useLanguage();

  return (
    <div className="relative flex min-h-screen flex-col bg-[#050506]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.1),transparent)]"
        aria-hidden
      />
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          {t("linkBackShort")}
        </Link>
        <header className="mt-8 max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/85">
            {t("explorePageEyebrow")}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            {t("explorePageTitle")}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">{t("explorePageSubtitle")}</p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {exploreCategories.map((group) => (
            <ExploreCategoryCard key={group.slug} group={group} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
