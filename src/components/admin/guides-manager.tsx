"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import type { Guide } from "@/lib/api";

const GUIDE_CATEGORIES = [
  "scam-prevention",
  "roadmap",
  "resource",
  "workflow",
] as const;

const schema = z.object({
  guideSlug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, dashes only"),
  category: z.enum(GUIDE_CATEGORIES),
  title: z.string().min(1, "Title is required"),
  titleZh: z.string().min(1, "中文标题必填"),
  content: z.string().min(1, "Content is required"),
  contentZh: z.string().min(1, "中文内容必填"),
  displayOrder: z.number().int().min(0),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const categoryBadgeClass: Record<(typeof GUIDE_CATEGORIES)[number], string> = {
  "scam-prevention": "border-orange-400/50 bg-orange-400/10 text-orange-300",
  roadmap: "border-emerald-400/50 bg-emerald-400/10 text-emerald-300",
  resource: "border-sky-400/50 bg-sky-400/10 text-sky-300",
  workflow: "border-violet-400/50 bg-violet-400/10 text-violet-300",
};

function categoryBadge(cat: string): string {
  return (
    categoryBadgeClass[cat as (typeof GUIDE_CATEGORIES)[number]] ??
    "border-zinc-600 bg-zinc-800 text-zinc-300"
  );
}

type GuidesManagerProps = {
  initialGuides: Guide[];
};

export function GuidesManager({ initialGuides }: GuidesManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<Guide | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function handleToggleActive(guide: Guide) {
    const { error } = await supabase
      .from("guides")
      .update({ is_active: !guide.is_active })
      .eq("id", guide.id);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  async function handleDelete(guide: Guide) {
    if (!confirm(`Delete "${guide.title}"?`)) return;
    const { error } = await supabase
      .from("guides")
      .delete()
      .eq("id", guide.id);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center rounded-lg border border-emerald-500/70 bg-emerald-500/90 px-3 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
        >
          Add Guide Block
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/50">
        <div className="grid grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.6fr)_minmax(0,0.8fr)_minmax(0,1fr)] border-b border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
          <div>Title</div>
          <div>Slug</div>
          <div>Category</div>
          <div>Order</div>
          <div>Active</div>
          <div className="text-right">Actions</div>
        </div>
        {initialGuides.length === 0 ? (
          <p className="px-4 py-4 text-sm text-zinc-500">
            No guide blocks yet. Use &quot;Add Guide Block&quot; to create your
            first entry.
          </p>
        ) : (
          <div className="divide-y divide-zinc-800/80 text-sm">
            {initialGuides.map((guide) => (
              <div
                key={guide.id}
                className="grid grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.6fr)_minmax(0,0.8fr)_minmax(0,1fr)] items-center px-4 py-2.5 hover:bg-zinc-900/60"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-zinc-100">
                    {guide.title}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {guide.title_zh}
                  </p>
                </div>
                <div className="truncate text-xs text-zinc-400">
                  {guide.guide_slug}
                </div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${categoryBadge(guide.category)}`}
                  >
                    {guide.category}
                  </span>
                </div>
                <div className="text-xs text-zinc-400">
                  {guide.display_order}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(guide)}
                    className="inline-flex cursor-pointer items-center"
                    aria-label="Toggle active"
                  >
                    <span
                      className={`flex h-5 w-9 items-center rounded-full ${
                        guide.is_active ? "bg-emerald-500/80" : "bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`ml-0.5 block h-4 w-4 rounded-full bg-zinc-950 transition ${
                          guide.is_active ? "translate-x-4" : ""
                        }`}
                      />
                    </span>
                  </button>
                </div>
                <div className="flex items-center justify-end gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(guide);
                      setShowForm(true);
                    }}
                    className="rounded-md border border-zinc-700 bg-zinc-900 p-1.5 text-zinc-300 transition-colors hover:border-emerald-500/60 hover:text-emerald-300"
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(guide)}
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
        <GuideFormModal
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

type GuideFormModalProps = {
  initial: Guide | null;
  onClose: () => void;
  onSuccess: () => void;
};

function GuideFormModal({ initial, onClose, onSuccess }: GuideFormModalProps) {
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
          guideSlug: initial.guide_slug,
          category: (GUIDE_CATEGORIES as readonly string[]).includes(
            initial.category,
          )
            ? (initial.category as (typeof GUIDE_CATEGORIES)[number])
            : "scam-prevention",
          title: initial.title,
          titleZh: initial.title_zh,
          content: initial.content,
          contentZh: initial.content_zh,
          displayOrder: initial.display_order,
          isActive: initial.is_active,
        }
      : {
          guideSlug: "web3-jobs",
          category: "scam-prevention",
          title: "",
          titleZh: "",
          content: "",
          contentZh: "",
          displayOrder: 0,
          isActive: true,
        },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    const payload = {
      guide_slug: values.guideSlug,
      category: values.category,
      title: values.title,
      title_zh: values.titleZh,
      content: values.content,
      content_zh: values.contentZh,
      display_order: values.displayOrder,
      is_active: values.isActive,
    };
    const op = initial
      ? supabase.from("guides").update(payload).eq("id", initial.id)
      : supabase.from("guides").insert(payload);
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
            {initial ? "Edit Guide Block" : "New Guide Block"}
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

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Guide Slug
                </label>
                <input
                  type="text"
                  {...register("guideSlug")}
                  placeholder="web3-jobs"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
                />
                {errors.guideSlug && (
                  <p className="text-xs text-red-400">
                    {errors.guideSlug.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Category
                </label>
                <select
                  {...register("category")}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
                >
                  {GUIDE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Title (EN)
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
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
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
                />
                {errors.titleZh && (
                  <p className="text-xs text-red-400">
                    {errors.titleZh.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                Content (EN) — supports markdown
              </label>
              <textarea
                {...register("content")}
                rows={6}
                className="w-full resize-y rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
              />
              {errors.content && (
                <p className="text-xs text-red-400">{errors.content.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                内容 (ZH) — 支持 markdown
              </label>
              <textarea
                {...register("contentZh")}
                rows={6}
                className="w-full resize-y rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
              />
              {errors.contentZh && (
                <p className="text-xs text-red-400">
                  {errors.contentZh.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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
              <div className="flex items-end">
                <div className="flex w-full items-center justify-between gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-2.5">
                  <p className="text-xs font-medium text-zinc-200">Active</p>
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
              </div>
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
                  : "Create guide block"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
