import { SignalsPage } from "@/components/signals-page";
import { getSignals, type Signal } from "@/lib/api";
import {
  buildBilingualPageMetadata,
  truncateMetaDescription,
} from "@/lib/seo-metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const signals = await getSignals().catch(() => [] as Signal[]);
  const count = signals.length;
  const base =
    "Curated Web3 and AI topics, tools and resources tracked this week by the Niubility team.";
  const enDescription =
    count > 0
      ? truncateMetaDescription(`${base} ${count} picks this week.`)
      : truncateMetaDescription(base);
  const zhDescription =
    count > 0
      ? truncateMetaDescription(
          `Niubility 团队本周精选的 Web3 与 AI 主题、工具与资源，共 ${count} 条。`,
        )
      : truncateMetaDescription(
          "Niubility 团队本周精选的 Web3 与 AI 主题、工具与资源。",
        );
  return buildBilingualPageMetadata({
    path: "/signals",
    enTitle: "Signals — Niubility",
    enDescription,
    zhTitle: "Signals 信号 — Niubility",
    zhDescription,
  });
}

export default async function SignalsPageRoute() {
  const signals = await getSignals().catch(() => [] as Signal[]);
  return <SignalsPage signals={signals} />;
}
