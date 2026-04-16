import { EngageStrip } from "@/components/engage-strip";
import { HomeDashboardSections } from "@/components/home-dashboard-sections";
import { HomeHeroIntro } from "@/components/home-hero-intro";
import { HeroWeekPanel } from "@/components/hero-week-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { hotThisWeek } from "@/data/hot-this-week";
import { getFeaturedTools, getLeafCategories, getTools } from "@/lib/api";

export default async function Home() {
  const [featuredTools, listings, leafCategories] = await Promise.all([
    getFeaturedTools(),
    getTools(),
    getLeafCategories(),
  ]);

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

      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 pb-0 sm:px-6">
        <section
          id="start"
          className="scroll-mt-32 grid gap-6 pt-6 lg:grid-cols-12 lg:gap-8 lg:pt-8"
        >
          <HomeHeroIntro
            listings={listings}
            leafCategories={leafCategories}
          />
          <div className="lg:col-span-5 lg:pt-1">
            <HeroWeekPanel trends={hotThisWeek} />
          </div>
        </section>

        <HomeDashboardSections featuredTools={featuredTools} />

        <EngageStrip />

        <div className="pb-10 pt-8">
          <SiteFooter />
        </div>
      </main>
    </div>
  );
}
