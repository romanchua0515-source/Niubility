import type { Metadata } from "next";

export const SITE_ORIGIN = "https://niubility.io";

/** Truncate for meta description (max ~160 chars). */
export function truncateMetaDescription(text: string, max = 160): string {
  const t = text.trim().replace(/\s+/g, " ");
  if ([...t].length <= max) return t;
  const slice = [...t].slice(0, max - 1).join("");
  return slice.replace(/\s+\S*$/, "").trimEnd() + "…";
}

export type BilingualPageSeo = {
  path: string;
  enTitle: string;
  enDescription: string;
  zhTitle?: string;
  zhDescription?: string;
  robots?: Metadata["robots"];
};

/**
 * Default public metadata: EN primary fields, hreflang alternates, OG + Twitter.
 * Paths are pathname-only; resolve with `metadataBase` in root layout.
 */
export function buildBilingualPageMetadata(input: BilingualPageSeo): Metadata {
  const path = input.path.startsWith("/") ? input.path : `/${input.path}`;
  const enDescription = truncateMetaDescription(input.enDescription);

  return {
    title: input.enTitle,
    description: enDescription,
    alternates: {
      canonical: path,
      languages: {
        en: path,
        "zh-CN": path,
        "x-default": path,
      },
    },
    openGraph: {
      title: input.enTitle,
      description: enDescription,
      type: "website",
      url: path,
      siteName: "Niubility",
      locale: "en_US",
      alternateLocale: ["zh_CN"],
    },
    twitter: {
      card: "summary_large_image",
      title: input.enTitle,
      description: enDescription,
    },
    robots: input.robots,
  };
}
