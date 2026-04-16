"use client";

import type { DirectoryListing } from "@/data/listings";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToolForm } from "@/components/admin/tool-form";

type ToolsManagerProps = {
  initialTools: DirectoryListing[];
};

export function ToolsManager({ initialTools }: ToolsManagerProps) {
  const router = useRouter();
  const [tools] = useState(initialTools);
  const [showForm, setShowForm] = useState(false);
  const fetchTools = () => router.refresh();

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

      <div className="rounded-xl border border-zinc-800/60 overflow-hidden">
        <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)_minmax(0,1fr)] border-b border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
          <div>Name</div>
          <div>Category</div>
          <div className="text-right">Featured</div>
        </div>
        {tools.length === 0 ? (
          <p className="px-4 py-4 text-sm text-zinc-500">
            No tools yet. Use “Add New Tool” to create your first entry.
          </p>
        ) : (
          <div className="divide-y divide-zinc-800/80 text-sm">
            {tools.map((tool) => (
              <div
                key={tool.slug}
                className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)_minmax(0,1fr)] items-center px-4 py-2.5 hover:bg-zinc-900/60"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-zinc-100">
                    {tool.name}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {tool.url}
                  </p>
                </div>
                <div className="truncate text-xs text-zinc-400">
                  {tool.category} · {tool.subcategory}
                </div>
                <div className="text-right text-xs">
                  {tool.isFeatured ? (
                    <span className="inline-flex items-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
                      Featured
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                      Standard
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6">
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/50 px-6 py-4">
              <h2 className="text-lg font-semibold text-zinc-100">Add New Tool</h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="overflow-y-auto p-6">
              <ToolForm
                onSuccess={() => {
                  setShowForm(false);
                  fetchTools(); // Make sure the table refreshes
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

