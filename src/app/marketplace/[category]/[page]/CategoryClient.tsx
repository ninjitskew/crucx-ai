"use client";

import { useMemo, useState } from "react";
import BookCard from "@/components/marketplace/BookCard";
import FilterSidebar from "@/components/marketplace/FilterSidebar";
import SortDropdown, { SortKey } from "@/components/marketplace/SortDropdown";
import Pagination from "@/components/marketplace/Pagination";
import Breadcrumbs from "@/components/marketplace/Breadcrumbs";
import EmptyState from "@/components/marketplace/EmptyState";
import { PAGE_SIZE } from "@/lib/pagination";
import { getCategoryBySlug } from "@/lib/categories";
import type { Book, Author } from "@/lib/types";

interface Props {
  category: string;        // URL slug
  pageNum: number;
  books: Book[];
  authors: Author[];
}

export default function CategoryClient({ category, pageNum, books, authors }: Props) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [minRating, setMinRating] = useState(0);
  const [format, setFormat] = useState("any");
  const [sort, setSort] = useState<SortKey>("popular");
  const [subFilter, setSubFilter] = useState<string>("all");

  // Resolve the category definition for nicer display + chip filters
  const catDef = getCategoryBySlug(category);
  const categoryName = catDef?.name ?? category.replace(/-/g, " ");
  const subCategories = catDef?.subCategories ?? [];

  // Sub-category counts (for chip labels)
  const subCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of books) {
      if (b.subCategory) map.set(b.subCategory, (map.get(b.subCategory) ?? 0) + 1);
    }
    return map;
  }, [books]);

  const filtered = useMemo(() => {
    let r = books.filter(
      (b) =>
        b.price <= priceRange[1] &&
        (b.rating ?? 0) >= minRating &&
        (format === "any" || (b.format ?? "eBook") === format) &&
        (subFilter === "all" || b.subCategory === subFilter)
    );
    if (sort === "newest") r = [...r].sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1));
    else if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === "rating") r = [...r].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else r = [...r].sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    return r;
  }, [books, priceRange, minRating, format, sort, subFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (pageNum - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Marketplace", href: "/books/" }, { label: categoryName }]} />

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              {catDef && <span className="text-3xl">{catDef.icon}</span>}
              <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">{categoryName}</h1>
            </div>
            {catDef && (
              <p className="mt-1 text-sm text-text-secondary">
                {catDef.tagline} · {books.length} books
              </p>
            )}
          </div>
          <SortDropdown value={sort} onChange={setSort} />
        </div>

        {/* Sub-category chip filters */}
        {subCategories.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSubFilter("all")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                subFilter === "all"
                  ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white"
                  : "border border-border-default text-text-secondary hover:text-text-primary"
              }`}
            >
              All ({books.length})
            </button>
            {subCategories.map((s) => {
              const count = subCounts.get(s) ?? 0;
              if (count === 0) return null;
              return (
                <button
                  key={s}
                  onClick={() => setSubFilter(s)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    subFilter === s
                      ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white"
                      : "border border-border-default text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {s} ({count})
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
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
              <EmptyState title="No books match these filters" description="Try widening your price range or clearing the sub-filter." />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((b) => {
                  const a = authors.find((x) => x.slug === b.authorSlug);
                  return <BookCard key={b.slug} book={b} authorName={a?.name} />;
                })}
              </div>
            )}
            <Pagination current={pageNum} totalPages={totalPages} hrefFor={(p) => `/marketplace/${category}/${p}/`} />
          </div>
        </div>
      </div>
    </main>
  );
}
