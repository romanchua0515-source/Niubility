import { PeopleManager } from "@/components/admin/people-manager";
import { getAdminPeople } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminPeoplePage() {
  const initialPeople = await getAdminPeople();
  return <PeopleManager initialPeople={initialPeople} />;
}
