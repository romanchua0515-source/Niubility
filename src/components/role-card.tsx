"use client";

import { useLanguage } from "@/context/LanguageContext";
import { roleText } from "@/i18n/localized";
import type { Role } from "@/data/roles";
import Link from "next/link";

type RoleCardProps = {
  role: Role;
  compact?: boolean;
};

export function RoleCard({ role, compact = false }: RoleCardProps) {
  const { lang } = useLanguage();
  const { title, description } = roleText(role, lang);
  const Icon = role.icon;

  if (compact) {
    return (
      <Link
        href={`/roles/${role.slug}`}
        className="group flex items-center gap-2.5 rounded-lg border border-zinc-800/80 bg-zinc-900/35 px-3 py-2.5 transition-colors hover:border-violet-500/30 hover:bg-zinc-900/65"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950/60 text-violet-300/90 group-hover:border-violet-500/25">
          <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold leading-tight text-zinc-100">
            {title}
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-zinc-500 group-hover:text-zinc-400">
            {description}
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/roles/${role.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/35 p-5 transition-all duration-300 hover:border-violet-500/25 hover:bg-zinc-900/60 hover:shadow-[0_16px_40px_-28px_rgba(139,92,246,0.45)]"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/60 text-violet-300/90 transition-colors group-hover:border-violet-500/30 group-hover:text-violet-200">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
      </span>
      <div>
        <h3 className="font-semibold tracking-tight text-zinc-100">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-400">
          {description}
        </p>
      </div>
    </Link>
  );
}
