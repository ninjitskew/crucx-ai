import Link from "next/link";
import books from "@/content/books.json";
import { paginate, pageRange, PAGE_SIZE } from "@/lib/pagination";

const CATEGORIES = ["All", "Strategy", "Fiction", "Nonfiction", "Poetry"];

export default function BooksIndex() {
  const { items, totalPages } = paginate(books, 1);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-2 text-4xl font-bold text-text-primary">Marketplace</h1>
      <p className="mb-8 text-text-muted">Discover books by independent authors.</p>

      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={c === "All" ? "/books" : `/marketplace/${c.toLowerCase()}/1`}
            className="rounded-full border border-border-default px-4 py-1.5 text-sm text-text-secondary hover:border-accent-primary hover:text-text-primary"
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((b) => (
          <Link
            key={b.slug}
            href={`/books/${b.slug}`}
            className="rounded-2xl border border-border-default bg-bg-card p-6 transition hover:border-accent-primary"
          >
            <div className="mb-3 aspect-[3/4] rounded-lg bg-bg-secondary" />
            <h2 className="text-base font-semibold text-text-primary">
              {b.title}
            </h2>
            <p className="mt-1 text-xs text-text-muted">{b.category}</p>
            <p className="mt-3 text-sm font-semibold text-accent-primary">
              ₹{b.price}
            </p>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-2">
          {pageRange(totalPages).map((p) => (
            <Link
              key={p}
              href={p === 1 ? "/books" : `/books/page/${p}`}
              className={`rounded-lg px-4 py-2 text-sm ${
                p === 1
                  ? "bg-accent-primary text-white"
                  : "border border-border-default text-text-secondary hover:text-text-primary"
              }`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </main>
  );
}
