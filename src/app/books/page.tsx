import Link from "next/link";
import { getAllBooks, getAllAuthors } from "@/lib/content/books-source";
import BookCarousel from "@/components/marketplace/BookCarousel";
import FollowedAuthorsCarousel from "@/components/marketplace/FollowedAuthorsCarousel";
import type { Book } from "@/lib/types";

const CATEGORIES = [
  "Fiction",
  "Self-Help",
  "Business",
  "Romance",
  "Mystery",
  "Sci-Fi",
  "Strategy",
  "Poetry",
];

export default async function BooksIndex() {
  const all = await getAllBooks();
  const auths = await getAllAuthors();

  const has = (b: Book, t: string) => (b.tags ?? []).includes(t);
  const bestsellers = all.filter((b) => has(b, "bestseller"));
  const newReleases = [...all].sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1)).slice(0, 8);
  const trending = all.filter((b) => has(b, "trending"));
  const picks = all.filter((b) => has(b, "picks"));
  const rising = all.filter((b) => has(b, "rising"));

  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border-default">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/15 via-accent-purple/10 to-accent-pink/15" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="mb-3 text-xs uppercase tracking-wider text-accent-blue">Reader Marketplace</p>
          <h1 className="max-w-3xl font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-text-primary sm:text-5xl lg:text-6xl">
            Discover books from independent authors.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-text-secondary">
            Bestsellers, new releases, and rising voices — curated daily by the crucx team.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/search/" className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-3 text-sm font-semibold text-white">
              Search the catalog
            </Link>
            <Link href="/marketplace/fiction/1/" className="rounded-xl border border-border-default px-5 py-3 text-sm font-semibold text-text-primary hover:border-accent-blue">
              Browse Fiction
            </Link>
          </div>
        </div>
      </section>

      <BookCarousel title="Bestsellers" subtitle="What readers are buying now" books={bestsellers} authors={auths} />
      <BookCarousel title="New Releases" subtitle="Fresh from independent authors" books={newReleases} authors={auths} />
      <BookCarousel title="Trending" subtitle="Buzzing this week" books={trending} authors={auths} />
      <BookCarousel title="Crucx Picks" subtitle="Hand-curated by our editors" books={picks} authors={auths} />
      <BookCarousel title="Rising Authors" subtitle="Names you'll know soon" books={rising} authors={auths} />
      <FollowedAuthorsCarousel />

      {/* Category grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-text-primary sm:text-3xl">Browse by category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/marketplace/${c.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/1/`}
              className="rounded-2xl border border-border-default bg-bg-card px-5 py-8 text-center font-semibold text-text-primary transition hover:border-accent-blue hover:bg-bg-secondary"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
