"use client";

import { useCallback, useState } from "react";
import { CareersResourceCard } from "@/components/careers-resource-card";
import { DirectoryListingCard } from "@/components/directory-listing-card";
import { ToolDetailModal } from "@/components/tool-detail-modal";
import { useLanguage } from "@/context/LanguageContext";
import { categoryText } from "@/i18n/localized";
import type { Category, CareersModule, CareersResource, DirectoryListing } from "@/types/data";
import { getLeafCategoryIcon } from "@/lib/category-metadata";
import {
  jobsAndCareersFeatured,
  jobsAndCareersModules,
} from "@/lib/job-careers";
import Link from "next/link";

type CategoryDetailPageProps = {
  slug: string;
  allListings: DirectoryListing[];
  category: Category;
};

export function CategoryDetailPage({
  slug,
  allListings,
  category,
}: CategoryDetailPageProps) {
  const { t, lang } = useLanguage();
  const [selectedTool, setSelectedTool] = useState<DirectoryListing | null>(
    null,
  );
  const closeToolModal = useCallback(() => setSelectedTool(null), []);

  const { title, description } = categoryText(category, lang);
  const Icon = getLeafCategoryIcon(category.slug);

  return (
    <div className="relative min-h-screen bg-[#050506]">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.08),transparent)]"
        aria-hidden
      />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          {t("linkBack")}
        </Link>
        <div className="mt-8 flex items-center gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-emerald-400">
            <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
              {title}
            </h1>
            <p className="mt-1 text-zinc-500">{description}</p>
          </div>
        </div>

        {slug === "job-boards" ? (
          <div className="mt-10 space-y-8">
            <section
              aria-labelledby="featured-listings-heading"
              className="rounded-2xl border border-zinc-800/70 bg-zinc-900/20 p-4 sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2
                  id="featured-listings-heading"
                  className="text-lg font-semibold tracking-tight text-zinc-100"
                >
                  {t("categoryFeaturedPicks")}
                </h2>
                <span className="text-xs text-zinc-600">
                  {jobsAndCareersFeatured.length} {t("resourcesUnit")}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {jobsAndCareersFeatured.map((resource) => (
                  <CareersResourceCard
                    key={`featured-${resource.name}`}
                    resource={resource}
                  />
                ))}
              </div>
            </section>

            {jobsAndCareersModules.map((module) => (
              <section
                key={module.key}
                aria-labelledby={`${module.key}-heading`}
                className="rounded-2xl border border-zinc-800/70 bg-zinc-900/20 p-4 sm:p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2
                      id={`${module.key}-heading`}
                      className="text-lg font-semibold tracking-tight text-zinc-100"
                    >
                      {module.title}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      {module.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-zinc-600">
                    {module.resources.length} {t("linksUnit")}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {module.resources.map((resource) => (
                    <CareersResourceCard
                      key={`${module.key}-${resource.name}`}
                      resource={resource}
                    />
                  ))}
                </div>
              </section>
            ))}

            <section
              aria-labelledby="directory-listings-heading"
              className="rounded-2xl border border-zinc-800/70 bg-zinc-900/20 p-4 sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2
                  id="directory-listings-heading"
                  className="text-lg font-semibold tracking-tight text-zinc-100"
                >
                  {t("categoryDirectoryHeading")}
                </h2>
                <span className="text-xs text-zinc-600">
                  {allListings.length} {t("entriesUnit")}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {allListings.map((listing) => (
                  <DirectoryListingCard
                    key={listing.slug}
                    listing={listing}
                    onClick={() => setSelectedTool(listing)}
                  />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <p className="mt-10 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 px-4 py-8 text-center text-sm text-zinc-500">
            {t("categoryNextSlice")}
          </p>
        )}
      </main>

      <ToolDetailModal tool={selectedTool} onClose={closeToolModal} />
    </div>
  );
}
