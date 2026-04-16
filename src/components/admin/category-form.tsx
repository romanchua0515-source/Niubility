"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  title: z.string().min(1, "English title is required"),
  title_zh: z.string().optional(),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  cover_image: z.string().url("Enter a valid cover image URL"),
});

type FormValues = z.infer<typeof schema>;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type CategoryFormProps = {
  variant: "create" | "edit";
  /** Required when variant is "edit" */
  categoryId?: string;
  defaultValues?: Partial<FormValues>;
  onSuccess?: () => void;
};

export function CategoryForm({
  variant,
  categoryId,
  defaultValues,
  onSuccess,
}: CategoryFormProps) {
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
      title: defaultValues?.title ?? "",
      title_zh: defaultValues?.title_zh ?? "",
      slug: defaultValues?.slug ?? "",
      cover_image: defaultValues?.cover_image ?? "",
    },
  });

  const titleValue = watch("title");

  function maybeSyncSlug() {
    if (variant === "edit") return;
    const currentSlug = watch("slug");
    if (!currentSlug) {
      setValue("slug", slugify(titleValue ?? ""));
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        slug: values.slug,
        title: values.title,
        title_zh: values.title_zh?.trim() ? values.title_zh.trim() : null,
        cover_image: values.cover_image,
      };

      if (variant === "create") {
        const { error: insertError } = await supabase
          .from("categories")
          .insert(payload);
        if (insertError) {
          setError(insertError.message);
          setSubmitting(false);
          return;
        }
      } else {
        if (!categoryId) {
          setError("Missing category id");
          setSubmitting(false);
          return;
        }
        const { error: updateError } = await supabase
          .from("categories")
          .update(payload)
          .eq("id", categoryId);
        if (updateError) {
          setError(updateError.message);
          setSubmitting(false);
          return;
        }
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
          Title (English)
        </label>
        <input
          type="text"
          {...register("title")}
          onBlur={maybeSyncSlug}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-500/0 transition focus:border-emerald-500/70 focus:ring-1"
          placeholder="e.g. Marketing"
        />
        {errors.title && (
          <p className="text-xs text-red-400">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-300">
          Title (中文)
        </label>
        <input
          type="text"
          {...register("title_zh")}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-500/0 transition focus:border-emerald-500/70 focus:ring-1"
          placeholder="例如：营销"
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
          placeholder="marketing"
        />
        <p className="mt-0.5 text-[11px] text-zinc-500">
          Unique URL segment for this hub (e.g. /categories/marketing).
        </p>
        {errors.slug && (
          <p className="text-xs text-red-400">{errors.slug.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-300">
          Cover image URL
        </label>
        <input
          type="url"
          {...register("cover_image")}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-500/0 transition focus:border-emerald-500/70 focus:ring-1"
          placeholder="https://…"
        />
        <p className="mt-0.5 text-[11px] text-zinc-500">
          Used on explore / Flipboard-style category tiles.
        </p>
        {errors.cover_image && (
          <p className="text-xs text-red-400">{errors.cover_image.message}</p>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-lg border border-emerald-500/70 bg-emerald-500/90 px-3 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting
          ? "Saving…"
          : variant === "create"
            ? "Create category"
            : "Save changes"}
      </button>
    </form>
  );
}
