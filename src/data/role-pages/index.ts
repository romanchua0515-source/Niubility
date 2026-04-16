import type { RolePageDetail } from "@/types/role-page";
import { bdFoundersPage } from "./bd-founders";
import { designersPage } from "./designers";
import { developersPage } from "./developers";
import { jobSeekersPage } from "./job-seekers";
import { marketersPage } from "./marketers";
import { operatorsPage } from "./operators";
import { researchersPage } from "./researchers";
import { tradersPage } from "./traders";

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
