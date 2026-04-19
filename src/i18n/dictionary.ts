export type Lang = "en" | "zh";

const en = {
  headerTagline: "Web3 · AI hub",
  navStart: "Start",
  navRoles: "Roles",
  navTools: "Tools",
  navCategories: "Categories",
  navSignals: "Signals",
  navSubmit: "Submit",
  navOpenMenu: "Open menu",
  navCloseMenu: "Close menu",
  navMenuLabel: "Site navigation",
  heroEyebrow: "WEB3 · AI HUB",
  heroTitle: "Resource portal for builders & operators",
  heroSubtitle:
    "Search tools, roles, and signals in one place—wallets to job boards, research stacks, AI copilots, and security—curated for people who ship on-chain.",
  searchPlaceholder: "Search protocols, tools, job boards, AI stacks…",
  searchHint: "Try “L2 analytics”, “wallet security”, “Solidity hiring”.",
  searchAriaLabel: "Search the hub",
  searchNoResults: "No listings match. Press Enter to open full search.",
  searchListboxLabel: "Matching directory listings",
  languageSwitcherAria: "Switch language",
  langOptionEn: "English (US)",
  langOptionZh: "简体中文 (ZH)",
  visitCta: "Visit",
  toolModalVisit: "Visit Tool",
  toolModalClose: "Close",
  bestForLabel: "Best for:",
  openCta: "Open",
  quickExploreTools: "Explore Tools",
  quickBrowseRole: "Browse by Role",
  quickTopResources: "Top Resources This Week",

  footerBlurb:
    "Web3 + AI navigation for builders, operators, and job seekers—free and open.",
  footerCopyright: "Public resource hub.",
  footerNoWallet: "No wallet required to browse.",
  footerSubmit: "Submit a Tool",
  footerAdvertise: "Advertise",
  footerPartner: "Partner With Us",
  footerContact: "Contact",

  engageEyebrow: "Engage",
  engageTitle: "Partner with the hub",
  engageDesc:
    "Listings, sponsorships, and collaborations—built for teams who want reach without noise.",
  engageSubmitTool: "Submit a tool",
  engageAdvertise: "Advertise",
  engagePartner: "Partner",
  engageContactLink: "Contact",

  homeRolesEyebrow: "Route",
  homeRolesTitle: "Browse by role",
  homeRolesDesc: "Pick a lane—curated lists per function.",
  homeToolsEyebrow: "Tools",
  homeToolsTitle: "Featured picks",
  homeToolsDesc: "Analytics, wallets, AI glue, and security rails.",
  homeCategoriesEyebrow: "Index",
  homeCategoriesTitle: "Spotlight carousel",
  homeCategoriesDesc:
    "Rotates through the same featured tools as the left column—open the full taxonomy from the link above.",
  homeFullIndex: "Full index",

  panelThisWeek: "This week",
  panelViewAll: "View all",
  panelCarouselPrevAria: "Previous tool",
  panelCarouselNextAria: "Next tool",
  panelTopSearched: "Top searched",

  linkBackLong: "← Back to hub",
  linkBackShort: "← Hub",
  linkBack: "← Back",
  linkBackRoles: "← Roles",

  pageAdvertiseTitle: "Advertise",
  pageAdvertiseBody:
    "Sponsored placements and newsletter slots are in the works. Email us via Contact for early access.",
  pageSubmitTitle: "Submit a Tool",
  pageSubmitBody:
    "List your product for Web3 builders and AI teams. We review submissions weekly.",
  submitEyebrow: "Listings",
  submitHeroTitle: "Submit your tool to Niubility",
  submitHeroSubtitle:
    "Get discovered by thousands of Web3 builders, AI researchers, and early adopters.",
  submitCriteriaHeading: "What we look for",
  submitCriteria1Title: "High-quality experience",
  submitCriteria1Desc:
    "Polished UI, clear onboarding, and a product that feels intentional—not a bare repo screenshot.",
  submitCriteria2Title: "Clear value proposition",
  submitCriteria2Desc:
    "Visitors should understand who it’s for and what problem it solves in one scroll.",
  submitCriteria3Title: "Working product",
  submitCriteria3Desc:
    "Live links, real docs, and something shippable we can recommend with confidence.",
  submitCta: "Fill out the submission form",
  submitCtaAria: "Open submission form in a new tab",
  submitCtaNote:
    "Submissions are reviewed weekly. We only accept high-quality products.",
  submitFormIntro:
    "Submit securely below. Your request is saved to our team inbox for review.",
  submitFormFirstName: "First name",
  submitFormLastName: "Last name",
  submitFormEmail: "Email",
  submitFormDescription: "Tell us more",
  submitFormCaptchaPrompt: "What is {{a}} + {{b}}? (human check)",
  submitFormCaptchaPlaceholder: "Your answer",
  submitFormCaptchaHint:
    "Simple math helps block automated spam. Refresh the page if this expires.",
  submitFormPrivacyPrefix: "I agree to the ",
  submitFormPrivacyLinkLabel: "Privacy & contact notice",
  submitFormPrivacySuffix:
    " and understand my data will be used only to review this submission.",
  submitFormSubmit: "Submit application",
  submitFormSubmitting: "Sending…",
  submitFormBackHint:
    "After a successful send, you’ll see a confirmation above the button.",
  submitMailFallback: "Prefer email?",
  pageContactTitle: "Contact",
  pageContactBody:
    "For now, reach out through your usual channels—this page will host a form and routing rules next.",
  pagePartnerTitle: "Partner With Us",
  pagePartnerBody:
    "We collaborate with protocols, media, and education teams. Tell us what you're building through Contact.",

  pageSearchTitle: "Search",
  searchResultPending:
    'Results for "{{q}}" will appear here once the index is connected.',
  pageSearchEmptyHint:
    "Enter a query from the homepage to search tools, categories, and roles.",

  searchPageInputPlaceholder: "Search tools, people, guides...",
  searchFilterAll: "All",
  searchFilterTools: "Tools",
  searchFilterPeople: "People",
  searchFilterGuides: "Guides",
  searchSectionTools: "Tools",
  searchSectionPeople: "People",
  searchSectionGuides: "Guides",
  searchResultsCount: '{{count}} results for "{{q}}"',
  searchEmptyNoResults: 'No results for "{{q}}"',
  searchEmptySuggestion:
    "Try searching for a tool category or role",
  searchPopularLabel: "Popular searches",
  searchClearInputAria: "Clear search",
  searchFilterRowAria: "Filter results by type",

  categoriesTaxonomyEyebrow: "Taxonomy",
  categoriesPageTitle: "All categories",
  categoriesPageSubtitle:
    "Full index—same structure as the homepage, without truncation.",
  explorePageEyebrow: "Explore",
  explorePageTitle: "Explore Categories",
  explorePageSubtitle:
    "Magazine-style themes—tap a tile, then pick a subcategory.",
  subcategoriesBadge: "{{n}} subcategories",
  parentHubSubtitle: "Choose a subcategory to open tools and listings.",
  filterAllTab: "All",
  categoryLevelTwoEmpty:
    "No directory listings for this filter yet—try another tab or open a leaf category page.",
  categoryCapsuleTabsAria: "Filter by subcategory",
  rolesIndexEyebrow: "Roles",
  rolesIndexTitle: "Browse by role",
  rolesIndexSubtitle:
    "Pick a lane—each page curates tools and links for how you work.",

  libraryTitle: "My library",
  libraryBookmarks: "Bookmarks",
  libraryRecents: "Recently viewed",
  libraryEmptyBookmarks:
    "No bookmarks yet—star a tool card to save it here.",
  libraryEmptyRecents: "Open a tool link to build your recent history.",
  libraryCloseAria: "Close library",
  bookmarkToggleAria: "Toggle bookmark",
  libraryRemoveBookmarkAria: "Remove bookmark",
  libraryRemoveLabel: "Remove",

  signalsEyebrow: "Signal",
  signalsPageTitle: "All signals this week",
  signalsPageSubtitle:
    "Extended list of topics, tools, and resources we're tracking.",

  categoryFeaturedPicks: "Featured picks",
  categoryDirectoryHeading: "Directory listing data",
  resourcesUnit: "resources",
  linksUnit: "links",
  entriesUnit: "entries",
  categoryNextSlice:
    "Links for this category will appear here in the next MVP slice.",

  roleEyebrow: "Role",
  quickStartLabel: "Quick start",
  stackEyebrow: "Stack",
  recommendedToolsTitle: "Recommended tools",
  recommendedToolsDesc:
    "Pick a lane, then jump straight to a tool—organized by how you work, not a single long list.",
  sourcesEyebrow: "Sources",
  readingTitle: "Reading & reference",
  readingDesc:
    "Frameworks and long-lived docs worth bookmarking—scan and open what you need.",
  peopleEyebrow: "People",
  learnTitle: "People to learn from",
  learnDesc:
    "Operators, writers, and funds publishing useful essays and case studies—direct links, no endless scrolling.",
  indexEyebrow: "Index",
  relatedCategoriesTitle: "Related categories",
  relatedCategoriesDesc: "Jump into hub taxonomy from here.",
  readingSr: "Reading and reference",
  learnSr: "People to learn from",
  relatedSr: "Related categories",
  recommendedSr: "Recommended tools",

  rolePlaceholderMsg:
    "A curated page for this role is not published yet. Check back soon or browse the hub.",
  rolePlaceholderCta: "Return to hub →",

  kindTopic: "Topic",
  kindTool: "Tool",
  kindResource: "Resource",

  cardBadgeIndex: "Index",
  cardExplore: "Explore",
} as const;

