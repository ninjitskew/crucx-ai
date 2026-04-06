import Link from "next/link";
import { notFound } from "next/navigation";
import books from "@/content/books.json";
import { paginate, pageRange, PAGE_SIZE } from "@/lib/pagination";

const CATEGORIES = ["strategy", "fiction", "nonfiction", "poetry"];

export function generateStaticParams() {
  const params: { category: string; page: string }[] = [];
  for (const category of CATEGORIES) {
    const filtered = books.filter(
      (b) => b.category.toLowerCase() === category
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    for (const p of pageRange(totalPages)) {
      params.push({ category, page: String(p) });
    }
  }
  return params;
}

export default async function MarketplaceCategoryPage({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}) {
  const { category, page } = await params;
  if (!CATEGORIES.includes(category)) notFound();
  const pageNum = Number(page);
  if (!Number.isInteger(pageNum) || pageNum < 1) notFound();

  const filtered = books.filter(
    (b) => b.category.toLowerCase() === category
  );
  const { items, totalPages } = paginate(filtered, pageNum);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <Link
        href="/books"
        className="text-sm text-text-muted hover:text-text-primary"
      >
        ← Marketplace
      </Link>
      <h1 className="mb-8 mt-4 text-4xl font-bold capitalize text-text-primary">
        {category}
      </h1>

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
              href={`/marketplace/${category}/${p}`}
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
      )}
    </main>
  );
}
