"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Check, Globe } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const CLOSE_MS = 140;

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_MS);
  }, [cancelClose]);

  const openNow = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  useEffect(() => {
    return () => cancelClose();
  }, [cancelClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let onDoc: ((e: MouseEvent) => void) | undefined;
    const t = window.setTimeout(() => {
      onDoc = (e: MouseEvent) => {
        if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", onDoc);
    }, 0);
    return () => {
      window.clearTimeout(t);
      if (onDoc) document.removeEventListener("mousedown", onDoc);
    };
  }, [open]);

  const pick = (next: "en" | "zh") => {
    setLang(next);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("languageSwitcherAria")}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-800/85 bg-zinc-950/70 px-2.5 text-zinc-400 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] transition-colors hover:border-zinc-700 hover:bg-zinc-900/80 hover:text-zinc-200"
      >
        <Globe className="h-4 w-4 shrink-0 text-zinc-500" strokeWidth={2} aria-hidden />
        <span className="hidden text-[11px] font-medium sm:inline">
          {lang === "en" ? t("langOptionEn") : t("langOptionZh")}
        </span>
      </button>

      <div
        role="listbox"
        aria-label={t("languageSwitcherAria")}
        className={[
          "absolute right-0 top-[calc(100%+0.4rem)] z-[60] min-w-[13.5rem] origin-top overflow-hidden rounded-xl border border-zinc-800/95 bg-zinc-950/95 py-1 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.06] backdrop-blur-md transition-[opacity,transform] duration-150",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        ].join(" ")}
      >
        <button
          type="button"
          role="option"
          aria-selected={lang === "en"}
          onClick={() => pick("en")}
          className={[
            "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors",
            lang === "en"
              ? "bg-zinc-800/70 text-emerald-300/95"
              : "text-zinc-300 hover:bg-zinc-900/90",
          ].join(" ")}
        >
          <span className="flex w-4 shrink-0 justify-center">
            {lang === "en" ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} aria-hidden />
            ) : null}
          </span>
          <span className="font-medium">{t("langOptionEn")}</span>
        </button>
        <button
          type="button"
          role="option"
          aria-selected={lang === "zh"}
          onClick={() => pick("zh")}
          className={[
            "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors",
            lang === "zh"
              ? "bg-zinc-800/70 text-emerald-300/95"
              : "text-zinc-300 hover:bg-zinc-900/90",
          ].join(" ")}
        >
          <span className="flex w-4 shrink-0 justify-center">
            {lang === "zh" ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} aria-hidden />
            ) : null}
          </span>
          <span className="font-medium">{t("langOptionZh")}</span>
        </button>
      </div>
    </div>
  );
}
