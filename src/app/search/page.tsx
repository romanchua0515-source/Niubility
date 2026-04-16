import { SearchView } from "@/components/search-view";
import { searchTools } from "@/lib/api";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchTools(query, 24) : [];

  return <SearchView query={query} results={results} />;
}
