/**
 * Re-export role page detail data for use in app/component files.
 * The rich structured data (tools, reading, learnFrom) lives in static
 * files under src/data/role-pages/. The DB stores a simplified version.
 * Until the admin UI supports editing nested structures, this module
 * bridges the gap.
 */
import type { RolePageDetail } from "@/types/role-page";
import { bdFoundersPage } from "@/data/role-pages/bd-founders";
import { designersPage } from "@/data/role-pages/designers";
import { developersPage } from "@/data/role-pages/developers";
import { jobSeekersPage } from "@/data/role-pages/job-seekers";
import { marketersPage } from "@/data/role-pages/marketers";
import { operatorsPage } from "@/data/role-pages/operators";
import { researchersPage } from "@/data/role-pages/researchers";
import { tradersPage } from "@/data/role-pages/traders";

const bySlug: Record<string, RolePageDetail> = {
  [operatorsPage.slug]: operatorsPage,
  [bdFoundersPage.slug]: bdFoundersPage,
  [researchersPage.slug]: researchersPage,
  [marketersPage.slug]: marketersPage,
  [jobSeekersPage.slug]: jobSeekersPage,
  [developersPage.slug]: developersPage,
  [designersPage.slug]: designersPage,
  [tradersPage.slug]: tradersPage,
};

export function getRolePageDetail(slug: string): RolePageDetail | undefined {
  return bySlug[slug];
}

export function hasRolePageDetail(slug: string): boolean {
  return slug in bySlug;
}
