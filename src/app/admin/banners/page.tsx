import { BannersConsole } from "@/components/admin/banners-console";
import { getTools } from "@/lib/api";

export default async function AdminBannersPage() {
  const listings = await getTools();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Banners & ads
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Featured homepage carousel: pick directory tools, publish sponsored
          banners with image upload, and control carousel order.
        </p>
      </div>
      <BannersConsole initialListings={listings} />
    </div>
  );
}
