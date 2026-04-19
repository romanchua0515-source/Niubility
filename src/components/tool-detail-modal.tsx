"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useUserState } from "@/context/UserStateContext";
import { getListingBookmarkKey } from "@/lib/bookmarks";
import type { DirectoryListing } from "@/types/data";
import { X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

type ToolDetailModalProps = {
  tool: DirectoryListing | null;
  onClose: () => void;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ToolDetailModal({ tool, onClose }: ToolDetailModalProps) {
  const { lang, t } = useLanguage();
  const { addRecent } = useUserState();
  const panelRef = useRef<HTMLDivElement>(null);
  const zh = lang === "zh";

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!tool) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [tool]);

  useLayoutEffect(() => {
    if (!tool) return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }
      if (e.key !== "Tab" || focusables.length === 0) return;

      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [tool, handleClose]);

  if (!tool) return null;

  const subcategory =
    zh && tool.subcategoryZh ? tool.subcategoryZh : tool.subcategory;
  const description =
    zh && tool.descriptionZh ? tool.descriptionZh : tool.description;
  const bestFor = zh && tool.bestForZh ? tool.bestForZh : tool.bestFor;
  const pricingNorm = tool.pricing.trim().toLowerCase();
  const pricingIsFree =
    pricingNorm === "free" || tool.pricing.trim() === "免费";
  const bookmarkKey = getListingBookmarkKey(tool);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/80"
      role="presentation"
      onClick={handleClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tool-modal-title"
        className="relative mx-4 w-full max-w-lg rounded-xl border border-zinc-800/60 bg-zinc-900 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          aria-label={t("toolModalClose")}
          onClick={handleClose}
        >
          <X className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>

        <h2
          id="tool-modal-title"
          className="pr-10 text-xl font-semibold tracking-tight text-zinc-100"
        >
          {tool.name}
        </h2>

        <div className="mt-3">
          <span className="inline-block rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-400">
            {subcategory}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-zinc-400">{description}</p>

        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {t("bestForLabel")}
          </p>
          <p className="mt-1 text-sm text-zinc-300">{bestFor}</p>
        </div>

        {tool.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tool.tags.map((tag) => (
              <span
                key={`${tool.slug}-${tag}`}
                className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-4">
          <span
            className={`inline-block rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium ${
              pricingIsFree ? "text-emerald-400" : "text-zinc-400"
            }`}
          >
            {tool.pricing}
          </span>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          >
            {t("toolModalClose")}
          </button>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
            onClick={() => addRecent(bookmarkKey)}
          >
            {t("toolModalVisit")}
          </a>
        </div>
      </div>
    </div>
  );
}
