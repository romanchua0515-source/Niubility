import { EngageStrip } from "@/components/engage-strip";
import { HomeDashboardSections } from "@/components/home-dashboard-sections";
import { HomeHeroIntro } from "@/components/home-hero-intro";
import { HeroWeekPanel } from "@/components/hero-week-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getFeaturedTools,
  getLeafCategories,
  getSignals,
  getTools,
  getTopSearched,
  type Signal,
  type TopSearched,
} from "@/lib/api";
import { buildBilingualPageMetadata } from "@/lib/seo-metadata";
import type { HotItem, TopSearchTerm } from "@/types/data";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return buildBilingualPageMetadata({
    path: "/",
    enTitle: "Niubility — Web3 & AI Tools Hub",
    enDescription:
      "Curated Web3 and AI tools for builders, traders, researchers and operators. Find the right stack for your workflow.",
    zhTitle: "Niubility — Web3 与 AI 工具聚合平台",
    zhDescription:
      "为 Web3 从业者精选的 AI 与链上工具，覆盖交易、研究、运营、开发全场景。",
  });
}

function signalToHotItem(s: Signal): HotItem {
  const kind: HotItem["kind"] =
    s.type === "TOPIC" ? "Topic" : s.type === "TOOL" ? "Tool" : "Resource";
  return {
    id: s.id,
    title: s.title,
    titleZh: s.titleZh,
    context: s.description,
    contextZh: s.descriptionZh,
    kind,
  };
}

function topSearchedToTerm(t: TopSearched): TopSearchTerm {
  return { label: t.label, labelZh: t.labelZh, q: t.query };
}

export default async function Home() {
  const [featuredTools, listings, leafCategories, signals, topSearched] =
    await Promise.all([
      getFeaturedTools(),
      getTools(),
      getLeafCategories(),
      getSignals().catch(() => [] as Signal[]),
      getTopSearched().catch(() => [] as TopSearched[]),
    ]);

  const trends = signals.map(signalToHotItem);
  const topSearchedTerms = topSearched.map(topSearchedToTerm);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[#050506]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(16,185,129,0.09),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_45%_30%_at_100%_0%,rgba(139,92,246,0.05),transparent)]"
        aria-hidden
      />

      <SiteHeader />

      <main className="relative mx-auto w-full max-w-7xl flex-1 px-4 pb-0 sm:px-6 lg:px-8">
        <section
          id="start"
          className="flex min-h-[85vh] scroll-mt-24 items-center pt-6 sm:pt-7 md:scroll-mt-32 md:pt-8"
        >
          <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-5 lg:items-stretch lg:gap-10">
            <div className="min-w-0 lg:col-span-3 lg:flex lg:flex-col lg:justify-center">
              <HomeHeroIntro
                listings={listings}
                leafCategories={leafCategories}
              />
            </div>
            <div className="min-w-0 lg:col-span-2 lg:flex lg:min-h-0">
              <HeroWeekPanel
                className="w-full lg:h-full"
                trends={trends}
                topSearched={topSearchedTerms}
              />
            </div>
          </div>
        </section>

        <HomeDashboardSections featuredTools={featuredTools} />

        <EngageStrip />

        <div className="pb-10 pt-10 sm:pt-12">
          <SiteFooter />
        </div>
      </main>
    </div>
  );
}
