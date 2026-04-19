import { CategoriesListPage } from "@/components/categories-list-page";
import { getCategories } from "@/lib/api";
import {
  buildBilingualPageMetadata,
  truncateMetaDescription,
} from "@/lib/seo-metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const exploreCategories = await getCategories();
  const sample = exploreCategories
    .slice(0, 3)
    .map((c) => c.title)
    .join(", ");
  const suffix =
    exploreCategories.length > 0 && sample
      ? ` ${exploreCategories.length} hubs: ${sample}.`
      : "";
  return buildBilingualPageMetadata({
    path: "/categories",
    enTitle: "Browse Categories — Niubility",
    enDescription: truncateMetaDescription(
      `Explore Web3 and AI tools organized by category.${suffix}`,
    ),
    zhTitle: "分类浏览 — Niubility",
    zhDescription: truncateMetaDescription(
      exploreCategories.length > 0
        ? `按分类探索 Web3 与 AI 工具，共 ${exploreCategories.length} 个精选主题。`
        : "按分类探索 Web3 与 AI 工具目录。",
    ),
  });
}

export default async function CategoriesPage() {
  const exploreCategories = await getCategories();
  return <CategoriesListPage exploreCategories={exploreCategories} />;
}
