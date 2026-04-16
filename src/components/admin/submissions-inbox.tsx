"use client";

import { updateSubmissionStatus } from "@/app/admin/submissions/actions";
import type { SubmissionRow } from "@/lib/submissions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type SubmissionsInboxProps = {
  submissions: SubmissionRow[];
  canMutate: boolean;
};

function preview(text: string, max = 72) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

export function SubmissionsInbox({
  submissions,
  canMutate,
}: SubmissionsInboxProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function patch(id: string, status: "pending" | "reviewed" | "approved") {
    startTransition(async () => {
      const r = await updateSubmissionStatus(id, status);
      if (r.ok) router.refresh();
      else if (r.message) {
        window.alert(r.message);
      }
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
              <th className="px-4 py-2.5">Name</th>
              <th className="px-4 py-2.5">Email</th>
              <th className="px-4 py-2.5">Description</th>
              <th className="px-4 py-2.5">Date</th>
              <th className="px-4 py-2.5">Status</th>
              {canMutate ? (
                <th className="px-4 py-2.5 text-right">Actions</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {submissions.length === 0 ? (
              <tr>
                <td
                  colSpan={canMutate ? 6 : 5}
                  className="px-4 py-8 text-center text-sm text-zinc-500"
                >
                  {canMutate
                    ? "No submissions in the inbox yet."
                    : "Inbox is not loaded — add SUPABASE_SERVICE_ROLE_KEY to the deployment environment."}
                </td>
              </tr>
            ) : (
              submissions.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-900/40">
                  <td className="px-4 py-3 font-medium text-zinc-100">
                    {row.first_name} {row.last_name}
                  </td>
                  <td className="max-w-[10rem] truncate px-4 py-3 text-xs text-zinc-400">
                    {row.email}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-xs text-zinc-500">
                    {preview(row.description)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-500">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        row.status === "approved"
                          ? "inline-flex rounded-full border border-emerald-500/50 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300"
                          : row.status === "reviewed"
                            ? "inline-flex rounded-full border border-zinc-600 bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-300"
                            : "inline-flex rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-200/90"
                      }
                    >
                      {row.status}
                    </span>
                  </td>
                  {canMutate ? (
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {row.status !== "reviewed" ? (
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => patch(row.id, "reviewed")}
                            className="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300 disabled:opacity-50"
                          >
                            Reviewed
                          </button>
                        ) : null}
                        {row.status !== "approved" ? (
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => patch(row.id, "approved")}
                            className="rounded-md border border-emerald-600/50 bg-emerald-500/15 px-2 py-1 text-[11px] font-medium text-emerald-200 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
                          >
                            Approve
                          </button>
                        ) : null}
                        {row.status !== "pending" ? (
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => patch(row.id, "pending")}
                            className="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:text-zinc-200 disabled:opacity-50"
                          >
                            Re-open
                          </button>
                        ) : null}
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
