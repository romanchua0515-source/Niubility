"use client";

import { FeaturedToolCard } from "@/components/featured-tool-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/context/LanguageContext";
import type { DirectoryListing, ExploreCategory } from "@/types/data";
import {
  directoryListingToFeaturedTool,
  getListingsByCategory,
  leafSlugToListingCategory,
  listingsForExploreSubSlugs,
} from "@/lib/listing-utils";
import { getExploreCategoryIcon } from "@/lib/category-metadata";
import { exploreCategoryText, exploreSubcategoryLabel } from "@/i18n/localized";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type CategoryLevelTwoPageProps = {
  slug: string;
  group: ExploreCategory;
  listings: DirectoryListing[];
};

export function CategoryLevelTwoPage({
  slug,
  group,
  listings,
}: CategoryLevelTwoPageProps) {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState<"all" | string>("all");

  const { title, description } = exploreCategoryText(group, lang);

  const filteredListings: DirectoryListing[] = useMemo(() => {
    if (tab === "all") {
      return listingsForExploreSubSlugs(
        listings,
        group.subcategories.map((s) => s.slug),
      );
    }
    const lc = leafSlugToListingCategory(tab);
    if (!lc) return [];
    return getListingsByCategory(listings, lc);
  }, [group, tab, listings]);

  const tools = useMemo(
    () => filteredListings.map(directoryListingToFeaturedTool),
    [filteredListings],
  );

  const Icon = getExploreCategoryIcon(slug);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#050506]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.08),transparent)]"
        aria-hidden
      />
      <SiteHeader />
      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/categories"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          {t("linkBack")}
        </Link>

        <div className="relative mt-6 overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40">
          <div className="relative aspect-[21/9] min-h-[168px] sm:aspect-[24/9] sm:min-h-[200px]">
            <Image
              src={group.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1152px) 100vw, 1152px"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25"
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-black/35 text-emerald-300 backdrop-blur-sm sm:h-11 sm:w-11">
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div
          className="scrollbar-none -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
          role="tablist"
          aria-label={t("categoryCapsuleTabsAria")}
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "all"}
            onClick={() => setTab("all")}
            className={[
              "shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors sm:text-sm",
              tab === "all"
                ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-200"
                : "border-zinc-700/90 bg-zinc-950/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200",
            ].join(" ")}
          >
            {t("filterAllTab")}
          </button>
          {group.subcategories.map((sub) => {
            const active = tab === sub.slug;
            return (
              <button
                key={sub.slug}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(sub.slug)}
                className={[
                  "shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors sm:text-sm",
                  active
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-200"
                    : "border-zinc-700/90 bg-zinc-950/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200",
                ].join(" ")}
              >
                {exploreSubcategoryLabel(sub, lang)}
              </button>
            );
          })}
        </div>

        {tools.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 px-4 py-10 text-center text-sm text-zinc-500">
            {t("categoryLevelTwoEmpty")}
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <FeaturedToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
