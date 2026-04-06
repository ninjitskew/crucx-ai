import Link from "next/link";
import authors from "@/content/authors.json";
import { paginate, pageRange, PAGE_SIZE } from "@/lib/pagination";

export default function AuthorsIndex() {
  const { items, totalPages } = paginate(authors, 1);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold text-text-primary">Authors</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <Link
            key={a.slug}
            href={`/authors/${a.slug}`}
            className="rounded-2xl border border-border-default bg-bg-card p-6 transition hover:border-accent-primary"
          >
            <h2 className="text-xl font-semibold text-text-primary">
              {a.name}
            </h2>
            <p className="mt-1 text-sm text-text-muted">{a.tagline}</p>
            <p className="mt-3 text-sm text-text-secondary line-clamp-2">
              {a.bio}
            </p>
          </Link>
        ))}
      </div>
      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-2">
          {pageRange(totalPages).map((p) => (
            <Link
              key={p}
              href={p === 1 ? "/authors" : `/authors/page/${p}`}
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
