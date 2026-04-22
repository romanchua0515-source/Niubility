"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Loader2, Play, Upload, X } from "lucide-react";

/**
 * Build headers for every /api/import-tool call. We send the bearer token
 * alongside cookies so the request authenticates even when Vercel's edge →
 * function routing drops the admin_auth cookie mid-batch.
 */
function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

type GeneratedTool = {
  name: string;
  name_zh: string;
  description: string;
  description_zh: string;
  best_for: string;
  best_for_zh: string;
  pricing: string;
  tags: string[];
  category_slug: string;
  subcategory_slug: string;
  website_url: string;
};

const PRICING_OPTIONS = ["Free", "Freemium", "Paid", "Enterprise"] as const;
const CATEGORY_OPTIONS = [
  "ai",
  "research-insights",
  "security",
  "wallets-browsers",
  "jobs",
  "media-community",
] as const;

type FormState = {
  name: string;
  name_zh: string;
  description: string;
  description_zh: string;
  best_for: string;
  best_for_zh: string;
  pricing: string;
  tags: string;
  category_slug: string;
  subcategory_slug: string;
  website_url: string;
  affiliate_url: string;
};

function toFormState(tool: GeneratedTool): FormState {
  return {
    name: tool.name ?? "",
    name_zh: tool.name_zh ?? "",
    description: tool.description ?? "",
    description_zh: tool.description_zh ?? "",
    best_for: tool.best_for ?? "",
    best_for_zh: tool.best_for_zh ?? "",
    pricing: tool.pricing ?? "Free",
    tags: Array.isArray(tool.tags) ? tool.tags.join(", ") : "",
    category_slug: tool.category_slug ?? "ai",
    subcategory_slug: tool.subcategory_slug ?? "",
    website_url: tool.website_url ?? "",
    affiliate_url: "",
  };
}

/**
 * POST /api/import-tool with { action: "publish", ...toolData }.
 * The server inserts via the service-role client, bypassing RLS.
 * Returns { ok: true } on success, or throws with the server's error message.
 */
async function publishViaApi(
  tool: GeneratedTool & { affiliate_url?: string },
  token: string,
) {
  const res = await fetch("/api/import-tool", {
    method: "POST",
    credentials: "include",
    headers: authHeaders(token),
    body: JSON.stringify({ action: "publish", ...tool }),
  });
  const data = (await res.json().catch(() => null)) as
    | { ok?: boolean; error?: string; detail?: string; existing_name?: string }
    | null;
  if (res.status === 409) {
    const msg = data?.existing_name
      ? `Already exists: ${data.existing_name}`
      : "Already exists";
    const err = new Error(msg) as Error & { isDuplicate: true };
    err.isDuplicate = true;
    throw err;
  }
  if (!res.ok || !data?.ok) {
    throw new Error(
      data?.detail ?? data?.error ?? `Publish failed (${res.status})`,
    );
  }
}

type Tab = "single" | "batch";

