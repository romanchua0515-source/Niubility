"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import type { RolePageSection } from "@/lib/api";

const SECTION_TYPES = ["hero", "tool_group", "workflow", "resource"] as const;

const schema = z.object({
  roleSlug: z.string().min(1),
  sectionType: z.enum(SECTION_TYPES),
  title: z.string().min(1, "Title is required"),
  titleZh: z.string().min(1, "标题必填"),
  description: z.string().optional(),
  descriptionZh: z.string().optional(),
  toolSlugsRaw: z.string().optional(),
  displayOrder: z.number().int().min(0),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const sectionTypeBadge: Record<(typeof SECTION_TYPES)[number], string> = {
  hero: "border-emerald-400/50 bg-emerald-400/10 text-emerald-400",
  tool_group: "border-blue-400/50 bg-blue-400/10 text-blue-400",
  workflow: "border-purple-400/50 bg-purple-400/10 text-purple-400",
  resource: "border-amber-400/50 bg-amber-400/10 text-amber-400",
};

type RolesManagerProps = {
  roleSlugs: string[];
  selectedSlug: string;
  initialSections: RolePageSection[];
};

export function RolesManager({
  roleSlugs,
  selectedSlug,
  initialSections,
}: RolesManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<RolePageSection | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function handleDelete(section: RolePageSection) {
    if (!confirm(`Delete section "${section.title}"?`)) return;
    const { error } = await supabase
      .from("role_page_sections")
      .delete()
      .eq("id", section.id);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Role Pages
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage sections that power each role landing page.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,200px)_minmax(0,1fr)]">
        <aside className="rounded-xl border border-zinc-800/60 bg-zinc-900/50">
          <div className="border-b border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Roles
          </div>
          <nav className="p-1.5">
            {roleSlugs.map((slug) => {
              const active = slug === selectedSlug;
              return (
                <a
                  key={slug}
                  href={`/admin/roles?role=${slug}`}
                  className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-emerald-500/10 text-emerald-300"
                      : "text-zinc-300 hover:bg-zinc-900 hover:text-emerald-300"
                  }`}
                >
                  {slug}
                </a>
              );
            })}
          </nav>
        </aside>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-zinc-300">
              Sections for{" "}
              <span className="font-semibold text-zinc-100">{selectedSlug}</span>
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center rounded-lg border border-emerald-500/70 bg-emerald-500/90 px-3 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
            >
              Add Section
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/50">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,3fr)_minmax(0,0.6fr)_minmax(0,1fr)] border-b border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
              <div>Type</div>
              <div>Title</div>
              <div>Order</div>
              <div className="text-right">Actions</div>
            </div>
            {initialSections.length === 0 ? (
              <p className="px-4 py-4 text-sm text-zinc-500">
                No sections yet for this role. Use &quot;Add Section&quot; to
                create your first entry.
              </p>
            ) : (
              <div className="divide-y divide-zinc-800/80 text-sm">
                {initialSections.map((section) => (
                  <div
                    key={section.id}
                    className="grid grid-cols-[minmax(0,1fr)_minmax(0,3fr)_minmax(0,0.6fr)_minmax(0,1fr)] items-center px-4 py-2.5 hover:bg-zinc-900/60"
                  >
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${sectionTypeBadge[section.sectionType]}`}
                      >
                        {section.sectionType}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-zinc-100">
                        {section.title}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        {section.titleZh}
                      </p>
                    </div>
                    <div className="text-xs text-zinc-400">
                      {section.displayOrder}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(section);
                          setShowForm(true);
                        }}
                        className="rounded-md border border-zinc-700 bg-zinc-900 p-1.5 text-zinc-300 transition-colors hover:border-emerald-500/60 hover:text-emerald-300"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(section)}
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
        </section>
      </div>

      {showForm && (
        <RoleSectionFormModal
          roleSlugs={roleSlugs}
          defaultRoleSlug={selectedSlug}
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

type RoleSectionFormModalProps = {
  roleSlugs: string[];
  defaultRoleSlug: string;
  initial: RolePageSection | null;
  onClose: () => void;
  onSuccess: () => void;
};

function RoleSectionFormModal({
  roleSlugs,
  defaultRoleSlug,
  initial,
  onClose,
  onSuccess,
}: RoleSectionFormModalProps) {
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
          roleSlug: initial.roleSlug,
          sectionType: initial.sectionType,
          title: initial.title,
          titleZh: initial.titleZh,
          description: initial.description ?? "",
          descriptionZh: initial.descriptionZh ?? "",
          toolSlugsRaw: initial.toolSlugs.join(", "),
          displayOrder: initial.displayOrder,
          isActive: initial.isActive,
        }
      : {
          roleSlug: defaultRoleSlug,
          sectionType: "tool_group",
          title: "",
          titleZh: "",
          description: "",
          descriptionZh: "",
          toolSlugsRaw: "",
          displayOrder: 0,
          isActive: true,
        },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    const toolSlugs = (values.toolSlugsRaw ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const payload = {
      role_slug: values.roleSlug,
      section_type: values.sectionType,
      title: values.title,
      title_zh: values.titleZh,
      description: values.description || null,
      description_zh: values.descriptionZh || null,
      tool_slugs: toolSlugs,
      display_order: values.displayOrder,
      is_active: values.isActive,
    };
    const op = initial
      ? supabase
          .from("role_page_sections")
          .update(payload)
          .eq("id", initial.id)
      : supabase.from("role_page_sections").insert(payload);
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
            {initial ? "Edit Section" : "New Section"}
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
                Role
              </label>
              <select
                {...register("roleSlug")}
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
              >
                {roleSlugs.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                Section Type
              </label>
              <select
                {...register("sectionType")}
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
              >
                {SECTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
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
                className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-300">
                描述 (ZH)
              </label>
              <textarea
                {...register("descriptionZh")}
                rows={3}
                className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-300">
              Tool Slugs (comma-separated)
            </label>
            <input
              type="text"
              {...register("toolSlugsRaw")}
              placeholder="dune-analytics, nansen, defillama"
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
            />
            <p className="text-[11px] text-zinc-500">
              Optional. Reference tools by their slug to surface them in this
              section.
            </p>
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
                  : "Create section"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
