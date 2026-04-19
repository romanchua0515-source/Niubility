-- Phase 1: Full Static Data Migration to Supabase
-- Extends `tools` with hot/quick_pick/featured_order flags and creates
-- `signals`, `role_page_sections`, `job_careers`, `top_searched` tables.

-- =========================================================================
-- 1A. Extend `tools` table (is_featured already exists — do not touch)
-- =========================================================================
ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS featured_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_hot boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS hot_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_quick_pick boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS quick_pick_order integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS tools_hot_idx
  ON public.tools (is_hot) WHERE is_hot = true;
CREATE INDEX IF NOT EXISTS tools_quick_pick_idx
  ON public.tools (is_quick_pick) WHERE is_quick_pick = true;

-- =========================================================================
-- 1B. `signals` table
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_zh text NOT NULL,
  description text NOT NULL,
  description_zh text NOT NULL,
  type text NOT NULL CHECK (type IN ('TOPIC', 'TOOL', 'RESOURCE')),
  week_label text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS signals_week_idx ON public.signals (week_label);

ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "signals_select_public" ON public.signals;
CREATE POLICY "signals_select_public"
  ON public.signals FOR SELECT TO anon, authenticated USING (true);

-- =========================================================================
-- 1C. `role_page_sections` table
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.role_page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_slug text NOT NULL,
  section_type text NOT NULL CHECK (
    section_type IN ('hero', 'tool_group', 'workflow', 'resource')
  ),
  title text NOT NULL,
  title_zh text NOT NULL,
  description text,
  description_zh text,
  tool_slugs text[] NOT NULL DEFAULT '{}',
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS role_sections_slug_idx
  ON public.role_page_sections (role_slug);

ALTER TABLE public.role_page_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "role_sections_select_public" ON public.role_page_sections;
CREATE POLICY "role_sections_select_public"
  ON public.role_page_sections FOR SELECT TO anon, authenticated USING (true);

-- =========================================================================
-- 1D. `job_careers` table
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.job_careers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_zh text NOT NULL,
  company text NOT NULL,
  company_zh text,
  location text,
  url text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_careers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "job_careers_select_public" ON public.job_careers;
CREATE POLICY "job_careers_select_public"
  ON public.job_careers FOR SELECT TO anon, authenticated USING (true);

-- =========================================================================
-- 1E. `top_searched` table
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.top_searched (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  label_zh text NOT NULL,
  query text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE public.top_searched ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "top_searched_select_public" ON public.top_searched;
CREATE POLICY "top_searched_select_public"
  ON public.top_searched FOR SELECT TO anon, authenticated USING (true);

-- =========================================================================
-- 1F. Service role write policies for all new tables
-- =========================================================================
DROP POLICY IF EXISTS "signals_service_write" ON public.signals;
CREATE POLICY "signals_service_write"
  ON public.signals USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "role_sections_service_write" ON public.role_page_sections;
CREATE POLICY "role_sections_service_write"
  ON public.role_page_sections USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "job_careers_service_write" ON public.job_careers;
CREATE POLICY "job_careers_service_write"
  ON public.job_careers USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "top_searched_service_write" ON public.top_searched;
CREATE POLICY "top_searched_service_write"
  ON public.top_searched USING (auth.role() = 'service_role');
