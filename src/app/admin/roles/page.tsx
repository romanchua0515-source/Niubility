import { RolesManager } from "@/components/admin/roles-manager";
import { getAdminRolePageSections } from "@/lib/api";

export const dynamic = "force-dynamic";

const ROLE_SLUGS = [
  "traders",
  "developers",
  "marketers",
  "researchers",
  "designers",
  "bd-founders",
  "operators",
  "job-seekers",
] as const;

type SearchParams = Promise<{ role?: string }>;

export default async function AdminRolesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const selected =
    params.role && ROLE_SLUGS.includes(params.role as (typeof ROLE_SLUGS)[number])
      ? params.role
      : ROLE_SLUGS[0];

  const sections = await getAdminRolePageSections(selected);

  return (
    <RolesManager
      roleSlugs={[...ROLE_SLUGS]}
      selectedSlug={selected}
      initialSections={sections}
    />
  );
}
