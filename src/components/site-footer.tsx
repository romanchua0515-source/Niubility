"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

const linkKeys = [
  { href: "/submit", key: "footerSubmit" as const },
  { href: "/advertise", key: "footerAdvertise" as const },
  { href: "/partner", key: "footerPartner" as const },
  { href: "/contact", key: "footerContact" as const },
];

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-zinc-800/60 bg-zinc-950/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 md:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="max-w-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400/20 to-violet-500/20 ring-1 ring-white/10">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)]" />
              </span>
              <span className="text-sm font-semibold tracking-tight text-zinc-100">
                Niubility
              </span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-500">{t("footerBlurb")}</p>
          </div>
          <nav
            className="flex flex-col gap-3 md:items-end"
            aria-label="Footer"
          >
            {linkKeys.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-zinc-800/60 pt-6 text-xs text-zinc-600 sm:mt-10 sm:pt-7 md:mt-12 md:flex-row md:items-center md:justify-between md:pt-8">
          <span>
            © {new Date().getFullYear()} Niubility. {t("footerCopyright")}
          </span>
          <span>{t("footerNoWallet")}</span>
        </div>
      </div>
    </footer>
  );
}
