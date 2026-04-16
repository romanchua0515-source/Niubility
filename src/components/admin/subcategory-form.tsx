"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  name_zh: z.string().optional(),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
});

type FormValues = z.infer<typeof schema>;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type SubcategoryFormProps = {
  categoryId: string;
  onSuccess?: () => void;
};

export function SubcategoryForm({ categoryId, onSuccess }: SubcategoryFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      name_zh: "",
      slug: "",
    },
  });

  const nameValue = watch("name");

  function maybeSyncSlug() {
    const currentSlug = watch("slug");
    if (!currentSlug) {
      setValue("slug", slugify(nameValue ?? ""));
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from("subcategories").insert({
        slug: values.slug,
        name: values.name,
        name_zh: values.name_zh?.trim() ? values.name_zh.trim() : null,
        category_id: categoryId,
      });
      if (insertError) {
        setError(insertError.message);
        setSubmitting(false);
        return;
      }
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setSubmitting(false);
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-zinc-800/80 bg-zinc-950/90 p-4"
    >
      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-300">
          Name (English)
        </label>
        <input
          type="text"
          {...register("name")}
          onBlur={maybeSyncSlug}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-500/0 transition focus:border-emerald-500/70 focus:ring-1"
          placeholder="e.g. Social growth"
        />
        {errors.name && (
          <p className="text-xs text-red-400">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-300">
          Name (中文)
        </label>
        <input
          type="text"
          {...register("name_zh")}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-500/0 transition focus:border-emerald-500/70 focus:ring-1"
          placeholder="可选"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-300">
          Slug
        </label>
        <input
          type="text"
          {...register("slug")}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-500/0 transition focus:border-emerald-500/70 focus:ring-1"
          placeholder="social-growth"
        />
        <p className="mt-0.5 text-[11px] text-zinc-500">
          Globally unique across all subcategories (used in /categories/… routes).
        </p>
        {errors.slug && (
          <p className="text-xs text-red-400">{errors.slug.message}</p>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-lg border border-emerald-500/70 bg-emerald-500/90 px-3 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Saving…" : "Add subcategory"}
      </button>
    </form>
  );
}
