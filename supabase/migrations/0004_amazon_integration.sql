-- Phase-1: Amazon affiliate catalog integration
-- Extends book table with Amazon metadata, adds event tracking + FX rates.
-- Applied to live Supabase via MCP on 2026-04-20.

-- 1) Extend book table for Amazon metadata
alter table public.book add column if not exists asin text;
alter table public.book add column if not exists amazon_in_url text;
alter table public.book add column if not exists amazon_com_url text;
alter table public.book add column if not exists price_usd numeric(10,2);
alter table public.book add column if not exists currency_primary text default 'USD';
alter table public.book add column if not exists asin_last_synced_at timestamptz;
alter table public.book add column if not exists super_category text;         -- Fiction | Non-fiction | Children | Shorts
alter table public.book add column if not exists bestseller_rank int;
alter table public.book add column if not exists author_name text;            -- free-text for affiliate books
alter table public.book add column if not exists rating numeric(3,2);
alter table public.book add column if not exists review_count int;
alter table public.book add column if not exists format text;                 -- Paperback | Hardcover | Kindle | Audiobook
alter table public.book add column if not exists pages int;
alter table public.book add column if not exists published_date date;

create index if not exists book_super_category_idx on public.book(super_category);
create index if not exists book_status_idx on public.book(status);
create unique index if not exists book_asin_unique on public.book(asin) where asin is not null;

-- 2) FX rate table for currency conversion (refreshed daily by cron)
create table if not exists public.fx_rate (
  base text not null,
  quote text not null,
  rate numeric(14,6) not null,
  as_of timestamptz not null default now(),
  primary key (base, quote)
);

alter table public.fx_rate enable row level security;
drop policy if exists "anyone reads fx" on public.fx_rate;
create policy "anyone reads fx" on public.fx_rate for select using (true);

insert into public.fx_rate (base, quote, rate) values
  ('USD', 'USD', 1.000000),
  ('USD', 'INR', 83.500000),
  ('USD', 'EUR', 0.920000),
  ('USD', 'GBP', 0.790000),
  ('INR', 'USD', 0.011976),
  ('INR', 'INR', 1.000000)
on conflict (base, quote) do nothing;

-- 3) Event: book page views
create table if not exists public.book_view_event (
  id uuid primary key default gen_random_uuid(),
  book_slug text not null,
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  country text,
  user_agent text,
  ts timestamptz not null default now()
);
create index if not exists book_view_slug_ts_idx on public.book_view_event(book_slug, ts desc);
create index if not exists book_view_ts_idx on public.book_view_event(ts desc);
create index if not exists book_view_user_idx on public.book_view_event(user_id) where user_id is not null;

-- 4) Event: outbound clicks to Amazon
create table if not exists public.book_outbound_click_event (
  id uuid primary key default gen_random_uuid(),
  book_slug text not null,
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  target_store text,       -- 'amazon.in' | 'amazon.com'
  referrer text,
  country text,
  user_agent text,
  ts timestamptz not null default now()
);
create index if not exists book_click_slug_ts_idx on public.book_outbound_click_event(book_slug, ts desc);
create index if not exists book_click_ts_idx on public.book_outbound_click_event(ts desc);
create index if not exists book_click_user_idx on public.book_outbound_click_event(user_id) where user_id is not null;

-- 5) RLS on event tables: anyone can insert (incl. anon), admins can read
alter table public.book_view_event enable row level security;
alter table public.book_outbound_click_event enable row level security;

drop policy if exists "anyone insert view" on public.book_view_event;
create policy "anyone insert view" on public.book_view_event for insert with check (true);

drop policy if exists "admin read views" on public.book_view_event;
create policy "admin read views" on public.book_view_event for select
using (exists (select 1 from public.app_user where id = auth.uid() and role = 'admin'));

drop policy if exists "anyone insert click" on public.book_outbound_click_event;
create policy "anyone insert click" on public.book_outbound_click_event for insert with check (true);

drop policy if exists "admin read clicks" on public.book_outbound_click_event;
create policy "admin read clicks" on public.book_outbound_click_event for select
using (exists (select 1 from public.app_user where id = auth.uid() and role = 'admin'));

-- 6) Book access policies
drop policy if exists "public reads published books" on public.book;
create policy "public reads published books" on public.book for select
using (
  status = 'published'
  or exists (select 1 from public.app_user where id = auth.uid() and role = 'admin')
);

drop policy if exists "admin writes books" on public.book;
create policy "admin writes books" on public.book for all
using (exists (select 1 from public.app_user where id = auth.uid() and role = 'admin'))
with check (exists (select 1 from public.app_user where id = auth.uid() and role = 'admin'));
