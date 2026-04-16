import { BannersConsole } from "@/components/admin/banners-console";
import { getTools } from "@/lib/api";

export default async function AdminBannersPage() {
  const listings = await getTools();

  return <BannersConsole initialListings={listings} />;
}
