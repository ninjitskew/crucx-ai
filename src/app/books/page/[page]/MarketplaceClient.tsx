"use client";

import { useEffect, useMemo, useState } from "react";
import BackToTop from "@/components/ui/BackToTop";
import BookCard from "@/components/marketplace/BookCard";
import FilterSidebar from "@/components/marketplace/FilterSidebar";
import SortDropdown, { SortKey } from "@/components/marketplace/SortDropdown";
import Pagination from "@/components/marketplace/Pagination";
import Breadcrumbs from "@/components/marketplace/Breadcrumbs";
import EmptyState from "@/components/marketplace/EmptyState";
import { SearchIcon } from "@/components/ui/Icons";
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
  const [query, setQuery] = useState("");

  // Always scroll to top on mount — user expects fresh state when opening Marketplace
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => set.add(b.category));
    return ["all", ...Array.from(set).sort()];
  }, [books]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let r = books.filter(
      (b) =>
        (b.status ?? "published") === "published" &&
        b.price <= priceRange[1] &&
        (b.rating ?? 0) >= minRating &&
        (format === "any" || (b.format ?? "eBook") === format) &&
        (category === "all" || b.category === category) &&
        (!q ||
          b.title.toLowerCase().includes(q) ||
          (b.description ?? "").toLowerCase().includes(q) ||
          (authors.find((a) => a.slug === b.authorSlug)?.name ?? "")
            .toLowerCase()
            .includes(q))
    );
    if (sort === "newest") r = [...r].sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1));
    else if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === "rating") r = [...r].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else r = [...r].sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    return r;
  }, [books, authors, priceRange, minRating, format, category, sort, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (pageNum - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  return (
    <>
      <main className="min-h-screen bg-bg-primary pt-24">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Marketplace", href: "/books/" }, { label: "Browse All" }]} />

          {/* Page heading */}
          <div className="mt-4 text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-widest text-accent-purple">
              Marketplace
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary sm:text-4xl md:text-5xl">
              Discover your next{" "}
              <span className="bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
                great read
              </span>
            </h1>
            <p className="mt-3 text-sm text-text-secondary sm:text-base">
              {filtered.length} {filtered.length === 1 ? "book" : "books"} available
            </p>
          </div>

          {/* Search catalog */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search catalog — titles, authors, topics…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-border-default bg-bg-card py-3 pl-12 pr-4 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple"
              />
            </div>
          </div>

          {/* Category pills — horizontally scrollable on mobile */}
          <div className="mt-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium capitalize transition-all duration-200 ${
                  category === c
                    ? "bg-gradient-to-r from-accent-purple to-accent-pink text-white shadow-lg shadow-accent-purple/20"
                    : "border border-border-default bg-bg-card text-text-secondary hover:border-accent-purple/40 hover:text-text-primary"
                }`}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>

          {/* Sort + results row */}
          <div className="mt-8 flex items-center justify-between">
            <span className="text-sm text-text-muted">
              Showing {items.length} of {filtered.length}
            </span>
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {/* Sidebar + grid */}
          <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
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
                <EmptyState
                  title="No books match these filters"
                  description="Try widening your price range, clearing the search, or picking a different category."
                />
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
      <BackToTop />
    </>
  );
}
