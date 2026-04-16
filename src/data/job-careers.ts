export type CareersModuleKey =
  | "job-boards"
  | "recruiters-hiring-channels"
  | "career-pages"
  | "market-intelligence"
  | "guides-and-safety";

export type CareersResource = {
  name: string;
  url: string;
  description: string;
  tags: string[];
  bestFor: string;
  isFeatured?: boolean;
};

export type CareersModule = {
  key: CareersModuleKey;
  title: string;
  description: string;
  resources: CareersResource[];
};

export const jobsAndCareersModules: CareersModule[] = [
  {
    key: "job-boards",
    title: "Job boards",
    description: "Direct sources of active Web3 openings across functions and seniorities.",
    resources: [
      {
        name: "CryptoJobsList",
        url: "https://cryptojobslist.com",
        description: "Broad Web3 board covering product, growth, ops, and engineering.",
        tags: ["jobs", "remote"],
        bestFor: "Daily role scanning across many crypto companies.",
        isFeatured: true,
      },
      {
        name: "DeJob",
        url: "https://www.dejob.top",
        description: "Crypto-native hiring marketplace for contributors and teams.",
        tags: ["marketplace", "contributors"],
        bestFor: "Early-stage and contributor-style opportunities.",
      },
      {
        name: "Bossjob",
        url: "https://bossjob.ph/en-us/jobs/web3",
        description: "Web3 role listings with recruiter-driven outreach flow.",
        tags: ["recruiters", "hiring"],
        bestFor: "Faster recruiter conversations and shortlisting.",
      },
      {
        name: "Web3.career",
        url: "https://web3.career",
        description: "Large role index with stack, location, and salary filters.",
        tags: ["filters", "salary"],
        bestFor: "Comparing role types and compensation ranges.",
        isFeatured: true,
      },
      {
        name: "Remote Web3",
        url: "https://remote3.co",
        description: "Remote-first listings across engineering, design, and growth.",
        tags: ["remote", "web3"],
        bestFor: "Global remote teams and async-friendly roles.",
      },
    ],
  },
  {
    key: "recruiters-hiring-channels",
    title: "Recruiters and hiring channels",
    description: "Places where hiring managers and recruiters share opportunities before broad posting.",
    resources: [
      {
        name: "LinkedIn Jobs",
        url: "https://www.linkedin.com/jobs",
        description: "Recruiter pipelines, role alerts, and direct outreach.",
        tags: ["recruiters", "network"],
        bestFor: "Building direct conversations with talent teams.",
      },
      {
        name: "Wellfound",
        url: "https://wellfound.com",
        description: "Startup hiring platform with many crypto-native teams.",
        tags: ["startups", "direct apply"],
        bestFor: "Early-stage opportunities and lean teams.",
      },
      {
        name: "Remote OK",
        url: "https://remoteok.com",
        description: "Remote tech board with recurring crypto and blockchain roles.",
        tags: ["remote", "tech jobs"],
        bestFor: "Supplementing crypto-specific board searches.",
      },
      {
        name: "X (Crypto hiring search)",
        url: "https://x.com/search?q=web3%20hiring&src=typed_query",
        description: "Founders and operators frequently post roles directly on X.",
        tags: ["social", "direct posts"],
        bestFor: "Early signals and warm intro opportunities.",
      },
    ],
  },
  {
    key: "career-pages",
    title: "Career pages and company hiring hubs",
    description: "High-signal company career pages to track directly for quality openings.",
    resources: [
      {
        name: "ConsenSys Careers",
        url: "https://consensys.io/open-roles",
        description: "Open roles across product, growth, legal, and engineering.",
        tags: ["company hub", "ethereum"],
        bestFor: "Established Web3 infrastructure and product teams.",
      },
      {
        name: "Chainlink Labs Careers",
        url: "https://chainlinklabs.com/careers",
        description: "Hiring hub for oracle and ecosystem-facing teams.",
        tags: ["infrastructure", "ecosystem"],
        bestFor: "Roles intersecting protocol and enterprise partnerships.",
      },
      {
        name: "Coinbase Careers",
        url: "https://www.coinbase.com/careers/positions",
        description: "Large exchange and product organization with global hiring.",
        tags: ["exchange", "global"],
        bestFor: "Structured roles and larger team environments.",
      },
      {
        name: "Binance Careers",
        url: "https://www.binance.com/en/careers",
        description: "Operations-heavy global hiring for growth and product.",
        tags: ["exchange", "operations"],
        bestFor: "High-scale operations and market-facing functions.",
      },
      {
        name: "Kraken Careers",
        url: "https://www.kraken.com/careers",
        description: "Remote-friendly roles in product, compliance, and growth.",
        tags: ["remote", "exchange"],
        bestFor: "Distributed teams with mature processes.",
      },
    ],
  },
  {
    key: "market-intelligence",
    title: "Job market intelligence",
    description: "Resources for evaluating hiring cycles, demand shifts, and role competitiveness.",
    resources: [
      {
        name: "Electric Capital Developer Report",
        url: "https://www.developerreport.com",
        description: "Annual data on developer activity and ecosystem growth trends.",
        tags: ["report", "ecosystem"],
        bestFor: "Understanding where builder demand is rising.",
      },
      {
        name: "LinkedIn Economic Graph",
        url: "https://economicgraph.linkedin.com",
        description: "Labor and hiring trend data by region and role.",
        tags: ["labor data", "hiring trends"],
        bestFor: "Macro view of role demand and market shifts.",
      },
      {
        name: "Web3.career Salary Explorer",
        url: "https://web3.career/salaries",
        description: "Salary benchmarks from Web3 job postings.",
        tags: ["salary", "benchmarks"],
        bestFor: "Compensation calibration before interviews.",
      },
      {
        name: "Messari Research",
        url: "https://messari.io/research",
        description: "Sector and protocol insights useful for company-quality evaluation.",
        tags: ["research", "sector analysis"],
        bestFor: "Filtering teams by long-term viability and focus.",
      },
    ],
  },
  {
    key: "guides-and-safety",
    title: "Job-seeking guides, interview prep, and scam awareness",
    description: "Practical resources for stronger applications and safer hiring interactions.",
    resources: [
      {
        name: "The Pragmatic Engineer",
        url: "https://newsletter.pragmaticengineer.com",
        description: "High-signal career and interview guidance from hiring perspectives.",
        tags: ["career guide", "interviews"],
        bestFor: "Improving applications, resumes, and interview stories.",
      },
      {
        name: "Y Combinator Interview Guide",
        url: "https://www.ycombinator.com/library",
        description: "Practical frameworks for role prep and interview communication.",
        tags: ["prep", "founder lens"],
        bestFor: "Structuring concise and credible interview answers.",
      },
      {
        name: "FTC Job Scam Tips",
        url: "https://consumer.ftc.gov/articles/job-scams",
        description: "Official guidance on spotting fake recruiters and payment scams.",
        tags: ["safety", "scam awareness"],
        bestFor: "Avoiding advance-fee, check-cashing, and identity traps.",
      },
      {
        name: "CISA Phishing Guidance",
        url: "https://www.cisa.gov/topics/cybersecurity-best-practices/phishing",
        description: "Security checklist for suspicious links, messages, and impersonation attempts.",
        tags: ["phishing", "security"],
        bestFor: "Reducing risk from malicious hiring outreach.",
      },
      {
        name: "CertiK Scam Insights",
        url: "https://www.certik.com/resources/blog",
        description: "Crypto scam patterns and threat reports relevant to job seekers.",
        tags: ["crypto scams", "risk"],
        bestFor: "Recognizing social-engineering tactics common in Web3.",
      },
    ],
  },
];

export const jobsAndCareersFeatured = jobsAndCareersModules
  .flatMap((module) => module.resources)
  .filter((resource) => resource.isFeatured);