const zh: Record<keyof typeof en, string> = {
  headerTagline: "Web3 · AI 导航",
  navStart: "起点",
  navRoles: "角色",
  navTools: "工具",
  navCategories: "分类",
  navSignals: "动态",
  navSubmit: "提交",
  navOpenMenu: "打开菜单",
  navCloseMenu: "关闭菜单",
  navMenuLabel: "站点导航",
  heroEyebrow: "WEB3 · AI 导航",
  heroTitle: "面向建设者与运营者的资源门户",
  heroSubtitle:
    "在一处搜索工具、角色与信号——从钱包到招聘板、研究栈、AI 助手与安全资源，为链上交付者精选。",
  searchPlaceholder: "搜索协议、工具、招聘板、AI 技术栈…",
  searchHint: "试试「L2 分析」「钱包安全」「Solidity 招聘」。",
  searchAriaLabel: "搜索导航站",
  searchNoResults: "没有匹配的收录。按 Enter 打开完整搜索。",
  searchListboxLabel: "匹配的目录条目",
  languageSwitcherAria: "切换语言",
  langOptionEn: "English (US)",
  langOptionZh: "简体中文 (ZH)",
  visitCta: "访问",
  toolModalVisit: "访问工具",
  toolModalClose: "关闭",
  bestForLabel: "适合：",
  openCta: "打开",
  quickExploreTools: "探索工具",
  quickBrowseRole: "按角色浏览",
  quickTopResources: "本周精选资源",

  footerBlurb:
    "面向建设者、运营者与求职者——免费开放的 Web3 + AI 导航。",
  footerCopyright: "公共资源导航站。",
  footerNoWallet: "浏览无需连接钱包。",
  footerSubmit: "提交工具",
  footerAdvertise: "广告投放",
  footerPartner: "合作共建",
  footerContact: "联系我们",

  engageEyebrow: "合作",
  engageTitle: "与导航站合作",
  engageDesc:
    "收录、赞助与协作——为追求触达而非噪音的团队而设。",
  engageSubmitTool: "提交工具",
  engageAdvertise: "广告投放",
  engagePartner: "合作伙伴",
  engageContactLink: "联系",

  homeRolesEyebrow: "路线",
  homeRolesTitle: "按角色浏览",
  homeRolesDesc: "选一条路径——按职能精选的列表。",
  homeToolsEyebrow: "工具",
  homeToolsTitle: "精选推荐",
  homeToolsDesc: "分析、钱包、AI 胶水与安全护栏。",
  homeCategoriesEyebrow: "索引",
  homeCategoriesTitle: "精选轮播",
  homeCategoriesDesc:
    "与左侧精选工具同一批收录轮换展示，可通过上方按钮打开完整分类索引。",
  homeFullIndex: "完整索引",

  panelThisWeek: "本周",
  panelViewAll: "查看全部",
  panelCarouselPrevAria: "上一个工具",
  panelCarouselNextAria: "下一个工具",
  panelTopSearched: "热门搜索",

  linkBackLong: "← 返回导航站",
  linkBackShort: "← 导航站",
  linkBack: "← 返回",
  linkBackRoles: "← 角色",

  pageAdvertiseTitle: "广告投放",
  pageAdvertiseBody:
    "赞助位与邮件推荐位正在筹备中。如需抢先合作，请通过「联系我们」发邮件。",
  pageSubmitTitle: "提交工具",
  pageSubmitBody:
    "把产品推荐给 Web3 与 AI 方向的访客；我们按周审核收录。",
  submitEyebrow: "收录",
  submitHeroTitle: "将你的产品提交至 Niubility",
  submitHeroSubtitle:
    "让成千上万的 Web3 建设者、AI 研究者与早期用户发现你。",
  submitCriteriaHeading: "我们关注什么",
  submitCriteria1Title: "高质量体验",
  submitCriteria1Desc:
    "界面完整、上手清晰、产品感明确——而不只是仓库截图。",
  submitCriteria2Title: "价值主张清楚",
  submitCriteria2Desc:
    "访问者在一屏内能看懂服务对象与解决的问题。",
  submitCriteria3Title: "可用产品",
  submitCriteria3Desc:
    "可访问的链接、真实文档、可放心推荐的可交付物。",
  submitCta: "填写提交申请单",
  submitCtaAria: "在新标签页打开提交表单",
  submitCtaNote:
    "申请将按周审核；我们只收录高质量产品。",
  submitFormIntro:
    "请使用下方安全表单提交；内容会进入团队收信箱等待审核。",
  submitFormFirstName: "名",
  submitFormLastName: "姓",
  submitFormEmail: "邮箱",
  submitFormDescription: "详细说明",
  submitFormCaptchaPrompt: "{{a}} + {{b}} 等于多少？（人机验证）",
  submitFormCaptchaPlaceholder: "填写答案",
  submitFormCaptchaHint:
    "简单算术用于拦截垃圾请求；若过期请刷新页面获取新题目。",
  submitFormPrivacyPrefix: "我已阅读并同意",
  submitFormPrivacyLinkLabel: "隐私与联系说明",
  submitFormPrivacySuffix: "，并理解所填信息仅用于本次收录审核。",
  submitFormSubmit: "提交申请",
  submitFormSubmitting: "发送中…",
  submitFormBackHint: "提交成功后，按钮上方会显示确认提示。",
  submitMailFallback: "更想用邮件？",
  pageContactTitle: "联系我们",
  pageContactBody:
    "目前请通过你常用的渠道联系——本页后续将提供表单与路由规则。",
  pagePartnerTitle: "合作共建",
  pagePartnerBody:
    "我们与协议、媒体与教育团队合作。请通过「联系我们」说明你在做什么。",

  pageSearchTitle: "搜索",
  searchResultPending: "「{{q}}」的搜索结果将在索引接入后展示。",
  pageSearchEmptyHint:
    "从首页输入查询，可搜索工具、分类与角色。",

  searchPageInputPlaceholder: "搜索工具、人物、指南...",
  searchFilterAll: "全部",
  searchFilterTools: "工具",
  searchFilterPeople: "人物",
  searchFilterGuides: "指南",
  searchSectionTools: "工具",
  searchSectionPeople: "人物",
  searchSectionGuides: "指南",
  searchResultsCount: "「{{q}}」共 {{count}} 条结果",
  searchEmptyNoResults: "没有找到「{{q}}」的结果",
  searchEmptySuggestion: "试试搜索工具分类或角色",
  searchPopularLabel: "热门搜索",
  searchClearInputAria: "清除搜索",
  searchFilterRowAria: "按类型筛选结果",

  categoriesTaxonomyEyebrow: "分类体系",
  categoriesPageTitle: "全部分类",
  categoriesPageSubtitle: "完整索引——与首页结构一致，无截断。",
  explorePageEyebrow: "探索",
  explorePageTitle: "探索分类",
  explorePageSubtitle: "杂志式主题——点选大图，再进入子分类。",
  subcategoriesBadge: "{{n}} 个子分类",
  parentHubSubtitle: "选择子分类以查看工具与收录。",
  filterAllTab: "全部",
  categoryLevelTwoEmpty:
    "当前筛选下暂无目录收录——可切换标签或进入子分类页面。",
  categoryCapsuleTabsAria: "按子分类筛选",
  rolesIndexEyebrow: "角色",
  rolesIndexTitle: "按角色浏览",
  rolesIndexSubtitle: "选一条路径——每个页面按工作方式整理工具与链接。",

  libraryTitle: "我的收藏",
  libraryBookmarks: "书签",
  libraryRecents: "最近浏览",
  libraryEmptyBookmarks: "暂无收藏——在工具卡片上点星标即可保存。",
  libraryEmptyRecents: "打开工具链接后，会在这里留下最近记录。",
  libraryCloseAria: "关闭收藏夹",
  bookmarkToggleAria: "切换收藏",
  libraryRemoveBookmarkAria: "移除收藏",
  libraryRemoveLabel: "移除",

  signalsEyebrow: "信号",
  signalsPageTitle: "本周全部信号",
  signalsPageSubtitle: "我们正在跟进的议题、工具与资源扩展列表。",

  categoryFeaturedPicks: "精选推荐",
  categoryDirectoryHeading: "目录数据",
  resourcesUnit: "条资源",
  linksUnit: "条链接",
  entriesUnit: "条收录",
  categoryNextSlice: "该类目的链接将在后续版本中补充。",

  roleEyebrow: "角色",
  quickStartLabel: "快速开始",
  stackEyebrow: "栈",
  recommendedToolsTitle: "推荐工具",
  recommendedToolsDesc:
    "先选场景，再直达工具——按工作方式组织，而不是一条长列表。",
  sourcesEyebrow: "来源",
  readingTitle: "阅读与参考",
  readingDesc:
    "值得收藏的长期文档与框架——按需打开。",
  peopleEyebrow: "人物",
  learnTitle: "值得关注的人",
  learnDesc:
    "运营者、作者与基金发布的文章与案例——直链直达。",
  indexEyebrow: "索引",
  relatedCategoriesTitle: "相关分类",
  relatedCategoriesDesc: "从这里进入导航分类体系。",
  readingSr: "阅读与参考",
  learnSr: "值得关注的人",
  relatedSr: "相关分类",
  recommendedSr: "推荐工具",

  rolePlaceholderMsg:
    "该角色的精选页尚未发布。请稍后再来或返回导航站浏览。",
  rolePlaceholderCta: "返回导航站 →",

  kindTopic: "议题",
  kindTool: "工具",
  kindResource: "资源",

  cardBadgeIndex: "索引",
  cardExplore: "探索",
};

export const ui = { en, zh } as const;

export type UIKey = keyof typeof en;
