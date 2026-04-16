"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { DirectoryListing } from "@/data/listings";
import Link from "next/link";

type SearchViewProps = {
  query: string;
  results: DirectoryListing[];
};

export function SearchView({ query, results }: SearchViewProps) {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-[#050506]">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.08),transparent)]"
        aria-hidden
      />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          {t("linkBackLong")}
        </Link>
        <h1 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-100">
          {t("pageSearchTitle")}
        </h1>
        {query ? (
          <>
            <p className="mt-4 text-sm text-zinc-500">
              {t("searchResultPending").replace("{{q}}", query)}
            </p>
            {results.length === 0 ? (
              <p className="mt-6 text-sm text-zinc-600">{t("searchNoResults")}</p>
            ) : (
              <ul className="mt-8 space-y-2">
                {results.map((listing) => (
                  <li key={listing.slug}>
                    <a
                      href={listing.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 transition-colors hover:border-emerald-500/30 hover:bg-zinc-900/70"
                    >
                      <span className="font-medium text-zinc-100">
                        {listing.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-zinc-500">
                        {listing.subcategory}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">{t("pageSearchEmptyHint")}</p>
        )}
      </div>
    </div>
  );
}
