import { SignalsManager } from "@/components/admin/signals-manager";
import { getAdminSignals } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminSignalsPage() {
  const initialSignals = await getAdminSignals();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Signals
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Weekly signals shown on the homepage and /signals page.
        </p>
      </div>
      <SignalsManager initialSignals={initialSignals} />
    </div>
  );
}
