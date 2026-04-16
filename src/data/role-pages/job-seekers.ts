import type { RolePageDetail } from "@/types/role-page";

export const jobSeekersPage: RolePageDetail = {
  slug: "job-seekers",
  lede:
    "Web3 job seekers need a repeatable search system: find strong teams, track openings, tailor applications, build visible proof of work, and prepare for role-specific interviews.",
  ledeZh:
    "Web3 求职者需要可重复的搜索体系：找到靠谱团队、跟踪岗位、定制申请、积累可展示的 proof of work，并针对岗位准备面试。",
  quickStart: [
    {
      label: "Job boards",
      href: "/categories/job-boards",
      hint: "Active roles",
      labelZh: "招聘板",
      hintZh: "在招岗位",
    },
    {
      label: "Research projects",
      href: "/categories/research",
      hint: "Team quality",
      labelZh: "项目研究",
      hintZh: "团队质量",
    },
    {
      label: "Media context",
      href: "/categories/media",
      hint: "Who is shipping",
      labelZh: "媒体脉络",
      hintZh: "谁在交付",
    },
    {
      label: "Community channels",
      href: "/categories/community",
      hint: "Warm intro paths",
      labelZh: "社区渠道",
      hintZh: "内推路径",
    },
  ],
  toolGroups: [
    {
      id: "role-discovery",
      title: "Role discovery and tracking",
      titleZh: "岗位发现与跟踪",
      tools: [
        {
          name: "CryptoJobsList",
          url: "https://cryptojobslist.com",
          purpose: "Scan current openings across product, growth, ops, and engineering.",
          purposeZh:
            "浏览产品、增长、运营与工程等方向的最新在招岗位。",
          tag: "Board",
          tagZh: "招聘板",
        },
        {
          name: "Web3.career",
          url: "https://web3.career",
          purpose: "Filter by role, stack, compensation, and remote preference.",
          purposeZh:
            "按岗位、技术栈、薪资与远程偏好筛选。",
          tag: "Board",
          tagZh: "招聘板",
        },
        {
          name: "LinkedIn Jobs",
          url: "https://www.linkedin.com/jobs",
          purpose: "Track company updates and hiring signals in one place.",
          purposeZh:
            "在一处跟踪公司动态与招聘信号。",
          tag: "Discovery",
          tagZh: "发现",
        },
      ],
    },
    {
      id: "company-diligence",
      title: "Company and project diligence",
      titleZh: "公司与项目尽调",
      tools: [
        {
          name: "DeFiLlama",
          url: "https://defillama.com",
          purpose: "Check protocol traction and category standing before applying.",
          purposeZh:
            "投递前查看协议体量与赛道位置。",
          tag: "Traction",
          tagZh: "体量",
        },
        {
          name: "Messari",
          url: "https://messari.io",
          purpose: "Review project profiles and ecosystem context quickly.",
          purposeZh:
            "快速阅读项目档案与生态背景。",
          tag: "Research",
          tagZh: "研究",
        },
        {
          name: "RootData",
          url: "https://www.rootdata.com",
          purpose: "See funding and relationship networks around target teams.",
          purposeZh:
            "查看目标团队周围的融资与人脉网络。",
          tag: "Funding",
          tagZh: "融资",
        },
      ],
    },
    {
      id: "application-materials",
      title: "Application assets and portfolio",
      titleZh: "申请材料与作品集",
      tools: [
        {
          name: "Notion",
          url: "https://www.notion.so",
          purpose: "Build role-specific portfolios and case-study pages.",
          purposeZh:
            "搭建针对岗位的作品集与案例页。",
          tag: "Portfolio",
          tagZh: "作品集",
        },
        {
          name: "Canva",
          url: "https://www.canva.com",
          purpose: "Create clean one-page resumes and project visuals.",
          purposeZh:
            "制作简洁的单页简历与项目视觉。",
          tag: "Resume",
          tagZh: "简历",
        },
        {
          name: "Gamma",
          url: "https://gamma.app",
          purpose: "Package work samples into concise application decks.",
          purposeZh:
            "把作品样本整理成简洁的申请演示稿。",
          tag: "Presentation",
          tagZh: "演示",
        },
      ],
    },
    {
      id: "visibility-networking",
      title: "Visibility and networking",
      titleZh: "曝光与Networking",
      tools: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com",
          purpose: "Maintain a clear narrative of your work and role focus.",
          purposeZh:
            "保持清晰的工作叙事与岗位方向。",
          tag: "Profile",
          tagZh: "主页",
        },
        {
          name: "Farcaster",
          url: "https://www.farcaster.xyz",
          purpose: "Share public proof of work and connect with active builders.",
          purposeZh:
            "公开 proof of work 并与活跃建设者连接。",
          tag: "Social",
          tagZh: "社交",
        },
        {
          name: "Discord",
          url: "https://discord.com",
          purpose: "Join protocol communities where hiring often starts informally.",
          purposeZh:
            "加入协议社区，招聘常从非正式渠道开始。",
          tag: "Community",
          tagZh: "社区",
        },
      ],
    },
    {
      id: "prep-execution",
      title: "Interview prep and execution",
      titleZh: "面试准备与执行",
      tools: [
        {
          name: "Notion Calendar",
          url: "https://www.notion.so/product/calendar",
          purpose: "Track application stages and interview timelines in one board.",
          purposeZh:
            "在一个看板里跟踪投递阶段与面试时间线。",
          tag: "Pipeline",
          tagZh: "管道",
        },
        {
          name: "Loom",
          url: "https://www.loom.com",
          purpose: "Practice async intros and project walkthroughs for hiring loops.",
          purposeZh:
            "练习异步自我介绍与项目 walkthrough，适配招聘流程。",
          tag: "Async prep",
          tagZh: "异步",
        },
        {
          name: "Grammarly",
          url: "https://www.grammarly.com",
          purpose: "Polish outreach, cover notes, and follow-up messages.",
          purposeZh:
            "润色外联、附言与跟进邮件。",
          tag: "Writing",
          tagZh: "写作",
        },
      ],
    },
  ],
  reading: [
    {
      title: "The Pragmatic Engineer - Job search content",
      url: "https://newsletter.pragmaticengineer.com",
      kind: "Guide",
      note: "Interview and hiring process insights applicable to remote crypto teams.",
      titleZh: "The Pragmatic Engineer — 求职内容",
      kindZh: "指南",
      noteZh:
        "面试与招聘流程洞察，适用于远程加密团队。",
    },
    {
      title: "a16z crypto startup school content",
      url: "https://a16zcrypto.com/posts/",
      kind: "Docs",
      note: "Understand team priorities so your applications sound context-aware.",
      titleZh: "a16z crypto 创业学校内容",
      kindZh: "文档",
      noteZh:
        "理解团队优先级，让申请听起来有语境。",
    },
    {
      title: "Bankless career stories",
      url: "https://www.bankless.com",
      kind: "Case study",
      note: "Real examples of role transitions into crypto-native teams.",
      titleZh: "Bankless 职业故事",
      kindZh: "案例",
      noteZh:
        "转入原生加密团队的真实转岗案例。",
    },
    {
      title: "Lenny's hiring and career archive",
      url: "https://www.lennysnewsletter.com",
      kind: "Framework",
      note: "Practical frameworks for resume strategy and interview prep.",
      titleZh: "Lenny 招聘与职业归档",
      kindZh: "框架",
      noteZh:
        "简历策略与面试准备的实用框架。",
    },
    {
      title: "r/ethdev and r/cryptodevs",
      url: "https://www.reddit.com/r/ethdev/",
      kind: "Forum",
      note: "Community threads on skill signals and role expectations.",
      titleZh: "r/ethdev 与 r/cryptodevs",
      kindZh: "论坛",
      noteZh:
        "关于技能信号与岗位预期的社区讨论。",
    },
  ],
  learnFrom: [
    {
      name: "Swyx",
      url: "https://www.swyx.io",
      kind: "Writer",
      note: "Career strategy and public learning systems for technical builders.",
      kindZh: "作者",
      noteZh:
        "技术建设者的职业策略与公开学习体系。",
    },
    {
      name: "Lenny Rachitsky",
      url: "https://www.lennysnewsletter.com",
      kind: "Newsletter",
      note: "High-signal hiring and career interviews with operators and founders.",
      kindZh: "通讯",
      noteZh:
        "高信号招聘与职业访谈，对话运营者与创始人。",
    },
    {
      name: "Gergely Orosz",
      url: "https://newsletter.pragmaticengineer.com",
      kind: "Writer",
      note: "Hiring market realities and interviewing patterns for product teams.",
      kindZh: "作者",
      noteZh:
        "招聘市场现实与产品团队面试模式。",
    },
    {
      name: "Jess Sloss",
      url: "https://twitter.com/thattallguy",
      kind: "Operator",
      note: "Perspective on community, ecosystem work, and role fit in Web3 teams.",
      kindZh: "运营者",
      noteZh:
        "社区、生态工作与 Web3 岗位匹配的视角。",
    },
    {
      name: "Packy McCormick",
      url: "https://www.notboring.co",
      kind: "Newsletter",
      note: "Company and category context to improve target selection and outreach.",
      kindZh: "通讯",
      noteZh:
        "公司与赛道语境，帮助筛选目标与冷触达。",
    },
  ],
  relatedCategorySlugs: ["job-boards", "research", "media", "community"],
};
