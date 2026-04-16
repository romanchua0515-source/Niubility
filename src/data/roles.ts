import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  CandlestickChart,
  Code2,
  Megaphone,
  Microscope,
  Palette,
  Rocket,
  TrendingUp,
} from "lucide-react";

export type Role = {
  slug: string;
  title: string;
  description: string;
  titleZh?: string;
  descriptionZh?: string;
  icon: LucideIcon;
};

export const roles: Role[] = [
  {
    slug: "operators",
    title: "Operations & growth",
    titleZh: "运营与增长",
    description: "Campaigns, community, analytics.",
    descriptionZh: "活动、社区与分析。",
    icon: TrendingUp,
  },
  {
    slug: "bd-founders",
    title: "BD & Partnerships",
    titleZh: "BD 与商务拓展",
    description: "Deals, KOL, ecosystem growth.",
    descriptionZh: "交易、KOL 与生态增长。",
    icon: Rocket,
  },
  {
    slug: "marketers",
    title: "Marketers",
    titleZh: "市场",
    description: "GTM & community.",
    descriptionZh: "GTM 与社区。",
    icon: Megaphone,
  },
  {
    slug: "researchers",
    title: "Researchers",
    titleZh: "研究",
    description: "Diligence & data.",
    descriptionZh: "尽调与数据。",
    icon: Microscope,
  },
  {
    slug: "traders",
    title: "Traders",
    titleZh: "交易",
    description: "Execution & risk.",
    descriptionZh: "执行与风控。",
    icon: CandlestickChart,
  },
  {
    slug: "developers",
    title: "Developers",
    titleZh: "开发者",
    description: "Contracts & apps.",
    descriptionZh: "合约与应用。",
    icon: Code2,
  },
  {
    slug: "designers",
    title: "Designers",
    titleZh: "设计师",
    description: "Product & UX.",
    descriptionZh: "产品与体验。",
    icon: Palette,
  },
  {
    slug: "job-seekers",
    title: "Job Seekers",
    titleZh: "求职者",
    description: "Roles & interviews.",
    descriptionZh: "岗位与面试。",
    icon: Briefcase,
  },
];
