import { GuidesManager } from "@/components/admin/guides-manager";
import { getAdminGuides } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminGuidesPage() {
  const initialGuides = await getAdminGuides();
  return <GuidesManager initialGuides={initialGuides} />;
}
