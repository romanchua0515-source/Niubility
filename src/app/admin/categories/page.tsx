import { CategoriesManager } from "@/components/admin/categories-manager";
import { getAdminCategoryList } from "@/lib/api";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategoryList();

  return <CategoriesManager initialCategories={categories} />;
}
