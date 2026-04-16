import type { RolePageDetail } from "@/types/role-page";

export const bdFoundersPage: RolePageDetail = {
  slug: "bd-founders",
  lede:
    "Web3 BD is relationship execution at market speed: finding aligned protocols, building KOL and media loops, evaluating listing quality, coordinating co-marketing, and keeping follow-through tight after intros. This page is a practical navigation board for partnership operators, not enterprise SDR playbooks.",
  ledeZh:
    "Web3 BD 是在市场速度下做关系执行：寻找契合的协议、搭建 KOL 与媒体闭环、评估上币质量、协调联合增长，并在引荐后把跟进做扎实。本页是面向合作运营者的实务导航，而非传统企业 SDR 话术。",
  quickStart: [
    {
      label: "Market map",
      href: "/categories/research",
      hint: "Protocols and categories",
      labelZh: "市场图谱",
      hintZh: "协议与赛道",
    },
    {
      label: "Trend feeds",
      href: "/categories/trends-news",
      hint: "Narratives and launches",
      labelZh: "趋势资讯",
      hintZh: "叙事与上新",
    },
    {
      label: "Media channels",
      href: "/categories/media",
      hint: "Coverage targets",
      labelZh: "媒体渠道",
      hintZh: "报道目标",
    },
    {
      label: "Community surfaces",
      href: "/categories/community",
      hint: "TG and Discord signal",
      labelZh: "社区触点",
      hintZh: "TG 与 Discord 信号",
    },
  ],
  toolGroups: [
    {
      id: "partner-discovery",
      title: "Partner discovery",
      titleZh: "伙伴发现",
      tools: [
        {
          name: "DeFiLlama",
          url: "https://defillama.com",
          purpose:
            "Map protocols by TVL, chain footprint, and momentum to find high-fit partners.",
          purposeZh:
            "按 TVL、链足迹与动能映射协议，寻找高匹配伙伴。",
          tag: "Market map",
          tagZh: "市场图",
        },
        {
          name: "CryptoRank",
          url: "https://cryptorank.io",
          purpose:
            "Track token events, categories, and ecosystems when building partner pipelines.",
          purposeZh:
            "搭建伙伴管道时跟踪代币事件、赛道与生态。",
          tag: "Ecosystem",
          tagZh: "生态",
        },
        {
          name: "RootData",
          url: "https://www.rootdata.com",
          purpose:
            "Explore project and funding relationships for warm intros and partner context.",
          purposeZh:
            "探索项目与融资关系，支持暖场引荐与合作语境。",
          tag: "Relationship graph",
          tagZh: "关系图",
        },
        {
          name: "CoinGecko",
          url: "https://www.coingecko.com",
          purpose:
            "Validate market relevance and comparable projects before outreach.",
          purposeZh:
            "外联前验证市场相关性与可比项目。",
          tag: "Market intel",
          tagZh: "市场情报",
        },
      ],
    },
    {
      id: "kol-media-research",
      title: "KOL / media research",
      titleZh: "KOL / 媒体研究",
      tools: [
        {
          name: "Kaito",
          url: "https://kaito.ai",
          purpose:
            "Find key voices and narrative clusters across crypto social channels.",
          purposeZh:
            "在加密社交渠道发现关键声音与叙事聚类。",
          tag: "Mindshare",
          tagZh: "声量",
        },
        {
          name: "TGStat",
          url: "https://tgstat.com",
          purpose:
            "Evaluate Telegram channels and communities before KOL or media collaboration.",
          purposeZh:
            "在 KOL 或媒体合作前评估 Telegram 频道与社区。",
          tag: "Telegram",
          tagZh: "TG",
        },
        {
          name: "Similarweb",
          url: "https://www.similarweb.com",
          purpose:
            "Check traffic quality and referral patterns for media and partner properties.",
          purposeZh:
            "检查媒体与伙伴资产的流量质量与引荐模式。",
          tag: "Traffic",
          tagZh: "流量",
        },
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com",
          purpose:
            "Map roles and decision-makers for outreach targeting and follow-up.",
          purposeZh:
            "梳理角色与决策人以支持触达与跟进。",
          tag: "Contacts",
          tagZh: "联系人",
        },
      ],
    },
    {
      id: "outreach-crm",
      title: "Outreach & relationship tracking",
      titleZh: "外联与关系跟踪",
      tools: [
        {
          name: "HubSpot",
          url: "https://www.hubspot.com",
          purpose:
            "Track partner stages, owners, and follow-up cadence across your pipeline.",
          purposeZh:
            "跟踪伙伴阶段、负责人与整条管道的跟进节奏。",
          tag: "CRM",
          tagZh: "CRM",
        },
        {
          name: "Airtable",
          url: "https://airtable.com",
          purpose:
            "Build lightweight partner trackers with custom views for launches and status.",
          purposeZh:
            "搭建轻量伙伴跟踪表，自定义上线与状态视图。",
          tag: "Tracker",
          tagZh: "跟踪",
        },
        {
          name: "Notion",
          url: "https://www.notion.so",
          purpose:
            "Keep partner briefs, call notes, and co-marketing plans in one workspace.",
          purposeZh:
            "在同一工作区保存伙伴简报、通话记录与联合营销计划。",
          tag: "Workspace",
          tagZh: "工作区",
        },
      ],
    },
    {
      id: "listing-evaluation",
      title: "Listing / project evaluation",
      titleZh: "上币 / 项目评估",
      tools: [
        {
          name: "CoinMarketCap",
          url: "https://coinmarketcap.com",
          purpose:
            "Benchmark listing exposure, category placement, and competitor visibility.",
          purposeZh:
            "对比上币曝光、赛道位置与竞品可见度。",
          tag: "Listings",
          tagZh: "榜单",
        },
        {
          name: "CoinGecko Terminal",
          url: "https://www.geckoterminal.com",
          purpose:
            "Check liquidity depth and pair behavior before exchange or partner discussions.",
          purposeZh:
            "在交易所或伙伴讨论前检查流动性深度与交易对行为。",
          tag: "Liquidity",
          tagZh: "流动性",
        },
        {
          name: "DefiLlama Raises",
          url: "https://defillama.com/raises",
          purpose:
            "Review fundraising context when assessing collaboration durability.",
          purposeZh:
            "评估合作可持续性时回顾融资背景。",
          tag: "Due diligence",
          tagZh: "尽调",
        },
      ],
    },
    {
      id: "decks-proposals-coordination",
      title: "Decks / proposals / coordination",
      titleZh: "演示稿 / 提案 / 协调",
      tools: [
        {
          name: "Gamma",
          url: "https://gamma.app",
          purpose:
            "Ship proposal decks quickly for partner and exchange conversations.",
          purposeZh:
            "快速产出伙伴与交易所对话用的提案稿。",
          tag: "Decks",
          tagZh: "演示",
        },
        {
          name: "Canva",
          url: "https://www.canva.com",
          purpose:
            "Create campaign visuals and one-pagers for co-marketing packages.",
          purposeZh:
            "为联合营销包制作活动视觉与单页介绍。",
          tag: "Creative",
          tagZh: "创意",
        },
        {
          name: "Figma",
          url: "https://www.figma.com",
          purpose:
            "Collaborate on partner landing pages and campaign assets with design.",
          purposeZh:
            "与设计协作完成伙伴落地页与活动素材。",
          tag: "Design",
          tagZh: "设计",
        },
        {
          name: "Lark",
          url: "https://www.larksuite.com",
          purpose:
            "Coordinate launch timelines, owners, and updates across distributed teams.",
          purposeZh:
            "跨分布式团队协调上线时间线、负责人与更新。",
          tag: "Execution",
          tagZh: "执行",
        },
      ],
    },
  ],
  reading: [
    {
      title: "Lenny's Newsletter - Growth archives",
      url: "https://www.lennysnewsletter.com",
      kind: "Newsletter",
      note:
        "Durable lessons on distribution, partnerships, and team execution that port to Web3.",
      titleZh: "Lenny's Newsletter — 增长归档",
      kindZh: "通讯",
      noteZh:
        "分发、伙伴关系与团队执行的持久经验，可迁移到 Web3。",
    },
    {
      title: "a16z crypto essays",
      url: "https://a16zcrypto.com/posts/",
      kind: "Guide",
      note:
        "Category-level framing useful for partner narratives and ecosystem positioning.",
      titleZh: "a16z crypto 文章",
      kindZh: "指南",
      noteZh:
        "赛道级叙事框架，利于伙伴故事与生态定位。",
    },
    {
      title: "Alliance DAO playbooks",
      url: "https://alliance.xyz/blog",
      kind: "Framework",
      note:
        "Operator-oriented guidance on GTM and ecosystem growth for crypto projects.",
      titleZh: "Alliance DAO 手册",
      kindZh: "框架",
      noteZh:
        "面向加密项目 GTM 与生态增长的运营向指南。",
    },
    {
      title: "Messari research hub",
      url: "https://messari.io/research",
      kind: "Docs",
      note:
        "Reference-grade protocol and sector breakdowns for partner qualification calls.",
      titleZh: "Messari 研究中心",
      kindZh: "文档",
      noteZh:
        "协议与赛道拆解，可作伙伴资格电话的参考级材料。",
    },
    {
      title: "Bankless strategy episodes",
      url: "https://www.bankless.com",
      kind: "Case study",
      note:
        "Macro and narrative context that helps time announcements and collaborations.",
      titleZh: "Bankless 策略节目",
      kindZh: "案例",
      noteZh:
        "宏观与叙事语境，帮助把握公告与合作时机。",
    },
  ],
  learnFrom: [
    {
      name: "Jason Choi",
      url: "https://twitter.com/jasonchoiim",
      kind: "Operator",
      note:
        "Clear lenses on narrative, positioning, and ecosystem-level relationship strategy.",
      kindZh: "运营者",
      noteZh:
        "叙事、定位与生态级关系策略的清晰视角。",
    },
    {
      name: "Li Jin",
      url: "https://li.substack.com",
      kind: "Writer",
      note:
        "Creator and network-effect frameworks that translate well to KOL and community partnerships.",
      kindZh: "作者",
      noteZh:
        "创作者与网络效应框架，可迁移到 KOL 与社区合作。",
    },
    {
      name: "Packy McCormick",
      url: "https://www.notboring.co",
      kind: "Newsletter",
      note:
        "Deep company and category analyses useful for partner due diligence and story alignment.",
      kindZh: "通讯",
      noteZh:
        "公司与赛道深度分析，利于伙伴尽调与故事对齐。",
    },
    {
      name: "Variant",
      url: "https://variant.fund/articles",
      kind: "Fund",
      note:
        "Investor and ecosystem essays with practical distribution and ownership insights.",
      kindZh: "基金",
      noteZh:
        "投资人与生态文章，含分发与所有权洞察。",
    },
    {
      name: "Ari Paul",
      url: "https://twitter.com/AriDavidPaul",
      kind: "Operator",
      note:
        "Market-structure perspective useful when prioritizing projects and narratives to partner with.",
      kindZh: "运营者",
      noteZh:
        "市场结构视角，帮助优先排序合作对象与叙事。",
    },
  ],
  relatedCategorySlugs: ["research", "trends-news", "media", "community"],
};
