import Link from "next/link";
import { notFound } from "next/navigation";
import books from "@/content/books.json";
import authors from "@/content/authors.json";

export function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = books.find((b) => b.slug === slug);
  if (!book) notFound();

  const author = authors.find((a) => a.slug === book.authorSlug);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <Link
        href="/books"
        className="text-sm text-text-muted hover:text-text-primary"
      >
        ← Marketplace
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-[300px_1fr]">
        <div className="aspect-[3/4] rounded-2xl bg-bg-secondary" />
        <div>
          <p className="text-xs uppercase tracking-wider text-text-muted">
            {book.category}
          </p>
          <h1 className="mt-2 text-4xl font-bold text-text-primary">
            {book.title}
          </h1>
          {author && (
            <Link
              href={`/authors/${author.slug}`}
              className="mt-2 inline-block text-text-secondary hover:text-accent-primary"
            >
              by {author.name}
            </Link>
          )}
          <p className="mt-6 text-text-secondary">{book.description}</p>
          <div className="mt-8 flex items-center gap-4">
            <span className="text-3xl font-bold text-accent-primary">
              ₹{book.price}
            </span>
            <button className="rounded-lg bg-accent-primary px-6 py-3 font-semibold text-white hover:bg-accent-primary/90">
              Buy now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
