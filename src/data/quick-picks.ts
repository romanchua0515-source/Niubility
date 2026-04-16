import type { LucideIcon } from "lucide-react";
import { Briefcase, Microscope, Shield, Sparkles } from "lucide-react";

export type QuickPick = {
  id: string;
  title: string;
  titleZh?: string;
  subtitle: string;
  subtitleZh?: string;
  href: string;
  icon: LucideIcon;
};

export const quickPicks: QuickPick[] = [
  {
    id: "ai-ops",
    title: "Best AI tools for Web3 ops",
    titleZh: "Web3 运营首选 AI 工具",
    subtitle: "Agents, codegen, and chain-aware workflows",
    subtitleZh: "智能体、代码生成与链感知工作流",
    href: "/categories/ai-tools",
    icon: Sparkles,
  },
  {
    id: "jobs",
    title: "Top Web3 job boards",
    titleZh: "热门 Web3 招聘板",
    subtitle: "Protocols, DAOs, and product teams hiring now",
    subtitleZh: "协议、DAO 与产品团队正在招聘",
    href: "/categories/job-boards",
    icon: Briefcase,
  },
  {
    id: "security",
    title: "Security essentials",
    titleZh: "安全必备",
    subtitle: "Audits, monitoring, and safe shipping",
    subtitleZh: "审计、监控与安全交付",
    href: "/categories/security",
    icon: Shield,
  },
  {
    id: "research",
    title: "Research stack",
    titleZh: "研究栈",
    subtitle: "Explorers, data, and diligence",
    subtitleZh: "浏览器、数据与尽调",
    href: "/categories/research",
    icon: Microscope,
  },
];
