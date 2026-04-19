"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import type { Signal } from "@/lib/api";

const SIGNAL_TYPES = ["TOPIC", "TOOL", "RESOURCE"] as const;

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  titleZh: z.string().min(1, "中文标题必填"),
  description: z.string().min(5, "Description is required"),
  descriptionZh: z.string().min(1, "中文说明必填"),
  type: z.enum(SIGNAL_TYPES),
  weekLabel: z
    .string()
    .regex(/^\d{4}-W\d{2}$/, "Format: 2026-W16"),
  displayOrder: z.number().int().min(0),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const typeBadgeClass: Record<(typeof SIGNAL_TYPES)[number], string> = {
  TOPIC: "border-emerald-400/50 bg-emerald-400/10 text-emerald-400",
  TOOL: "border-blue-400/50 bg-blue-400/10 text-blue-400",
  RESOURCE: "border-purple-400/50 bg-purple-400/10 text-purple-400",
};

type SignalsManagerProps = {
  initialSignals: Signal[];
};

export function SignalsManager({ initialSignals }: SignalsManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<Signal | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function handleToggleActive(signal: Signal) {
    const { error } = await supabase
      .from("signals")
      .update({ is_active: !signal.isActive })
      .eq("id", signal.id);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  async function handleDelete(signal: Signal) {
    if (!confirm(`Delete signal "${signal.title}"?`)) return;
    const { error } = await supabase
      .from("signals")
      .delete()
      .eq("id", signal.id);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Signals
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Weekly signals shown on the homepage and /signals page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center rounded-lg border border-emerald-500/70 bg-emerald-500/90 px-3 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
        >
          Add Signal
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/50">
        <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)] border-b border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
          <div>Title</div>
          <div>Type</div>
          <div>Week</div>
          <div>Active</div>
          <div className="text-right">Actions</div>
        </div>
        {initialSignals.length === 0 ? (
          <p className="px-4 py-4 text-sm text-zinc-500">
            No signals yet. Use &quot;Add Signal&quot; to create your first entry.
          </p>
        ) : (
          <div className="divide-y divide-zinc-800/80 text-sm">
            {initialSignals.map((signal) => (
              <div
                key={signal.id}
                className="grid grid-cols-[minmax(0,3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)] items-center px-4 py-2.5 hover:bg-zinc-900/60"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-zinc-100">
                    {signal.title}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {signal.titleZh}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${typeBadgeClass[signal.type]}`}
                  >
                    {signal.type}
                  </span>
                </div>
                <div className="text-xs text-zinc-400">{signal.weekLabel}</div>
                <div>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(signal)}
                    className="inline-flex cursor-pointer items-center"
                    aria-label="Toggle active"
                  >
                    <span
                      className={`flex h-5 w-9 items-center rounded-full ${
                        signal.isActive ? "bg-emerald-500/80" : "bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`ml-0.5 block h-4 w-4 rounded-full bg-zinc-950 transition ${
                          signal.isActive ? "translate-x-4" : ""
                        }`}
                      />
                    </span>
                  </button>
                </div>
                <div className="flex items-center justify-end gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(signal);
                      setShowForm(true);
                    }}
                    className="rounded-md border border-zinc-700 bg-zinc-900 p-1.5 text-zinc-300 transition-colors hover:border-emerald-500/60 hover:text-emerald-300"
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(signal)}
                    className="rounded-md border border-zinc-700 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:border-red-500/60 hover:text-red-200"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <SignalFormModal
          initial={editing}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

type SignalFormModalProps = {
  initial: Signal | null;
  onClose: () => void;
  onSuccess: () => void;
};

function SignalFormModal({ initial, onClose, onSuccess }: SignalFormModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          title: initial.title,
          titleZh: initial.titleZh,
          description: initial.description,
          descriptionZh: initial.descriptionZh,
          type: initial.type,
          weekLabel: initial.weekLabel,
          displayOrder: initial.displayOrder,
          isActive: initial.isActive,
        }
      : {
          title: "",
          titleZh: "",
          description: "",
          descriptionZh: "",
          type: "TOPIC",
          weekLabel: "",
          displayOrder: 0,
          isActive: true,
        },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    const payload = {
      title: values.title,
      title_zh: values.titleZh,
      description: values.description,
      description_zh: values.descriptionZh,
      type: values.type,
      week_label: values.weekLabel,
      display_order: values.displayOrder,
      is_active: values.isActive,
    };
    const op = initial
      ? supabase.from("signals").update(payload).eq("id", initial.id)
      : supabase.from("signals").insert(payload);
    const { error: dbError } = await op;
    if (dbError) {
      setError(dbError.message);
      setSubmitting(false);
      return;
    }
    onSuccess();
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6">
      <div className="relative flex min-h-0 max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-zinc-100">
            {initial ? "Edit Signal" : "New Signal"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
            <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                Title (EN)
              </label>
              <input
                type="text"
                {...register("title")}
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/0"
              />
              {errors.title && (
                <p className="text-xs text-red-400">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                标题 (ZH)
              </label>
              <input
                type="text"
                {...register("titleZh")}
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/0"
              />
              {errors.titleZh && (
                <p className="text-xs text-red-400">{errors.titleZh.message}</p>
              )}
            </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                Description (EN)
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/0"
              />
              {errors.description && (
                <p className="text-xs text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                描述 (ZH)
              </label>
              <textarea
                {...register("descriptionZh")}
                rows={3}
                className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/0"
              />
              {errors.descriptionZh && (
                <p className="text-xs text-red-400">
                  {errors.descriptionZh.message}
                </p>
              )}
            </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                Type
              </label>
              <select
                {...register("type")}
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
              >
                {SIGNAL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                Week Label
              </label>
              <input
                type="text"
                {...register("weekLabel")}
                placeholder="2026-W16"
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
              />
              {errors.weekLabel && (
                <p className="text-xs text-red-400">
                  {errors.weekLabel.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                Display Order
              </label>
              <input
                type="number"
                min={0}
                {...register("displayOrder", { valueAsNumber: true })}
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
              />
            </div>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-2.5">
            <div>
              <p className="text-xs font-medium text-zinc-200">Active</p>
              <p className="text-[11px] text-zinc-500">
                Inactive signals stay in the table but are hidden from the site.
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                {...register("isActive")}
                className="peer sr-only"
              />
              <span className="h-5 w-9 rounded-full bg-zinc-700 transition peer-checked:bg-emerald-500/80">
                <span className="relative left-0.5 top-0.5 block h-4 w-4 rounded-full bg-zinc-950 transition peer-checked:translate-x-4" />
              </span>
            </label>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-zinc-800/80 bg-zinc-900/50 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800/80 hover:text-zinc-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg border border-emerald-500/70 bg-emerald-500/90 px-3 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting
                ? "Saving…"
                : initial
                  ? "Save changes"
                  : "Create signal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
