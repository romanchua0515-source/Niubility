import { ImportToolButton } from "@/components/admin/import-tool-button";
import { ToolsManager } from "@/components/admin/tools-manager";
import { getAdminTools } from "@/lib/api";
import { AlertTriangle } from "lucide-react";

export default async function AdminToolsPage() {
  const tools = await getAdminTools();
  const flaggedCount = tools.filter((t) => t.healthStatus === "flagged").length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Tools
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage the public directory of tools without touching Supabase tables
          directly.
        </p>
      </div>
      {flaggedCount > 0 && (
        <a
          href="#flagged-tools"
          className="flex items-center gap-2 rounded-lg border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm text-orange-300 transition-colors hover:bg-orange-500/15"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="font-medium">
            ⚠️ {flaggedCount} tool{flaggedCount === 1 ? "" : "s"} need review
          </span>
          <span className="text-xs text-orange-300/70">
            — jump to the flagged section
          </span>
        </a>
      )}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <ImportToolButton />
      </div>
      <ToolsManager initialTools={tools} />
    </div>
  );
}
