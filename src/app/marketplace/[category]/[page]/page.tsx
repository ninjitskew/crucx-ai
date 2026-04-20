import { notFound } from "next/navigation";
import { getAllBooks, getAllAuthors } from "@/lib/content/books-source";
import CategoryClient from "./CategoryClient";
import { PAGE_SIZE, pageRange } from "@/lib/pagination";

const CATEGORIES = ["fiction", "non-fiction", "children", "shorts", "self-help", "business", "romance", "mystery", "sci-fi", "strategy", "poetry"];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export async function generateStaticParams() {
  const books = await getAllBooks();
  const params: { category: string; page: string }[] = [];
  for (const category of CATEGORIES) {
    const filtered = books.filter(
      (b) => slugify(b.category) === category || (b.superCategory && slugify(b.superCategory) === category)
    );
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

  const allBooks = await getAllBooks();
  const authors = await getAllAuthors();
  const filtered = allBooks.filter(
    (b) => slugify(b.category) === category || (b.superCategory && slugify(b.superCategory) === category)
  );
  return <CategoryClient category={category} pageNum={pageNum} books={filtered} authors={authors} />;
}
