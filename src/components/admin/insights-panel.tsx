"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type InsightsData = {
  topTools: Array<[string, number]>;
  topSearches: Array<[string, number]>;
  topCategories: Array<[string, number]>;
  totalPageviews: number;
  window: string;
};

export function InsightsPanel() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/insights")
      .then((r) => {
        if (!r.ok) throw new Error(`Status ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-6">
        <div className="flex items-center gap-2 text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading insights from PostHog...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-6">
        <p className="mb-2 text-xs uppercase tracking-wide text-emerald-400">
          INSIGHTS (LAST 7 DAYS)
        </p>
        <p className="text-sm text-zinc-400">
          PostHog not configured or no data yet.{" "}
          {error ? `Error: ${error}` : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-400">
            INSIGHTS · {data.window}
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            {data.totalPageviews.toLocaleString()} total page views
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Section title="TOP CLICKED TOOLS" rows={data.topTools} />
        <Section title="TOP SEARCHES" rows={data.topSearches} />
        <Section title="TOP CATEGORIES" rows={data.topCategories} />
      </div>
    </div>
  );
}

function Section({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, number]>;
}) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-wide text-zinc-500">
        {title}
      </p>
      {rows.length === 0 ? (
        <p className="text-sm text-zinc-600">No data yet</p>
      ) : (
        <ul className="space-y-2">
          {rows.map(([name, count], i) => (
            <li
              key={i}
              className="flex items-center justify-between text-sm"
            >
              <span className="mr-2 truncate text-zinc-300">{name}</span>
              <span className="font-mono text-emerald-400">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
