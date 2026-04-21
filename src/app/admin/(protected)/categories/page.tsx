import { CategoriesManager } from "@/components/admin/categories-manager";
import { getAdminCategoryList } from "@/lib/api";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategoryList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Categories
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Explore hubs (parents), cover art, and leaf subcategories from
          Supabase.
        </p>
      </div>
      <CategoriesManager initialCategories={categories} />
    </div>
  );
}
