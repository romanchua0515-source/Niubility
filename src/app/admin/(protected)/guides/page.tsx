import { GuidesManager } from "@/components/admin/guides-manager";
import { getAdminGuides } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminGuidesPage() {
  const initialGuides = await getAdminGuides();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Guides
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Dynamic blocks (scam prevention, roadmaps, resources, workflows) for
          guide pages.
        </p>
      </div>
      <GuidesManager initialGuides={initialGuides} />
    </div>
  );
}
