import { CategoriesListPage } from "@/components/categories-list-page";
import { getCategories } from "@/lib/api";

export default async function CategoriesPage() {
  const exploreCategories = await getCategories();
  return <CategoriesListPage exploreCategories={exploreCategories} />;
}
