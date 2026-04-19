-- =============================================================================
-- People + Guides tables
-- People backs the "Who to Follow" section on guide pages.
-- Guides backs dynamic content blocks (scam prevention, roadmaps, etc.).
-- =============================================================================

CREATE TABLE public.people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_zh text,
  avatar_url text,
  role text NOT NULL,
  bio text NOT NULL,
  bio_zh text NOT NULL,
  twitter_url text,
  linkedin_url text,
  website_url text,
  notable_work text NOT NULL,
  notable_work_zh text NOT NULL,
  is_featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_slug text NOT NULL,
  category text NOT NULL
    CHECK (category IN (
      'scam-prevention',
      'roadmap',
      'resource',
      'workflow'
    )),
  title text NOT NULL,
  title_zh text NOT NULL,
  content text NOT NULL,
  content_zh text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX people_role_idx ON public.people (role);
CREATE INDEX people_featured_idx ON public.people (is_featured)
  WHERE is_featured = true;
CREATE INDEX guides_slug_idx ON public.guides (guide_slug);

ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "people_select_public"
  ON public.people FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "guides_select_public"
  ON public.guides FOR SELECT TO anon, authenticated USING (true);

-- =============================================================================
-- Seed data: 5 people, 4 scam-prevention guides for /guide/web3-jobs
-- =============================================================================

INSERT INTO public.people
  (name, name_zh, role, bio, bio_zh, twitter_url,
   notable_work, notable_work_zh, is_featured, display_order)
VALUES
(
  'Gaby Goldberg', NULL,
  'Recruiter',
  'Partner at TCG Crypto. Focuses on Web3 talent and early-stage projects.',
  '加密风投 TCG Crypto 合伙人，专注 Web3 人才与早期项目。',
  'https://twitter.com/gabygoldberg',
  'Built one of the most active Web3 talent networks in crypto.',
  '建立了加密圈最活跃的 Web3 人才网络之一。',
  true, 1
),
(
  'Allie Nguyen', NULL,
  'Recruiter',
  'Web3 recruiter and career coach. Helps people transition into crypto roles.',
  'Web3 猎头兼职业教练，帮助人们转型进入加密行业。',
  'https://twitter.com/allienguyen_',
  'Has helped 100+ people land their first Web3 job.',
  '帮助超过 100 人拿到第一份 Web3 工作。',
  true, 2
),
(
  'Julia Rosenberg', NULL,
  'Recruiter',
  'Talent lead focused on DeFi and infrastructure teams.',
  '专注 DeFi 和基础设施团队的人才负责人。',
  'https://twitter.com/juliarosenberg',
  'Built talent pipelines for multiple top-10 DeFi protocols.',
  '为多个顶级 DeFi 协议建立人才管道。',
  false, 3
),
(
  'Hiring Chain', NULL,
  'Job Board',
  'Curated Web3 job board with verified listings from top crypto companies.',
  '精选 Web3 职位板，收录顶级加密公司的核实职位。',
  'https://twitter.com/hiringchain',
  'One of the most trusted Web3 job sources in the ecosystem.',
  '行业内最受信任的 Web3 职位来源之一。',
  true, 4
),
(
  'Cryptocurrency Jobs', NULL,
  'Job Board',
  'One of the oldest and most comprehensive Web3 job aggregators.',
  '最老牌、最全面的 Web3 职位聚合平台之一。',
  'https://twitter.com/cryptocurrencyjobs',
  'Has listed over 50,000 Web3 jobs since 2017.',
  '自 2017 年以来已发布超过 5 万个 Web3 职位。',
  false, 5
);

INSERT INTO public.guides
  (guide_slug, category, title, title_zh,
   content, content_zh, display_order)
VALUES
(
  'web3-jobs',
  'scam-prevention',
  'The fake job offer scam',
  '虚假工作邀约骗局',
  'Scammers pose as recruiters from top crypto companies. Red flags: they contact you first on Telegram, offer unusually high salaries, ask you to complete a "test task" that requires downloading unknown software, or request your seed phrase to "verify your wallet".',
  '骗子冒充顶级加密公司的招聘人员。危险信号：他们主动在 Telegram 上联系你、提供异常高薪、要求你完成需要下载未知软件的"测试任务"，或以"验证钱包"为由索取你的助记词。',
  1
),
(
  'web3-jobs',
  'scam-prevention',
  'How to verify a company is real',
  '如何验证公司的真实性',
  'Before accepting any offer: 1) Check the company on-chain — do they have real treasury activity? 2) Find their official website independently, do not click links from recruiters. 3) Verify the recruiter on LinkedIn matches the company team page. 4) Ask for a video call with at least two team members.',
  '在接受任何工作邀约之前：1) 链上核查公司——他们有真实的资金活动吗？2) 独立查找官方网站，不要点击招聘人员发的链接。3) 核实 LinkedIn 上的招聘人员是否与公司团队页面匹配。4) 要求与至少两名团队成员进行视频通话。',
  2
),
(
  'web3-jobs',
  'scam-prevention',
  'Never share your private key or seed phrase',
  '永远不要分享你的私钥或助记词',
  'No legitimate employer will ever ask for your private key or seed phrase. Ever. Not to verify your wallet, not to send you a test payment, not for any reason. If anyone asks, end the conversation immediately and report the account.',
  '任何合法雇主都不会索取你的私钥或助记词。永远不会。不是为了验证你的钱包，不是为了向你发送测试付款，任何理由都不行。如果有人索取，立即结束对话并举报该账号。',
  3
),
(
  'web3-jobs',
  'scam-prevention',
  'The "trial task" trap',
  '"试用任务"陷阱',
  'A common scam: you are asked to complete a paid trial task, but the payment requires you to first send crypto to "activate" your account. Legitimate companies never ask candidates to send money. Walk away immediately.',
  '常见骗局：你被要求完成一项付费试用任务，但收款需要你先发送加密货币来"激活"账户。合法公司从不要求候选人汇款。立即离开。',
  4
);
