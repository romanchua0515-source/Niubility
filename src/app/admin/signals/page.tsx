import { SignalsManager } from "@/components/admin/signals-manager";
import { getAdminSignals } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminSignalsPage() {
  const initialSignals = await getAdminSignals();
  return <SignalsManager initialSignals={initialSignals} />;
}
