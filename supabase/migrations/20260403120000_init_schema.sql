-- Phase 1 schema: categories, subcategories, tools + RLS (public read only)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- categories (explore parent tiles; includes cover art)
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  title_zh text,
  cover_image text not null,
  created_at timestamptz not null default now()
);

create index categories_slug_idx on public.categories (slug);

-- ---------------------------------------------------------------------------
-- subcategories (leaf slugs under a parent category)
-- ---------------------------------------------------------------------------
create table public.subcategories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  name_zh text,
  category_id uuid not null references public.categories (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (category_id, slug)
);

create index subcategories_category_id_idx on public.subcategories (category_id);

-- ---------------------------------------------------------------------------
-- tools (directory listings)
-- ---------------------------------------------------------------------------
create table public.tools (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  description_zh text,
  best_for text not null,
  best_for_zh text,
  category_slug text not null,
  subcategory_slug text not null,
  website_url text not null,
  affiliate_url text,
  pricing text not null,
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index tools_category_sub_idx on public.tools (category_slug, subcategory_slug);
create index tools_featured_idx on public.tools (is_featured) where is_featured = true;

-- ---------------------------------------------------------------------------
-- Row Level Security: anonymous + authenticated can SELECT only
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.tools enable row level security;

create policy "categories_select_public"
  on public.categories
  for select
  to anon, authenticated
  using (true);

create policy "subcategories_select_public"
  on public.subcategories
  for select
  to anon, authenticated
  using (true);

create policy "tools_select_public"
  on public.tools
  for select
  to anon, authenticated
  using (true);
