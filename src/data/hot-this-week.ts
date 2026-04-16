export type HotItem = {
  id: string;
  title: string;
  titleZh?: string;
  context: string;
  contextZh?: string;
  kind: "Topic" | "Tool" | "Resource";
};

export const hotThisWeek: HotItem[] = [
  {
    id: "1",
    title: "Intent-based routing & account abstraction",
    titleZh: "意图路由与账户抽象",
    context: "Teams shipping gasless flows and chain-abstracted UX.",
    contextZh: "团队正在交付免 gas 流程与链抽象体验。",
    kind: "Topic",
  },
  {
    id: "2",
    title: "On-chain agent frameworks",
    titleZh: "链上智能体框架",
    context: "Tooling that ties wallets, policies, and LLM orchestration.",
    contextZh: "连接钱包、策略与大模型编排的工具链。",
    kind: "Topic",
  },
  {
    id: "3",
    title: "Block explorers & data APIs",
    titleZh: "区块浏览器与数据 API",
    context: "Unified views across L2s and app-specific rollups.",
    contextZh: "跨 L2 与应用型 Rollup 的统一视图。",
    kind: "Tool",
  },
  {
    id: "4",
    title: "Security monitoring & runtime checks",
    titleZh: "安全监控与运行时检查",
    context: "From audits to live anomaly detection for contracts.",
    contextZh: "从审计到合约的实时异常检测。",
    kind: "Resource",
  },
  {
    id: "5",
    title: "Crypto-native hiring boards",
    titleZh: "加密原生招聘板",
    context: "Curated roles for engineers, operators, and growth.",
    contextZh: "为工程、运营与增长精选的岗位。",
    kind: "Resource",
  },
];
