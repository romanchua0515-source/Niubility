import { CareersManager } from "@/components/admin/careers-manager";
import { getAdminJobCareers } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminCareersPage() {
  const initialCareers = await getAdminJobCareers();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Careers
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Web3 careers resources and hiring links.
        </p>
      </div>
      <CareersManager initialCareers={initialCareers} />
    </div>
  );
}
