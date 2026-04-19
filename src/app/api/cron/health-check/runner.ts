import { createServiceClient } from "@/lib/supabase-service";

export type HealthCheckSummary = {
  checked: number;
  healthy: number;
  flagged: number;
  newly_flagged: string[];
  errors: { slug: string; message: string }[];
};

type ToolPing = {
  id: string;
  slug: string;
  name: string;
  website_url: string;
  health_fail_count: number;
};

const PING_TIMEOUT_MS = 10_000;
const BATCH_SIZE = 10;
const FAIL_THRESHOLD = 3;

async function pingUrl(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    return res.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function runHealthCheck(
  options: { limit?: number } = {},
): Promise<HealthCheckSummary> {
  const summary: HealthCheckSummary = {
    checked: 0,
    healthy: 0,
    flagged: 0,
    newly_flagged: [],
    errors: [],
  };

  const supabase = createServiceClient();
  if (!supabase) {
    summary.errors.push({
      slug: "__init__",
      message: "Supabase service client unavailable (missing env vars).",
    });
    return summary;
  }

  let query = supabase
    .from("tools")
    .select("id, slug, name, website_url, health_fail_count");
  if (typeof options.limit === "number") {
    query = query.limit(options.limit);
  }
  const { data, error } = await query;
  if (error) {
    summary.errors.push({ slug: "__fetch__", message: error.message });
    return summary;
  }

  const tools = (data ?? []) as ToolPing[];

  for (let i = 0; i < tools.length; i += BATCH_SIZE) {
    const batch = tools.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (tool) => {
        try {
          summary.checked += 1;

          if (!tool.website_url) {
            summary.errors.push({
              slug: tool.slug,
              message: "Missing website_url",
            });
            return;
          }

          const ok = await pingUrl(tool.website_url);
          const now = new Date().toISOString();

          if (ok) {
            const { error: updateError } = await supabase
              .from("tools")
              .update({
                health_status: "healthy",
                health_fail_count: 0,
                health_last_checked: now,
              })
              .eq("id", tool.id);
            if (updateError) {
              summary.errors.push({
                slug: tool.slug,
                message: updateError.message,
              });
              return;
            }
            summary.healthy += 1;
            return;
          }

          const nextFail = (tool.health_fail_count ?? 0) + 1;
          const becomesFlagged = nextFail >= FAIL_THRESHOLD;
          const wasFlagged = (tool.health_fail_count ?? 0) >= FAIL_THRESHOLD;

          const update: Record<string, unknown> = {
            health_fail_count: nextFail,
            health_last_checked: now,
            health_last_failure: now,
          };
          if (becomesFlagged) update.health_status = "flagged";

          const { error: updateError } = await supabase
            .from("tools")
            .update(update)
            .eq("id", tool.id);
          if (updateError) {
            summary.errors.push({
              slug: tool.slug,
              message: updateError.message,
            });
            return;
          }

          if (becomesFlagged) {
            summary.flagged += 1;
            if (!wasFlagged) summary.newly_flagged.push(tool.slug);
          }
        } catch (err) {
          summary.errors.push({
            slug: tool.slug,
            message: err instanceof Error ? err.message : String(err),
          });
        }
      }),
    );
  }

  return summary;
}
