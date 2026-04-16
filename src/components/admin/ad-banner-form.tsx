"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ASPECT_TARGET = 2;
const ASPECT_TOLERANCE = 0.18;

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(4, "English description is required"),
  descriptionZh: z.string().optional(),
  websiteUrl: z.string().url("Enter a valid destination URL"),
  affiliateUrl: z.string().url().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeAdSlug(title: string): string {
  const base = slugify(title).slice(0, 36) || "sponsored";
  return `ad-${base}-${Math.random().toString(36).slice(2, 8)}`;
}

function extFromFile(file: File): string | null {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp"].includes(fromName)) {
    return fromName === "jpg" ? "jpeg" : fromName;
  }
  const t = file.type;
  if (t === "image/jpeg") return "jpeg";
  if (t === "image/png") return "png";
  if (t === "image/webp") return "webp";
  return null;
}

async function measureImageAspect(file: File): Promise<{
  width: number;
  height: number;
  ratio: number;
}> {
  const bitmap = await createImageBitmap(file);
  try {
    const width = bitmap.width;
    const height = bitmap.height;
    const ratio = width / height;
    return { width, height, ratio };
  } finally {
    bitmap.close();
  }
}

export type AdBannerFormProps = {
  nextFeaturedOrder: number;
  onSuccess: () => void;
};

export function AdBannerForm({ nextFeaturedOrder, onSuccess }: AdBannerFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dimWarning, setDimWarning] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      descriptionZh: "",
      websiteUrl: "https://",
      affiliateUrl: "",
    },
  });

  async function onFileChange(f: File | null) {
    setError(null);
    setDimWarning(null);
    if (!f) {
      setFile(null);
      return;
    }
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (JPEG, PNG, or WebP).");
      setFile(null);
      return;
    }
    if (f.size > MAX_IMAGE_BYTES) {
      setError("Error: Image exceeds 10MB limit.");
      setFile(null);
      return;
    }
    try {
      const { width, height, ratio } = await measureImageAspect(f);
      if (Math.abs(ratio - ASPECT_TARGET) > ASPECT_TOLERANCE) {
        setDimWarning(
          `This image is ${width}×${height} (ratio ${ratio.toFixed(2)}:1). Recommended dimensions: 800×400 (2:1 aspect ratio) for best results.`,
        );
      }
    } catch {
      setDimWarning("Could not read image dimensions; upload is still allowed.");
    }
    setFile(f);
  }

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    if (!file) {
      setError("Please select a banner image.");
      return;
    }

    const ext = extFromFile(file);
    if (!ext) {
      setError("Use JPEG, PNG, or WebP for the banner image.");
      return;
    }

    setSubmitting(true);
    try {
      const slug = makeAdSlug(values.title);
      const path = `hero/${slug}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("banners")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || `image/${ext}`,
        });

      if (upErr) {
        setError(upErr.message);
        setSubmitting(false);
        return;
      }

      const { data: pub } = supabase.storage.from("banners").getPublicUrl(path);
      const publicUrl = pub.publicUrl;

      const { error: insErr } = await supabase.from("tools").insert({
        slug,
        name: values.title,
        description: values.description,
        description_zh: values.descriptionZh?.trim() || null,
        website_url: values.websiteUrl,
        affiliate_url: values.affiliateUrl?.trim() || null,
        is_featured: true,
        featured_order: nextFeaturedOrder,
        banner_image_url: publicUrl,
        best_for: "Sponsored placement",
        best_for_zh: null,
        category_slug: "culture",
        subcategory_slug: "media",
        pricing: "Sponsored",
        tags: [],
      });

      if (insErr) {
        setError(insErr.message);
        setSubmitting(false);
        return;
      }

      onSuccess();
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
          Ad title
        </label>
        <input
          type="text"
          {...register("title")}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/30"
          placeholder="Campaign or partner name"
        />
        {errors.title && (
          <p className="text-xs text-red-400">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-300">
          Ad description (English)
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/30"
        />
        {errors.description && (
          <p className="text-xs text-red-400">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-300">
          Ad description (中文，可选)
        </label>
        <textarea
          {...register("descriptionZh")}
          rows={2}
          className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/30"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-300">
          Destination URL
        </label>
        <input
          type="url"
          {...register("websiteUrl")}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/30"
        />
        {errors.websiteUrl && (
          <p className="text-xs text-red-400">{errors.websiteUrl.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-300">
          Affiliate / tracking URL (可选)
        </label>
        <input
          type="url"
          {...register("affiliateUrl")}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/30"
          placeholder="https://"
        />
        {errors.affiliateUrl && (
          <p className="text-xs text-red-400">{errors.affiliateUrl.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-300">
          Banner image
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            void onFileChange(f);
          }}
          className="block w-full text-xs text-zinc-400 file:mr-3 file:rounded-md file:border file:border-zinc-700 file:bg-zinc-900 file:px-2 file:py-1.5 file:text-xs file:text-zinc-200"
        />
        <p className="text-[11px] leading-relaxed text-zinc-500">
          Max size: 10MB. Recommended dimensions: 800×400 (2:1 aspect ratio).
        </p>
        {dimWarning ? (
          <p className="text-[11px] text-amber-400/90">{dimWarning}</p>
        ) : null}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-lg border border-emerald-500/70 bg-emerald-500/90 px-3 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Publishing…" : "Publish ad"}
      </button>
    </form>
  );
}
