"use client";

import { RoleCard } from "@/components/role-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/context/LanguageContext";
import { roles } from "@/lib/roles";
import Link from "next/link";

export function RolesIndexPage() {
  const { t } = useLanguage();

  return (
    <div className="relative flex min-h-screen flex-col bg-[#050506]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.08),transparent)]"
        aria-hidden
      />
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          {t("linkBackShort")}
        </Link>
        <header className="mt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-400/85">
            {t("rolesIndexEyebrow")}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            {t("rolesIndexTitle")}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">{t("rolesIndexSubtitle")}</p>
        </header>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => (
            <RoleCard key={role.slug} role={role} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
