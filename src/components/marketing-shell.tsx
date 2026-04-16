"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { UIKey } from "@/i18n/dictionary";
import Link from "next/link";

type MarketingShellProps = {
  titleKey: UIKey;
  bodyKey: UIKey;
};

export function MarketingShell({ titleKey, bodyKey }: MarketingShellProps) {
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
          {t(titleKey)}
        </h1>
        <div className="mt-6 text-sm leading-relaxed text-zinc-500">{t(bodyKey)}</div>
      </div>
    </div>
  );
}
