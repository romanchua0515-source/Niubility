import { ToolsManager } from "@/components/admin/tools-manager";
import { getTools } from "@/lib/api";

export default async function AdminToolsPage() {
  const tools = await getTools();

  return <ToolsManager initialTools={tools} />;
}

