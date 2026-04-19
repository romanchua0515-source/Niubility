import { Web3JobsGuidePage } from "@/components/guide/web3-jobs-guide-page";
import {
  getFeaturedPeople,
  getGuidesByCategory,
  type Guide,
  type Person,
} from "@/lib/api";
import { buildBilingualPageMetadata } from "@/lib/seo-metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return buildBilingualPageMetadata({
    path: "/guide/web3-jobs",
    enTitle: "Web3 Jobs Guide — Niubility",
    enDescription:
      "Complete guide to landing your first Web3 job. Job boards, who to follow, scam prevention, and entry roadmap.",
    zhTitle: "Web3 求职完整指南 — Niubility",
    zhDescription:
      "Web3 入行完整攻略：招聘平台、值得关注的人、防骗指南和入行路线图。",
  });
}

export default async function Web3JobsGuideRoute() {
  const [peopleRaw, scamGuides] = await Promise.all([
    getFeaturedPeople().catch(() => [] as Person[]),
    getGuidesByCategory("web3-jobs", "scam-prevention").catch(
      () => [] as Guide[],
    ),
  ]);

  const people = peopleRaw.filter(
    (p) => p.role === "Recruiter" || p.role === "Job Board",
  );

  return <Web3JobsGuidePage people={people} scamGuides={scamGuides} />;
}
