"use client";

import { DirectoryListingCard } from "@/components/directory-listing-card";
import { useLanguage } from "@/context/LanguageContext";
import type { TopSearched } from "@/lib/api";
import type { DirectoryListing, ListingCategory } from "@/types/data";
import { Search, SearchX, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { trackEvent } from "@/lib/posthog";

type SearchViewProps = {
  query: string;
  results: DirectoryListing[];
  topSearched: TopSearched[];
};

type FilterTab = "all" | "tool" | "person" | "guide";

function listingSearchKind(
  listing: DirectoryListing,
): "tool" | "person" | "guide" {
  const c: ListingCategory = listing.category;
  if (c === "community") return "person";
  if (c === "research" || c === "trends-news" || c === "job-boards") {
    return "guide";
  }
  return "tool";
}

function filterByTab(
  listings: DirectoryListing[],
  tab: FilterTab,
): DirectoryListing[] {
  if (tab === "all") return listings;
  return listings.filter((l) => listingSearchKind(l) === tab);
}

export function SearchView({ query, results, topSearched }: SearchViewProps) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(query);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setInputValue(query);
    setFilterTab("all");
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => {
      trackEvent("search_performed", {
        query: query.trim().toLowerCase(),
        results_count: results.length,
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [query, results.length]);

  const navigateToQuery = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      startTransition(() => {
        if (!trimmed) {
          router.replace("/search");
        } else {
          router.push(`/search?q=${encodeURIComponent(trimmed)}`);
        }
      });
    },
    [router],
  );

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      navigateToQuery(inputValue);
    },
    [inputValue, navigateToQuery],
  );

  const filtered = useMemo(
    () => filterByTab(results, filterTab),
    [results, filterTab],
  );

  const grouped = useMemo(() => {
    const tools: DirectoryListing[] = [];
    const people: DirectoryListing[] = [];
    const guides: DirectoryListing[] = [];
    for (const listing of results) {
      const k = listingSearchKind(listing);
      if (k === "tool") tools.push(listing);
      else if (k === "person") people.push(listing);
      else guides.push(listing);
    }
    return { tools, people, guides };
  }, [results]);

  const showGrouped = filterTab === "all" && query.length > 0;

  const filterPills: { id: FilterTab; label: string }[] = [
    { id: "all", label: t("searchFilterAll") },
    { id: "tool", label: t("searchFilterTools") },
    { id: "person", label: t("searchFilterPeople") },
    { id: "guide", label: t("searchFilterGuides") },
  ];

  const resultCountText = t("searchResultsCount")
    .replace("{{count}}", String(filtered.length))
    .replace("{{q}}", query);

  const emptyTitle = t("searchEmptyNoResults").replace("{{q}}", query);

  return (
    <div className="relative min-h-screen bg-[#050506]">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.08),transparent)]"
        aria-hidden
      />
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          {t("linkBackLong")}
        </Link>
        <h1 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-100">
          {t("pageSearchTitle")}
        </h1>

        <form
          onSubmit={onSubmit}
          className="mt-8 w-full"
          role="search"
          aria-label={t("searchAriaLabel")}
        >
          <div className="group relative flex w-full items-center gap-2.5 rounded-xl border border-zinc-800/90 bg-zinc-950/80 px-3 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] ring-emerald-500/0 transition-[box-shadow,border-color] focus-within:border-emerald-500/35 focus-within:ring-2 focus-within:ring-emerald-500/20 sm:gap-3 sm:px-4 sm:py-2.5">
            <Search
              className="h-5 w-5 shrink-0 text-zinc-500 transition-colors group-focus-within:text-emerald-400/90"
              strokeWidth={1.75}
              aria-hidden
            />
            <input
              ref={inputRef}
              name="q"
              type="search"
              autoComplete="off"
              placeholder={t("searchPageInputPlaceholder")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 outline-none"
            />
            {inputValue ? (
              <button
                type="button"
                className="shrink-0 rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-800/80 hover:text-zinc-300"
                aria-label={t("searchClearInputAria")}
                onClick={() => {
                  setInputValue("");
                  startTransition(() => {
                    router.replace("/search");
                  });
                }}
              >
                <X className="h-4 w-4" strokeWidth={2} aria-hidden />
              </button>
            ) : null}
          </div>
        </form>

        <div
          className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label={t("searchFilterRowAria")}
        >
          {filterPills.map((pill) => {
            const active = filterTab === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilterTab(pill.id)}
                className={
                  active
                    ? "shrink-0 rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-medium text-zinc-950"
                    : "shrink-0 rounded-full bg-zinc-800 px-4 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-700"
                }
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {query ? (
          isPending ? (
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`sk-${i}`}
                  className="h-24 rounded-xl bg-zinc-800/50 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              <p className="mt-8 text-sm text-zinc-400">{resultCountText}</p>

              {filtered.length === 0 ? (
                <div className="mt-16 flex flex-col items-center justify-center text-center">
                  <SearchX
                    className="h-12 w-12 text-zinc-600"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <p className="mt-4 text-zinc-400">{emptyTitle}</p>
                  <p className="mt-2 text-sm text-zinc-500">
                    {t("searchEmptySuggestion")}
                  </p>
                </div>
              ) : showGrouped ? (
                <div className="mt-8 space-y-10">
                  {grouped.tools.length > 0 ? (
                    <section>
                      <h2 className="mb-3 text-xs uppercase tracking-widest text-zinc-500">
                        {t("searchSectionTools")}
                      </h2>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {grouped.tools.map((listing) => (
                          <li key={listing.slug}>
                            <DirectoryListingCard listing={listing} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                  {grouped.people.length > 0 ? (
                    <section>
                      <h2 className="mb-3 text-xs uppercase tracking-widest text-zinc-500">
                        {t("searchSectionPeople")}
                      </h2>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {grouped.people.map((listing) => (
                          <li key={listing.slug}>
                            <DirectoryListingCard listing={listing} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                  {grouped.guides.length > 0 ? (
                    <section>
                      <h2 className="mb-3 text-xs uppercase tracking-widest text-zinc-500">
                        {t("searchSectionGuides")}
                      </h2>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {grouped.guides.map((listing) => (
                          <li key={listing.slug}>
                            <DirectoryListingCard listing={listing} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                </div>
              ) : (
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {filtered.map((listing) => (
                    <li key={listing.slug}>
                      <DirectoryListingCard listing={listing} />
                    </li>
                  ))}
                </ul>
              )}
            </>
          )
        ) : (
          <div className="mt-12">
            <p className="text-xs uppercase text-zinc-500">
              {t("searchPopularLabel")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {topSearched.map((row) => {
                const label =
                  lang === "zh" && row.labelZh ? row.labelZh : row.label;
                return (
                  <button
                    key={row.id}
                    type="button"
                    className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                    onClick={() => {
                      setInputValue(row.query);
                      navigateToQuery(row.query);
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
