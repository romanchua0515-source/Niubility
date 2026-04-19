"use client";

import type { AdminToolView } from "@/lib/api";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ToolForm } from "@/components/admin/tool-form";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Minus,
  X,
} from "lucide-react";
import {
  confirmToolDown,
  markToolHealthy,
} from "@/app/admin/tools/actions";

type ToolsManagerProps = {
  initialTools: AdminToolView[];
};

function formatChecked(iso: string | null): string {
  if (!iso) return "Never checked";
  try {
    return `Checked ${new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;
  } catch {
    return "Never checked";
  }
}

function HealthCell({ tool }: { tool: AdminToolView }) {
  const checked = formatChecked(tool.healthLastChecked);
  if (tool.healthStatus === "healthy") {
    return (
      <div className="flex flex-col items-start gap-0.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Healthy
        </span>
        <span className="text-[10px] text-zinc-500">{checked}</span>
      </div>
    );
  }
  if (tool.healthStatus === "flagged") {
    return (
      <div className="flex flex-col items-start gap-0.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-400">
          <AlertTriangle className="h-3 w-3" />
          Flagged
        </span>
        <span className="text-[10px] text-zinc-500">{checked}</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
        <Minus className="h-3 w-3" />
        Unknown
      </span>
      <span className="text-[10px] text-zinc-600">{checked}</span>
    </div>
  );
}

function ReviewModal({
  tool,
  onClose,
  onResolved,
}: {
  tool: AdminToolView;
  onClose: () => void;
  onResolved: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handle = (action: "healthy" | "down") => {
    setError(null);
    startTransition(async () => {
      const res =
        action === "healthy"
          ? await markToolHealthy(tool.slug)
          : await confirmToolDown(tool.slug);
      if (!res.ok) {
        setError(res.message || "Action failed.");
        return;
      }
      onResolved();
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6">
      <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/50 px-6 py-4">
          <div className="flex items-center gap-2 text-orange-400">
            <AlertTriangle className="h-4 w-4" />
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Review flagged tool
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <p className="text-lg font-semibold text-zinc-100">{tool.name}</p>
            <p className="mt-1 text-xs text-zinc-500">
              Failed {tool.healthFailCount} consecutive check
              {tool.healthFailCount === 1 ? "" : "s"} ·{" "}
              {formatChecked(tool.healthLastChecked)}
            </p>
          </div>

          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800/60 bg-zinc-900/50 px-3 py-2 text-sm text-emerald-400 transition-colors hover:border-emerald-500/40 hover:bg-zinc-900"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="truncate">{tool.url}</span>
          </a>

          {error && (
            <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={pending}
              onClick={() => handle("down")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-orange-500/60 bg-orange-500/10 px-3 py-2 text-sm font-medium text-orange-300 transition-colors hover:bg-orange-500/20 disabled:opacity-50"
            >
              Confirm Down → Unpublish
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => handle("healthy")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mark as Healthy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ToolsManager({ initialTools }: ToolsManagerProps) {
  const router = useRouter();
  const [tools] = useState(initialTools);
  const [showForm, setShowForm] = useState(false);
  const [reviewSlug, setReviewSlug] = useState<string | null>(null);
  const fetchTools = () => router.refresh();

  const flaggedTools = useMemo(
    () => tools.filter((t) => t.healthStatus === "flagged"),
    [tools],
  );
  const otherTools = useMemo(
    () => tools.filter((t) => t.healthStatus !== "flagged"),
    [tools],
  );
  const reviewTool = reviewSlug
    ? tools.find((t) => t.slug === reviewSlug) ?? null
    : null;

  const renderRow = (tool: AdminToolView) => (
    <div
      key={tool.slug}
      className="grid grid-cols-[minmax(0,2.6fr)_minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(0,1.4fr)] items-center px-4 py-2.5 hover:bg-zinc-900/60"
    >
      <div className="min-w-0">
        <p className="truncate font-medium text-zinc-100">{tool.name}</p>
        <p className="truncate text-xs text-zinc-500">{tool.url}</p>
      </div>
      <div className="truncate text-xs text-zinc-400">
        {tool.category} · {tool.subcategory}
      </div>
      <div className="flex items-center gap-2">
        <HealthCell tool={tool} />
        {tool.healthStatus === "flagged" && (
          <button
            type="button"
            onClick={() => setReviewSlug(tool.slug)}
            className="ml-1 inline-flex items-center rounded-md border border-orange-500/60 bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-orange-300 transition-colors hover:bg-orange-500/20"
          >
            Review
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-end gap-1 text-xs">
        {tool.isFeatured && (
          <span className="inline-flex items-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
            Featured
          </span>
        )}
        {tool.isHot && (
          <span className="inline-flex items-center rounded-full border border-orange-500/60 bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-orange-300">
            Hot
          </span>
        )}
        {tool.isQuickPick && (
          <span className="inline-flex items-center rounded-full border border-cyan-500/60 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-300">
            Quick
          </span>
        )}
        {!tool.isFeatured && !tool.isHot && !tool.isQuickPick && (
          <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
            Standard
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Tools
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage the public directory of tools without touching Supabase tables.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center rounded-lg border border-emerald-500/70 bg-emerald-500/90 px-3 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
        >
          Add New Tool
        </button>
      </div>

      {flaggedTools.length > 0 && (
        <section
          id="flagged-tools"
          className="rounded-xl border border-orange-500/40 bg-orange-500/5 overflow-hidden"
        >
          <div className="flex items-center gap-2 border-b border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-orange-300">
            <AlertTriangle className="h-3.5 w-3.5" />
            Needs Review · {flaggedTools.length}
          </div>
          <div className="grid grid-cols-[minmax(0,2.6fr)_minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(0,1.4fr)] border-b border-orange-500/20 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
            <div>Name</div>
            <div>Category</div>
            <div>Health</div>
            <div className="text-right">Flags</div>
          </div>
          <div className="divide-y divide-orange-500/10 text-sm">
            {flaggedTools.map(renderRow)}
          </div>
        </section>
      )}

      <div className="rounded-xl border border-zinc-800/60 overflow-hidden">
        <div className="grid grid-cols-[minmax(0,2.6fr)_minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(0,1.4fr)] border-b border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
          <div>Name</div>
          <div>Category</div>
          <div>Health</div>
          <div className="text-right">Flags</div>
        </div>
        {otherTools.length === 0 ? (
          <p className="px-4 py-4 text-sm text-zinc-500">
            No tools yet. Use “Add New Tool” to create your first entry.
          </p>
        ) : (
          <div className="divide-y divide-zinc-800/80 text-sm">
            {otherTools.map(renderRow)}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6">
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/50 px-6 py-4">
              <h2 className="text-lg font-semibold text-zinc-100">Add New Tool</h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <ToolForm
                onSuccess={() => {
                  setShowForm(false);
                  fetchTools();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {reviewTool && (
        <ReviewModal
          tool={reviewTool}
          onClose={() => setReviewSlug(null)}
          onResolved={() => {
            setReviewSlug(null);
            fetchTools();
          }}
        />
      )}
    </div>
  );
}
