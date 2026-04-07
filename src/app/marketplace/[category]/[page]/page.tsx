import { notFound } from "next/navigation";
import books from "@/content/books.json";
import authors from "@/content/authors.json";
import CategoryClient from "./CategoryClient";
import { PAGE_SIZE, pageRange } from "@/lib/pagination";
import type { Book, Author } from "@/lib/types";

const CATEGORIES = ["fiction", "self-help", "business", "romance", "mystery", "sci-fi", "strategy", "poetry"];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function generateStaticParams() {
  const params: { category: string; page: string }[] = [];
  for (const category of CATEGORIES) {
    const filtered = (books as Book[]).filter((b) => slugify(b.category) === category);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    for (const p of pageRange(totalPages)) {
      params.push({ category, page: String(p) });
    }
  }
  return params;
}

export default async function MarketplaceCategoryPage({ params }: { params: Promise<{ category: string; page: string }> }) {
  const { category, page } = await params;
  if (!CATEGORIES.includes(category)) notFound();
  const pageNum = Number(page);
  if (!Number.isInteger(pageNum) || pageNum < 1) notFound();

  const filtered = (books as Book[]).filter((b) => slugify(b.category) === category);
  return <CategoryClient category={category} pageNum={pageNum} books={filtered} authors={authors as Author[]} />;
}
