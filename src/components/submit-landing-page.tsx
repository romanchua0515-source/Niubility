"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SubmitToolForm } from "@/components/submit-tool-form";
import { useLanguage } from "@/context/LanguageContext";
import { Rocket, Sparkles, Target } from "lucide-react";
import Link from "next/link";

export type SubmitLandingCaptcha = {
  a: number;
  b: number;
  token: string;
};

const criteria = [
  { icon: Sparkles, titleKey: "submitCriteria1Title" as const, descKey: "submitCriteria1Desc" as const },
  { icon: Target, titleKey: "submitCriteria2Title" as const, descKey: "submitCriteria2Desc" as const },
  { icon: Rocket, titleKey: "submitCriteria3Title" as const, descKey: "submitCriteria3Desc" as const },
];

export function SubmitLandingPage({
  captchaChallenge,
}: {
  captchaChallenge: SubmitLandingCaptcha;
}) {
  const { t } = useLanguage();

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[#050506]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_45%_at_50%_-15%,rgba(16,185,129,0.12),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_50%_35%_at_100%_20%,rgba(139,92,246,0.07),transparent)]"
        aria-hidden
      />

      <SiteHeader />

      <main className="relative flex-1">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8">
          <Link
            href="/"
            className="inline-flex text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            {t("linkBackLong")}
          </Link>

          <header className="mx-auto mt-10 max-w-3xl text-center sm:mt-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-400/90">
              {t("submitEyebrow")}
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl sm:leading-tight">
              {t("submitHeroTitle")}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              {t("submitHeroSubtitle")}
            </p>
          </header>

          <section
            aria-labelledby="submit-criteria-heading"
            className="mx-auto mt-14 max-w-5xl sm:mt-16"
          >
            <h2
              id="submit-criteria-heading"
              className="text-center text-sm font-semibold tracking-tight text-zinc-300"
            >
              {t("submitCriteriaHeading")}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
              {criteria.map(({ icon: Icon, titleKey, descKey }) => (
                <div
                  key={titleKey}
                  className="group relative rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] transition-colors duration-300 hover:border-emerald-500/25 hover:bg-zinc-900/70"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800/80 bg-zinc-950/70 text-emerald-400/90 ring-1 ring-white/[0.04] transition-colors group-hover:border-emerald-500/20 group-hover:text-emerald-300">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-semibold tracking-tight text-zinc-100">
                    {t(titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {t(descKey)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto mt-14 max-w-lg sm:mt-16">
            <SubmitToolForm captcha={captchaChallenge} />
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
