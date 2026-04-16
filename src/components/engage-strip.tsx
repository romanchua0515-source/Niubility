"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, Megaphone, Send, Users } from "lucide-react";
import Link from "next/link";

const primary = [
  { href: "/submit", key: "engageSubmitTool" as const, icon: Send },
  { href: "/advertise", key: "engageAdvertise" as const, icon: Megaphone },
  { href: "/partner", key: "engagePartner" as const, icon: Users },
] as const;

export function EngageStrip() {
  const { t } = useLanguage();

  return (
    <div className="mt-10 w-full">
      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/45 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_1px_0_0_rgba(255,255,255,0.04)_inset] sm:p-7 md:px-8 md:py-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="max-w-md shrink-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/85">
              {t("engageEyebrow")}
            </p>
            <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-zinc-100">
              {t("engageTitle")}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-zinc-500">
              {t("engageDesc")}
            </p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:items-end">
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
              {primary.map(({ href, key, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-emerald-500/35 hover:bg-zinc-900/80 hover:text-white"
                >
                  <Icon
                    className="h-4 w-4 text-zinc-500"
                    strokeWidth={2}
                    aria-hidden
                  />
                  {t(key)}
                  <ArrowRight
                    className="h-3.5 w-3.5 text-zinc-600"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
            <Link
              href="/contact"
              className="self-stretch rounded-lg border border-dashed border-zinc-700 py-2 text-center text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200 sm:self-end sm:px-8"
            >
              {t("engageContactLink")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
