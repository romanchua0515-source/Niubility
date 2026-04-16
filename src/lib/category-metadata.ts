import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Globe,
  LineChart,
  Newspaper,
  Search,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

/** Explore parent hub slugs → icon (DB has no icon column). */
export const exploreCategoryIcon: Record<string, LucideIcon> = {
  jobs: Briefcase,
  ai: Sparkles,
  "research-insights": LineChart,
  "security-stack": Shield,
  wallets: Globe,
  culture: Newspaper,
};

/** Leaf subcategory slugs → icon */
export const leafCategoryIcon: Record<string, LucideIcon> = {
  browsers: Globe,
  "job-boards": Briefcase,
  "trends-news": LineChart,
  research: Search,
  "ai-tools": Sparkles,
  security: Shield,
  media: Newspaper,
  community: Users,
};

/** Long-form copy for leaf category pages (subcategory name comes from DB). */
export const leafCategoryDescription: Record<string, { en: string; zh: string }> = {
  browsers: {
    en: "Wallets, dApp browsers, and chain-native clients.",
    zh: "钱包、dApp 浏览器与链上客户端。",
  },
  "job-boards": {
    en: "Roles across protocols, DAOs, and crypto teams.",
    zh: "协议、DAO 与加密团队的岗位。",
  },
  "trends-news": {
    en: "Signals, narratives, and what the market is watching.",
    zh: "信号、叙事与市场关注点。",
  },
  research: {
    en: "On-chain data, docs, and diligence workflows.",
    zh: "链上数据、文档与尽调流程。",
  },
  "ai-tools": {
    en: "Models, agents, and assistants for builders.",
    zh: "面向建设者的大模型、智能体与助手。",
  },
  security: {
    en: "Audits, monitoring, and safe-practice tooling.",
    zh: "审计、监控与安全实践工具。",
  },
  media: {
    en: "Podcasts, newsletters, and long-form coverage.",
    zh: "播客、通讯与深度报道。",
  },
  community: {
    en: "Forums, guilds, and places to coordinate.",
    zh: "论坛、公会与协作空间。",
  },
};

/** Explore parent descriptions (not stored in DB schema). */
export const exploreCategoryDescription: Record<
  string,
  { en: string; zh: string }
> = {
  jobs: {
    en: "Hiring boards, recruiters, and career paths across Web3.",
    zh: "招聘平台、猎头与 Web3 职业路径。",
  },
  ai: {
    en: "Models, agents, and builder-facing copilots.",
    zh: "大模型、智能体与面向建设者的助手。",
  },
  "research-insights": {
    en: "On-chain data, narratives, and market signals.",
    zh: "链上数据、叙事与市场信号。",
  },
  "security-stack": {
    en: "Audits, monitoring, and safe shipping.",
    zh: "审计、监控与安全交付。",
  },
  wallets: {
    en: "Clients, signers, and chain-native UX.",
    zh: "客户端、签名器与链上体验。",
  },
  culture: {
    en: "Newsrooms, podcasts, guilds, and coordination.",
    zh: "资讯、播客、公会与协作。",
  },
};

export function getExploreCategoryIcon(slug: string): LucideIcon {
  return exploreCategoryIcon[slug] ?? Globe;
}

export function getLeafCategoryIcon(slug: string): LucideIcon {
  return leafCategoryIcon[slug] ?? Globe;
}
