import Link from "next/link";
import { notFound } from "next/navigation";
import books from "@/content/books.json";
import authors from "@/content/authors.json";
import BuyBox from "@/components/marketplace/BuyBox";
import RatingStars from "@/components/marketplace/RatingStars";
import BookCarousel from "@/components/marketplace/BookCarousel";
import Breadcrumbs from "@/components/marketplace/Breadcrumbs";
import SamplePreviewLauncher from "@/components/marketplace/SamplePreviewLauncher";
import ReviewComposer from "@/components/marketplace/ReviewComposer";
import FollowAuthorButton from "@/components/marketplace/FollowAuthorButton";
import type { Book, Author } from "@/lib/types";

export function generateStaticParams() {
  return (books as Book[]).map((b) => ({ slug: b.slug }));
}

const MOCK_REVIEWS = [
  { name: "Avery", rating: 5, body: "Couldn't put it down. Buying for my whole team." },
  { name: "Jordan", rating: 4, body: "Sharp and useful. A few chapters drag but overall excellent." },
  { name: "Sam", rating: 5, body: "Best read of the quarter for me." },
];

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = books as Book[];
  const auths = authors as Author[];
  const book = all.find((b) => b.slug === slug);
  if (!book) notFound();

  const author = auths.find((a) => a.slug === book.authorSlug);
  const related = all.filter((b) => b.slug !== book.slug && b.category === book.category).slice(0, 8);

  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Marketplace", href: "/books/" },
            { label: book.category, href: `/marketplace/${book.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/1/` },
            { label: book.title },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[300px_1fr_320px]">
          {/* Cover */}
          <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-accent-blue/30 via-accent-purple/30 to-accent-pink/30" />

          {/* Details */}
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted">{book.category}</p>
            <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-text-primary">
              {book.title}
            </h1>
            {book.subtitle && <p className="mt-1 text-lg text-text-secondary">{book.subtitle}</p>}
            {author && (
              <Link href={`/authors/${author.slug}/`} className="mt-3 inline-block text-text-secondary hover:text-accent-blue">
                by {author.name}
              </Link>
            )}
            <div className="mt-3 flex items-center gap-3">
              <RatingStars rating={book.rating ?? 0} reviewCount={book.reviewCount} size="md" />
              <span className="rounded-full bg-bg-secondary px-3 py-0.5 text-xs uppercase tracking-wider text-text-secondary">
                {book.format ?? "eBook"}
              </span>
            </div>

            <p className="mt-6 text-text-secondary">{book.description}</p>

            <div className="mt-6">
              <SamplePreviewLauncher title={book.title} />
            </div>

            {book.toc && book.toc.length > 0 && (
              <div className="mt-10">
                <h3 className="mb-3 text-base font-semibold text-text-primary">Table of contents</h3>
                <ol className="space-y-1.5 text-sm text-text-secondary">
                  {book.toc.map((t, i) => (
                    <li key={i} className="border-l-2 border-border-default pl-3">{i + 1}. {t}</li>
                  ))}
                </ol>
              </div>
            )}

            {author && (
              <div className="mt-10 rounded-2xl border border-border-default bg-bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-text-muted">About the author</p>
                    <h3 className="mt-1 text-lg font-semibold text-text-primary">{author.name}</h3>
                    <p className="mt-2 text-sm text-text-secondary">{author.bio}</p>
                  </div>
                  <FollowAuthorButton authorSlug={author.slug} />
                </div>
              </div>
            )}

            <div className="mt-10">
              <h3 className="mb-3 text-base font-semibold text-text-primary">Reviews</h3>
              <ul className="space-y-4">
                {MOCK_REVIEWS.map((r, i) => (
                  <li key={i} className="rounded-xl border border-border-default bg-bg-card p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-text-primary">{r.name}</span>
                      <RatingStars rating={r.rating} />
                    </div>
                    <p className="mt-2 text-sm text-text-secondary">{r.body}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <ReviewComposer bookSlug={book.slug} />
              </div>
            </div>
          </div>

          {/* Buy box */}
          <div>
            <BuyBox book={book} authorName={author?.name} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <BookCarousel title="Readers Also Bought" books={related} authors={auths} />
      )}
    </main>
  );
}
