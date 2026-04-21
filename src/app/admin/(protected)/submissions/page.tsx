import { SubmissionsInbox } from "@/components/admin/submissions-inbox";
import { getSubmissions } from "@/lib/submissions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submissions — Niubility Admin",
  description: "Partnership and tool listing requests inbox.",
};

export default async function AdminSubmissionsPage() {
  const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  let loadError: string | null = null;
  let submissions = await (async () => {
    if (!hasServiceKey) return [];
    try {
      return await getSubmissions();
    } catch (e: unknown) {
      loadError = e instanceof Error ? e.message : "Failed to load submissions";
      return [];
    }
  })();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Submissions / 合作请求
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Tool listing and partnership messages from the public submit form.
        </p>
      </div>

      {!hasServiceKey ? (
        <p className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
          Set{" "}
          <code className="rounded bg-zinc-950 px-1 py-0.5 text-[11px] text-zinc-300">
            SUPABASE_SERVICE_ROLE_KEY
          </code>{" "}
          on the server. The public submit form and this inbox both use it
          (Server Actions only — key never ships to the browser; RLS is bypassed
          for these writes/reads).
        </p>
      ) : null}

      {loadError ? (
        <p className="rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {loadError}
        </p>
      ) : null}

      <SubmissionsInbox submissions={submissions} canMutate={hasServiceKey} />
    </div>
  );
}
