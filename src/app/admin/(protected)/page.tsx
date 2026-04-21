import { supabase } from "@/lib/supabase";
import { InsightsPanel } from "@/components/admin/insights-panel";

type ToolRow = {
  id: string;
  name: string;
  category_slug: string;
  subcategory_slug: string;
  created_at: string;
  is_featured: boolean;
};

type CategoryRow = { id: string };

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const divisions: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let duration = diffSec;
  for (const [amount, unit] of divisions) {
    if (Math.abs(duration) < amount) {
      return rtf.format(-duration, unit);
    }
    duration = Math.round(duration / amount);
  }
  return "";
}

export default async function AdminDashboardPage() {
  const [{ data: tools, error: toolsError }, { data: cats, error: catsError }] =
    await Promise.all([
      supabase
        .from("tools")
        .select("id,name,category_slug,subcategory_slug,created_at,is_featured"),
      supabase.from("categories").select("id"),
    ]);

  if (toolsError || catsError) {
    // In admin we surface a simple error state instead of crashing the whole app.
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Admin Dashboard
        </h1>
        <p className="text-sm text-red-400">
          Failed to load metrics from Supabase. Please check your connection and
          try again.
        </p>
      </div>
    );
  }

  const toolRows = (tools ?? []) as ToolRow[];
  const categoryRows = (cats ?? []) as CategoryRow[];

  const totalTools = toolRows.length;
  const featuredTools = toolRows.filter((t) => t.is_featured).length;
  const totalCategories = categoryRows.length;

  const byCategory = new Map<
    string,
    { count: number; label: string }
  >();
  for (const t of toolRows) {
    const key = t.category_slug || "uncategorized";
    const entry = byCategory.get(key) ?? { count: 0, label: key };
    entry.count += 1;
    byCategory.set(key, entry);
  }
  const totalForPct = Array.from(byCategory.values()).reduce(
    (sum, x) => sum + x.count,
    0,
  );
  const categoryDist = Array.from(byCategory.entries()).sort(
    (a, b) => b[1].count - a[1].count,
  );

  const recent = [...toolRows]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Dashboard
        </h1>
        <p className="text-sm text-zinc-400">
          High-level overview of what&apos;s live in the Niubility directory.
          No user tracking, just content metrics.
        </p>
      </div>

      {/* KPI scorecards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800/80 bg-gradient-to-br from-emerald-500/10 via-zinc-950 to-zinc-900/80 p-4 shadow-[0_0_0_1px_rgba(16,185,129,0.15)_inset]">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-300/90">
            Total Tools · 收录网址总数
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">
            {totalTools}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800/80 bg-gradient-to-br from-violet-500/10 via-zinc-950 to-zinc-900/80 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-300/90">
            Featured Tools · 轮播推荐数
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">
            {featuredTools}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800/80 bg-gradient-to-br from-sky-500/10 via-zinc-950 to-zinc-900/80 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-sky-300/90">
            Categories · 分类总数
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">
            {totalCategories}
          </p>
        </div>
      </div>

      {/* Category distribution */}
      <section className="space-y-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/90">
              Category Distribution
            </p>
            <p className="text-xs text-zinc-400">
              收录分布图 · Where your tools are concentrated.
            </p>
          </div>
        </div>
        {categoryDist.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">
            No tools yet. Add a few entries to see the distribution chart.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {categoryDist.map(([slug, info]) => {
              const pct =
                totalForPct === 0
                  ? 0
                  : Math.round((info.count / totalForPct) * 100);
              return (
                <div
                  key={slug}
                  className="space-y-1 rounded-lg bg-zinc-950/50 p-2"
                >
                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <span className="font-medium">
                      {slug} · {info.count}
                    </span>
                    <span className="text-zinc-500">{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800/80">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-violet-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* PostHog insights */}
      <InsightsPanel />

      {/* Recent tools */}
      <section className="space-y-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/90">
              Recently Added Tools
            </p>
            <p className="text-xs text-zinc-400">
              最新收录 · Last 5 tools added to the directory.
            </p>
          </div>
        </div>
        {recent.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">
            No tools have been added yet.
          </p>
        ) : (
          <div className="mt-3 divide-y divide-zinc-800/80 text-sm">
            {recent.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-zinc-100">
                    {tool.name}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {tool.category_slug} · {tool.subcategory_slug}
                  </p>
                </div>
                <p className="whitespace-nowrap text-xs text-zinc-500">
                  {formatRelativeTime(tool.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


