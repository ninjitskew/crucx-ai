// Unified book loader: Supabase (published) + JSON fallback.
// - Works at build time (Node/SSG) and runtime (browser after hydration).
// - DB wins on slug conflicts; JSON provides seed content when DB is empty.
// - Caches result in module scope to avoid N+1 during static generation.

import type { Book, Author } from "@/lib/types";
import booksJson from "@/content/books.json";
import authorsJson from "@/content/authors.json";

interface DbBookRow {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  author_id: string | null;
  author_name: string | null;
  cover_url: string | null;
  asin: string | null;
  amazon_in_url: string | null;
  amazon_com_url: string | null;
  price_inr: number | null;
  price_usd: number | string | null;
  currency_primary: string | null;
  super_category: string | null;
  bestseller_rank: number | null;
  rating: number | string | null;
  review_count: number | null;
  format: string | null;
  pages: number | null;
  published_date: string | null;
  published_at: string | null;
  status: string;
  created_at: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let cache: { books: Book[]; authors: Author[] } | null = null;
let inflight: Promise<{ books: Book[]; authors: Author[] }> | null = null;

async function fetchDbBooks(): Promise<DbBookRow[]> {
  if (!supabaseUrl || !supabaseAnonKey) return [];
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/book?select=*&status=eq.published&order=created_at.desc`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    return (await res.json()) as DbBookRow[];
  } catch {
    return [];
  }
}

function normalizeDbBook(row: DbBookRow): Book {
  const priceUsd = row.price_usd != null ? Number(row.price_usd) : undefined;
  const priceInr = row.price_inr != null ? Number(row.price_inr) : undefined;
  const rating = row.rating != null ? Number(row.rating) : undefined;
  // Build an authorSlug from author_name for compatibility; fall back to "external"
  const authorSlug = row.author_name
    ? row.author_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "external"
    : "external";

  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    authorSlug,
    authorName: row.author_name ?? undefined,
    category: row.super_category ?? "Other",
    superCategory: row.super_category ?? undefined,
    // Curated affiliate books (those with an ASIN) are all Amazon bestsellers
    // by definition. Books with high review counts also qualify.
    tags: row.asin || (row.review_count != null && row.review_count >= 10000)
      ? ["bestseller"]
      : [],
    cover: row.cover_url ?? "",
    coverUrl: row.cover_url ?? undefined,
    description: row.description ?? "",
    price: priceUsd ?? (priceInr != null ? Math.round(priceInr * 0.012 * 100) / 100 : 0),
    priceUsd,
    priceInr,
    currencyPrimary: (row.currency_primary === "INR" ? "INR" : "USD"),
    rating,
    reviewCount: row.review_count ?? undefined,
    format: row.format ?? undefined,
    pages: row.pages ?? undefined,
    publishedAt: row.published_at ?? row.published_date ?? row.created_at,
    status: (row.status as Book["status"]) ?? "published",
    asin: row.asin ?? undefined,
    amazonInUrl: row.amazon_in_url ?? undefined,
    amazonComUrl: row.amazon_com_url ?? undefined,
    bestsellerRank: row.bestseller_rank ?? undefined,
    source: "db",
  };
}

function normalizeJsonBook(b: Book): Book {
  return {
    ...b,
    source: "json",
    // legacy buyUrl → amazonInUrl if not otherwise set
    amazonInUrl: b.amazonInUrl ?? (b.buyUrl?.includes("amazon.in") ? b.buyUrl : undefined),
    amazonComUrl: b.amazonComUrl ?? (b.buyUrl?.includes("amazon.com") ? b.buyUrl : undefined),
  };
}

async function build(): Promise<{ books: Book[]; authors: Author[] }> {
  const jsonBooks = (booksJson as Book[]).map(normalizeJsonBook);
  const jsonAuthors = authorsJson as Author[];

  const dbRows = await fetchDbBooks();
  const dbBooks = dbRows.map(normalizeDbBook);

  // Merge with DB winning on slug conflict
  const bySlug = new Map<string, Book>();
  for (const b of jsonBooks) bySlug.set(b.slug, b);
  for (const b of dbBooks) bySlug.set(b.slug, b);
  const books = Array.from(bySlug.values());

  // Build author index: include JSON authors + synthesized from DB author_name
  const authorBySlug = new Map<string, Author>();
  for (const a of jsonAuthors) authorBySlug.set(a.slug, a);
  for (const b of dbBooks) {
    if (b.authorName && b.authorSlug && !authorBySlug.has(b.authorSlug)) {
      authorBySlug.set(b.authorSlug, {
        slug: b.authorSlug,
        name: b.authorName,
        tagline: b.superCategory,
        bio: "",
        avatar: "",
        books: [b.slug],
      });
    } else if (b.authorName && b.authorSlug && authorBySlug.has(b.authorSlug)) {
      const existing = authorBySlug.get(b.authorSlug)!;
      if (!existing.books.includes(b.slug)) existing.books.push(b.slug);
    }
  }

  return { books, authors: Array.from(authorBySlug.values()) };
}

/** Returns merged books from DB + JSON. Cached after first call. */
export async function getAllBooks(): Promise<Book[]> {
  const data = await getContent();
  return data.books;
}

/** Returns merged authors from DB + JSON. Cached after first call. */
export async function getAllAuthors(): Promise<Author[]> {
  const data = await getContent();
  return data.authors;
}

export async function getBookBySlug(slug: string): Promise<Book | undefined> {
  const books = await getAllBooks();
  return books.find((b) => b.slug === slug);
}

export async function getAuthorBySlug(slug: string): Promise<Author | undefined> {
  const authors = await getAllAuthors();
  return authors.find((a) => a.slug === slug);
}

export async function getContent() {
  if (cache) return cache;
  if (!inflight) inflight = build();
  cache = await inflight;
  return cache;
}

/** Force-refresh (used by dev / after admin updates). No-op at build time after first call. */
export function invalidateCache() {
  cache = null;
  inflight = null;
}
