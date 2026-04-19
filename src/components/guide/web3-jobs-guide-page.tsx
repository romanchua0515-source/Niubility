"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/context/LanguageContext";
import type { Guide, Person } from "@/lib/api";
import {
  AlertTriangle,
  ChevronDown,
  ExternalLink,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Platform = {
  name: string;
  descriptionEn: string;
  descriptionZh: string;
  url: string;
};

const PLATFORMS: Platform[] = [
  {
    name: "web3.career",
    descriptionEn: "Most listings, all roles.",
    descriptionZh: "职位数量最多，涵盖所有岗位。",
    url: "https://web3.career",
  },
  {
    name: "cryptojobslist.com",
    descriptionEn: "Great filters for developers.",
    descriptionZh: "为开发者提供强大的筛选器。",
    url: "https://cryptojobslist.com",
  },
  {
    name: "jobs.bankless.com",
    descriptionEn: "High quality, community-vetted.",
    descriptionZh: "高质量，社区严选。",
    url: "https://jobs.bankless.com",
  },
  {
    name: "recruitd.io",
    descriptionEn: "Web3-native, clean UX.",
    descriptionZh: "原生 Web3 体验，界面简洁。",
    url: "https://recruitd.io",
  },
  {
    name: "LinkedIn (Web3 filter)",
    descriptionEn: "Best for BD and marketing roles.",
    descriptionZh: "最适合商务拓展与市场类岗位。",
    url: "https://www.linkedin.com/jobs/web3-jobs",
  },
  {
    name: "Telegram groups",
    descriptionEn: "Best for referrals and insider roles.",
    descriptionZh: "最适合内推和圈内职位。",
    url: "https://t.me",
  },
];

type RoadmapStep = {
  en: { title: string; description: string };
  zh: { title: string; description: string };
};

const ROADMAP: RoadmapStep[] = [
  {
    en: {
      title: "Learn the basics (2–4 weeks)",
      description:
        "Read Bankless, Messari, and build a mental model of wallets, gas, L1 vs L2, and DeFi primitives.",
    },
    zh: {
      title: "学习基础（2–4 周）",
      description:
        "阅读 Bankless、Messari，建立钱包、Gas、L1/L2 以及 DeFi 基础组件的完整心智模型。",
    },
  },
  {
    en: {
      title: "Pick your track",
      description: "Dev / Marketing / Ops / Research. Specialize early.",
    },
    zh: {
      title: "选择你的赛道",
      description: "开发 / 市场 / 运营 / 研究。尽早专注于一个方向。",
    },
  },
  {
    en: {
      title: "Build proof of work",
      description:
        "Ship something public: a Dune dashboard, a Paragraph article, a Farcaster frame, a small smart contract.",
    },
    zh: {
      title: "沉淀可验证作品",
      description:
        "公开输出：Dune 看板、Paragraph 文章、Farcaster frame 或一个小型智能合约。",
    },
  },
  {
    en: {
      title: "Apply + network",
      description:
        "Apply through the boards above, then DM founders on Twitter with your proof of work attached.",
    },
    zh: {
      title: "投递 + 建立人脉",
      description:
        "通过上述平台投递，并在 Twitter 上直接联系创始人，附上你的作品。",
    },
  },
  {
    en: {
      title: "First job checklist",
      description:
        "Get paid in stablecoins, set up a cold wallet, understand your vesting, and keep shipping in public.",
    },
    zh: {
      title: "入职检查清单",
      description:
        "用稳定币领薪、配置冷钱包、读懂你的解锁条款，并持续公开输出。",
    },
  },
];

type Web3JobsGuidePageProps = {
  people: Person[];
  scamGuides: Guide[];
};

export function Web3JobsGuidePage({
  people,
  scamGuides,
}: Web3JobsGuidePageProps) {
  const { lang, t } = useLanguage();
  const zh = lang === "zh";

  return (
    <div className="relative flex min-h-screen flex-col bg-[#050506]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(52,211,153,0.08),transparent)]"
        aria-hidden
      />
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          {t("linkBackShort")}
        </Link>

        <header className="mt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/85">
            GUIDE · WEB3 JOBS
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            {zh
              ? "从零开始的 Web3 求职完整指南"
              : "Your complete roadmap to landing a Web3 role"}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {zh
              ? "招聘平台、值得关注的人、防骗指南、入行路线图——一站式。"
              : "Job boards, who to follow, scam prevention, and a step-by-step entry roadmap — all in one place."}
          </p>
        </header>

        <PlatformsSection zh={zh} />
        <WhoToFollowSection people={people} zh={zh} />
        <ScamPreventionSection guides={scamGuides} zh={zh} />
        <RoadmapSection zh={zh} />
      </main>
      <SiteFooter />
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/85">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">
        {title}
      </h2>
    </div>
  );
}

function PlatformsSection({ zh }: { zh: boolean }) {
  return (
    <section className="mt-12">
      <SectionTitle
        eyebrow={zh ? "第一部分" : "SECTION 1"}
        title={zh ? "Web3 招聘平台" : "Job Platforms"}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {PLATFORMS.map((p) => (
          <article
            key={p.name}
            className="rounded-xl border border-zinc-800/80 bg-zinc-900/35 p-4 transition-colors hover:border-zinc-700/60 hover:bg-zinc-900/80"
          >
            <h3 className="text-sm font-semibold text-zinc-100">{p.name}</h3>
            <p className="mt-1 text-xs text-zinc-400">
              {zh ? p.descriptionZh : p.descriptionEn}
            </p>
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-950/60 px-2.5 py-1.5 text-[11px] font-medium text-zinc-200 transition-colors hover:border-emerald-500/60 hover:text-emerald-300"
            >
              {zh ? "访问" : "Visit"}
              <ExternalLink className="h-3 w-3" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function WhoToFollowSection({
  people,
  zh,
}: {
  people: Person[];
  zh: boolean;
}) {
  return (
    <section className="mt-12">
      <SectionTitle
        eyebrow={zh ? "第二部分" : "SECTION 2"}
        title={zh ? "值得关注的人" : "Who to Follow"}
      />
      {people.length === 0 ? (
        <p className="text-sm text-zinc-500">
          {zh
            ? "暂无人物数据。管理员可在后台添加。"
            : "No people yet. Add some via the admin dashboard."}
        </p>
      ) : (
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
          {people.map((p) => (
            <PersonCard key={p.id} person={p} zh={zh} />
          ))}
        </div>
      )}
    </section>
  );
}

function PersonCard({ person, zh }: { person: Person; zh: boolean }) {
  const displayName = zh && person.name_zh ? person.name_zh : person.name;
  const bio = zh ? person.bio_zh : person.bio;
  const notable = zh ? person.notable_work_zh : person.notable_work;

  return (
    <article className="flex w-72 shrink-0 flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/35 p-4 sm:w-auto">
      <div className="flex items-center gap-3">
        {person.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={person.avatar_url}
            alt={displayName}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-zinc-800"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
            {initialsOf(displayName)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-100">
            {displayName}
          </p>
          <span className="mt-0.5 inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            {person.role}
          </span>
        </div>
      </div>
      <p className="mt-3 line-clamp-3 text-xs text-zinc-400">{bio}</p>
      <p className="mt-2 line-clamp-2 text-[11px] text-zinc-500">{notable}</p>
      {person.twitter_url && (
        <a
          href={person.twitter_url}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-950/60 px-2.5 py-1.5 text-[11px] font-medium text-zinc-200 transition-colors hover:border-emerald-500/60 hover:text-emerald-300"
        >
          <Twitter className="h-3 w-3" />
          {zh ? "Twitter" : "Twitter"}
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </article>
  );
}

function ScamPreventionSection({
  guides,
  zh,
}: {
  guides: Guide[];
  zh: boolean;
}) {
  return (
    <section className="mt-12">
      <SectionTitle
        eyebrow={zh ? "第三部分" : "SECTION 3"}
        title={zh ? "防骗指南" : "Scam Prevention"}
      />
      {guides.length === 0 ? (
        <p className="text-sm text-zinc-500">
          {zh ? "暂无防骗内容。" : "No scam-prevention content yet."}
        </p>
      ) : (
        <div className="space-y-2">
          {guides.map((g, i) => (
            <ScamGuideItem key={g.id} guide={g} zh={zh} defaultOpen={i === 0} />
          ))}
        </div>
      )}
    </section>
  );
}

function ScamGuideItem({
  guide,
  zh,
  defaultOpen,
}: {
  guide: Guide;
  zh: boolean;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const title = zh ? guide.title_zh : guide.title;
  const content = zh ? guide.content_zh : guide.content;

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/35 transition-colors hover:border-zinc-700/60">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
          <AlertTriangle className="h-4 w-4 shrink-0 text-orange-400" />
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="border-t border-zinc-800/60 px-4 py-3">
          <p className="text-sm leading-relaxed text-zinc-400">{content}</p>
        </div>
      )}
    </div>
  );
}

function RoadmapSection({ zh }: { zh: boolean }) {
  return (
    <section className="mt-12 mb-8">
      <SectionTitle
        eyebrow={zh ? "第四部分" : "SECTION 4"}
        title={zh ? "入行路线图" : "Entry Roadmap"}
      />
      <ol className="space-y-4">
        {ROADMAP.map((step, i) => {
          const content = zh ? step.zh : step.en;
          return (
            <li
              key={i}
              className="flex gap-4 rounded-xl border border-zinc-800/80 bg-zinc-900/35 p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10 text-sm font-semibold text-emerald-400">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-zinc-100">
                  {content.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  {content.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
