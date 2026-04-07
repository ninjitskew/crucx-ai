"use client";

import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import books from "@/content/books.json";
import authors from "@/content/authors.json";
import BookCard from "@/components/marketplace/BookCard";
import type { Book, Author } from "@/lib/types";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [index, setIndex] = useState<any[] | null>(null);

  useEffect(() => {
    fetch("/search-index.json")
      .then((r) => (r.ok ? r.json() : null))
      .then(setIndex)
      .catch(() => setIndex(null));
  }, []);

  const fuse = useMemo(() => {
    const data = index ?? [
      ...(books as Book[]).map((b) => ({ kind: "book", ...b })),
      ...(authors as Author[]).map((a) => ({ kind: "author", ...a })),
    ];
    return new Fuse(data, {
      keys: ["title", "subtitle", "description", "category", "name", "tagline", "bio"],
      threshold: 0.4,
    });
  }, [index]);

  const results = q ? fuse.search(q).map((r) => r.item) : [];
  const bookResults = results.filter((r: any) => r.kind !== "author") as Book[];
  const authorResults = results.filter((r: any) => r.kind === "author") as Author[];
  const auths = authors as Author[];

  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">Search</h1>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search books, authors, topics..."
          className="mt-6 w-full rounded-2xl border border-border-default bg-bg-card px-5 py-4 text-lg text-text-primary outline-none focus:border-accent-blue"
        />

        {q && bookResults.length === 0 && authorResults.length === 0 && (
          <p className="mt-10 text-center text-text-muted">No results for "{q}"</p>
        )}

        {authorResults.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-sm uppercase tracking-wider text-text-muted">Authors</h2>
            <ul className="space-y-2">
              {authorResults.map((a) => (
                <li key={a.slug}>
                  <Link href={`/authors/${a.slug}/`} className="text-text-primary hover:text-accent-blue">{a.name}</Link>
                  <span className="ml-2 text-sm text-text-muted">{a.tagline}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {bookResults.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-sm uppercase tracking-wider text-text-muted">Books</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {bookResults.map((b) => {
                const a = auths.find((x) => x.slug === b.authorSlug);
                return <BookCard key={b.slug} book={b} authorName={a?.name} />;
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
