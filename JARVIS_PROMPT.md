# TASK — PostHog Analytics Integration + Admin Insights Dashboard

## Output Format (READ THIS FIRST)

When all phases are complete, output verification report in this 
exact format — nothing else after:

VERIFICATION REPORT
===================
PHASE 1: ✅/⚠️/❌ — PostHog client setup
PHASE 2: ✅/⚠️/❌ — Event tracking instrumented
PHASE 3: ✅/⚠️/❌ — Admin insights API route
PHASE 4: ✅/⚠️/❌ — Admin insights dashboard UI
PHASE 5: ✅/⚠️/❌ — Build verification
BUILD: ✅ zero errors / ❌ [error count]
FILES CHANGED: [comma separated list]
MANUAL STEPS REQUIRED: yes/no — [list env vars user must set in Vercel]
NEXT ACTION: [what user does next]

---

## Objective

Integrate PostHog Cloud (US region) for anonymous event tracking + 
build a read-only insights panel inside the existing admin dashboard.

Goals:
1. Track page views, tool clicks, search events, category clicks, 
   and tool detail modal opens — all anonymous (no user identify)
2. Add a "Insights (Last 7 Days)" section to /admin showing:
   - Top 10 clicked tools
   - Top 10 search queries
   - Top 5 categories clicked
   - Total page views (number)

GDPR posture: anonymous events only, no IP collection beyond what 
PostHog defaults handle, no identify() calls. We are not setting 
cookies via PostHog SDK in autocapture mode.

---

## Environment Variables (user must set in Vercel)

User must add these to Vercel env vars (Production + Preview + Development):

- NEXT_PUBLIC_POSTHOG_KEY = phc_xxxx (project API key, safe to expose)
- NEXT_PUBLIC_POSTHOG_HOST = https://us.i.posthog.com
- POSTHOG_PROJECT_ID = 390826 (numeric project id)
- POSTHOG_PERSONAL_API_KEY = phx_xxxx (personal API key with query:read scope, server-only)

Do NOT generate or hardcode these values. Read from process.env only.

---

## Phase 1 — PostHog Client Setup

1. Install posthog-js:
   npm install posthog-js

2. Create src/lib/posthog.ts (client-side singleton):

```ts
import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
  if (typeof window === "undefined") return;
  if (initialized) return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,
    persistence: "memory",
    disable_session_recording: true,
    loaded: () => {
      initialized = true;
    },
  });
}

export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!initialized) return;
  posthog.capture(name, props);
}

export { posthog };
```

3. Create src/components/posthog-provider.tsx (client wrapper):

```tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, posthog } from "@/lib/posthog";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!pathname) return;
    const url = window.location.origin + pathname + 
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return <>{children}</>;
}
```

4. Wrap root layout src/app/layout.tsx with PostHogProvider:
   - Import { Suspense } from react and { PostHogProvider } from new file
   - Wrap {children} inside <Suspense fallback={null}><PostHogProvider>{children}</PostHogProvider></Suspense>
   - Suspense is required because usePathname/useSearchParams need it

---

## Phase 2 — Event Tracking Instrumentation

Track these 5 events. Pick the right component for each.

### Event: tool_clicked
Fires when user clicks any tool card to visit its external URL.

Find the tool card component (likely src/components/directory-listing-card.tsx 
or similar). On the outbound <a> tag, add onMouseDown handler 
(use mousedown not click — fires before new tab opens, prevents loss):

```tsx
import { trackEvent } from "@/lib/posthog";

<a 
  href={tool.website_url}
  target="_blank"
  rel="noopener noreferrer"
  onMouseDown={() => trackEvent("tool_clicked", {
    tool_id: tool.id,
    tool_name: tool.name,
    category: tool.category_slug,
    subcategory: tool.subcategory_slug,
  })}
>
```

### Event: search_performed
Fires 800ms after user stops typing in search box.

Find search input component (likely src/components/search-bar.tsx or 
in src/app/search/...). Implement debounced tracking:

```tsx
import { useEffect } from "react";
import { trackEvent } from "@/lib/posthog";

useEffect(() => {
  if (!query.trim()) return;
  const timer = setTimeout(() => {
    trackEvent("search_performed", {
      query: query.trim().toLowerCase(),
      results_count: resultsCount,
    });
  }, 800);
  return () => clearTimeout(timer);
}, [query, resultsCount]);
```

### Event: category_clicked
Fires when user clicks any category card on home or categories page.

Find category card component, add onClick:

```tsx
onClick={() => trackEvent("category_clicked", {
  category_slug: category.slug,
  category_name: category.title,
})}
```

### Event: tool_detail_opened
Fires when user opens the tool detail modal (clicking on card to see 
detail without going to external URL).

Find the modal trigger or card click handler that opens the detail 
modal. Add tracking:

```tsx
trackEvent("tool_detail_opened", {
  tool_id: tool.id,
  tool_name: tool.name,
  category: tool.category_slug,
});
```

### Event: $pageview
Already handled automatically by PostHogProvider. No extra work.

IMPORTANT for all events:
- All event handlers are client-side — components must already be 
  "use client" or be made "use client"
- If a component cannot be made client (e.g., it's a Server Component 
  rendering many cards), wrap just the interactive part in a small 
  client component
