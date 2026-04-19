"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil, Trash2, X } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import type { JobCareer } from "@/lib/api";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  titleZh: z.string().min(1, "标题必填"),
  company: z.string().min(1, "Company is required"),
  companyZh: z.string().optional(),
  location: z.string().optional(),
  url: z.string().url("Enter a valid URL"),
  tagsRaw: z.string().optional(),
  displayOrder: z.number().int().min(0),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

type CareersManagerProps = {
  initialCareers: JobCareer[];
};

export function CareersManager({ initialCareers }: CareersManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<JobCareer | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function handleToggleActive(item: JobCareer) {
    const { error } = await supabase
      .from("job_careers")
      .update({ is_active: !item.isActive })
      .eq("id", item.id);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  async function handleDelete(item: JobCareer) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    const { error } = await supabase
      .from("job_careers")
      .delete()
      .eq("id", item.id);
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
            Careers
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Web3 careers resources and hiring links.
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
          Add Career
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/50">
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)] border-b border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
          <div>Title</div>
          <div>Company</div>
          <div>Location</div>
          <div>Active</div>
          <div className="text-right">Actions</div>
        </div>
        {initialCareers.length === 0 ? (
          <p className="px-4 py-4 text-sm text-zinc-500">
            No careers yet. Use &quot;Add Career&quot; to create your first entry.
          </p>
        ) : (
          <div className="divide-y divide-zinc-800/80 text-sm">
            {initialCareers.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)] items-center px-4 py-2.5 hover:bg-zinc-900/60"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-zinc-100">
                    {item.title}
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 truncate text-xs text-emerald-400/80 hover:text-emerald-300"
                  >
                    {item.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="truncate text-xs text-zinc-400">
                  {item.company}
                </div>
                <div className="truncate text-xs text-zinc-400">
                  {item.location ?? "—"}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(item)}
                    className="inline-flex cursor-pointer items-center"
                    aria-label="Toggle active"
                  >
                    <span
                      className={`flex h-5 w-9 items-center rounded-full ${
                        item.isActive ? "bg-emerald-500/80" : "bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`ml-0.5 block h-4 w-4 rounded-full bg-zinc-950 transition ${
                          item.isActive ? "translate-x-4" : ""
                        }`}
                      />
                    </span>
                  </button>
                </div>
                <div className="flex items-center justify-end gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(item);
                      setShowForm(true);
                    }}
                    className="rounded-md border border-zinc-700 bg-zinc-900 p-1.5 text-zinc-300 transition-colors hover:border-emerald-500/60 hover:text-emerald-300"
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
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
        <CareerFormModal
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

type CareerFormModalProps = {
  initial: JobCareer | null;
  onClose: () => void;
  onSuccess: () => void;
};

function CareerFormModal({ initial, onClose, onSuccess }: CareerFormModalProps) {
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
          company: initial.company,
          companyZh: initial.companyZh ?? "",
          location: initial.location ?? "",
          url: initial.url,
          tagsRaw: initial.tags.join(", "),
          displayOrder: initial.displayOrder,
          isActive: initial.isActive,
        }
      : {
          title: "",
          titleZh: "",
          company: "",
          companyZh: "",
          location: "",
          url: "",
          tagsRaw: "",
          displayOrder: 0,
          isActive: true,
        },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    const tags = (values.tagsRaw ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const payload = {
      title: values.title,
      title_zh: values.titleZh,
      company: values.company,
      company_zh: values.companyZh || null,
      location: values.location || null,
      url: values.url,
      tags,
      display_order: values.displayOrder,
      is_active: values.isActive,
    };
    const op = initial
      ? supabase.from("job_careers").update(payload).eq("id", initial.id)
      : supabase.from("job_careers").insert(payload);
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
            {initial ? "Edit Career" : "New Career"}
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
                <p className="text-xs text-red-400">{errors.titleZh.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                Company (EN)
              </label>
              <input
                type="text"
                {...register("company")}
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
              />
              {errors.company && (
                <p className="text-xs text-red-400">
                  {errors.company.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                公司 (ZH，可选)
              </label>
              <input
                type="text"
                {...register("companyZh")}
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                Location (可选)
              </label>
              <input
                type="text"
                {...register("location")}
                placeholder="Remote · Singapore"
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                URL
              </label>
              <input
                type="url"
                {...register("url")}
                placeholder="https://…"
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
              />
              {errors.url && (
                <p className="text-xs text-red-400">{errors.url.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-300">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              {...register("tagsRaw")}
              placeholder="jobs, remote, engineering"
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
            />
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
                  : "Create career"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
