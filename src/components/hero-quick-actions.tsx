"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Compass, LayoutGrid, Radio } from "lucide-react";
import Link from "next/link";

const actions = [
  { href: "/categories", key: "quickExploreTools" as const, icon: LayoutGrid },
  { href: "/roles", key: "quickBrowseRole" as const, icon: Compass },
  { href: "/signals", key: "quickTopResources" as const, icon: Radio },
] as const;

export function HeroQuickActions() {
  const { t } = useLanguage();

  return (
    <div className="mt-5 flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:gap-2">
      {actions.map(({ href, key, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-800/90 bg-zinc-950/60 px-3 py-2.5 text-center text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500/35 hover:bg-zinc-900/80 hover:text-zinc-100"
        >
          <Icon
            className="h-3.5 w-3.5 shrink-0 text-zinc-500 group-hover:text-emerald-400/90"
            strokeWidth={2}
            aria-hidden
          />
          {t(key)}
        </Link>
      ))}
    </div>
  );
}