- Do NOT track in Server Components — trackEvent is a no-op there 
  but the import path will fail to bundle

---

## Phase 3 — Admin Insights API Route

Create src/app/api/admin/insights/route.ts — server-side API that 
queries PostHog HogQL and returns top tools, top searches, top 
categories, total pageviews.

```ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, ADMIN_COOKIE_VALUE } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
const PERSONAL_KEY = process.env.POSTHOG_PERSONAL_API_KEY;

async function runHogQL(query: string) {
  const res = await fetch(
    `${POSTHOG_HOST}/api/projects/${PROJECT_ID}/query/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PERSONAL_KEY}`,
      },
      body: JSON.stringify({
        query: { kind: "HogQLQuery", query },
      }),
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(`PostHog query failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get(ADMIN_COOKIE)?.value;
  if (auth !== ADMIN_COOKIE_VALUE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!PROJECT_ID || !PERSONAL_KEY) {
    return NextResponse.json(
      { error: "PostHog server credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const sevenDaysAgo = `now() - INTERVAL 7 DAY`;

    const [topTools, topSearches, topCategories, totalPageviews] = await Promise.all([
      runHogQL(`
        SELECT properties.tool_name AS name, count() AS clicks
        FROM events
        WHERE event = 'tool_clicked' AND timestamp > ${sevenDaysAgo}
        GROUP BY properties.tool_name
        ORDER BY clicks DESC
        LIMIT 10
      `),
      runHogQL(`
        SELECT properties.query AS query, count() AS searches
        FROM events
        WHERE event = 'search_performed' AND timestamp > ${sevenDaysAgo}
        GROUP BY properties.query
        ORDER BY searches DESC
        LIMIT 10
      `),
      runHogQL(`
        SELECT properties.category_name AS name, count() AS clicks
        FROM events
        WHERE event = 'category_clicked' AND timestamp > ${sevenDaysAgo}
        GROUP BY properties.category_name
        ORDER BY clicks DESC
        LIMIT 5
      `),
      runHogQL(`
        SELECT count() AS total
        FROM events
        WHERE event = '$pageview' AND timestamp > ${sevenDaysAgo}
      `),
    ]);

    return NextResponse.json({
      topTools: topTools.results ?? [],
      topSearches: topSearches.results ?? [],
      topCategories: topCategories.results ?? [],
      totalPageviews: totalPageviews.results?.[0]?.[0] ?? 0,
      window: "Last 7 days",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
```

---

## Phase 4 — Admin Insights Dashboard UI

Add a new section to src/app/admin/(protected)/page.tsx (the dashboard 
page) — appears below existing CATEGORY DISTRIBUTION section.

Create new client component src/components/admin/insights-panel.tsx:

```tsx
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
        <p className="text-xs uppercase tracking-wide text-emerald-400 mb-2">
          INSIGHTS (LAST 7 DAYS)
        </p>
        <p className="text-zinc-400 text-sm">
          PostHog not configured or no data yet. {error ? `Error: ${error}` : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-400">
            INSIGHTS · {data.window}
          </p>
          <p className="text-zinc-400 text-sm mt-1">
            {data.totalPageviews.toLocaleString()} total page views
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Section title="TOP CLICKED TOOLS" rows={data.topTools} />
        <Section title="TOP SEARCHES" rows={data.topSearches} />
        <Section title="TOP CATEGORIES" rows={data.topCategories} />
      </div>
    </div>
  );
}

function Section({ title, rows }: { title: string; rows: Array<[string, number]> }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-zinc-500 mb-3">{title}</p>
      {rows.length === 0 ? (
        <p className="text-zinc-600 text-sm">No data yet</p>
      ) : (
        <ul className="space-y-2">
          {rows.map(([name, count], i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span className="text-zinc-300 truncate mr-2">{name}</span>
              <span className="text-emerald-400 font-mono">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

Then in src/app/admin/(protected)/page.tsx, import and place 
<InsightsPanel /> below the CATEGORY DISTRIBUTION section (before 
RECENTLY ADDED TOOLS).

---

## Phase 5 — Build Verification

1. Run npm run build
2. Confirm zero TypeScript errors
3. Confirm no PostHog SDK is bundled in Server Components 
   (posthog-js should only appear in client chunks)

---

## Technical Constraints (from CLAUDE.md)

- Server Components first, "use client" only where needed
- Tailwind: bg-zinc-950, bg-zinc-900/50, text-zinc-100, 
  text-zinc-400, emerald-400/500, border-zinc-800/60
- Modals: fixed inset-0 z-50 backdrop-blur-sm bg-black/80
- Icons: lucide-react only

---

## Important Notes for Claude Code

- DO NOT hardcode PostHog keys — read from process.env only
- DO NOT call posthog.identify() — we want pure anonymous tracking
- DO NOT enable session recording — disable_session_recording: true
- If you can't find a specific component (e.g., search bar location), 
  search the codebase first with grep before creating new files
- Tool card and search components must become "use client" if they 
  aren't already — but only the interactive leaf, not the entire page
- The HogQL query syntax for property access is properties.field_name 
  — if results come back as objects instead of [name, count] tuples, 
  adjust the InsightsPanel data shape accordingly
- For the admin insights API, use force-dynamic to ensure no caching
- DO NOT commit .env.local or any file containing API keys