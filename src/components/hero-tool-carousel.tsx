"use client";

import { useUserState } from "@/context/UserStateContext";
import { useLanguage } from "@/context/LanguageContext";
import type { FeaturedTool } from "@/types/data";
import { featuredToolFaviconFallback, featuredToolLogoSrc } from "@/lib/featured-tool-assets";
import { getFeaturedBookmarkKey } from "@/lib/bookmarks";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const ROTATE_MS = 6500;

type HeroToolCarouselProps = {
  tools: FeaturedTool[];
};

/**
 * Homepage Index column (#categories): rotating spotlight for featured tools.
 */
export function HeroToolCarousel({ tools }: HeroToolCarouselProps) {
  const { t, lang } = useLanguage();
  const { addRecent } = useUserState();
  const n = tools.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [logoSrc, setLogoSrc] = useState<string>("");

  const safeIndex = n > 0 ? index % n : 0;
  const tool = tools[safeIndex];

  const go = useCallback(
    (delta: number) => {
      if (n <= 0) return;
      setIndex((i) => (i + delta + n) % n);
    },
    [n],
  );

  useEffect(() => {
    if (n <= 1 || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % n);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [n, paused]);

  useEffect(() => {
    if (!tool) return;
    setLogoSrc(featuredToolLogoSrc(tool));
  }, [tool?.id, tool?.href, tool?.coverImage]);

  if (!tool || n === 0) return null;

  const tagline =
    lang === "zh" && tool.taglineZh ? tool.taglineZh : tool.tagline;
  const category =
    lang === "zh" && tool.categoryZh ? tool.categoryZh : tool.category;

  const onOpen = () => {
    addRecent(getFeaturedBookmarkKey(tool));
  };

  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative flex min-h-[min(19rem,40vh)] flex-1 flex-col overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-950/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] sm:min-h-[17rem]">
        <div
          key={tool.id}
          className="relative h-[7.25rem] shrink-0 overflow-hidden border-b border-zinc-800/70 bg-[linear-gradient(165deg,rgba(39,39,42,0.5),rgba(9,9,11,0.95))]"
        >
          {logoSrc ? (
            <>
              <Image
                src={logoSrc}
                alt=""
                width={280}
                height={120}
                unoptimized
                className="pointer-events-none absolute inset-0 h-full w-full scale-[1.35] object-contain opacity-[0.12] blur-2xl"
                aria-hidden
              />
              <div className="relative flex h-full items-center justify-center px-6 py-5">
                <Image
                  src={logoSrc}
                  alt={tool.name}
                  width={120}
                  height={48}
                  unoptimized
                  className="relative z-[1] max-h-12 w-auto max-w-[80%] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
                  onError={() => {
                    const fb = featuredToolFaviconFallback(tool);
                    if (fb && fb !== logoSrc) setLogoSrc(fb);
                    else setLogoSrc("");
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-3xl font-semibold text-zinc-700">
                {tool.name.slice(0, 1)}
              </span>
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-3 pt-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-600">
            {category}
          </p>
          <p className="mt-1 text-sm font-semibold leading-tight text-zinc-100">
            {tool.name}
          </p>
          <p className="mt-1.5 min-h-0 flex-1 text-[11px] leading-relaxed text-zinc-500 line-clamp-4">
            {tagline}
          </p>
          <a
            href={tool.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onOpen}
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400/90 hover:text-emerald-300"
          >
            {t("openCta")}
            <ArrowUpRight className="h-3 w-3" aria-hidden />
          </a>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-zinc-800/60 px-3 pb-3 pt-3">
          <button
            type="button"
            onClick={() => go(-1)}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-100"
            aria-label={t("panelCarouselPrevAria")}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <div className="flex flex-1 justify-center gap-1.5">
            {tools.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={x.name}
                aria-current={i === safeIndex ? "true" : undefined}
                className={
                  i === safeIndex
                    ? "h-1.5 w-4 rounded-full bg-emerald-500/80"
                    : "h-1.5 w-1.5 rounded-full bg-zinc-700 hover:bg-zinc-600"
                }
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-100"
            aria-label={t("panelCarouselNextAria")}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
