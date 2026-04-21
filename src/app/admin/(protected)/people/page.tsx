import { PeopleManager } from "@/components/admin/people-manager";
import { getAdminPeople } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminPeoplePage() {
  const initialPeople = await getAdminPeople();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          People
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Recruiters, traders, researchers and other folks worth following.
        </p>
      </div>
      <PeopleManager initialPeople={initialPeople} />
    </div>
  );
}
