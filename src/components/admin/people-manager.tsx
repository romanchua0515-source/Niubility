"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import type { Person } from "@/lib/api";

const PERSON_ROLES = [
  "Recruiter",
  "Trader",
  "Researcher",
  "Builder",
  "Job Board",
  "Content Creator",
] as const;

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || /^https?:\/\//i.test(v), "Must be an http(s) URL");

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  nameZh: z.string().optional(),
  role: z.enum(PERSON_ROLES),
  bio: z.string().min(1, "Bio is required"),
  bioZh: z.string().min(1, "中文简介必填"),
  twitterUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  websiteUrl: optionalUrl,
  notableWork: z.string().min(1, "Notable work is required"),
  notableWorkZh: z.string().min(1, "中文亮点必填"),
  avatarUrl: optionalUrl,
  isFeatured: z.boolean(),
  displayOrder: z.number().int().min(0),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const roleBadgeClass: Record<(typeof PERSON_ROLES)[number], string> = {
  Recruiter: "border-emerald-400/50 bg-emerald-400/10 text-emerald-300",
  Trader: "border-amber-400/50 bg-amber-400/10 text-amber-300",
  Researcher: "border-sky-400/50 bg-sky-400/10 text-sky-300",
  Builder: "border-violet-400/50 bg-violet-400/10 text-violet-300",
  "Job Board": "border-blue-400/50 bg-blue-400/10 text-blue-300",
  "Content Creator": "border-pink-400/50 bg-pink-400/10 text-pink-300",
};

