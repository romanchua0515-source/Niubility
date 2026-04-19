"use client";

import { AdBannerForm } from "@/components/admin/ad-banner-form";
import { HeroToolCarousel } from "@/components/hero-tool-carousel";
import type { DirectoryListing, FeaturedTool, ListingCategory } from "@/types/data";
import { directoryListingToFeaturedTool } from "@/lib/listing-utils";
import { supabase } from "@/lib/supabase";
import { GripVertical } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type BannersConsoleProps = {
  initialListings: DirectoryListing[];
};

const CATEGORY_FILTER_OPTIONS: { value: ListingCategory; label: string }[] = [
  { value: "job-boards", label: "Job boards" },
  { value: "ai-tools", label: "AI tools" },
  { value: "research", label: "Research" },
  { value: "trends-news", label: "Trends & news" },
  { value: "security", label: "Security" },
  { value: "browsers", label: "Browsers" },
  { value: "media", label: "Media" },
  { value: "community", label: "Community" },
];

function sortForAdmin(a: DirectoryListing, b: DirectoryListing) {
  if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
  if (a.isFeatured && b.isFeatured) {
    return a.featuredOrder - b.featuredOrder;
  }
  return a.name.localeCompare(b.name);
}

function ModalCloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function FeaturedToggle({
  checked,
  disabled,
  onChange,
  slug,
}: {
  checked: boolean;
  disabled: boolean;
  onChange: (next: boolean) => void;
  slug: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <span className="sr-only">Featured for {slug}</span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors " +
          (checked
            ? "border-emerald-500/50 bg-emerald-500/85"
            : "border-zinc-700 bg-zinc-700")
        }
      >
        <span
          className={
            "pointer-events-none block h-[1.125rem] w-[1.125rem] translate-x-0.5 rounded-full bg-zinc-950 shadow-sm transition-transform " +
            (checked ? "translate-x-[1.375rem]" : "")
          }
        />
      </span>
    </label>
  );
}

