import { notFound } from "next/navigation";
import { CategoryDetailPage } from "@/components/category-detail-page";
import { CategoryLevelTwoPage } from "@/components/category-level-two-page";
import {
  getAllCategoryRouteSlugs,
  getExploreCategoryBySlug,
  getLeafCategories,
  getListingsForExploreParent,
  getListingsForLeaf,
} from "@/lib/api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllCategoryRouteSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const explore = await getExploreCategoryBySlug(slug);
  if (explore) {
    const listings = await getListingsForExploreParent(slug);
    return (
      <CategoryLevelTwoPage slug={slug} group={explore} listings={listings} />
    );
  }

  const leafCategories = await getLeafCategories();
  const category = leafCategories.find((c) => c.slug === slug);
  if (!category) {
    notFound();
  }

  const listings = await getListingsForLeaf(slug);

  return (
    <CategoryDetailPage
      slug={slug}
      allListings={listings}
      category={category}
    />
  );
}
