import { notFound } from "next/navigation";
import { getAllBooks, getAllAuthors } from "@/lib/content/books-source";
import MarketplaceClient from "./MarketplaceClient";
import { PAGE_SIZE, pageRange } from "@/lib/pagination";

export async function generateStaticParams() {
  const books = await getAllBooks();
  const totalPages = Math.max(1, Math.ceil(books.length / PAGE_SIZE));
  return pageRange(totalPages).map((p) => ({ page: String(p) }));
}

export const metadata = {
  title: "Browse Marketplace — crucx.ai",
  description: "Browse every book on crucx.ai — filter, sort, paginate.",
};

export default async function BooksPaginatedPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNum = Number(page);
  if (!Number.isInteger(pageNum) || pageNum < 1) notFound();

  const books = await getAllBooks();
  const authors = await getAllAuthors();
  return <MarketplaceClient pageNum={pageNum} books={books} authors={authors} />;
}
