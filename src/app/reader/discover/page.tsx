import Link from "next/link";
import books from "@/content/books.json";

export default function ReaderDiscoverPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-xs uppercase tracking-wider text-text-muted">
        Reader Portal
      </p>
      <h1 className="mt-2 text-4xl font-bold text-text-primary">Discover</h1>
      <p className="mt-4 text-text-secondary">
        Hand-picked recommendations from indie authors.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {books.slice(0, 8).map((b) => (
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
          </Link>
        ))}
      </div>
    </main>
  );
}
