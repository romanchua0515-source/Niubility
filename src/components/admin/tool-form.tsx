"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().min(10, "Please add an English description"),
  descriptionZh: z.string().optional(),
  websiteUrl: z.string().url("Enter a valid website URL"),
  affiliateUrl: z.string().url().optional().or(z.literal("")),
  isFeatured: z.boolean(),
  featuredOrder: z.number().int().min(0),
  isHot: z.boolean(),
  hotOrder: z.number().int().min(0),
  isQuickPick: z.boolean(),
  quickPickOrder: z.number().int().min(0),
});

type FormValues = z.infer<typeof schema>;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type ToolFormProps = {
  onCreated?: () => void;
  onSuccess?: () => void;
};

export function ToolForm({ onCreated, onSuccess }: ToolFormProps) {
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
      slug: "",
      description: "",
      descriptionZh: "",
      websiteUrl: "",
      affiliateUrl: "",
      isFeatured: false,
      featuredOrder: 0,
      isHot: false,
      hotOrder: 0,
      isQuickPick: false,
      quickPickOrder: 0,
    },
  });

  const isFeaturedVal = watch("isFeatured");
  const isHotVal = watch("isHot");
  const isQuickPickVal = watch("isQuickPick");

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
      const { error } = await supabase.from("tools").insert({
        slug: values.slug,
        name: values.name,
        description: values.description,
        description_zh: values.descriptionZh || null,
        website_url: values.websiteUrl,
        affiliate_url: values.affiliateUrl || null,
        is_featured: values.isFeatured,
        featured_order: values.featuredOrder,
        is_hot: values.isHot,
        hot_order: values.hotOrder,
        is_quick_pick: values.isQuickPick,
        quick_pick_order: values.quickPickOrder,
        // Reasonable defaults for required fields so Roman doesn't see DB errors.
        best_for: "TBD",
        best_for_zh: null,
        category_slug: "ai",
        subcategory_slug: "ai-tools",
        pricing: "Unknown",
        tags: [],
      });
      if (error) {
        setError(error.message);
        setSubmitting(false);
        return;
      }
      if (onCreated) onCreated();
      if (onSuccess) onSuccess();
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
          Name
        </label>
        <input
          type="text"
          {...register("name")}
          onBlur={maybeSyncSlug}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-500/0 transition focus:border-emerald-500/70 focus:ring-1"
          placeholder="e.g. Dune Analytics"
        />
        {errors.name && (
          <p className="text-xs text-red-400">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-300">
          Slug
        </label>
        <input
          type="text"
          {...register("slug")}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-500/0 transition focus:border-emerald-500/70 focus:ring-1"
          placeholder="dune-analytics"
        />
        <p className="mt-0.5 text-[11px] text-zinc-500">
          Used in internal URLs and bookmarks. Lowercase, hyphen-separated.
        </p>
        {errors.slug && (
          <p className="text-xs text-red-400">{errors.slug.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-300">
          English Description
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-500/0 transition focus:border-emerald-500/70 focus:ring-1"
          placeholder="Short summary that will appear on the public card."
        />
        {errors.description && (
          <p className="text-xs text-red-400">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-300">
          Chinese Description (可选)
        </label>
        <textarea
          {...register("descriptionZh")}
          rows={3}
          className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-500/0 transition focus:border-emerald-500/70 focus:ring-1"
          placeholder="中文简介（如果暂时不需要，可以留空）。"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-300">
          Website URL
        </label>
        <input
          type="url"
          {...register("websiteUrl")}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-500/0 transition focus:border-emerald-500/70 focus:ring-1"
          placeholder="https://example.com"
        />
        {errors.websiteUrl && (
          <p className="text-xs text-red-400">{errors.websiteUrl.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-300">
          Affiliate URL (可选)
        </label>
        <input
          type="url"
          {...register("affiliateUrl")}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-500/0 transition focus:border-emerald-500/70 focus:ring-1"
          placeholder="https://partner.example.com/..."
        />
        <p className="mt-0.5 text-[11px] text-zinc-500">
          If set, this link will be used for referrals; otherwise the Website URL
          is used.
        </p>
        {errors.affiliateUrl && (
          <p className="text-xs text-red-400">{errors.affiliateUrl.message}</p>
        )}
      </div>

      <div className="space-y-3 rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-zinc-200">
              Feature this tool (Banner)
            </p>
            <p className="text-[11px] text-zinc-500">
              When enabled, this tool can show up in hero carousels.
            </p>
          </div>
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
        {isFeaturedVal && (
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-zinc-400">
              Featured order (lower = earlier)
            </label>
            <input
              type="number"
              min={0}
              {...register("featuredOrder", { valueAsNumber: true })}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
            />
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-zinc-200">Hot this week</p>
            <p className="text-[11px] text-zinc-500">
              Surface this tool in the hot-this-week block.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              {...register("isHot")}
              className="peer sr-only"
            />
            <span className="h-5 w-9 rounded-full bg-zinc-700 transition peer-checked:bg-emerald-500/80">
              <span className="relative left-0.5 top-0.5 block h-4 w-4 rounded-full bg-zinc-950 transition peer-checked:translate-x-4" />
            </span>
          </label>
        </div>
        {isHotVal && (
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-zinc-400">
              Hot order (lower = earlier)
            </label>
            <input
              type="number"
              min={0}
              {...register("hotOrder", { valueAsNumber: true })}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
            />
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-zinc-200">Quick pick</p>
            <p className="text-[11px] text-zinc-500">
              Shortlist this tool as a homepage quick pick.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              {...register("isQuickPick")}
              className="peer sr-only"
            />
            <span className="h-5 w-9 rounded-full bg-zinc-700 transition peer-checked:bg-emerald-500/80">
              <span className="relative left-0.5 top-0.5 block h-4 w-4 rounded-full bg-zinc-950 transition peer-checked:translate-x-4" />
            </span>
          </label>
        </div>
        {isQuickPickVal && (
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-zinc-400">
              Quick pick order (lower = earlier)
            </label>
            <input
              type="number"
              min={0}
              {...register("quickPickOrder", { valueAsNumber: true })}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70"
            />
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-lg border border-emerald-500/70 bg-emerald-500/90 px-3 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Saving…" : "Save Tool"}
      </button>
    </form>
  );
}

