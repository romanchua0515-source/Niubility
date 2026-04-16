"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Lang } from "@/i18n/dictionary";
import type { Category } from "@/data/categories";
import { filterListingsByQuery, type DirectoryListing } from "@/data/listings";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type HeroSearchProps = {
  className?: string;
  listings: DirectoryListing[];
  leafCategories: Category[];
};

function categoryTitleForListing(
  listing: DirectoryListing,
  leafCategories: Category[],
): string {
  return (
    leafCategories.find((c) => c.slug === listing.category)?.title ??
    listing.category
  );
}

function subcategoryLabel(listing: DirectoryListing, lang: Lang): string {
  if (lang === "zh" && listing.subcategoryZh) {
    return listing.subcategoryZh;
  }
  return listing.subcategory;
}

export function HeroSearch({
  className,
  listings,
  leafCategories,
}: HeroSearchProps) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(
    () => filterListingsByQuery(query, listings),
    [query, listings],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const goToListing = useCallback(
    (listing: DirectoryListing) => {
      setOpen(false);
      setQuery("");
      inputRef.current?.blur();
      const params = new URLSearchParams();
      params.set("tool", listing.name);
      router.push(`/categories/${listing.category}?${params.toString()}`);
    },
    [router],
  );

  const submit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const q = query.trim();
      if (!q) return;
      if (results.length === 1) {
        goToListing(results[0]);
        return;
      }
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setOpen(false);
    },
    [query, results, router, goToListing],
  );

  const showPanel = open && query.trim().length > 0;

  return (
    <form
      onSubmit={submit}
      className={["mt-5 w-full max-w-xl", className].filter(Boolean).join(" ")}
      role="search"
      aria-label={t("searchAriaLabel")}
    >
      <div ref={rootRef} className="relative">
        <div className="group relative flex items-center gap-2.5 rounded-xl border border-zinc-800/90 bg-zinc-950/80 px-3 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] ring-emerald-500/0 transition-[box-shadow,border-color] focus-within:border-emerald-500/35 focus-within:ring-2 focus-within:ring-emerald-500/20 sm:gap-3 sm:px-4 sm:py-2.5">
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
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setOpen(false);
                inputRef.current?.blur();
              }
            }}
            aria-expanded={showPanel}
            aria-controls="hero-search-results"
            aria-autocomplete="list"
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 outline-none"
          />
          <kbd className="hidden shrink-0 rounded-md border border-zinc-700/90 bg-zinc-900/80 px-2 py-1 font-mono text-[10px] font-medium text-zinc-500 sm:inline-block">
            /
          </kbd>
        </div>

        {showPanel ? (
          <div
            id="hero-search-results"
            role="listbox"
            aria-label={t("searchListboxLabel")}
            className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 max-h-[min(18rem,50vh)] overflow-y-auto rounded-xl border border-zinc-800/95 bg-zinc-950/98 py-1 shadow-[0_16px_48px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.06]"
          >
            {results.length === 0 ? (
              <p className="px-3 py-2.5 text-left text-xs text-zinc-500">
                {t("searchNoResults")}
              </p>
            ) : (
              results.map((listing) => (
                <button
                  key={listing.slug}
                  type="button"
                  role="option"
                  className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-900/90 focus:bg-zinc-900/90 focus:outline-none"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goToListing(listing)}
                >
                  <span className="font-medium text-zinc-100">{listing.name}</span>
                  <span className="text-[11px] leading-snug text-zinc-500">
                    {categoryTitleForListing(listing, leafCategories)}
                    <span className="text-zinc-600"> · </span>
                    {subcategoryLabel(listing, lang)}
                  </span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>
      <p className="mt-1.5 text-left text-[11px] text-zinc-600">
        {t("searchHint")}
      </p>
    </form>
  );
}
