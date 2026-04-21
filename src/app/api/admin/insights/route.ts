import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, ADMIN_COOKIE_VALUE } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
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
    },
  );
  if (!res.ok) {
    throw new Error(
      `PostHog query failed: ${res.status} ${await res.text()}`,
    );
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
      { status: 500 },
    );
  }

  try {
    const sevenDaysAgo = `now() - INTERVAL 7 DAY`;

    const [topTools, topSearches, topCategories, totalPageviews] =
      await Promise.all([
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
      { status: 500 },
    );
  }
}
