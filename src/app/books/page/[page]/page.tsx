import { notFound } from "next/navigation";
import books from "@/content/books.json";
import authors from "@/content/authors.json";
import MarketplaceClient from "./MarketplaceClient";
import { PAGE_SIZE, pageRange } from "@/lib/pagination";
import type { Book, Author } from "@/lib/types";

export function generateStaticParams() {
  const totalPages = Math.max(1, Math.ceil((books as Book[]).length / PAGE_SIZE));
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

  return (
    <MarketplaceClient
      pageNum={pageNum}
      books={books as Book[]}
      authors={authors as Author[]}
    />
  );
}
