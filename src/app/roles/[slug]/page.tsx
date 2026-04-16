import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RolePagePlaceholder } from "@/components/role-page/role-page-placeholder";
import { RolePageShell } from "@/components/role-page/role-page-shell";
import { RolePageTemplate } from "@/components/role-page/role-page-template";
import { getRolePageDetail } from "@/data/role-pages";
import { roles } from "@/data/roles";
import { getCategoriesBySlugs } from "@/lib/api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return roles.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const role = roles.find((r) => r.slug === slug);
  if (!role) return { title: "Role" };
  const detail = getRolePageDetail(slug);
  const desc = detail?.lede ?? role.description;
  return {
    title: `${role.title} — Niubility`,
    description: desc,
  };
}

export default async function RolePage({ params }: PageProps) {
  const { slug } = await params;
  const role = roles.find((r) => r.slug === slug);

  if (!role) {
    notFound();
  }

  const detail = getRolePageDetail(slug);
  const relatedCategories = detail
    ? await getCategoriesBySlugs(detail.relatedCategorySlugs)
    : [];

  return (
    <RolePageShell>
      {detail ? (
        <RolePageTemplate
          roleSlug={slug}
          detail={detail}
          relatedCategories={relatedCategories}
        />
      ) : (
        <RolePagePlaceholder roleSlug={slug} />
      )}
    </RolePageShell>
  );
}
