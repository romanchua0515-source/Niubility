"use client";

import { FeaturedToolCard } from "@/components/featured-tool-card";
import { HeroToolCarousel } from "@/components/hero-tool-carousel";
import { RoleCard } from "@/components/role-card";
import { SectionHeading } from "@/components/section-heading";
import { useLanguage } from "@/context/LanguageContext";
import type { FeaturedTool } from "@/types/data";
import { roles } from "@/lib/roles";
import Link from "next/link";

const panel =
  "rounded-xl border border-zinc-800/80 bg-zinc-900/35 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] sm:p-4";

type HomeDashboardSectionsProps = {
  featuredTools: FeaturedTool[];
};

export function HomeDashboardSections({ featuredTools }: HomeDashboardSectionsProps) {
  const { t } = useLanguage();

  return (
    <div className="mt-8 space-y-6 border-t border-zinc-800/60 pt-8 sm:mt-10 sm:space-y-8 sm:pt-10">
      <section
        id="roles"
        className={`scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-32 ${panel}`}
      >
        <SectionHeading
          compact
          eyebrow={t("homeRolesEyebrow")}
          title={t("homeRolesTitle")}
          description={t("homeRolesDesc")}
        />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <RoleCard key={role.slug} role={role} compact />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:items-stretch lg:gap-6">
        <section
          id="tools"
          className={`scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-32 flex h-full min-h-0 flex-col ${panel}`}
        >
          <SectionHeading
            compact
            eyebrow={t("homeToolsEyebrow")}
            title={t("homeToolsTitle")}
            description={t("homeToolsDesc")}
          />
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <FeaturedToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        <section
          id="categories"
          className={`scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-32 flex h-full min-h-0 flex-col ${panel}`}
        >
          <SectionHeading
            compact
            eyebrow={t("homeCategoriesEyebrow")}
            title={t("homeCategoriesTitle")}
            description={t("homeCategoriesDesc")}
            action={
              <Link
                href="/categories"
                className="inline-flex shrink-0 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950/50 px-2.5 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-100"
              >
                {t("homeFullIndex")}
              </Link>
            }
          />
          <HeroToolCarousel tools={featuredTools} />
        </section>
      </div>
    </div>
  );
}
