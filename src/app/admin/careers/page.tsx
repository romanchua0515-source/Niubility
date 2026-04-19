import { CareersManager } from "@/components/admin/careers-manager";
import { getAdminJobCareers } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminCareersPage() {
  const initialCareers = await getAdminJobCareers();
  return <CareersManager initialCareers={initialCareers} />;
}
