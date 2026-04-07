"use client";

import { useMemo, useState } from "react";
import BookCard from "@/components/marketplace/BookCard";
import FilterSidebar from "@/components/marketplace/FilterSidebar";
import SortDropdown, { SortKey } from "@/components/marketplace/SortDropdown";
import Pagination from "@/components/marketplace/Pagination";
import Breadcrumbs from "@/components/marketplace/Breadcrumbs";
import EmptyState from "@/components/marketplace/EmptyState";
import { PAGE_SIZE } from "@/lib/pagination";
import type { Book, Author } from "@/lib/types";

interface Props {
  pageNum: number;
  books: Book[];
  authors: Author[];
}

export default function MarketplaceClient({ pageNum, books, authors }: Props) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [minRating, setMinRating] = useState(0);
  const [format, setFormat] = useState("any");
  const [sort, setSort] = useState<SortKey>("popular");
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => set.add(b.category));
    return ["all", ...Array.from(set).sort()];
  }, [books]);

  const filtered = useMemo(() => {
    let r = books.filter(
      (b) =>
        b.price <= priceRange[1] &&
        (b.rating ?? 0) >= minRating &&
        (format === "any" || (b.format ?? "eBook") === format) &&
        (category === "all" || b.category === category)
    );
    if (sort === "newest") r = [...r].sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1));
    else if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === "rating") r = [...r].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else r = [...r].sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    return r;
  }, [books, priceRange, minRating, format, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (pageNum - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Marketplace", href: "/books/" }, { label: "Browse All" }]} />
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary sm:text-4xl">
              Browse Marketplace
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              {filtered.length} {filtered.length === 1 ? "book" : "books"} available
            </p>
          </div>
          <SortDropdown value={sort} onChange={setSort} />
        </div>

        {/* Category pills */}
        <div className="mt-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium capitalize transition ${
                category === c
                  ? "border-accent-purple bg-accent-purple/15 text-text-primary"
                  : "border-border-default bg-bg-card/40 text-text-secondary hover:text-text-primary"
              }`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <FilterSidebar
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minRating={minRating}
            setMinRating={setMinRating}
            format={format}
            setFormat={setFormat}
          />
          <div>
            {items.length === 0 ? (
              <EmptyState title="No books match these filters" description="Try widening your price range or rating." />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((b) => {
                  const a = authors.find((x) => x.slug === b.authorSlug);
                  return <BookCard key={b.slug} book={b} authorName={a?.name} />;
                })}
              </div>
            )}
            <Pagination
              current={pageNum}
              totalPages={totalPages}
              hrefFor={(p) => `/books/page/${p}/`}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
