import Link from "next/link";
import { getAllBooks, getAllAuthors } from "@/lib/content/books-source";
import BookCarousel from "@/components/marketplace/BookCarousel";
import FollowedAuthorsCarousel from "@/components/marketplace/FollowedAuthorsCarousel";
import { CATEGORIES, type CategoryDef } from "@/lib/categories";
import type { Book } from "@/lib/types";

export default async function BooksIndex() {
  const all = await getAllBooks();
  const auths = await getAllAuthors();

  const has = (b: Book, t: string) => (b.tags ?? []).includes(t);
  const inCategory = (b: Book, name: string) =>
    b.primaryCategory === name || (b.secondaryCategories ?? []).includes(name);

  const bestsellers = all.filter((b) => has(b, "bestseller"));
  const newReleases = [...all]
    .filter((b) => b.publishedAt)
    .sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1))
    .slice(0, 12);

  // Build counts + 4 sample covers per category
  const categoryStats: { cat: CategoryDef; count: number; sampleBooks: Book[] }[] = CATEGORIES.map(
    (cat) => {
      const matches = all.filter((b) => inCategory(b, cat.name));
      return { cat, count: matches.length, sampleBooks: matches.slice(0, 4) };
    }
  );

  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border-default">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/15 via-accent-purple/10 to-accent-pink/15" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="mb-3 text-xs uppercase tracking-wider text-accent-blue">Reader Marketplace</p>
          <h1 className="max-w-3xl font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-text-primary sm:text-5xl lg:text-6xl">
            Discover your next great read.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-text-secondary">
            Curated bestsellers across fiction, non-fiction, children&apos;s books, and short reads — handpicked daily.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/search/"
              className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-3 text-sm font-semibold text-white"
            >
              Search the catalog
            </Link>
            <Link
              href="/marketplace/fiction-and-literature/1/"
              className="rounded-xl border border-border-default px-5 py-3 text-sm font-semibold text-text-primary hover:border-accent-blue"
            >
              Browse Fiction
            </Link>
          </div>
        </div>
      </section>

      {/* 10-category grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Browse by category</h2>
            <p className="mt-1 text-sm text-text-secondary">10 carefully curated shelves. {all.length} books and growing.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categoryStats.map(({ cat, count, sampleBooks }) => (
            <Link
              key={cat.slug}
              href={`/marketplace/${cat.slug}/1/`}
              className="group relative overflow-hidden rounded-2xl border border-border-default bg-bg-card p-5 transition hover:border-accent-blue hover:bg-bg-secondary"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl">{cat.icon}</span>
                <span className="rounded-full bg-bg-secondary px-2 py-0.5 text-[10px] font-medium text-text-muted">
                  {count}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-text-primary group-hover:text-accent-blue">
                {cat.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-[11px] text-text-muted">{cat.tagline}</p>
              {/* Cover stack preview */}
              {sampleBooks.length > 0 && (
                <div className="mt-3 flex -space-x-2">
                  {sampleBooks.map((b, idx) => (
                    <div
                      key={b.slug}
                      className="h-10 w-7 shrink-0 overflow-hidden rounded border border-bg-card bg-gradient-to-br from-accent-blue/30 via-accent-purple/30 to-accent-pink/30 shadow-sm"
                      style={{ zIndex: 10 - idx }}
                    >
                      {b.coverUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.coverUrl} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Rotating carousels */}
      <BookCarousel title="Bestsellers" subtitle="What readers are buying now" books={bestsellers.slice(0, 12)} authors={auths} />
      <BookCarousel title="New Releases" subtitle="Recently published" books={newReleases} authors={auths} />
      <FollowedAuthorsCarousel />
    </main>
  );
}
