import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { QuickPick } from "@/data/quick-picks";

type QuickPickCardProps = {
  pick: QuickPick;
};

export function QuickPickCard({ pick }: QuickPickCardProps) {
  const Icon = pick.icon;

  return (
    <Link
      href={pick.href}
      className="group flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-3.5 py-3 transition-colors hover:border-emerald-500/25 hover:bg-zinc-900/70"
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/60 text-emerald-400/85 group-hover:border-emerald-500/25">
        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium leading-snug text-zinc-100">
          {pick.title}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-zinc-500 group-hover:text-zinc-400">
          {pick.subtitle}
        </span>
      </span>
      <ChevronRight
        className="mt-1 h-4 w-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-400"
        aria-hidden
      />
    </Link>
  );
}