export function ImportToolButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("single");
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Fetch the bearer token the first time the panel is opened. We rely on
  // AbortController for cancellation instead of a `cancelled` flag: the
  // previous flag-based version combined with `loadingToken` in the dep
  // array formed a feedback loop — setLoadingToken(true) retriggered the
  // effect, whose cleanup set cancelled=true, which made the fetch's
  // finally skip the setLoadingToken(false) reset and left the UI stuck on
  // "Preparing secure session…" forever. Deps intentionally do NOT include
  // any state this effect writes.
  useEffect(() => {
    if (!open || sessionToken) return;

    console.log("[import-tool-button] useEffect fired, fetching token");
    setTokenError(null);
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/admin/session-token", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });
        if (res.status === 401) {
          setTokenError("Session expired, please re-login");
          return;
        }
        if (!res.ok) {
          setTokenError(`Could not obtain session token (${res.status})`);
          return;
        }
        const data = (await res.json().catch(() => null)) as
          | { token?: string; error?: string }
          | null;
        if (typeof data?.token === "string" && data.token.length > 0) {
          console.log("[import-tool-button] token set, state updated");
          setSessionToken(data.token);
        } else {
          setTokenError(data?.error ?? "Invalid token response");
        }
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        setTokenError("Network error fetching session token");
      }
    })();

    return () => controller.abort();
  }, [open, sessionToken]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/70 bg-emerald-500/90 px-3 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
      >
        <Upload className="h-4 w-4" />
        Import from URL
      </button>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
            <Upload className="h-4 w-4 text-emerald-400" />
            Import Tool
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Single: review the AI draft before publishing. Batch: paste many
            tools, one per line, auto-publish.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          aria-label="Close import panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {tokenError && (
        <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {tokenError}
        </p>
      )}
      {!sessionToken && !tokenError && (
        <p className="rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-400">
          <Loader2 className="mr-1.5 inline h-3 w-3 animate-spin text-emerald-400" />
          Preparing secure session…
        </p>
      )}

      <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950/60 p-0.5 text-xs">
        <TabButton
          active={tab === "single"}
          onClick={() => setTab("single")}
          label="Single"
        />
        <TabButton
          active={tab === "batch"}
          onClick={() => setTab("batch")}
          label="Batch"
        />
      </div>

      {tab === "single" ? (
        <SinglePanel
          authToken={sessionToken}
          onPublished={() => router.refresh()}
          onBack={() => setOpen(false)}
        />
      ) : (
        <BatchPanel
          authToken={sessionToken}
          onDone={() => router.refresh()}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
        active
          ? "bg-emerald-500/90 text-emerald-950"
          : "text-zinc-400 hover:text-zinc-200"
      }`}
    >
      {label}
    </button>
  );
}

// =============================================================================
// Single tab (AI draft → edit → publish, with 409 duplicate warning)
// =============================================================================

type SinglePanelProps = {
  authToken: string | null;
  onPublished: () => void;
  onBack: () => void;
};

function SinglePanel({ authToken, onPublished, onBack }: SinglePanelProps) {
  const [toolName, setToolName] = useState("");
  const [url, setUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishedName, setPublishedName] = useState<string | null>(null);

  const canGenerate =
    toolName.trim().length > 0 &&
    url.trim().length > 0 &&
    !generating &&
    authToken !== null;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleGenerate() {
    setError(null);
    setDuplicate(null);
    setPublishedName(null);
    const trimmedName = toolName.trim();
    const trimmedUrl = url.trim();
    if (!trimmedName) {
      setError("Tool name is required.");
      return;
    }
    if (!/^https?:\/\//i.test(trimmedUrl)) {
      setError("Enter a valid http(s) URL first.");
      return;
    }
    if (!authToken) {
      setError("Session token not ready yet — please retry in a moment.");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/import-tool", {
        method: "POST",
        credentials: "include",
        headers: authHeaders(authToken),
        body: JSON.stringify({
          action: "generate",
          name: trimmedName,
          url: trimmedUrl,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | (GeneratedTool & {
            error?: string;
            detail?: string;
            existing_name?: string;
          })
        | null;
      if (res.status === 409) {
        // Duplicate: show amber warning, do NOT clear the form/inputs.
        setDuplicate(data?.existing_name ?? trimmedName);
        return;
      }
      if (!res.ok) {
        setError(
          data?.detail ?? data?.error ?? `Generation failed (${res.status})`,
        );
        return;
      }
      if (!data) {
        setError("Empty response from AI");
        return;
      }
      setForm(toFormState(data));
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function handlePublish() {
    if (!form) return;
    if (!authToken) {
      setError("Session token not ready yet — please retry in a moment.");
      return;
    }
    setError(null);
    setDuplicate(null);
    setPublishing(true);
    try {
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      await publishViaApi(
        {
          name: form.name,
          name_zh: form.name_zh,
          description: form.description,
          description_zh: form.description_zh,
          best_for: form.best_for,
          best_for_zh: form.best_for_zh,
          pricing: form.pricing,
          tags,
          category_slug: form.category_slug,
          subcategory_slug: form.subcategory_slug,
          website_url: form.website_url,
          affiliate_url: form.affiliate_url,
        },
        authToken,
      );
      setPublishedName(form.name);
      setForm(null);
      setUrl("");
      setToolName("");
      onPublished();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      if (e instanceof Error && (e as Error & { isDuplicate?: true }).isDuplicate) {
        setDuplicate(msg.replace(/^Already exists: /, ""));
      } else {
        setError(msg);
      }
    } finally {
      setPublishing(false);
    }
  }

  function handleClear() {
    setForm(null);
    setToolName("");
    setUrl("");
    setError(null);
    setDuplicate(null);
    setPublishedName(null);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-300">
            Tool Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            placeholder="e.g. Cursor, Uniswap, DeFiLlama"
            disabled={generating}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70 disabled:opacity-70"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-300">
            Official URL <span className="text-red-400">*</span>
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            disabled={generating}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70 disabled:opacity-70"
          />
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-emerald-500/70 bg-emerald-500/90 px-4 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Generate
            </>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          onBack();
          handleClear();
        }}
        className="text-xs text-zinc-400 transition-colors hover:text-zinc-200"
      >
        ← back to manual form
      </button>

      {duplicate && (
        <p className="rounded-md border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs text-amber-400">
          Already exists: {duplicate}
        </p>
      )}

      {error && (
        <p className="rounded-md border border-orange-500/40 bg-orange-500/10 px-3 py-2 text-xs text-orange-400">
          {error}
        </p>
      )}

      {publishedName && (
        <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
          ✓ Tool &quot;{publishedName}&quot; published successfully.
        </p>
      )}

      {form && (
        <GeneratedToolForm
          form={form}
          publishing={publishing}
          onChange={updateField}
          onPublish={handlePublish}
          onClear={handleClear}
        />
      )}
    </div>
  );
}

// =============================================================================
// Batch tab (sequential check + auto-publish, with live per-tool progress)
// =============================================================================

type BatchStatus = "pending" | "processing" | "published" | "skipped" | "failed";
type BatchRow = {
  id: string;
  name: string;
  url: string;
  status: BatchStatus;
  message?: string;
};

function parseBatchInput(raw: string): BatchRow[] {
  const lines = raw.split(/\r?\n/);
  const out: BatchRow[] = [];
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const parts = trimmed.split("|").map((p) => p.trim());
    const name = parts[0] ?? "";
    const url = parts[1] ?? "";
    out.push({
      id: `${index}-${name || "?"}`,
      name,
      url,
      status: "pending",
      message:
        !name || !url
          ? "Invalid line — expected `Name | URL`"
          : !/^https?:\/\//i.test(url)
            ? "Invalid URL"
            : undefined,
    });
  });
  return out;
}

async function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

type BatchPanelProps = { authToken: string | null; onDone: () => void };

function BatchPanel({ authToken, onDone }: BatchPanelProps) {
  const [input, setInput] = useState("");
  const [rows, setRows] = useState<BatchRow[] | null>(null);
  const [running, setRunning] = useState(false);
  const [cursor, setCursor] = useState<number>(-1);
  const [summary, setSummary] = useState<string | null>(null);

  const currentRow = cursor >= 0 && rows ? rows[cursor] : null;

  function updateRow(id: string, patch: Partial<BatchRow>) {
    setRows((prev) =>
      prev ? prev.map((r) => (r.id === id ? { ...r, ...patch } : r)) : prev,
    );
  }

  async function handleStart() {
    if (!authToken) {
      setSummary("Session token not ready — please retry in a moment.");
      return;
    }
    const parsed = parseBatchInput(input);
    if (parsed.length === 0) {
      setRows(null);
      setSummary("No valid lines found.");
      return;
    }
    setRows(parsed);
    setSummary(null);
    setRunning(true);

    let published = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < parsed.length; i++) {
      const row = parsed[i];
      setCursor(i);

      // Pre-validated lines: missing fields / bad URL.
      if (row.message) {
        updateRow(row.id, { status: "failed" });
        failed += 1;
        continue;
      }

      updateRow(row.id, { status: "processing", message: undefined });

      // Step 1: checkOnly — is this URL (or its slug) already in tools?
      // Sending `name` lets the server derive the slug and block both a url
      // collision and a slug collision before spending a Claude call.
      let isDup = false;
      let duplicateName: string | undefined;
      try {
        const checkRes = await fetch("/api/import-tool", {
          method: "POST",
          credentials: "include",
          headers: authHeaders(authToken),
          body: JSON.stringify({
            action: "checkOnly",
            url: row.url,
            name: row.name,
          }),
        });
        const checkData = (await checkRes.json().catch(() => null)) as
          | { existing_name?: string; error?: string; detail?: string }
          | null;
        if (checkRes.status === 409) {
          isDup = true;
          duplicateName = checkData?.existing_name;
        } else if (!checkRes.ok) {
          updateRow(row.id, {
            status: "failed",
            message:
              checkData?.detail ??
              checkData?.error ??
              `Check failed (${checkRes.status})`,
          });
          failed += 1;
          await wait(1500);
          continue;
        }
      } catch (e) {
        updateRow(row.id, {
          status: "failed",
          message: e instanceof Error ? e.message : "Check failed",
        });
        failed += 1;
        await wait(1500);
        continue;
      }

      if (isDup) {
        updateRow(row.id, {
          status: "skipped",
          message: duplicateName ? `Already exists: ${duplicateName}` : "Already exists",
        });
        skipped += 1;
        await wait(1500);
        continue;
      }

      // Step 2: generate + auto-publish (publish goes through the server
      // route so the insert runs with the service role and bypasses RLS).
      try {
        const genRes = await fetch("/api/import-tool", {
          method: "POST",
          credentials: "include",
          headers: authHeaders(authToken),
          body: JSON.stringify({
            action: "generate",
            name: row.name,
            url: row.url,
          }),
        });
        const genData = (await genRes.json().catch(() => null)) as
          | (GeneratedTool & { error?: string; detail?: string })
          | null;

        if (genRes.status === 409) {
          updateRow(row.id, {
            status: "skipped",
            message: "Already exists",
          });
          skipped += 1;
          await wait(1500);
          continue;
        }

        if (!genRes.ok || !genData || !genData.name) {
          updateRow(row.id, {
            status: "failed",
            message:
              genData?.detail ??
              genData?.error ??
              `Generation failed (${genRes.status})`,
          });
          failed += 1;
          await wait(1500);
          continue;
        }

        try {
          await publishViaApi({ ...genData, website_url: row.url }, authToken);
          updateRow(row.id, {
            status: "published",
            message: genData.name,
          });
          published += 1;
        } catch (publishErr) {
          const publishMsg =
            publishErr instanceof Error ? publishErr.message : "Publish failed";
          const isDup =
            publishErr instanceof Error &&
            (publishErr as Error & { isDuplicate?: true }).isDuplicate === true;
          if (isDup) {
            updateRow(row.id, { status: "skipped", message: publishMsg });
            skipped += 1;
          } else {
            updateRow(row.id, { status: "failed", message: publishMsg });
            failed += 1;
          }
        }
      } catch (e) {
        updateRow(row.id, {
          status: "failed",
          message: e instanceof Error ? e.message : "Unknown error",
        });
        failed += 1;
      }

      await wait(1500);
    }

    setCursor(-1);
    setRunning(false);
    setSummary(`Done: ${published} published, ${skipped} skipped, ${failed} failed`);
    onDone();
  }

  const progressText = currentRow
    ? `Processing ${cursor + 1}/${rows?.length ?? 0}: ${currentRow.name || currentRow.url}…`
    : null;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-300">
          Batch list — one tool per line, format <code className="text-emerald-300">Name | URL</code>
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={running}
          rows={8}
          placeholder={"Uniswap | https://uniswap.org\nMetaMask | https://metamask.io\nDeFiLlama | https://defillama.com"}
          className="w-full resize-y rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-100 outline-none transition focus:border-emerald-500/70 disabled:opacity-70"
        />
      </div>

      <button
        type="button"
        onClick={handleStart}
        disabled={running || input.trim().length === 0 || authToken === null}
        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-emerald-500/70 bg-emerald-500/90 px-4 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {running ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Running…
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Start Batch Import
          </>
        )}
      </button>

      {progressText && (
        <p className="rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-300">
          <Loader2 className="mr-1.5 inline h-3 w-3 animate-spin text-emerald-400" />
          {progressText}
        </p>
      )}

      {summary && (
        <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
          {summary}
        </p>
      )}

      {rows && rows.length > 0 && (
        <ul className="divide-y divide-zinc-800/60 overflow-hidden rounded-lg border border-zinc-800/60 bg-zinc-950/60 text-xs">
          {rows.map((row) => (
            <BatchRowItem key={row.id} row={row} />
          ))}
        </ul>
      )}
    </div>
  );
}

function BatchRowItem({ row }: { row: BatchRow }) {
  const statusClass =
    row.status === "published"
      ? "text-emerald-400"
      : row.status === "skipped"
        ? "text-amber-400"
        : row.status === "failed"
          ? "text-red-400"
          : row.status === "processing"
            ? "text-zinc-200"
            : "text-zinc-500";
  const statusLabel =
    row.status === "published"
      ? "Published"
      : row.status === "skipped"
        ? "Skipped"
        : row.status === "failed"
          ? "Failed"
          : row.status === "processing"
            ? "Processing…"
            : "Pending";
  return (
    <li className="flex items-center justify-between gap-3 px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-zinc-100">
          {row.name || "(unnamed)"}
        </p>
        <p className="truncate text-[11px] text-zinc-500">{row.url}</p>
        {row.message && (
          <p className={`truncate text-[11px] ${statusClass}`}>{row.message}</p>
        )}
      </div>
      <span className={`shrink-0 font-medium uppercase tracking-wide ${statusClass}`}>
        {statusLabel}
      </span>
    </li>
  );
}

// =============================================================================
// Shared AI-draft form used by Single tab
// =============================================================================

type GeneratedToolFormProps = {
  form: FormState;
  publishing: boolean;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onPublish: () => void;
  onClear: () => void;
};

function GeneratedToolForm({
  form,
  publishing,
  onChange,
  onPublish,
  onClear,
}: GeneratedToolFormProps) {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-800/60 bg-zinc-950/60 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400/80">
        AI draft — review before publishing
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name (EN)">
          <input
            type="text"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="名称 (ZH)">
          <input
            type="text"
            value={form.name_zh}
            onChange={(e) => onChange("name_zh", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Description (EN)">
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </Field>
        <Field label="描述 (ZH)">
          <textarea
            rows={3}
            value={form.description_zh}
            onChange={(e) => onChange("description_zh", e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Best For (EN)">
          <input
            type="text"
            value={form.best_for}
            onChange={(e) => onChange("best_for", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="最适合 (ZH)">
          <input
            type="text"
            value={form.best_for_zh}
            onChange={(e) => onChange("best_for_zh", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Pricing">
          <select
            value={form.pricing}
            onChange={(e) => onChange("pricing", e.target.value)}
            className={inputClass}
          >
            {PRICING_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Category">
          <select
            value={form.category_slug}
            onChange={(e) => onChange("category_slug", e.target.value)}
            className={inputClass}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Subcategory">
          <input
            type="text"
            value={form.subcategory_slug}
            onChange={(e) => onChange("subcategory_slug", e.target.value)}
            placeholder="ai-tools"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Tags (comma-separated)">
        <input
          type="text"
          value={form.tags}
          onChange={(e) => onChange("tags", e.target.value)}
          placeholder="onchain, analytics, dashboards"
          className={inputClass}
        />
      </Field>

      <Field label="Website URL (locked)">
        <input
          type="url"
          value={form.website_url}
          readOnly
          className={`${inputClass} cursor-not-allowed text-zinc-400`}
        />
      </Field>

      <Field label="Affiliate URL (optional)">
        <input
          type="url"
          value={form.affiliate_url}
          onChange={(e) => onChange("affiliate_url", e.target.value)}
          placeholder="https://partner.example.com/…"
          className={inputClass}
        />
      </Field>

      <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClear}
          disabled={publishing}
          className="inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800/80 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={publishing || !form.name || !form.description}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/70 bg-emerald-500/90 px-3 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {publishing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publishing…
            </>
          ) : (
            "Publish Tool"
          )}
        </button>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-zinc-300">{label}</label>
      {children}
    </div>
  );
}
