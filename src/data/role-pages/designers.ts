import type { RolePageDetail } from "@/types/role-page";

export const designersPage: RolePageDetail = {
  slug: "designers",
  lede:
    "Web3 designers shape trust and clarity at the edge of complexity. The role covers product UX, interaction flows, visual systems, landing pages, social assets, and brand execution across user-facing crypto experiences.",
  ledeZh:
    "Web3 设计师在复杂边缘塑造信任与清晰：涵盖产品体验、交互流程、视觉系统、落地页、社交素材与面向用户的加密品牌执行。",
  quickStart: [
    {
      label: "Product context",
      href: "/categories/research",
      hint: "Use cases and users",
      labelZh: "产品语境",
      hintZh: "场景与用户",
    },
    {
      label: "Media references",
      href: "/categories/media",
      hint: "Narratives and style",
      labelZh: "媒体参考",
      hintZh: "叙事与风格",
    },
    {
      label: "Community feedback",
      href: "/categories/community",
      hint: "User sentiment",
      labelZh: "社区反馈",
      hintZh: "用户情绪",
    },
    {
      label: "AI design tools",
      href: "/categories/ai-tools",
      hint: "Rapid iteration",
      labelZh: "AI 设计工具",
      hintZh: "快速迭代",
    },
  ],
  toolGroups: [
    {
      id: "ux-product-design",
      title: "Product UX and interaction design",
      titleZh: "产品体验与交互设计",
      tools: [
        {
          name: "Figma",
          url: "https://www.figma.com",
          purpose: "Design product flows, prototypes, and reusable component systems.",
          purposeZh:
            "设计产品流程、原型与可复用组件系统。",
          tag: "Core",
          tagZh: "核心",
        },
        {
          name: "FigJam",
          url: "https://www.figma.com/figjam",
          purpose: "Map user journeys, IA, and cross-functional design critiques.",
          purposeZh:
            "梳理用户旅程、信息架构与跨职能设计评审。",
          tag: "Workflow",
          tagZh: "工作流",
        },
        {
          name: "Maze",
          url: "https://maze.co",
          purpose: "Run lightweight usability tests before engineering handoff.",
          purposeZh:
            "工程交接前做轻量可用性测试。",
          tag: "Testing",
          tagZh: "测试",
        },
      ],
    },
    {
      id: "visual-brand-systems",
      title: "Visual and brand systems",
      titleZh: "视觉与品牌系统",
      tools: [
        {
          name: "Canva",
          url: "https://www.canva.com",
          purpose: "Produce social, event, and campaign graphics quickly.",
          purposeZh:
            "快速产出社交、活动与活动视觉。",
          tag: "Creative",
          tagZh: "创意",
        },
        {
          name: "Adobe Illustrator",
          url: "https://www.adobe.com/products/illustrator.html",
          purpose: "Create logo marks and vector brand assets for scalable use.",
          purposeZh:
            "制作可扩展使用的 Logo 与矢量品牌资产。",
          tag: "Brand",
          tagZh: "品牌",
        },
        {
          name: "Coolors",
          url: "https://coolors.co",
          purpose: "Explore and standardize color systems for product and marketing.",
          purposeZh:
            "探索并统一产品与市场的颜色系统。",
          tag: "Palette",
          tagZh: "色板",
        },
      ],
    },
    {
      id: "landing-web-assets",
      title: "Landing pages and web assets",
      titleZh: "落地页与网页资产",
      tools: [
        {
          name: "Framer",
          url: "https://www.framer.com",
          purpose: "Ship high-fidelity marketing pages without heavy frontend cycles.",
          purposeZh:
            "无需重度前端周期即可上线高保真营销页。",
          tag: "Landing",
          tagZh: "落地页",
        },
        {
          name: "Webflow",
          url: "https://webflow.com",
          purpose: "Build structured content pages and campaign microsites quickly.",
          purposeZh:
            "快速搭建结构化内容页与活动微站。",
          tag: "CMS",
          tagZh: "CMS",
        },
        {
          name: "Spline",
          url: "https://spline.design",
          purpose: "Create lightweight 3D visuals for crypto-native brand surfaces.",
          purposeZh:
            "为加密原生品牌界面制作轻量 3D 视觉。",
          tag: "3D",
          tagZh: "3D",
        },
      ],
    },
    {
      id: "social-content-ops",
      title: "Social and content design operations",
      titleZh: "社交与内容设计运营",
      tools: [
        {
          name: "CapCut",
          url: "https://www.capcut.com",
          purpose: "Edit short-form campaign videos for social channels.",
          purposeZh:
            "为社交渠道剪辑短视频活动素材。",
          tag: "Video",
          tagZh: "视频",
        },
        {
          name: "LottieFiles",
          url: "https://lottiefiles.com",
          purpose: "Add lightweight motion assets to product and campaign touchpoints.",
          purposeZh:
            "为产品与活动触点添加轻量动效。",
          tag: "Motion",
          tagZh: "动效",
        },
        {
          name: "Notion",
          url: "https://www.notion.so",
          purpose: "Track asset requests, review queues, and publishing status.",
          purposeZh:
            "跟踪素材需求、评审队列与发布状态。",
          tag: "Coordination",
          tagZh: "协同",
        },
      ],
    },
    {
      id: "handoff-ai-workflow",
      title: "Handoff and AI-assisted workflows",
      titleZh: "交接与 AI 辅助工作流",
      tools: [
        {
          name: "Zeplin",
          url: "https://zeplin.io",
          purpose: "Improve design-to-dev handoff with specs and assets.",
          purposeZh:
            "用规格与资产改善设计到开发的交接。",
          tag: "Handoff",
          tagZh: "交接",
        },
        {
          name: "Relume",
          url: "https://www.relume.io",
          purpose: "Generate structured site and component ideas from prompts.",
          purposeZh:
            "从提示生成结构化站点与组件思路。",
          tag: "AI layout",
          tagZh: "AI 布局",
        },
        {
          name: "Midjourney",
          url: "https://www.midjourney.com",
          purpose: "Explore style directions and visual moodboards quickly.",
          purposeZh:
            "快速探索风格方向与情绪板。",
          tag: "Ideation",
          tagZh: "发散",
        },
      ],
    },
  ],
  reading: [
    {
      title: "NNGroup UX articles",
      url: "https://www.nngroup.com/articles/",
      kind: "Guide",
      note: "Foundational UX principles for decision-making under ambiguity.",
      titleZh: "NNGroup UX 文章",
      kindZh: "指南",
      noteZh:
        "在不确定中做决策的 UX 基础原则。",
    },
    {
      title: "Design Systems Handbook",
      url: "https://www.designbetter.co/design-systems-handbook",
      kind: "Framework",
      note: "Practical framework for scalable component and token systems.",
      titleZh: "设计系统手册",
      kindZh: "框架",
      noteZh:
        "可扩展组件与 Token 系统的实务框架。",
    },
    {
      title: "Figma blog",
      url: "https://www.figma.com/blog/",
      kind: "Docs",
      note: "Patterns for workflows, prototyping, and collaborative design practice.",
      titleZh: "Figma 博客",
      kindZh: "文档",
      noteZh:
        "工作流、原型与协作设计实践的模式。",
    },
    {
      title: "A List Apart",
      url: "https://alistapart.com",
      kind: "Case study",
      note: "Interface and content design essays that age well.",
      titleZh: "A List Apart",
      kindZh: "案例",
      noteZh:
        "历久弥新的界面与内容设计随笔。",
    },
    {
      title: "Designer Hangout",
      url: "https://designerhangout.co",
      kind: "Forum",
      note: "Community discussions on product design challenges and process.",
      titleZh: "Designer Hangout",
      kindZh: "论坛",
      noteZh:
        "产品设计挑战与流程的社区讨论。",
    },
  ],
  learnFrom: [
    {
      name: "Julie Zhuo",
      url: "https://twitter.com/joulee",
      kind: "Writer",
      note: "Clear product design reasoning and systems-level process guidance.",
      kindZh: "作者",
      noteZh:
        "清晰的产品设计推理与系统级流程指导。",
    },
    {
      name: "Pablo Stanley",
      url: "https://twitter.com/pablostanley",
      kind: "Operator",
      note: "Practical and playful approaches to visual systems and tooling.",
      kindZh: "运营者",
      noteZh:
        "视觉系统与工具的务实、 playful 方法。",
    },
    {
      name: "Figma team",
      url: "https://www.figma.com/blog/",
      kind: "Collective",
      note: "Strong examples of design communication and workflow practices.",
      kindZh: "团队",
      noteZh:
        "设计沟通与工作流实践的强范例。",
    },
    {
      name: "HeyDesigner",
      url: "https://heydesigner.com",
      kind: "Newsletter",
      note: "Curated links for product, UI, and interaction design trends.",
      kindZh: "通讯",
      noteZh:
        "产品、界面与交互设计趋势的精选链接。",
    },
    {
      name: "Refactoring UI",
      url: "https://www.refactoringui.com",
      kind: "Writer",
      note: "Useful visual design heuristics for real product interfaces.",
      kindZh: "作者",
      noteZh:
        "面向真实产品界面的实用视觉启发式。",
    },
  ],
  relatedCategorySlugs: ["research", "media", "community", "ai-tools"],
};
