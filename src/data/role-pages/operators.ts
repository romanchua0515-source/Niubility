import type { RolePageDetail } from "@/types/role-page";

export const operatorsPage: RolePageDetail = {
  slug: "operators",
  lede:
    "This page is for Web3 operations and growth people: the ones running campaigns, coordinating creators and mods, shipping quests, reading dashboards, and keeping Discord and Telegram aligned with product and BD. If your day is execution—launches, analytics, community health, and content—not validators or RPCs, you’re in the right place.",
  ledeZh:
    "本页面向 Web3 运营与增长：负责活动、协调创作者与版主、上线任务、阅读数据看板，并让 Discord、Telegram 与产品与商务保持一致。如果你的日常是执行——上线、分析、社区健康与内容，而不是验证节点或 RPC，你来对地方了。",
  quickStart: [
    {
      label: "Trends & narratives",
      href: "/categories/trends-news",
      hint: "What’s moving",
      labelZh: "趋势与叙事",
      hintZh: "市场动向",
    },
    {
      label: "Media & newsletters",
      href: "/categories/media",
      hint: "Signal & context",
      labelZh: "媒体与通讯",
      hintZh: "信号与背景",
    },
    {
      label: "Community tools",
      href: "/categories/community",
      hint: "Guilds & chat",
      labelZh: "社区工具",
      hintZh: "公会与聊天",
    },
    {
      label: "AI tools",
      href: "/categories/ai-tools",
      hint: "Research & drafts",
      labelZh: "AI 工具",
      hintZh: "研究与草稿",
    },
  ],
  toolGroups: [
    {
      id: "data-analytics",
      title: "Data & analytics",
      titleZh: "数据与分析",
      tools: [
        {
          name: "Similarweb",
          url: "https://www.similarweb.com",
          purpose: "Traffic, referrals, and competitive digital footprint for partners and campaigns.",
          purposeZh:
            "流量、引荐来源与竞品数字足迹，用于合作方与活动评估。",
          tag: "Web intel",
          tagZh: "网站情报",
        },
        {
          name: "SEMrush",
          url: "https://www.semrush.com",
          purpose: "Keyword and content gap research for SEO-led growth and landing pages.",
          purposeZh: "关键词与内容缺口研究，支撑 SEO 增长与落地页。",
          tag: "SEO",
          tagZh: "SEO",
        },
        {
          name: "Dune",
          url: "https://dune.com",
          purpose: "Custom dashboards for on-chain metrics your community and investors actually see.",
          purposeZh:
            "自定义链上指标看板，让社区与投资人真正看到关键数据。",
          tag: "On-chain",
          tagZh: "链上",
        },
        {
          name: "Nansen",
          url: "https://www.nansen.ai",
          purpose: "Wallet labels and smart-money flows for ecosystem and partnership prioritization.",
          purposeZh:
            "钱包标签与聪明钱流向，用于生态与合作优先级判断。",
          tag: "Wallets",
          tagZh: "钱包",
        },
      ],
    },
    {
      id: "campaigns-quests",
      title: "Campaigns & quests",
      titleZh: "活动与任务",
      tools: [
        {
          name: "Galxe",
          url: "https://galxe.com",
          purpose: "Credential-based campaigns, OATs, and multi-chain growth programs.",
          purposeZh:
            "凭证类活动、OAT 与多链增长计划。",
          tag: "Quests",
          tagZh: "任务",
        },
        {
          name: "Zealy",
          url: "https://zealy.io",
          purpose: "Sprint-based quests and leaderboards for Discord- and Twitter-led activation.",
          purposeZh:
            "冲刺式任务与排行榜，适合 Discord / X 驱动的激活。",
          tag: "Sprints",
          tagZh: "冲刺",
        },
        {
          name: "Layer3",
          url: "https://layer3.xyz",
          purpose: "Guided journeys and tasks across chains for education-led acquisition.",
          purposeZh:
            "跨链引导式任务，以教育带增长。",
          tag: "Journeys",
          tagZh: "旅程",
        },
      ],
    },
    {
      id: "community",
      title: "Community management",
      titleZh: "社区管理",
      tools: [
        {
          name: "MEE6",
          url: "https://mee6.xyz",
          purpose: "Roles, leveling, and moderation automation for large Discord servers.",
          purposeZh:
            "大型 Discord 的角色、等级与自动化管理。",
          tag: "Discord",
          tagZh: "Discord",
        },
        {
          name: "Combot",
          url: "https://combot.org",
          purpose: "Telegram analytics, moderation, and anti-spam for public groups.",
          purposeZh:
            "Telegram 群组的分析、管理与反垃圾。",
          tag: "Telegram",
          tagZh: "TG",
        },
        {
          name: "TGStat",
          url: "https://tgstat.com",
          purpose: "Channel growth stats and discovery for Telegram ecosystem work.",
          purposeZh:
            "频道增长数据与发现，服务 Telegram 生态工作。",
          tag: "TG analytics",
          tagZh: "TG 分析",
        },
      ],
    },
    {
      id: "content-monitoring",
      title: "Content & research monitoring",
      titleZh: "内容与舆情监控",
      tools: [
        {
          name: "Notion",
          url: "https://www.notion.so",
          purpose: "Campaign calendars, briefs, and wiki-style coordination with design and BD.",
          purposeZh:
            "活动日历、简报与/wiki 式协作，对接设计与商务。",
          tag: "Wiki",
          tagZh: "知识库",
        },
        {
          name: "Canva",
          url: "https://www.canva.com",
          purpose: "Fast social and event visuals when design is thin and timelines are tight.",
          purposeZh:
            "设计资源紧、时间紧时快速出社交与活动物料。",
          tag: "Creative",
          tagZh: "创意",
        },
        {
          name: "Feedly",
          url: "https://feedly.com",
          purpose: "RSS and newsletter aggregation to track competitors and narratives daily.",
          purposeZh:
            "RSS 与通讯聚合，每日跟踪竞品与叙事。",
          tag: "Feeds",
          tagZh: "订阅",
        },
      ],
    },
    {
      id: "team-coordination",
      title: "Team coordination & execution",
      titleZh: "团队协作与执行",
      tools: [
        {
          name: "Lark",
          url: "https://www.larksuite.com",
          purpose: "Chat + docs + calendar in one stack for distributed squads across time zones.",
          purposeZh:
            "聊天、文档与日历一体，适合跨时区分布式小队。",
          tag: "Suite",
          tagZh: "套件",
        },
        {
          name: "Slack",
          url: "https://slack.com",
          purpose: "Internal war rooms with integrations for alerts, bots, and campaign threads.",
          purposeZh:
            "内部作战室，集成告警、机器人与活动线程。",
          tag: "Chat",
          tagZh: "沟通",
        },
        {
          name: "Linear",
          url: "https://linear.app",
          purpose: "Lightweight issue tracking for launch checklists and cross-functional follow-ups.",
          purposeZh:
            "轻量问题跟踪，适合上线清单与跨职能跟进。",
          tag: "Tasks",
          tagZh: "任务",
        },
      ],
    },
  ],
  reading: [
    {
      title: "a16z — Crypto Canon",
      url: "https://a16z.com/posts/2022/04/crypto-canonical-readings-resources/",
      kind: "Guide",
      note: "Foundational essays for context when your exec team asks “why crypto?” for the tenth time.",
      titleZh: "a16z — Crypto Canon",
      kindZh: "指南",
      noteZh:
        "奠基级文章，适合高管第十次问「为什么要做加密」时给上下文。",
    },
    {
      title: "First Round Review — Growth",
      url: "https://review.firstround.com/growth/",
      kind: "Framework",
      note: "Operator-friendly playbooks on experimentation, retention, and narrative—portable to Web3 GTM.",
      titleZh: "First Round Review — Growth",
      kindZh: "框架",
      noteZh:
        "面向运营的增长手册：实验、留存与叙事，可迁移到 Web3 GTM。",
    },
    {
      title: "Farcaster / protocol docs",
      url: "https://docs.farcaster.xyz",
      kind: "Docs",
      note: "Useful when your growth work touches social graphs and on-chain identity primitives.",
      titleZh: "Farcaster / 协议文档",
      kindZh: "文档",
      noteZh:
        "增长工作涉及社交图谱与链上身份原语时很有用。",
    },
    {
      title: "Web3 Growth subreddit wiki",
      url: "https://www.reddit.com/r/web3growth/",
      kind: "Forum",
      note: "Peer threads on campaigns, tools, and what’s working in the wild.",
      titleZh: "Web3 Growth subreddit wiki",
      kindZh: "论坛",
      noteZh:
        "同行讨论活动、工具与一线有效打法。",
    },
  ],
  learnFrom: [
    {
      name: "Packy McCormick (Not Boring)",
      url: "https://www.notboring.co",
      kind: "Newsletter",
      note: "Long-form essays on strategy and narrative—good mental models for ecosystem storytelling.",
      kindZh: "通讯",
      noteZh:
        "战略与叙事长文，适合做生态叙事的思维模型。",
    },
    {
      name: "Lenny Rachitsky",
      url: "https://www.lennysnewsletter.com",
      kind: "Newsletter",
      note: "Product and growth tactics with interview-style depth; many lessons apply to Web3 ops.",
      kindZh: "通讯",
      noteZh:
        "产品与增长战术，访谈式深度；许多经验适用于 Web3 运营。",
    },
    {
      name: "Variant Fund",
      url: "https://variant.fund",
      kind: "Fund",
      note: "Essays and case studies on crypto consumer and community-led growth.",
      kindZh: "基金",
      noteZh:
        "加密消费者与社区驱动增长的案例与文章。",
    },
    {
      name: "Peter Yang (Creator Economy)",
      url: "https://creatoreconomy.so",
      kind: "Writer",
      note: "Creator and distribution thinking—relevant when your protocol treats devs and KOLs as partners.",
      kindZh: "作者",
      noteZh:
        "创作者与分发视角；当协议把开发者与 KOL 当伙伴时尤其相关。",
    },
    {
      name: "Sari Azout (Substack)",
      url: "https://sari.substack.com",
      kind: "Writer",
      note: "Sharp framing on narrative and attention—useful for campaign and positioning work.",
      kindZh: "作者",
      noteZh:
        "叙事与注意力的高密度框架，适合活动与定位工作。",
    },
  ],
  relatedCategorySlugs: [
    "trends-news",
    "media",
    "community",
    "ai-tools",
  ],
};
