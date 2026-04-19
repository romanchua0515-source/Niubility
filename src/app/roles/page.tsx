import { RolesIndexPage } from "@/components/roles-index-page";
import { buildBilingualPageMetadata } from "@/lib/seo-metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return buildBilingualPageMetadata({
    path: "/roles",
    enTitle: "Tools by Role — Niubility",
    enDescription:
      "Find the best Web3 and AI tools for your role — developer, trader, researcher, marketer and more.",
    zhTitle: "按角色找工具 — Niubility",
    zhDescription:
      "按角色筛选 Web3 与 AI 工具：开发者、交易者、研究员、市场与运营等。",
  });
}

export default function RolesRoutePage() {
  return <RolesIndexPage />;
}
