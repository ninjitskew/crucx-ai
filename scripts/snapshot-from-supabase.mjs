// Optional build-time snapshot: pulls published books + authors from Supabase
// and overwrites src/content/{books,authors}.json so the static export ships
// the latest CMS content. Runs only when SUPABASE_SERVICE_ROLE_KEY is set;
// otherwise it is a silent no-op so local dev without Supabase still works.

import { writeFileSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!url || !key) {
  console.log("[snapshot] SUPABASE_SERVICE_ROLE_KEY not set — skipping snapshot, keeping existing JSON.");
  process.exit(0);
}

async function rest(path) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

try {
  const [books, authors] = await Promise.all([
    rest("book?status=eq.published&select=*"),
    rest("author_profile?select=*"),
  ]);

  // Map DB rows to the shape used by src/content/*.json so the marketplace
  // static export continues to work without touching read sites.
  const mappedBooks = books.map((b) => ({
    slug: b.slug,
    title: b.title,
    subtitle: b.subtitle ?? undefined,
    authorSlug: b.author_slug ?? "",
    category: b.category ?? "General",
    tags: [],
    cover: b.cover_url ?? "",
    description: b.description ?? "",
    price: (b.price_inr ?? 0) / 100,
    rating: b.rating ?? 0,
    reviewCount: b.review_count ?? 0,
    format: "eBook",
    pages: b.pages ?? 0,
    publishedAt: b.published_at ?? b.created_at ?? new Date().toISOString(),
    status: "published",
  }));

  const mappedAuthors = authors.map((a) => ({
    slug: a.slug,
    name: a.pen_name,
    tagline: a.tagline ?? "",
    bio: a.bio ?? "",
    avatar: a.avatar_url ?? "",
    books: [],
    joinedAt: a.created_at,
  }));

  // Only overwrite if we actually got rows; otherwise fall through to the existing fixtures
  // so the site doesn't ship empty.
  if (mappedBooks.length > 0) {
    writeFileSync(resolve(root, "src/content/books.json"), JSON.stringify(mappedBooks, null, 2));
    console.log(`[snapshot] wrote ${mappedBooks.length} books`);
  } else {
    console.log("[snapshot] no published books — keeping existing JSON");
  }
  if (mappedAuthors.length > 0) {
    writeFileSync(resolve(root, "src/content/authors.json"), JSON.stringify(mappedAuthors, null, 2));
    console.log(`[snapshot] wrote ${mappedAuthors.length} authors`);
  } else {
    console.log("[snapshot] no authors — keeping existing JSON");
  }
} catch (e) {
  console.warn("[snapshot] failed — keeping existing JSON:", e.message);
  // Don't fail the build — graceful fallback.
  // Verify existing JSON is still valid.
  try {
    JSON.parse(readFileSync(resolve(root, "src/content/books.json"), "utf8"));
    JSON.parse(readFileSync(resolve(root, "src/content/authors.json"), "utf8"));
  } catch (e2) {
    console.error("[snapshot] existing JSON is invalid:", e2.message);
    process.exit(1);
  }
}
