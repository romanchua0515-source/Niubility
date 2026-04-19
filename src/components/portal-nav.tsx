"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

const navKeys = [
  { href: "/", key: "navStart" as const },
  { href: "/roles", key: "navRoles" as const },
  { href: "/categories/ai", key: "navTools" as const },
  { href: "/categories", key: "navCategories" as const },
  { href: "/signals", key: "navSignals" as const },
  { href: "/submit", key: "navSubmit" as const },
];

type PortalNavProps = {
  /** Horizontal strip (default) or stacked links for mobile sheet */
  orientation?: "horizontal" | "vertical";
  /** Close mobile menu after navigation */
  onLinkClick?: () => void;
  className?: string;
};

export function PortalNav({
  orientation = "horizontal",
  onLinkClick,
  className = "",
}: PortalNavProps) {
  const { t } = useLanguage();
  const isVertical = orientation === "vertical";

  return (
    <nav
      className={
        isVertical
          ? `flex flex-col gap-0.5 px-2 py-2 ${className}`
          : `scrollbar-none -mx-4 flex gap-0.5 overflow-x-auto px-4 py-2 sm:mx-0 sm:gap-1 sm:px-0 ${className}`
      }
      aria-label="Page sections"
    >
      {navKeys.map(({ href, key }) => (
        <Link
          key={`${href}-${key}`}
          href={href}
          onClick={() => onLinkClick?.()}
          className={
            isVertical
              ? "rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100"
              : "shrink-0 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-zinc-500 transition-colors hover:bg-zinc-800/50 hover:text-zinc-200 sm:text-xs"
          }
        >
          {t(key)}
        </Link>
      ))}
    </nav>
  );
}
