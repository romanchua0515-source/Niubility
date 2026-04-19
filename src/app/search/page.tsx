import { SearchView } from "@/components/search-view";
import { getTopSearched, searchTools } from "@/lib/api";
import { buildBilingualPageMetadata, truncateMetaDescription } from "@/lib/seo-metadata";
import type { Metadata } from "next";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const safe = query.replace(/["<>]/g, "").slice(0, 60);
  const enBase = query
    ? `Search Niubility for “${safe}” and discover matching Web3 and AI tools, job boards and security resources.`
    : "Search Niubility for Web3 protocols, AI tools, job boards and security resources.";
  const zhBase = query
    ? `在 Niubility 搜索「${safe.slice(0, 40)}」，发现匹配的 Web3 与 AI 工具与资源。`
    : "在 Niubility 搜索 Web3 协议、AI 工具、招聘板与安全资源。";
  return buildBilingualPageMetadata({
    path: "/search",
    enTitle: "Search — Niubility",
    enDescription: truncateMetaDescription(enBase),
    zhTitle: "搜索 — Niubility",
    zhDescription: truncateMetaDescription(zhBase),
    robots: { index: false, follow: true },
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const [results, topSearched] = await Promise.all([
    query ? searchTools(query, 24) : Promise.resolve([]),
    getTopSearched(),
  ]);

  return (
    <SearchView query={query} results={results} topSearched={topSearched} />
  );
}
