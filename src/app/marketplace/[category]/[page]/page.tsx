import { notFound, redirect } from "next/navigation";
import { getAllBooks, getAllAuthors } from "@/lib/content/books-source";
import CategoryClient from "./CategoryClient";
import { PAGE_SIZE, pageRange } from "@/lib/pagination";
import { CATEGORIES, LEGACY_CATEGORY_REDIRECTS, getCategoryBySlug } from "@/lib/categories";
import type { Book } from "@/lib/types";

function inCategory(b: Book, name: string): boolean {
  return b.primaryCategory === name || (b.secondaryCategories ?? []).includes(name);
}

export async function generateStaticParams() {
  const books = await getAllBooks();
  const params: { category: string; page: string }[] = [];
  // New canonical category slugs
  for (const cat of CATEGORIES) {
    const matches = books.filter((b) => inCategory(b, cat.name));
    const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
    for (const p of pageRange(totalPages)) {
      params.push({ category: cat.slug, page: String(p) });
    }
  }
  // Generate stub pages for legacy slugs so old links redirect cleanly
  for (const legacy of Object.keys(LEGACY_CATEGORY_REDIRECTS)) {
    params.push({ category: legacy, page: "1" });
  }
  return params;
}

export default async function MarketplaceCategoryPage({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}) {
  const { category, page } = await params;

  // Legacy slug → redirect to new slug
  const redirectTarget = LEGACY_CATEGORY_REDIRECTS[category];
  if (redirectTarget) {
    redirect(`/marketplace/${redirectTarget}/${page}/`);
  }

  const catDef = getCategoryBySlug(category);
  if (!catDef) notFound();

  const pageNum = Number(page);
  if (!Number.isInteger(pageNum) || pageNum < 1) notFound();

  const allBooks = await getAllBooks();
  const authors = await getAllAuthors();
  const filtered = allBooks.filter((b) => inCategory(b, catDef.name));
  return <CategoryClient category={category} pageNum={pageNum} books={filtered} authors={authors} />;
}
