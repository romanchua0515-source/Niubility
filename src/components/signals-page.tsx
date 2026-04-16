"use client";

import { HotThisWeekList } from "@/components/hot-this-week";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/context/LanguageContext";
import type { HotItem } from "@/data/hot-this-week";
import Link from "next/link";

type SignalsPageProps = {
  items: HotItem[];
};

export function SignalsPage({ items }: SignalsPageProps) {
  const { t } = useLanguage();

  return (
    <div className="relative flex min-h-screen flex-col bg-[#050506]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.08),transparent)]"
        aria-hidden
      />
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          {t("linkBackShort")}
        </Link>
        <header className="mt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/85">
            {t("signalsEyebrow")}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            {t("signalsPageTitle")}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">{t("signalsPageSubtitle")}</p>
        </header>
        <div className="mt-8">
          <HotThisWeekList items={items} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
