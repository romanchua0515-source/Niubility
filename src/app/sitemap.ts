import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE = "https://niubility.vercel.app";

const ROLE_SLUGS = [
  "traders",
  "developers",
  "marketers",
  "researchers",
  "designers",
  "bd-founders",
  "operators",
  "job-seekers",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE}/categories`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/roles`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/signals`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE}/search`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${BASE}/submit`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE}/guide/web3-jobs`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const { data: categoryRows, error: categoriesError } = await supabase
    .from("categories")
    .select("slug");
  if (categoriesError) throw categoriesError;

  const categoryEntries: MetadataRoute.Sitemap = (categoryRows ?? []).map(
    (row) => ({
      url: `${BASE}/categories/${row.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }),
  );

  const roleEntries: MetadataRoute.Sitemap = ROLE_SLUGS.map((slug) => ({
    url: `${BASE}/roles/${slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const toolsFiltered = await supabase
    .from("tools")
    .select("slug")
    .neq("is_active", false);

  let toolRows: { slug: string }[] = [];
  if (toolsFiltered.error?.code === "42703") {
    const fb = await supabase.from("tools").select("slug");
    if (fb.error) throw fb.error;
    toolRows = fb.data ?? [];
  } else if (toolsFiltered.error) {
    throw toolsFiltered.error;
  } else {
    toolRows = toolsFiltered.data ?? [];
  }

  const toolEntries: MetadataRoute.Sitemap = toolRows.map((row) => ({
    url: `${BASE}/tools/${row.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...categoryEntries,
    ...roleEntries,
    ...toolEntries,
  ];
}
