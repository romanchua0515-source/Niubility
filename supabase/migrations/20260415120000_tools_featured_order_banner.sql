-- Featured carousel ordering + optional custom hero image (Supabase Storage public URL)

alter table public.tools
  add column if not exists featured_order integer not null default 0;

alter table public.tools
  add column if not exists banner_image_url text;

create index if not exists tools_featured_order_idx
  on public.tools (is_featured, featured_order)
  where is_featured = true;