export function BannersConsole({ initialListings }: BannersConsoleProps) {
  const router = useRouter();
  const [listings, setListings] = useState<DirectoryListing[]>(() =>
    [...initialListings].sort(sortForAdmin),
  );
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ListingCategory | "all">(
    "all",
  );
  const [pending, setPending] = useState<Set<string>>(() => new Set());
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [draggingSlug, setDraggingSlug] = useState<string | null>(null);
  const [dragOverSlug, setDragOverSlug] = useState<string | null>(null);

  useEffect(() => {
    setListings([...initialListings].sort(sortForAdmin));
  }, [initialListings]);

  const nextFeaturedOrder = useMemo(() => {
    const featured = listings.filter((l) => l.isFeatured);
    if (featured.length === 0) return 0;
    return Math.max(...featured.map((l) => l.featuredOrder)) + 1;
  }, [listings]);

  const previewTools: FeaturedTool[] = useMemo(
    () =>
      listings
        .filter((l) => l.isFeatured)
        .sort((a, b) => a.featuredOrder - b.featuredOrder)
        .map((l) => directoryListingToFeaturedTool(l)),
    [listings],
  );

  const filtered = useMemo(() => {
    const rows =
      categoryFilter === "all"
        ? listings
        : listings.filter((l) => l.category === categoryFilter);
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.slug.toLowerCase().includes(q) ||
        l.subcategory.toLowerCase().includes(q),
    );
  }, [listings, query, categoryFilter]);

  const setFeatured = useCallback(
    async (slug: string, next: boolean) => {
      setGlobalError(null);
      const prev = listings;

      if (next) {
        const maxOrder = listings
          .filter((l) => l.isFeatured)
          .reduce((m, l) => Math.max(m, l.featuredOrder), -1);
        const newOrder = maxOrder + 1;
        setListings((rows) =>
          rows
            .map((row) =>
              row.slug === slug
                ? { ...row, isFeatured: true, featuredOrder: newOrder }
                : row,
            )
            .sort(sortForAdmin),
        );
        setPending((p) => new Set(p).add(slug));

        const { error } = await supabase
          .from("tools")
          .update({ is_featured: true, featured_order: newOrder })
          .eq("slug", slug);

        setPending((p) => {
          const n = new Set(p);
          n.delete(slug);
          return n;
        });

        if (error) {
          setListings([...prev].sort(sortForAdmin));
          setGlobalError(error.message);
          return;
        }
      } else {
        setListings((rows) =>
          rows
            .map((row) =>
              row.slug === slug ? { ...row, isFeatured: false } : row,
            )
            .sort(sortForAdmin),
        );
        setPending((p) => new Set(p).add(slug));

        const { error } = await supabase
          .from("tools")
          .update({ is_featured: false })
          .eq("slug", slug);

        setPending((p) => {
          const n = new Set(p);
          n.delete(slug);
          return n;
        });

        if (error) {
          setListings([...prev].sort(sortForAdmin));
          setGlobalError(error.message);
          return;
        }
      }
      router.refresh();
    },
    [listings, router],
  );

  const featuredSorted = useMemo(
    () =>
      listings
        .filter((l) => l.isFeatured)
        .sort((a, b) => a.featuredOrder - b.featuredOrder),
    [listings],
  );

  /**
   * Drop reorder: moves `srcSlug` to the position of `targetSlug` inside the
   * featured list, then persists the new `featured_order` (0,1,2…) to Supabase.
   * Only the rows whose order actually changed are written.
   */
  const reorderFeatured = useCallback(
    async (srcSlug: string, targetSlug: string) => {
      if (srcSlug === targetSlug) return;
      setGlobalError(null);

      const current = featuredSorted;
      const srcIdx = current.findIndex((l) => l.slug === srcSlug);
      const targetIdx = current.findIndex((l) => l.slug === targetSlug);
      if (srcIdx === -1 || targetIdx === -1) return;

      const reordered = [...current];
      const [moved] = reordered.splice(srcIdx, 1);
      reordered.splice(targetIdx, 0, moved);

      // Compute contiguous 0…N-1 ordering, narrow to only rows that changed.
      const originalOrder = new Map(current.map((l) => [l.slug, l.featuredOrder]));
      const updates = reordered
        .map((l, i) => ({ slug: l.slug, newOrder: i }))
        .filter((u) => originalOrder.get(u.slug) !== u.newOrder);
      if (updates.length === 0) return;

      const prev = listings;
      const slugToOrder = new Map(updates.map((u) => [u.slug, u.newOrder]));
      setListings((rows) =>
        rows
          .map((r) =>
            slugToOrder.has(r.slug)
              ? { ...r, featuredOrder: slugToOrder.get(r.slug) as number }
              : r,
          )
          .sort(sortForAdmin),
      );

      setPending((p) => {
        const n = new Set(p);
        updates.forEach((u) => n.add(u.slug));
        return n;
      });

      const results = await Promise.all(
        updates.map((u) =>
          supabase
            .from("tools")
            .update({ featured_order: u.newOrder })
            .eq("slug", u.slug),
        ),
      );

      setPending((p) => {
        const n = new Set(p);
        updates.forEach((u) => n.delete(u.slug));
        return n;
      });

      const firstError = results.find((r) => r.error);
      if (firstError?.error) {
        setListings([...prev].sort(sortForAdmin));
        setGlobalError(firstError.error.message);
        return;
      }
      router.refresh();
    },
    [featuredSorted, listings, router],
  );

  // --- HTML5 drag + drop handlers (only active on featured rows) ---

  function onDragStart(slug: string, e: React.DragEvent<HTMLDivElement>) {
    setDraggingSlug(slug);
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", slug);
    } catch {
      /* Safari may reject setData during testing; effectAllowed is enough. */
    }
  }

  function onDragOver(slug: string, e: React.DragEvent<HTMLDivElement>) {
    if (!draggingSlug || draggingSlug === slug) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverSlug !== slug) setDragOverSlug(slug);
  }

  function onDragLeave(slug: string) {
    if (dragOverSlug === slug) setDragOverSlug(null);
  }

  function onDrop(slug: string, e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const src = draggingSlug;
    setDraggingSlug(null);
    setDragOverSlug(null);
    if (src && src !== slug) void reorderFeatured(src, slug);
  }

  function onDragEnd() {
    setDraggingSlug(null);
    setDragOverSlug(null);
  }

  return (
    <div className="space-y-6">
      {globalError ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {globalError}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setShowAdModal(true)}
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-violet-500/60 bg-violet-500/85 px-3 py-2 text-sm font-medium text-violet-50 transition-colors hover:bg-violet-400/90"
            >
              Add New Banner
            </button>
            <p className="text-xs text-zinc-600 sm:text-right">
              {previewTools.length} in carousel · {listings.length} tools total
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
            <div className="min-w-0 shrink-0 lg:w-44">
              <label
                htmlFor="banner-category-filter"
                className="block text-xs font-medium text-zinc-400"
              >
                分类筛选
              </label>
              <select
                id="banner-category-filter"
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value === "all"
                      ? "all"
                      : (e.target.value as ListingCategory),
                  )
                }
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              >
                <option value="all">全部</option>
                {CATEGORY_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0 flex-1">
              <label
                htmlFor="banner-tool-search"
                className="block text-xs font-medium text-zinc-400"
              >
                Search tools
              </label>
              <input
                id="banner-tool-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, slug, or category…"
                className="mt-1 w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-500/0 transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-800/60">
            <div className="overflow-x-auto">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-[2rem_minmax(0,2fr)_minmax(0,1.1fr)_auto] gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                  <div></div>
                  <div>Tool</div>
                  <div>Category</div>
                  <div className="pr-1 text-right">Featured</div>
                </div>
                {filtered.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-zinc-500">
                    {categoryFilter !== "all" || query.trim()
                      ? "No tools match this category filter or search."
                      : "No tools in the directory."}
                  </p>
                ) : (
                  <div className="divide-y divide-zinc-800/80 text-sm">
                    {filtered.map((tool) => {
                      const canDrag = tool.isFeatured;
                      const isDragging = draggingSlug === tool.slug;
                      const isDragOver =
                        dragOverSlug === tool.slug && draggingSlug !== tool.slug;

                      const rowClass = [
                        "grid grid-cols-[2rem_minmax(0,2fr)_minmax(0,1.1fr)_auto] items-center gap-2 px-4 py-2.5 transition-colors",
                        "hover:bg-zinc-900/50",
                        isDragging ? "opacity-40" : "",
                        isDragOver
                          ? "bg-zinc-700/50 border-l-2 border-emerald-400"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <div
                          key={tool.slug}
                          draggable={canDrag}
                          onDragStart={
                            canDrag ? (e) => onDragStart(tool.slug, e) : undefined
                          }
                          onDragOver={
                            canDrag ? (e) => onDragOver(tool.slug, e) : undefined
                          }
                          onDragLeave={
                            canDrag ? () => onDragLeave(tool.slug) : undefined
                          }
                          onDrop={
                            canDrag ? (e) => onDrop(tool.slug, e) : undefined
                          }
                          onDragEnd={canDrag ? onDragEnd : undefined}
                          className={rowClass}
                        >
                          <div
                            className={
                              canDrag
                                ? "flex h-full items-center justify-center text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing"
                                : "flex h-full items-center justify-center text-zinc-800"
                            }
                            aria-label={canDrag ? "Drag to reorder" : undefined}
                            title={
                              canDrag
                                ? "Drag to reorder carousel"
                                : "Enable Featured to reorder"
                            }
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-zinc-100">
                              {tool.name}
                              {tool.bannerImageUrl ? (
                                <span className="ml-1.5 text-[10px] font-normal uppercase tracking-wide text-violet-400/90">
                                  Ad
                                </span>
                              ) : null}
                            </p>
                            <p className="truncate font-mono text-[11px] text-zinc-600">
                              {tool.slug}
                            </p>
                          </div>
                          <div className="min-w-0 truncate text-xs text-zinc-400">
                            {tool.subcategory}
                          </div>
                          <div className="flex justify-end pr-1">
                            <FeaturedToggle
                              slug={tool.slug}
                              checked={tool.isFeatured}
                              disabled={pending.has(tool.slug)}
                              onChange={(next) => void setFeatured(tool.slug, next)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/35 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
              <h2 className="text-sm font-semibold tracking-tight text-zinc-100">
                Live Carousel Preview
              </h2>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                Same component as the homepage. Drag the grip handle on any
                featured row to reorder — updates live with no reload.
              </p>
              <div className="mt-4">
                {previewTools.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/60 px-3 py-8 text-center text-xs text-zinc-500">
                    No featured items. Enable a tool or publish a new banner ad.
                  </div>
                ) : (
                  <HeroToolCarousel tools={previewTools} />
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {showAdModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6">
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/50 px-6 py-4">
              <h2 className="text-lg font-semibold text-zinc-100">
                Add New Banner
              </h2>
              <button
                type="button"
                onClick={() => setShowAdModal(false)}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                aria-label="Close"
              >
                <ModalCloseIcon />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <AdBannerForm
                nextFeaturedOrder={nextFeaturedOrder}
                onSuccess={() => {
                  setShowAdModal(false);
                  router.refresh();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
