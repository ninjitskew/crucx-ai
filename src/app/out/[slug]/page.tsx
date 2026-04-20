import { getAllBooks } from "@/lib/content/books-source";
import OutRedirect from "./OutRedirect";

export async function generateStaticParams() {
  const books = await getAllBooks();
  return books
    .filter((b) => b.amazonInUrl || b.amazonComUrl)
    .map((b) => ({ slug: b.slug }));
}

export const metadata = {
  title: "Redirecting to Amazon…",
  robots: { index: false, follow: false },
};

export default async function OutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const books = await getAllBooks();
  const book = books.find((b) => b.slug === slug);

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary pt-24">
      <div className="w-full max-w-md rounded-2xl border border-border-default bg-bg-card p-10 text-center">
        <h1 className="text-lg font-semibold text-text-primary">
          Taking you to Amazon…
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {book?.title ? <span className="font-medium">{book.title}</span> : "Your book"}
          {" "}opens in Amazon&apos;s store.
        </p>
        <OutRedirect
          slug={slug}
          amazonInUrl={book?.amazonInUrl ?? null}
          amazonComUrl={book?.amazonComUrl ?? null}
        />
      </div>
    </main>
  );
}
