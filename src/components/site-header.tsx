"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { PortalNav } from "@/components/portal-nav";
import { UserLibraryDrawer } from "@/components/user-library-drawer";
import { useLanguage } from "@/context/LanguageContext";
import { Bookmark, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const { t } = useLanguage();
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between sm:h-16">
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400/20 to-violet-500/20 ring-1 ring-white/10 sm:h-9 sm:w-9">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)] sm:h-2.5 sm:w-2.5" />
              </span>
              <span className="text-sm font-semibold tracking-tight text-zinc-100">
                Niubility
              </span>
            </Link>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="hidden text-xs text-zinc-500 md:inline">
                {t("headerTagline")}
              </span>
              <button
                type="button"
                onClick={() => setLibraryOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800/85 bg-zinc-950/70 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-900/80 hover:text-emerald-300/90"
                aria-label={t("libraryTitle")}
                title={t("libraryTitle")}
              >
                <Bookmark className="h-4 w-4" strokeWidth={2} />
              </button>
              <LanguageSwitcher />
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800/85 bg-zinc-950/70 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-900/80 hover:text-emerald-300/90 md:hidden"
                aria-expanded={mobileNavOpen}
                aria-controls="site-mobile-nav"
                aria-label={mobileNavOpen ? t("navCloseMenu") : t("navOpenMenu")}
                onClick={() => setMobileNavOpen((o) => !o)}
              >
                {mobileNavOpen ? (
                  <X className="h-4 w-4" strokeWidth={2} />
                ) : (
                  <Menu className="h-4 w-4" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
          <div className="hidden border-t border-zinc-800/40 md:block">
            <PortalNav />
          </div>
        </div>
      </header>
      {mobileNavOpen ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm md:hidden"
          id="site-mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label={t("navMenuLabel")}
        >
          <div className="flex h-14 shrink-0 items-center justify-end border-b border-zinc-800/60 bg-zinc-950/95 px-4 sm:px-6">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800/85 bg-zinc-950/70 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-900/80 hover:text-emerald-300/90"
              aria-label={t("navCloseMenu")}
              onClick={() => setMobileNavOpen(false)}
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto bg-zinc-950/90 px-4 pb-8 pt-2 sm:px-6">
            <PortalNav
              orientation="vertical"
              onLinkClick={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      ) : null}
      <UserLibraryDrawer
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
      />
    </>
  );
}
