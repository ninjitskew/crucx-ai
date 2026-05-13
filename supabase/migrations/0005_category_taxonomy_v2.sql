-- Phase-1 Category Taxonomy v2
-- Adds primary_category, secondary_categories (text[]), sub_category columns.
-- 10 primary categories: Fiction & Literature, Mystery & Thriller, Romance,
-- Sci-Fi & Fantasy, Self-Mastery & Productivity, Psychology & Big Ideas,
-- Business & Money, Memoir & Biography, Children's Books, Poetry & Shorts.
-- Applied to live Supabase via MCP on 2026-04-20. Per-book backfill ran
-- separately (see supabase/seeds/category-mapping-proposal.md).

alter table public.book add column if not exists primary_category text;
alter table public.book add column if not exists secondary_categories text[] default '{}';
alter table public.book add column if not exists sub_category text;

create index if not exists book_primary_category_idx on public.book(primary_category);
create index if not exists book_secondary_categories_idx on public.book using gin(secondary_categories);
create index if not exists book_sub_category_idx on public.book(sub_category);
