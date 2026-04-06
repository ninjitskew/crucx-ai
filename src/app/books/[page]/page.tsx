import Link from "next/link";
import books from "@/content/books.json";
import { paginate, pageRange, PAGE_SIZE } from "@/lib/pagination";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const totalPages = Math.max(1, Math.ceil(books.length / PAGE_SIZE));
  return pageRange(totalPages).map((p) => ({ page: String(p) }));
}

export default async function BooksPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNum = Number(page);
  if (!Number.isInteger(pageNum) || pageNum < 1) notFound();

  const { items, totalPages } = paginate(books, pageNum);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold text-text-primary">Marketplace</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((b) => (
          <article
            key={b.slug}
            className="rounded-2xl border border-border-default bg-bg-card p-6"
          >
            <div className="mb-3 aspect-[3/4] rounded-lg bg-bg-secondary" />
            <h2 className="text-base font-semibold text-text-primary">
              {b.title}
            </h2>
            <p className="mt-1 text-xs text-text-muted">{b.category}</p>
            <p className="mt-2 text-sm text-text-secondary line-clamp-2">
              {b.description}
            </p>
            <p className="mt-3 text-sm font-semibold text-accent-primary">
              ₹{b.price}
            </p>
          </article>
        ))}
      </div>
      <nav className="mt-12 flex items-center justify-center gap-2">
        {pageRange(totalPages).map((p) => (
          <Link
            key={p}
            href={`/books/${p}`}
            className={`rounded-lg px-4 py-2 text-sm ${
              p === pageNum
                ? "bg-accent-primary text-white"
                : "border border-border-default text-text-secondary hover:text-text-primary"
            }`}
          >
            {p}
          </Link>
        ))}
      </nav>
    </main>
  );
}
