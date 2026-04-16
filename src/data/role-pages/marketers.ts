import type { RolePageDetail } from "@/types/role-page";

export const marketersPage: RolePageDetail = {
  slug: "marketers",
  lede:
    "Web3 marketers run narrative execution in public: campaigns, social and content cadence, KOL collaboration, community amplification, and conversion support tied to product milestones.",
  ledeZh:
    "Web3 市场同学在公开场合做叙事执行：活动、社交与内容节奏、KOL 协作、社区放大，以及与产品里程碑绑定的转化支持。",
  quickStart: [
    {
      label: "Campaign tools",
      href: "/categories/ai-tools",
      hint: "Drafting and production",
      labelZh: "活动工具",
      hintZh: "起草与制作",
    },
    {
      label: "Trend radar",
      href: "/categories/trends-news",
      hint: "Narratives and timing",
      labelZh: "趋势雷达",
      hintZh: "叙事与时机",
    },
    {
      label: "Media watch",
      href: "/categories/media",
      hint: "Stories and angles",
      labelZh: "媒体观察",
      hintZh: "报道与角度",
    },
    {
      label: "Community channels",
      href: "/categories/community",
      hint: "Amplification surfaces",
      labelZh: "社区渠道",
      hintZh: "放大触点",
    },
  ],
  toolGroups: [
    {
      id: "campaign-planning",
      title: "Campaign planning and launch sequencing",
      titleZh: "活动策划与上线节奏",
      tools: [
        {
          name: "Notion",
          url: "https://www.notion.so",
          purpose: "Run campaign calendars, launch briefs, and owner checklists.",
          purposeZh:
            "管理活动日历、上线简报与负责人清单。",
          tag: "Planning",
          tagZh: "规划",
        },
        {
          name: "Airtable",
          url: "https://airtable.com",
          purpose: "Track campaign states and creative assets in one grid.",
          purposeZh:
            "在一个表格里跟踪活动状态与创意资产。",
          tag: "Tracker",
          tagZh: "跟踪",
        },
        {
          name: "Lark",
          url: "https://www.larksuite.com",
          purpose: "Coordinate distributed launch updates across functions.",
          purposeZh:
            "跨职能协调分布式上线更新。",
          tag: "Execution",
          tagZh: "执行",
        },
      ],
    },
    {
      id: "content-social",
      title: "Social and content execution",
      titleZh: "社交与内容执行",
      tools: [
        {
          name: "Canva",
          url: "https://www.canva.com",
          purpose: "Produce social creatives quickly for high-frequency posting.",
          purposeZh:
            "高频发帖所需的快速社交物料。",
          tag: "Creative",
          tagZh: "创意",
        },
        {
          name: "Figma",
          url: "https://www.figma.com",
          purpose: "Collaborate on campaign visuals and landing-page systems.",
          purposeZh:
            "协作完成活动视觉与落地页体系。",
          tag: "Design",
          tagZh: "设计",
        },
        {
          name: "Typefully",
          url: "https://typefully.com",
          purpose: "Draft and schedule structured social threads.",
          purposeZh:
            "起草并排期结构化社交串文。",
          tag: "Publishing",
          tagZh: "发布",
        },
      ],
    },
    {
      id: "kol-coordination",
      title: "KOL coordination and partner amplification",
      titleZh: "KOL 协调与伙伴放大",
      tools: [
        {
          name: "Kaito",
          url: "https://kaito.ai",
          purpose: "Identify influential voices and mindshare clusters by narrative.",
          purposeZh:
            "按叙事识别影响力声音与声量聚类。",
          tag: "Mindshare",
          tagZh: "声量",
        },
        {
          name: "TGStat",
          url: "https://tgstat.com",
          purpose: "Assess Telegram channel fit before paid or organic pushes.",
          purposeZh:
            "在付费或自然推送前评估 Telegram 频道匹配度。",
          tag: "Telegram",
          tagZh: "TG",
        },
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com",
          purpose: "Map creator, media, and partner contacts for outreach.",
          purposeZh:
            "梳理创作者、媒体与伙伴联系人以便外联。",
          tag: "Network",
          tagZh: "人脉",
        },
      ],
    },
    {
      id: "community-amplification",
      title: "Community amplification",
      titleZh: "社区放大",
      tools: [
        {
          name: "Galxe",
          url: "https://galxe.com",
          purpose: "Run reward-based activations with verifiable participation.",
          purposeZh:
            "基于激励的活动与可验证参与。",
          tag: "Quests",
          tagZh: "任务",
        },
        {
          name: "Zealy",
          url: "https://zealy.io",
          purpose: "Launch mission ladders and leaderboard-based engagement.",
          purposeZh:
            "上线任务阶梯与排行榜互动。",
          tag: "Missions",
          tagZh: "任务",
        },
        {
          name: "MEE6",
          url: "https://mee6.xyz",
          purpose: "Automate Discord roles and engagement loops at scale.",
          purposeZh:
            "大规模自动化 Discord 角色与互动闭环。",
          tag: "Discord",
          tagZh: "Discord",
        },
      ],
    },
    {
      id: "measurement-conversion",
      title: "Measurement and conversion support",
      titleZh: "度量与转化支持",
      tools: [
        {
          name: "Dune",
          url: "https://dune.com",
          purpose: "Track on-chain outcomes tied to campaign windows.",
          purposeZh:
            "跟踪与活动窗口相关的链上结果。",
          tag: "On-chain",
          tagZh: "链上",
        },
        {
          name: "Similarweb",
          url: "https://www.similarweb.com",
          purpose: "Measure web traffic quality and referral channel lift.",
          purposeZh:
            "衡量网站流量质量与引荐渠道提升。",
          tag: "Traffic",
          tagZh: "流量",
        },
        {
          name: "SEMrush",
          url: "https://www.semrush.com",
          purpose: "Monitor search demand and content opportunity over time.",
          purposeZh:
            "长期监控搜索需求与内容机会。",
          tag: "SEO",
          tagZh: "SEO",
        },
      ],
    },
  ],
  reading: [
    {
      title: "Lenny's Newsletter",
      url: "https://www.lennysnewsletter.com",
      kind: "Newsletter",
      note: "Practical growth execution frameworks adaptable to crypto contexts.",
      titleZh: "Lenny's Newsletter",
      kindZh: "通讯",
      noteZh:
        "可迁移到加密语境的实务增长框架。",
    },
    {
      title: "Demand Curve Library",
      url: "https://www.demandcurve.com/library",
      kind: "Framework",
      note: "Channel and messaging playbooks useful for campaign design.",
      titleZh: "Demand Curve 资料库",
      kindZh: "框架",
      noteZh:
        "用于活动设计的渠道与信息手册。",
    },
    {
      title: "a16z crypto consumer",
      url: "https://a16zcrypto.com/posts/",
      kind: "Guide",
      note: "Consumer crypto positioning insights for market-facing messaging.",
      titleZh: "a16z crypto 消费者",
      kindZh: "指南",
      noteZh:
        "面向用户沟通的消费级加密定位洞察。",
    },
    {
      title: "State of Marketing in Web3",
      url: "https://www.web3marketing.xyz",
      kind: "Case study",
      note: "Examples and lessons from live campaign execution.",
      titleZh: "Web3 营销现状",
      kindZh: "案例",
      noteZh:
        "一线活动执行的案例与教训。",
    },
    {
      title: "Bankless newsletter",
      url: "https://newsletter.banklesshq.com",
      kind: "Newsletter",
      note: "Narrative timing and ecosystem context for campaign planning.",
      titleZh: "Bankless 通讯",
      kindZh: "通讯",
      noteZh:
        "活动策划所需的叙事时机与生态语境。",
    },
  ],
  learnFrom: [
    {
      name: "Katelyn Bourgoin",
      url: "https://www.katelynbourgoin.com",
      kind: "Writer",
      note: "Clear messaging and psychology frameworks for conversion-oriented copy.",
      kindZh: "作者",
      noteZh:
        "清晰的信息与心理学框架，服务转化导向文案。",
    },
    {
      name: "Lenny Rachitsky",
      url: "https://www.lennysnewsletter.com",
      kind: "Newsletter",
      note: "Operator interviews with repeatable growth systems.",
      kindZh: "通讯",
      noteZh:
        "与运营者对话，提炼可复用增长系统。",
    },
    {
      name: "Packy McCormick",
      url: "https://www.notboring.co",
      kind: "Newsletter",
      note: "Narrative construction lessons for category and product storytelling.",
      kindZh: "通讯",
      noteZh:
        "品类与产品叙事的构建方法。",
    },
    {
      name: "Li Jin",
      url: "https://li.substack.com",
      kind: "Writer",
      note: "Creator and community economy frameworks relevant to Web3 distribution.",
      kindZh: "作者",
      noteZh:
        "创作者与社区经济框架，适用于 Web3 分发。",
    },
    {
      name: "Jess Sloss",
      url: "https://twitter.com/thattallguy",
      kind: "Operator",
      note: "Practical thinking on community and ecosystem-level growth loops.",
      kindZh: "运营者",
      noteZh:
        "社区与生态级增长闭环的务实思考。",
    },
  ],
  relatedCategorySlugs: ["trends-news", "media", "community", "ai-tools"],
};
