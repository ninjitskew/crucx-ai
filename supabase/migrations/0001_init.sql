-- crucx.ai MVP schema (zero-cost: Supabase free tier)
-- Run this in Supabase SQL editor or via `supabase db push`.

create extension if not exists "pgcrypto";

-- ===== Users (mirrors auth.users) =====
create table if not exists public.app_user (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'reader' check (role in ('reader','author','admin')),
  created_at timestamptz not null default now()
);

-- ===== Profiles =====
create table if not exists public.author_profile (
  user_id uuid primary key references public.app_user(id) on delete cascade,
  pen_name text not null,
  slug text unique not null,
  bio text,
  avatar_url text,
  website text,
  created_at timestamptz not null default now()
);

create table if not exists public.reader_profile (
  user_id uuid primary key references public.app_user(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ===== Catalog =====
create table if not exists public.category (
  id serial primary key,
  slug text unique not null,
  name text not null
);

create table if not exists public.book (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  description text,
  author_id uuid references public.author_profile(user_id) on delete set null,
  cover_url text,
  price_inr integer not null default 0,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.book_category (
  book_id uuid references public.book(id) on delete cascade,
  category_id int references public.category(id) on delete cascade,
  primary key (book_id, category_id)
);

create table if not exists public.chapter (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.book(id) on delete cascade,
  idx int not null,
  title text not null,
  body text,
  is_sample boolean not null default false
);

-- ===== Engagement =====
create table if not exists public.review (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.book(id) on delete cascade,
  user_id uuid not null references public.app_user(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default now(),
  unique (book_id, user_id)
);

create table if not exists public.wishlist (
  user_id uuid references public.app_user(id) on delete cascade,
  book_id uuid references public.book(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, book_id)
);

create table if not exists public.follow (
  follower_id uuid references public.app_user(id) on delete cascade,
  author_id uuid references public.author_profile(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, author_id)
);

-- ===== Commerce (stubs — no live payments yet) =====
create table if not exists public.transaction (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.app_user(id) on delete set null,
  book_id uuid references public.book(id) on delete set null,
  amount_inr integer not null,
  kind text not null check (kind in ('purchase','royalty','payout','refund')),
  status text not null default 'pending',
  external_ref text,
  created_at timestamptz not null default now()
);

create table if not exists public.wallet (
  user_id uuid primary key references public.app_user(id) on delete cascade,
  balance_inr integer not null default 0,
  updated_at timestamptz not null default now()
);

-- ===== RLS =====
alter table public.app_user enable row level security;
alter table public.author_profile enable row level security;
alter table public.reader_profile enable row level security;
alter table public.book enable row level security;
alter table public.chapter enable row level security;
alter table public.review enable row level security;
alter table public.wishlist enable row level security;
alter table public.follow enable row level security;
alter table public.transaction enable row level security;
alter table public.wallet enable row level security;

-- Public read for catalog
create policy "books readable" on public.book for select using (status = 'published');
create policy "authors readable" on public.author_profile for select using (true);
create policy "categories readable" on public.category for select using (true);
create policy "reviews readable" on public.review for select using (true);
create policy "sample chapters readable" on public.chapter for select using (is_sample = true);

-- Owner-only writes
create policy "user self read" on public.app_user for select using (auth.uid() = id);
create policy "user self update" on public.app_user for update using (auth.uid() = id);

create policy "author self write" on public.author_profile
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "reader self write" on public.reader_profile
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "book author write" on public.book
  for all using (auth.uid() = author_id) with check (auth.uid() = author_id);

create policy "review owner write" on public.review
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "wishlist owner" on public.wishlist
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "wallet self read" on public.wallet for select using (auth.uid() = user_id);
