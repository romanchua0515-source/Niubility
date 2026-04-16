import type { RolePageDetail } from "@/types/role-page";

export const researchersPage: RolePageDetail = {
  slug: "researchers",
  lede:
    "Web3 researchers turn noise into conviction. The work spans project diligence, tokenomics review, source verification, ecosystem mapping, and thesis support for teams and communities.",
  ledeZh:
    "Web3 研究者把噪音变成判断：工作涵盖项目尽调、代币经济审阅、来源核实、生态图谱，以及为团队与社区提供观点支持。",
  quickStart: [
    {
      label: "Project docs",
      href: "/categories/research",
      hint: "Whitepapers and specs",
      labelZh: "项目文档",
      hintZh: "白皮书与规范",
    },
    {
      label: "Trend signals",
      href: "/categories/trends-news",
      hint: "Narratives and flows",
      labelZh: "趋势信号",
      hintZh: "叙事与资金流",
    },
    {
      label: "Security context",
      href: "/categories/security",
      hint: "Risk and audit posture",
      labelZh: "安全语境",
      hintZh: "风险与审计态势",
    },
    {
      label: "Media baseline",
      href: "/categories/media",
      hint: "Coverage and debate",
      labelZh: "媒体基线",
      hintZh: "报道与讨论",
    },
  ],
  toolGroups: [
    {
      id: "project-discovery",
      title: "Project discovery and ecosystem mapping",
      titleZh: "项目发现与生态图谱",
      tools: [
        {
          name: "DeFiLlama",
          url: "https://defillama.com",
          purpose: "Map protocol categories and growth trajectories across chains.",
          purposeZh:
            "跨链映射协议类别与增长轨迹。",
          tag: "Market map",
          tagZh: "市场图",
        },
        {
          name: "RootData",
          url: "https://www.rootdata.com",
          purpose: "Track project relationships, raises, and ecosystem connections.",
          purposeZh:
            "跟踪项目关系、融资与生态连接。",
          tag: "Graph",
          tagZh: "图谱",
        },
        {
          name: "CryptoRank",
          url: "https://cryptorank.io",
          purpose: "Screen sectors, token events, and comparable project sets.",
          purposeZh:
            "筛选赛道、代币事件与可比项目集。",
          tag: "Scanner",
          tagZh: "筛选",
        },
      ],
    },
    {
      id: "onchain-diligence",
      title: "On-chain diligence",
      titleZh: "链上尽调",
      tools: [
        {
          name: "Dune",
          url: "https://dune.com",
          purpose: "Build custom dashboards for protocol usage and user behavior.",
          purposeZh:
            "自定义看板分析协议使用与用户行为。",
          tag: "SQL",
          tagZh: "SQL",
        },
        {
          name: "Nansen",
          url: "https://www.nansen.ai",
          purpose: "Track smart money wallets and flow patterns by entity type.",
          purposeZh:
            "按实体类型跟踪聪明钱钱包与流模式。",
          tag: "Wallet intel",
          tagZh: "钱包情报",
        },
        {
          name: "Artemis",
          url: "https://www.artemis.xyz",
          purpose: "Compare chain and app metrics in a normalized framework.",
          purposeZh:
            "在统一框架下比较链与应用指标。",
          tag: "Comparables",
          tagZh: "可比",
        },
      ],
    },
    {
      id: "tokenomics-modeling",
      title: "Tokenomics and valuation support",
      titleZh: "代币经济与估值支持",
      tools: [
        {
          name: "Token Terminal",
          url: "https://tokenterminal.com",
          purpose: "Benchmark protocol fundamentals and valuation multiples.",
          purposeZh:
            "对比协议基本面与估值倍数。",
          tag: "Fundamentals",
          tagZh: "基本面",
        },
        {
          name: "Messari",
          url: "https://messari.io",
          purpose: "Reference long-form project profiles and token details.",
          purposeZh:
            "参考长文项目档案与代币细节。",
          tag: "Research DB",
          tagZh: "研究库",
        },
        {
          name: "DefiLlama Raises",
          url: "https://defillama.com/raises",
          purpose: "Add funding context to emissions and runway assumptions.",
          purposeZh:
            "为排放与跑道假设补充融资语境。",
          tag: "Funding",
          tagZh: "融资",
        },
      ],
    },
    {
      id: "source-verification",
      title: "Source verification and monitoring",
      titleZh: "来源核实与监控",
      tools: [
        {
          name: "GitHub",
          url: "https://github.com",
          purpose: "Validate activity cadence, contributors, and release quality.",
          purposeZh:
            "验证活跃度、贡献者与发布质量。",
          tag: "Code",
          tagZh: "代码",
        },
        {
          name: "Kaito",
          url: "https://kaito.ai",
          purpose: "Track who is shaping the narrative around specific projects.",
          purposeZh:
            "跟踪谁在塑造特定项目的叙事。",
          tag: "Mindshare",
          tagZh: "声量",
        },
        {
          name: "Feedly",
          url: "https://feedly.com",
          purpose: "Aggregate publication sources for daily verification loops.",
          purposeZh:
            "聚合信息源以支持每日核实循环。",
          tag: "Monitoring",
          tagZh: "监控",
        },
      ],
    },
    {
      id: "thesis-support",
      title: "Thesis writing and team sharing",
      titleZh: "观点写作与团队共享",
      tools: [
        {
          name: "Notion",
          url: "https://www.notion.so",
          purpose: "Keep thesis docs, diligence checklists, and research notes aligned.",
          purposeZh:
            "统一观点文档、尽调清单与研究笔记。",
          tag: "Workspace",
          tagZh: "工作区",
        },
        {
          name: "Obsidian",
          url: "https://obsidian.md",
          purpose: "Maintain linked notes and long-horizon knowledge graphs.",
          purposeZh:
            "维护双向链接笔记与长期知识图谱。",
          tag: "Knowledge",
          tagZh: "知识",
        },
        {
          name: "Gamma",
          url: "https://gamma.app",
          purpose: "Convert research conclusions into concise brief decks quickly.",
          purposeZh:
            "快速把研究结论变成简短简报稿。",
          tag: "Briefing",
          tagZh: "简报",
        },
      ],
    },
  ],
  reading: [
    {
      title: "Paradigm research",
      url: "https://www.paradigm.xyz/research",
      kind: "Docs",
      note: "Technical and market theses with strong first-principles framing.",
      titleZh: "Paradigm 研究",
      kindZh: "文档",
      noteZh:
        "技术与市场观点，强第一性原理框架。",
    },
    {
      title: "Messari State of Crypto",
      url: "https://messari.io/report",
      kind: "Guide",
      note: "Annual benchmark for sector structure and major narrative shifts.",
      titleZh: "Messari State of Crypto",
      kindZh: "指南",
      noteZh:
        "年度行业结构与重大叙事切换基准。",
    },
    {
      title: "a16z crypto essays",
      url: "https://a16zcrypto.com/posts/",
      kind: "Framework",
      note: "Category frameworks useful for thesis articulation and debate.",
      titleZh: "a16z crypto 文章",
      kindZh: "框架",
      noteZh:
        "有助于观点表达与辩论的赛道框架。",
    },
    {
      title: "Bankless",
      url: "https://www.bankless.com",
      kind: "Case study",
      note: "Accessible but detailed market context for scenario testing.",
      titleZh: "Bankless",
      kindZh: "案例",
      noteZh:
        "易懂但细致的市场语境，便于情景测试。",
    },
    {
      title: "Delphi Digital insights",
      url: "https://www.delphidigital.io/reports",
      kind: "Docs",
      note: "Thematic reports useful for cycle-aware ecosystem mapping.",
      titleZh: "Delphi Digital 洞察",
      kindZh: "文档",
      noteZh:
        "主题报告，适合周期感知的生态映射。",
    },
  ],
  learnFrom: [
    {
      name: "Hasu",
      url: "https://twitter.com/hasufl",
      kind: "Operator",
      note: "Sharp research framing on crypto market structure and protocol risk.",
      kindZh: "运营者",
      noteZh:
        "加密市场结构与协议风险的锐利研究框架。",
    },
    {
      name: "Chris Burniske",
      url: "https://twitter.com/cburniske",
      kind: "Writer",
      note: "Cycle and valuation thinking useful for long-horizon thesis work.",
      kindZh: "作者",
      noteZh:
        "周期与估值思维，适合长期观点工作。",
    },
    {
      name: "Dovey Wan",
      url: "https://twitter.com/DoveyWan",
      kind: "Operator",
      note: "Cross-market perspective connecting narratives and execution realities.",
      kindZh: "运营者",
      noteZh:
        "连接叙事与执行现实的跨市场视角。",
    },
    {
      name: "Messari team",
      url: "https://messari.io/team",
      kind: "Collective",
      note: "Consistent structure for project profiles and sector comparisons.",
      kindZh: "团队",
      noteZh:
        "项目档案与赛道对比的一贯结构。",
    },
    {
      name: "The Defiant",
      url: "https://thedefiant.io",
      kind: "Newsletter",
      note: "Narrative and protocol updates useful for ongoing verification loops.",
      kindZh: "通讯",
      noteZh:
        "叙事与协议更新，支持持续核实循环。",
    },
  ],
  relatedCategorySlugs: ["research", "trends-news", "security", "media"],
};
