import Link from "next/link";
import authors from "@/content/authors.json";
import { paginate, pageRange, PAGE_SIZE } from "@/lib/pagination";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const totalPages = Math.max(1, Math.ceil(authors.length / PAGE_SIZE));
  return pageRange(totalPages).map((p) => ({ page: String(p) }));
}

export default async function AuthorsPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNum = Number(page);
  if (!Number.isInteger(pageNum) || pageNum < 1) notFound();

  const { items, totalPages } = paginate(authors, pageNum);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold text-text-primary">Authors</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <article
            key={a.slug}
            className="rounded-2xl border border-border-default bg-bg-card p-6"
          >
            <h2 className="text-xl font-semibold text-text-primary">
              {a.name}
            </h2>
            <p className="mt-1 text-sm text-text-muted">{a.tagline}</p>
            <p className="mt-3 text-sm text-text-secondary">{a.bio}</p>
          </article>
        ))}
      </div>
      <nav className="mt-12 flex items-center justify-center gap-2">
        {pageRange(totalPages).map((p) => (
          <Link
            key={p}
            href={`/authors/${p}`}
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
