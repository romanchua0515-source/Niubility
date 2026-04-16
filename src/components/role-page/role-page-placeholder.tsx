"use client";

import { useLanguage } from "@/context/LanguageContext";
import { roleText } from "@/i18n/localized";
import { roles } from "@/data/roles";
import Link from "next/link";

type RolePagePlaceholderProps = {
  roleSlug: string;
};

export function RolePagePlaceholder({ roleSlug }: RolePagePlaceholderProps) {
  const { t, lang } = useLanguage();
  const role = roles.find((r) => r.slug === roleSlug);
  if (!role) return null;
  const { title, description } = roleText(role, lang);
  const Icon = role.icon;

  return (
    <main className="mx-auto max-w-2xl px-4 pb-12 pt-8 sm:px-6 sm:pt-10">
      <Link
        href="/#roles"
        className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
      >
        {t("linkBackRoles")}
      </Link>
      <div className="mt-8 flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-violet-300">
          <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/85">
            {t("roleEyebrow")}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">
            {title}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>
      </div>
      <div className="mt-10 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 px-4 py-8 text-center">
        <p className="text-sm text-zinc-400">{t("rolePlaceholderMsg")}</p>
        <Link
          href="/"
          className="mt-4 inline-flex text-sm font-medium text-emerald-400/90 hover:text-emerald-300"
        >
          {t("rolePlaceholderCta")}
        </Link>
      </div>
    </main>
  );
}
