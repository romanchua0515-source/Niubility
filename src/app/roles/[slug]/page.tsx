import { RolePagePlaceholder } from "@/components/role-page/role-page-placeholder";
import { RolePageShell } from "@/components/role-page/role-page-shell";
import { RolePageTemplate } from "@/components/role-page/role-page-template";
import { getCategoriesBySlugs } from "@/lib/api";
import { getRolePageDetail } from "@/lib/role-page-data";
import { roles } from "@/lib/roles";
import {
  buildBilingualPageMetadata,
  truncateMetaDescription,
} from "@/lib/seo-metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
  const enDesc = truncateMetaDescription(detail?.lede ?? role.description);
  const zhRaw =
    detail?.ledeZh ?? role.descriptionZh ?? role.description ?? enDesc;
  const zhDesc = truncateMetaDescription(zhRaw);
  return buildBilingualPageMetadata({
    path: `/roles/${slug}`,
    enTitle: `${role.title} — Niubility`,
    enDescription: enDesc,
    zhTitle: `${role.titleZh ?? role.title} — Niubility`,
    zhDescription: zhDesc,
  });
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
