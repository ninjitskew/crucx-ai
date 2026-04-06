import Link from "next/link";
import { notFound } from "next/navigation";
import authors from "@/content/authors.json";
import books from "@/content/books.json";

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export default async function AuthorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = authors.find((a) => a.slug === slug);
  if (!author) notFound();

  const authorBooks = books.filter((b) => b.authorSlug === slug);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <Link
        href="/authors/1"
        className="text-sm text-text-muted hover:text-text-primary"
      >
        ← All authors
      </Link>
      <header className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="h-32 w-32 shrink-0 rounded-2xl bg-bg-secondary" />
        <div>
          <h1 className="text-4xl font-bold text-text-primary">
            {author.name}
          </h1>
          <p className="mt-2 text-lg text-text-muted">{author.tagline}</p>
          <p className="mt-4 max-w-2xl text-text-secondary">{author.bio}</p>
        </div>
      </header>

      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-semibold text-text-primary">
          Books by {author.name}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {authorBooks.map((b) => (
            <Link
              key={b.slug}
              href={`/books/${b.slug}`}
              className="rounded-2xl border border-border-default bg-bg-card p-6 transition hover:border-accent-primary"
            >
              <div className="mb-3 aspect-[3/4] rounded-lg bg-bg-secondary" />
              <h3 className="text-base font-semibold text-text-primary">
                {b.title}
              </h3>
              <p className="mt-1 text-xs text-text-muted">{b.category}</p>
              <p className="mt-2 text-sm font-semibold text-accent-primary">
                ₹{b.price}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
