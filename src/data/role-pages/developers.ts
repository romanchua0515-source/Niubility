import type { RolePageDetail } from "@/types/role-page";

export const developersPage: RolePageDetail = {
  slug: "developers",
  lede:
    "Web3 developers ship contracts and apps under fast-moving constraints. The work spans smart contract design, integration with wallets and APIs, testing, deployment, docs, and maintaining reliable dev workflows across chains.",
  ledeZh:
    "Web3 开发者在快速变化约束下交付合约与应用：涵盖合约设计、钱包与 API 集成、测试、部署、文档，以及跨链可靠研发流程。",
  quickStart: [
    {
      label: "Builder docs",
      href: "/categories/research",
      hint: "Protocol references",
      labelZh: "建设者文档",
      hintZh: "协议参考",
    },
    {
      label: "Security baseline",
      href: "/categories/security",
      hint: "Audit and tooling",
      labelZh: "安全基线",
      hintZh: "审计与工具",
    },
    {
      label: "AI copilots",
      href: "/categories/ai-tools",
      hint: "Coding acceleration",
      labelZh: "AI 助手",
      hintZh: "编码加速",
    },
    {
      label: "Community channels",
      href: "/categories/community",
      hint: "Dev support and updates",
      labelZh: "社区渠道",
      hintZh: "开发者支持与动态",
    },
  ],
  toolGroups: [
    {
      id: "contracts-frameworks",
      title: "Smart contract development",
      titleZh: "智能合约开发",
      tools: [
        {
          name: "Foundry",
          url: "https://book.getfoundry.sh",
          purpose: "Fast Solidity compile, test, and script workflows for EVM contracts.",
          purposeZh:
            "面向 EVM 合约的快速编译、测试与脚本工作流。",
          tag: "Toolchain",
          tagZh: "工具链",
        },
        {
          name: "Hardhat",
          url: "https://hardhat.org",
          purpose: "Plugin-rich environment for contract development and local network testing.",
          purposeZh:
            "插件丰富的合约开发与本地网络测试环境。",
          tag: "Framework",
          tagZh: "框架",
        },
        {
          name: "OpenZeppelin",
          url: "https://www.openzeppelin.com",
          purpose: "Battle-tested contract libraries and upgrade patterns.",
          purposeZh:
            "久经考验的合约库与升级模式。",
          tag: "Library",
          tagZh: "库",
        },
      ],
    },
    {
      id: "app-integration",
      title: "App integration and wallet UX",
      titleZh: "应用集成与钱包体验",
      tools: [
        {
          name: "wagmi",
          url: "https://wagmi.sh",
          purpose: "React hooks for wallet connection and on-chain reads/writes.",
          purposeZh:
            "React Hooks 连接钱包与链上读写。",
          tag: "Frontend",
          tagZh: "前端",
        },
        {
          name: "viem",
          url: "https://viem.sh",
          purpose: "Type-safe Ethereum primitives for apps and backend services.",
          purposeZh:
            "类型安全的以太坊原语，用于应用与后端。",
          tag: "Client",
          tagZh: "客户端",
        },
        {
          name: "WalletConnect",
          url: "https://walletconnect.com",
          purpose: "Connect broad wallet ecosystem support into dapp flows.",
          purposeZh:
            "把广泛钱包生态接入 dapp 流程。",
          tag: "Wallet",
          tagZh: "钱包",
        },
      ],
    },
    {
      id: "data-apis-indexing",
      title: "Data, indexing, and APIs",
      titleZh: "数据、索引与 API",
      tools: [
        {
          name: "The Graph",
          url: "https://thegraph.com",
          purpose: "Build indexed subgraphs for reliable queryable protocol data.",
          purposeZh:
            "构建可索引子图，稳定查询协议数据。",
          tag: "Indexing",
          tagZh: "索引",
        },
        {
          name: "Alchemy",
          url: "https://www.alchemy.com",
          purpose: "Managed RPC and dev APIs for production-grade app backends.",
          purposeZh:
            "托管 RPC 与开发 API，支撑生产级后端。",
          tag: "Infra API",
          tagZh: "基础设施",
        },
        {
          name: "Chainlink",
          url: "https://chain.link",
          purpose: "Integrate external data and automation into contracts safely.",
          purposeZh:
            "安全接入外部数据与自动化。",
          tag: "Oracle",
          tagZh: "预言机",
        },
      ],
    },
    {
      id: "testing-security",
      title: "Testing and security checks",
      titleZh: "测试与安全检查",
      tools: [
        {
          name: "Slither",
          url: "https://github.com/crytic/slither",
          purpose: "Static analysis to catch common Solidity issues early.",
          purposeZh:
            "静态分析，尽早发现常见 Solidity 问题。",
          tag: "Static analysis",
          tagZh: "静态分析",
        },
        {
          name: "Echidna",
          url: "https://github.com/crytic/echidna",
          purpose: "Property-based fuzzing for contract invariants.",
          purposeZh:
            "基于属性的模糊测试，验证合约不变量。",
          tag: "Fuzzing",
          tagZh: "模糊测试",
        },
        {
          name: "Tenderly",
          url: "https://tenderly.co",
          purpose: "Simulate, debug, and monitor transactions before production execution.",
          purposeZh:
            "上线前模拟、调试与监控交易。",
          tag: "Simulation",
          tagZh: "模拟",
        },
      ],
    },
    {
      id: "deployment-docs-workflow",
      title: "Deployment, docs, and workflow",
      titleZh: "部署、文档与工作流",
      tools: [
        {
          name: "GitHub",
          url: "https://github.com",
          purpose: "Code review, CI hooks, and release management for shared repos.",
          purposeZh:
            "代码审查、CI 钩子与共享仓库发布管理。",
          tag: "Collab",
          tagZh: "协作",
        },
        {
          name: "Vercel",
          url: "https://vercel.com",
          purpose: "Deploy and iterate web app frontends with preview environments.",
          purposeZh:
            "部署 Web 前端并提供预览环境迭代。",
          tag: "Deploy",
          tagZh: "部署",
        },
        {
          name: "Mintlify",
          url: "https://mintlify.com",
          purpose: "Publish API and developer docs in a clean docs portal.",
          purposeZh:
            "在清晰门户中发布 API 与开发者文档。",
          tag: "Docs",
          tagZh: "文档",
        },
      ],
    },
  ],
  reading: [
    {
      title: "Solidity docs",
      url: "https://docs.soliditylang.org",
      kind: "Docs",
      note: "Core language reference for writing and auditing contracts.",
      titleZh: "Solidity 文档",
      kindZh: "文档",
      noteZh:
        "编写与审计合约的核心语言参考。",
    },
    {
      title: "Ethereum developer docs",
      url: "https://ethereum.org/en/developers/docs/",
      kind: "Guide",
      note: "Canonical docs for EVM architecture and protocol fundamentals.",
      titleZh: "以太坊开发者文档",
      kindZh: "指南",
      noteZh:
        "EVM 架构与协议基础的权威文档。",
    },
    {
      title: "OpenZeppelin blog",
      url: "https://blog.openzeppelin.com",
      kind: "Framework",
      note: "Practical posts on secure patterns, upgrades, and incident lessons.",
      titleZh: "OpenZeppelin 博客",
      kindZh: "框架",
      noteZh:
        "安全模式、升级与事故复盘等实务文章。",
    },
    {
      title: "Paradigm engineering posts",
      url: "https://www.paradigm.xyz/blog",
      kind: "Case study",
      note: "Detailed engineering deep-dives on protocol and infra design.",
      titleZh: "Paradigm 工程文章",
      kindZh: "案例",
      noteZh:
        "协议与基础设施设计的工程深潜。",
    },
    {
      title: "Dev.to Web3 tag",
      url: "https://dev.to/t/web3",
      kind: "Forum",
      note: "Community examples and implementation notes from builders.",
      titleZh: "Dev.to Web3 标签",
      kindZh: "论坛",
      noteZh:
        "建设者分享的示例与实现笔记。",
    },
  ],
  learnFrom: [
    {
      name: "Georgios Konstantopoulos",
      url: "https://twitter.com/gakonst",
      kind: "Operator",
      note: "High-signal writing and code contributions on Web3 developer tooling.",
      kindZh: "运营者",
      noteZh:
        "Web3 开发者工具的高信号文章与代码贡献。",
    },
    {
      name: "Patrick Collins",
      url: "https://twitter.com/PatrickAlphaC",
      kind: "Writer",
      note: "Educational content and practical walkthroughs for smart contract devs.",
      kindZh: "作者",
      noteZh:
        "面向合约开发者的教学与实操 walkthrough。",
    },
    {
      name: "OpenZeppelin",
      url: "https://www.openzeppelin.com/news",
      kind: "Collective",
      note: "Security and upgrade guidance from one of the core ecosystem teams.",
      kindZh: "团队",
      noteZh:
        "核心生态团队的安全与升级指南。",
    },
    {
      name: "Samczsun",
      url: "https://twitter.com/samczsun",
      kind: "Operator",
      note: "Security research and postmortem style analysis for protocol builders.",
      kindZh: "运营者",
      noteZh:
        "面向协议建设者的安全研究与事后分析风格。",
    },
    {
      name: "Paradigm engineering",
      url: "https://www.paradigm.xyz/blog",
      kind: "Collective",
      note: "Research and engineering essays that improve systems-level reasoning.",
      kindZh: "团队",
      noteZh:
        "提升系统层推理的研究与工程文章。",
    },
  ],
  relatedCategorySlugs: ["research", "security", "ai-tools", "community"],
};
