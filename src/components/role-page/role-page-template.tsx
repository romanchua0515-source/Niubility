"use client";

import { CategoryCard } from "@/components/category-card";
import {
  HubResourceModule,
  LearnNavCard,
  ReadingNavCard,
  ScenarioModule,
  ToolNavCard,
  hubModuleBox,
} from "@/components/role-page/hub-nav-cards";
import { SectionHeading } from "@/components/section-heading";
import { useLanguage } from "@/context/LanguageContext";
import {
  rolePageLede,
  roleQuickLinkText,
  roleText,
  roleToolGroupTitle,
} from "@/i18n/localized";
import type { Category } from "@/data/categories";
import { roles } from "@/data/roles";
import type { RolePageDetail } from "@/types/role-page";
import Link from "next/link";

type RolePageTemplateProps = {
  roleSlug: string;
  detail: RolePageDetail;
  relatedCategories: Category[];
};

export function RolePageTemplate({
  roleSlug,
  detail,
  relatedCategories,
}: RolePageTemplateProps) {
  const { t, lang } = useLanguage();
  const role = roles.find((r) => r.slug === roleSlug);
  if (!role) return null;
  const { title: roleTitle } = roleText(role, lang);
  const Icon = role.icon;
  const related = relatedCategories;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pt-10">
      <Link
        href="/#roles"
        className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
      >
        {t("linkBackRoles")}
      </Link>

      <header className="mt-6 border-b border-zinc-800/60 pb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/85">
          {t("roleEyebrow")}
        </p>
        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-violet-300">
            <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
              {roleTitle}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
              {rolePageLede(detail, lang)}
            </p>
          </div>
        </div>
      </header>

      <section className="mt-8" aria-labelledby="quick-start-heading">
        <h2 id="quick-start-heading" className="sr-only">
          {t("quickStartLabel")}
        </h2>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {t("quickStartLabel")}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {detail.quickStart.map((item) => {
            const { label, hint } = roleQuickLinkText(item, lang);
            return (
              <Link
                key={item.label}
                href={item.href}
                className="group rounded-lg border border-zinc-800/80 bg-zinc-950/40 px-3 py-2.5 transition-colors hover:border-emerald-500/25 hover:bg-zinc-900/60"
              >
                <span className="block text-xs font-medium text-zinc-100">
                  {label}
                </span>
                {hint ? (
                  <span className="mt-0.5 block text-[11px] text-zinc-500 group-hover:text-zinc-400">
                    {hint}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="tools-heading">
        <SectionHeading
          compact
          eyebrow={t("stackEyebrow")}
          title={t("recommendedToolsTitle")}
          description={t("recommendedToolsDesc")}
        />
        <div className="mt-5 flex flex-col gap-4">
          {detail.toolGroups.map((group) => (
            <ScenarioModule key={group.id} title={roleToolGroupTitle(group, lang)}>
              {group.tools.map((tool) => (
                <ToolNavCard
                  key={`${group.id}-${tool.name}`}
                  tool={tool}
                  lang={lang}
                  openLabel={t("openCta")}
                />
              ))}
            </ScenarioModule>
          ))}
        </div>
      </section>

      <section className="mt-6" aria-labelledby="reading-heading">
        <h2 id="reading-heading" className="sr-only">
          {t("readingSr")}
        </h2>
        <HubResourceModule
          eyebrow={t("sourcesEyebrow")}
          title={t("readingTitle")}
          description={t("readingDesc")}
        >
          {detail.reading.map((r) => (
            <ReadingNavCard
              key={r.title}
              item={r}
              lang={lang}
              openLabel={t("openCta")}
            />
          ))}
        </HubResourceModule>
      </section>

      <section className="mt-4" aria-labelledby="learn-heading">
        <h2 id="learn-heading" className="sr-only">
          {t("learnSr")}
        </h2>
        <HubResourceModule
          eyebrow={t("peopleEyebrow")}
          title={t("learnTitle")}
          description={t("learnDesc")}
        >
          {detail.learnFrom.map((p) => (
            <LearnNavCard
              key={p.name}
              person={p}
              lang={lang}
              openLabel={t("openCta")}
            />
          ))}
        </HubResourceModule>
      </section>

      <section className="mt-4" aria-labelledby="related-heading">
        <h2 id="related-heading" className="sr-only">
          {t("relatedSr")}
        </h2>
        <div className={hubModuleBox}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/85">
            {t("indexEyebrow")}
          </p>
          <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-zinc-100">
            {t("relatedCategoriesTitle")}
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-zinc-500">
            {t("relatedCategoriesDesc")}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {related.map((category) => (
              <CategoryCard key={category.slug} category={category} compact />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
