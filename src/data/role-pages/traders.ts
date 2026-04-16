import type { RolePageDetail } from "@/types/role-page";

export const tradersPage: RolePageDetail = {
  slug: "traders",
  lede:
    "Web3 traders operate across narratives, liquidity, and timing. The role combines market tracking, on-chain signal interpretation, execution tooling, dashboard discipline, and fast information processing for active decision-making.",
  ledeZh:
    "Web3 交易者在叙事、流动性与时机之间运作：结合市场跟踪、链上信号解读、执行工具、看板纪律与快速信息处理以支持主动决策。",
  quickStart: [
    {
      label: "Market headlines",
      href: "/categories/trends-news",
      hint: "Narrative shifts",
      labelZh: "市场头条",
      hintZh: "叙事切换",
    },
    {
      label: "Research tools",
      href: "/categories/research",
      hint: "Data and protocol context",
      labelZh: "研究工具",
      hintZh: "数据与协议背景",
    },
    {
      label: "Security checks",
      href: "/categories/security",
      hint: "Risk baseline",
      labelZh: "安全检查",
      hintZh: "风险基线",
    },
    {
      label: "Media flow",
      href: "/categories/media",
      hint: "Signal and sentiment",
      labelZh: "媒体流",
      hintZh: "信号与情绪",
    },
  ],
  toolGroups: [
    {
      id: "market-overview",
      title: "Market overview and narrative tracking",
      titleZh: "市场概览与叙事跟踪",
      tools: [
        {
          name: "CoinGecko",
          url: "https://www.coingecko.com",
          purpose: "Track broad market moves, categories, and token rotations.",
          purposeZh:
            "跟踪大盘走势、板块与代币轮动。",
          tag: "Overview",
          tagZh: "概览",
        },
        {
          name: "CoinMarketCap",
          url: "https://coinmarketcap.com",
          purpose: "Monitor rankings, listings, and attention shifts.",
          purposeZh:
            "监控排名、上架与注意力变化。",
          tag: "Listings",
          tagZh: "榜单",
        },
        {
          name: "CryptoRank",
          url: "https://cryptorank.io",
          purpose: "Watch unlocks, calendar events, and sector-level activity.",
          purposeZh:
            "关注解锁、日历事件与板块级活动。",
          tag: "Events",
          tagZh: "事件",
        },
      ],
    },
    {
      id: "onchain-signals",
      title: "On-chain and flow signals",
      titleZh: "链上与资金流信号",
      tools: [
        {
          name: "Nansen",
          url: "https://www.nansen.ai",
          purpose: "Follow wallet cohorts and smart money behavior.",
          purposeZh:
            "跟踪钱包分群与聪明钱行为。",
          tag: "Wallets",
          tagZh: "钱包",
        },
        {
          name: "DefiLlama",
          url: "https://defillama.com",
          purpose: "Track TVL and protocol flow changes across ecosystems.",
          purposeZh:
            "跟踪各生态 TVL 与协议资金流变化。",
          tag: "TVL",
          tagZh: "TVL",
        },
        {
          name: "Dune",
          url: "https://dune.com",
          purpose: "Build thesis-specific dashboards and monitor custom signals.",
          purposeZh:
            "搭建针对观点的看板并监控自定义信号。",
          tag: "Dashboards",
          tagZh: "看板",
        },
      ],
    },
    {
      id: "execution-charting",
      title: "Execution and charting",
      titleZh: "执行与图表",
      tools: [
        {
          name: "TradingView",
          url: "https://www.tradingview.com",
          purpose: "Run chart setups, alerts, and multi-timeframe market analysis.",
          purposeZh:
            "图表设置、警报与多周期分析。",
          tag: "Charts",
          tagZh: "图表",
        },
        {
          name: "CoinGlass",
          url: "https://www.coinglass.com",
          purpose: "Monitor liquidation maps, funding, and derivatives pressure points.",
          purposeZh:
            "监控清算地图、资金费率与衍生品压力点。",
          tag: "Derivatives",
          tagZh: "衍生品",
        },
        {
          name: "Tensor",
          url: "https://www.tensor.trade",
          purpose: "Track and execute on NFT market microstructure where relevant.",
          purposeZh:
            "在相关场景跟踪并执行 NFT 市场微观结构。",
          tag: "NFT",
          tagZh: "NFT",
        },
      ],
    },
    {
      id: "info-monitoring",
      title: "Information and sentiment monitoring",
      titleZh: "信息与情绪监控",
      tools: [
        {
          name: "Kaito",
          url: "https://kaito.ai",
          purpose: "Cluster market narratives and identify dominant social voices.",
          purposeZh:
            "聚类市场叙事并识别主导社交声音。",
          tag: "Mindshare",
          tagZh: "声量",
        },
        {
          name: "TGStat",
          url: "https://tgstat.com",
          purpose: "Track Telegram channel momentum and chatter intensity.",
          purposeZh:
            "跟踪 Telegram 频道动能与讨论强度。",
          tag: "Telegram",
          tagZh: "TG",
        },
        {
          name: "Feedly",
          url: "https://feedly.com",
          purpose: "Centralize macro, crypto, and protocol-specific news feeds.",
          purposeZh:
            "集中宏观、加密与协议相关资讯流。",
          tag: "RSS",
          tagZh: "订阅",
        },
      ],
    },
    {
      id: "journal-risk",
      title: "Journal, risk, and decision hygiene",
      titleZh: "日志、风控与决策纪律",
      tools: [
        {
          name: "Notion",
          url: "https://www.notion.so",
          purpose: "Maintain trade journals, thesis updates, and postmortem notes.",
          purposeZh:
            "维护交易日志、观点更新与复盘笔记。",
          tag: "Journal",
          tagZh: "日志",
        },
        {
          name: "Airtable",
          url: "https://airtable.com",
          purpose: "Track setup outcomes and edge quality over time.",
          purposeZh:
            "长期跟踪策略结果与优势质量。",
          tag: "Tracking",
          tagZh: "跟踪",
        },
        {
          name: "Lark",
          url: "https://www.larksuite.com",
          purpose: "Coordinate watchlists and briefings with a trading team.",
          purposeZh:
            "与交易团队协调观察清单与简报。",
          tag: "Team",
          tagZh: "团队",
        },
      ],
    },
  ],
  reading: [
    {
      title: "Arthur Hayes essays",
      url: "https://cryptohayes.medium.com",
      kind: "Guide",
      note: "Macro framing and risk perspectives for crypto market regimes.",
      titleZh: "Arthur Hayes 文章",
      kindZh: "指南",
      noteZh:
        "加密市场阶段的宏观框架与风险视角。",
    },
    {
      title: "Glassnode insights",
      url: "https://insights.glassnode.com",
      kind: "Docs",
      note: "Structured on-chain analysis and signal interpretation.",
      titleZh: "Glassnode 洞察",
      kindZh: "文档",
      noteZh:
        "结构化链上分析与信号解读。",
    },
    {
      title: "Delphi Digital reports",
      url: "https://www.delphidigital.io/reports",
      kind: "Framework",
      note: "Cross-sector research useful for thematic trading setups.",
      titleZh: "Delphi Digital 报告",
      kindZh: "框架",
      noteZh:
        "跨板块研究，适合主题交易搭建。",
    },
    {
      title: "The Block research",
      url: "https://www.theblock.co/research",
      kind: "Case study",
      note: "Market event breakdowns and protocol-specific context.",
      titleZh: "The Block 研究",
      kindZh: "案例",
      noteZh:
        "市场事件拆解与协议语境。",
    },
    {
      title: "r/CryptoCurrency discussions",
      url: "https://www.reddit.com/r/CryptoCurrency/",
      kind: "Forum",
      note: "Sentiment and crowd behavior context, filtered with caution.",
      titleZh: "r/CryptoCurrency 讨论",
      kindZh: "论坛",
      noteZh:
        "情绪与群体行为参考，需谨慎筛选。",
    },
  ],
  learnFrom: [
    {
      name: "Arthur Hayes",
      url: "https://twitter.com/CryptoHayes",
      kind: "Operator",
      note: "Macro and liquidity perspective for cycle-aware trade framing.",
      kindZh: "运营者",
      noteZh:
        "宏观与流动性视角，做周期感知交易框架。",
    },
    {
      name: "Willy Woo",
      url: "https://twitter.com/woonomic",
      kind: "Writer",
      note: "On-chain signal interpretation and longer-horizon market context.",
      kindZh: "作者",
      noteZh:
        "链上信号解读与更长周期市场语境。",
    },
    {
      name: "Hasu",
      url: "https://twitter.com/hasufl",
      kind: "Operator",
      note: "Clear, critical thinking on market structure and risk.",
      kindZh: "运营者",
      noteZh:
        "对市场结构与风险的清晰批判思考。",
    },
    {
      name: "Noah Smith",
      url: "https://www.noahpinion.blog",
      kind: "Newsletter",
      note: "Macro context that helps frame risk-on and risk-off cycles.",
      kindZh: "通讯",
      noteZh:
        "帮助框定风险偏好周期的宏观语境。",
    },
    {
      name: "Delphi Digital",
      url: "https://www.delphidigital.io",
      kind: "Collective",
      note: "Consistent research framing for narratives and sector rotation.",
      kindZh: "团队",
      noteZh:
        "叙事与板块轮动的一贯研究框架。",
    },
  ],
  relatedCategorySlugs: ["trends-news", "research", "media", "security"],
};
