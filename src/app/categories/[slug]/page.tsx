import { CategoryDetailPage } from "@/components/category-detail-page";
import { CategoryLevelTwoPage } from "@/components/category-level-two-page";
import {
  getAllCategoryRouteSlugs,
  getExploreCategoryBySlug,
  getLeafCategories,
  getListingsForExploreParent,
  getListingsForLeaf,
} from "@/lib/api";
import { buildBilingualPageMetadata } from "@/lib/seo-metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = `/categories/${slug}`;
  const explore = await getExploreCategoryBySlug(slug);
  if (explore) {
    return buildBilingualPageMetadata({
      path,
      enTitle: `${explore.title} — Niubility`,
      enDescription: explore.description,
      zhTitle: `${explore.titleZh} — Niubility`,
      zhDescription: explore.descriptionZh,
    });
  }
  const leafCategories = await getLeafCategories();
  const category = leafCategories.find((c) => c.slug === slug);
  if (!category) {
    return { title: "Not found" };
  }
  return buildBilingualPageMetadata({
    path,
    enTitle: `${category.title} — Niubility`,
    enDescription: category.description,
    zhTitle: category.titleZh ? `${category.titleZh} — Niubility` : undefined,
    zhDescription: category.descriptionZh ?? undefined,
  });
}

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