function badgeClass(role: string): string {
  return (
    roleBadgeClass[role as (typeof PERSON_ROLES)[number]] ??
    "border-zinc-600 bg-zinc-800 text-zinc-300"
  );
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

type PeopleManagerProps = {
  initialPeople: Person[];
};

export function PeopleManager({ initialPeople }: PeopleManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<Person | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function handleToggleFeatured(person: Person) {
    const { error } = await supabase
      .from("people")
      .update({ is_featured: !person.is_featured })
      .eq("id", person.id);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  async function handleDelete(person: Person) {
    if (!confirm(`Delete "${person.name}"?`)) return;
    const { error } = await supabase
      .from("people")
      .delete()
      .eq("id", person.id);
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
            People
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Recruiters, traders, researchers and other folks worth following.
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
          Add Person
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/50">
        <div className="grid grid-cols-[minmax(0,0.5fr)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.6fr)_minmax(0,1fr)] border-b border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
          <div></div>
          <div>Name</div>
          <div>Role</div>
          <div>Featured</div>
          <div>Order</div>
          <div className="text-right">Actions</div>
        </div>
        {initialPeople.length === 0 ? (
          <p className="px-4 py-4 text-sm text-zinc-500">
            No people yet. Use &quot;Add Person&quot; to create your first entry.
          </p>
        ) : (
          <div className="divide-y divide-zinc-800/80 text-sm">
            {initialPeople.map((person) => (
              <div
                key={person.id}
                className="grid grid-cols-[minmax(0,0.5fr)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.6fr)_minmax(0,1fr)] items-center px-4 py-2.5 hover:bg-zinc-900/60"
              >
                <div>
                  {person.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={person.avatar_url}
                      alt={person.name}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-zinc-800"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-semibold text-zinc-300">
                      {initialsOf(person.name)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-zinc-100">
                    {person.name}
                  </p>
                  {person.name_zh && (
                    <p className="truncate text-xs text-zinc-500">
                      {person.name_zh}
                    </p>
                  )}
                </div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${badgeClass(person.role)}`}
                  >
                    {person.role}
                  </span>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(person)}
                    className="inline-flex cursor-pointer items-center"
                    aria-label="Toggle featured"
                  >
                    <span
                      className={`flex h-5 w-9 items-center rounded-full ${
                        person.is_featured ? "bg-emerald-500/80" : "bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`ml-0.5 block h-4 w-4 rounded-full bg-zinc-950 transition ${
                          person.is_featured ? "translate-x-4" : ""
                        }`}
                      />
                    </span>
                  </button>
                </div>
                <div className="text-xs text-zinc-400">
                  {person.display_order}
                </div>
                <div className="flex items-center justify-end gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(person);
                      setShowForm(true);
                    }}
                    className="rounded-md border border-zinc-700 bg-zinc-900 p-1.5 text-zinc-300 transition-colors hover:border-emerald-500/60 hover:text-emerald-300"
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(person)}
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
        <PersonFormModal
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

type PersonFormModalProps = {
  initial: Person | null;
  onClose: () => void;
  onSuccess: () => void;
};

function PersonFormModal({
  initial,
  onClose,
  onSuccess,
}: PersonFormModalProps) {
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
          name: initial.name,
          nameZh: initial.name_zh ?? "",
          role: (PERSON_ROLES as readonly string[]).includes(initial.role)
            ? (initial.role as (typeof PERSON_ROLES)[number])
            : "Recruiter",
          bio: initial.bio,
          bioZh: initial.bio_zh,
          twitterUrl: initial.twitter_url ?? "",
          linkedinUrl: initial.linkedin_url ?? "",
          websiteUrl: initial.website_url ?? "",
          notableWork: initial.notable_work,
          notableWorkZh: initial.notable_work_zh,
          avatarUrl: initial.avatar_url ?? "",
          isFeatured: initial.is_featured,
          displayOrder: initial.display_order,
          isActive: initial.is_active,
        }
      : {
          name: "",
          nameZh: "",
          role: "Recruiter",
          bio: "",
          bioZh: "",
          twitterUrl: "",
          linkedinUrl: "",
          websiteUrl: "",
          notableWork: "",
          notableWorkZh: "",
          avatarUrl: "",
          isFeatured: false,
          displayOrder: 0,
          isActive: true,
        },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    const payload = {
      name: values.name,
      name_zh: values.nameZh?.trim() ? values.nameZh.trim() : null,
      role: values.role,
      bio: values.bio,
      bio_zh: values.bioZh,
      twitter_url: values.twitterUrl?.trim() || null,
      linkedin_url: values.linkedinUrl?.trim() || null,
      website_url: values.websiteUrl?.trim() || null,
      notable_work: values.notableWork,
      notable_work_zh: values.notableWorkZh,
      avatar_url: values.avatarUrl?.trim() || null,
      is_featured: values.isFeatured,
      display_order: values.displayOrder,
      is_active: values.isActive,
    };
    const op = initial
      ? supabase.from("people").update(payload).eq("id", initial.id)
      : supabase.from("people").insert(payload);
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
            {initial ? "Edit Person" : "New Person"}
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
                  Name (EN)
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
                />
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  名字 (ZH，可选)
                </label>
                <input
                  type="text"
                  {...register("nameZh")}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Role
                </label>
                <select
                  {...register("role")}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
                >
                  {PERSON_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Avatar URL (optional)
                </label>
                <input
                  type="url"
                  {...register("avatarUrl")}
                  placeholder="https://…"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
                />
                {errors.avatarUrl && (
                  <p className="text-xs text-red-400">
                    {errors.avatarUrl.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Bio (EN)
                </label>
                <textarea
                  {...register("bio")}
                  rows={3}
                  className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
                />
                {errors.bio && (
                  <p className="text-xs text-red-400">{errors.bio.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  简介 (ZH)
                </label>
                <textarea
                  {...register("bioZh")}
                  rows={3}
                  className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
                />
                {errors.bioZh && (
                  <p className="text-xs text-red-400">{errors.bioZh.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Notable Work (EN)
                </label>
                <textarea
                  {...register("notableWork")}
                  rows={2}
                  className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
                />
                {errors.notableWork && (
                  <p className="text-xs text-red-400">
                    {errors.notableWork.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  亮点 (ZH)
                </label>
                <textarea
                  {...register("notableWorkZh")}
                  rows={2}
                  className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
                />
                {errors.notableWorkZh && (
                  <p className="text-xs text-red-400">
                    {errors.notableWorkZh.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Twitter URL
                </label>
                <input
                  type="url"
                  {...register("twitterUrl")}
                  placeholder="https://twitter.com/…"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
                />
                {errors.twitterUrl && (
                  <p className="text-xs text-red-400">
                    {errors.twitterUrl.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  {...register("linkedinUrl")}
                  placeholder="https://linkedin.com/in/…"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
                />
                {errors.linkedinUrl && (
                  <p className="text-xs text-red-400">
                    {errors.linkedinUrl.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Website URL
                </label>
                <input
                  type="url"
                  {...register("websiteUrl")}
                  placeholder="https://…"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
                />
                {errors.websiteUrl && (
                  <p className="text-xs text-red-400">
                    {errors.websiteUrl.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
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
                  <p className="text-xs font-medium text-zinc-200">Featured</p>
                  <label className="inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      {...register("isFeatured")}
                      className="peer sr-only"
                    />
                    <span className="h-5 w-9 rounded-full bg-zinc-700 transition peer-checked:bg-emerald-500/80">
                      <span className="relative left-0.5 top-0.5 block h-4 w-4 rounded-full bg-zinc-950 transition peer-checked:translate-x-4" />
                    </span>
                  </label>
                </div>
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
                  : "Create person"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
