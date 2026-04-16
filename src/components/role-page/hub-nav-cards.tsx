import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Lang } from "@/i18n/dictionary";
import {
  roleLearnFromText,
  roleReadingItemText,
  roleScenarioToolText,
} from "@/i18n/localized";
import type { RoleLearnFrom, RoleReadingItem, RoleScenarioTool } from "@/types/role-page";

const cardBase =
  "group flex h-full flex-col rounded-lg border border-zinc-800/80 bg-zinc-950/45 p-3.5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] transition-colors hover:border-emerald-500/35 hover:bg-zinc-900/70";

export function ToolNavCard({
  tool,
  lang,
  openLabel,
}: {
  tool: RoleScenarioTool;
  lang: Lang;
  openLabel: string;
}) {
  const { purpose, tag } = roleScenarioToolText(tool, lang);
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cardBase}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 text-sm font-semibold leading-tight text-zinc-100">
          {tool.name}
        </span>
        {tag ? (
          <span className="shrink-0 rounded border border-zinc-800 bg-zinc-900/80 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500 group-hover:border-zinc-700 group-hover:text-zinc-400">
            {tag}
          </span>
        ) : null}
      </div>
      <p className="mt-2 line-clamp-2 flex-1 text-[11px] leading-relaxed text-zinc-500 group-hover:text-zinc-400">
        {purpose}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400/90 group-hover:text-emerald-300">
        {openLabel}
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      </span>
    </a>
  );
}

export function ReadingNavCard({
  item,
  lang,
  openLabel,
}: {
  item: RoleReadingItem;
  lang: Lang;
  openLabel: string;
}) {
  const { title, note, kind } = roleReadingItemText(item, lang);
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cardBase}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 text-sm font-semibold leading-tight text-zinc-100">
          {title}
        </span>
        <span className="shrink-0 rounded border border-zinc-800 bg-zinc-900/80 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 group-hover:border-zinc-700">
          {kind}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 flex-1 text-[11px] leading-relaxed text-zinc-500 group-hover:text-zinc-400">
        {note}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400/90 group-hover:text-emerald-300">
        {openLabel}
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      </span>
    </a>
  );
}

export function LearnNavCard({
  person,
  lang,
  openLabel,
}: {
  person: RoleLearnFrom;
  lang: Lang;
  openLabel: string;
}) {
  const { note, kind } = roleLearnFromText(person, lang);
  return (
    <a
      href={person.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cardBase}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 text-sm font-semibold leading-tight text-zinc-100">
          {person.name}
        </span>
        {kind ? (
          <span className="shrink-0 rounded border border-zinc-800 bg-zinc-900/80 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 group-hover:border-zinc-700">
            {kind}
          </span>
        ) : null}
      </div>
      <p className="mt-2 line-clamp-3 flex-1 text-[11px] leading-relaxed text-zinc-500 group-hover:text-zinc-400">
        {note}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400/90 group-hover:text-emerald-300">
        {openLabel}
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      </span>
    </a>
  );
}

export const hubModuleBox =
  "rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] sm:p-5";

type ScenarioModuleProps = {
  title: string;
  children: ReactNode;
};

/** One boxed work-scenario group for the tools area */
export function ScenarioModule({ title, children }: ScenarioModuleProps) {
  return (
    <div className={hubModuleBox}>
      <h3 className="text-sm font-semibold tracking-tight text-zinc-200">{title}</h3>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {children}
      </div>
    </div>
  );
}

/** Outer wrapper for reading / people sections — same visual weight as scenario modules */
export function HubResourceModule({
  title,
  eyebrow,
  description,
  children,
}: {
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className={hubModuleBox}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/85">
        {eyebrow}
      </p>
      <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-zinc-100">
        {title}
      </h2>
      <p className="mt-1 max-w-2xl text-xs leading-relaxed text-zinc-500">{description}</p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}
