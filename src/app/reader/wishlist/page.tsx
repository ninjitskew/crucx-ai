"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { getSupabase } from "@/lib/supabase";
import books from "@/content/books.json";
import authors from "@/content/authors.json";
import BookCard from "@/components/marketplace/BookCard";
import EmptyState from "@/components/marketplace/EmptyState";
import type { Book, Author } from "@/lib/types";

export default function WishlistPage() {
  const { user, loading } = useUser();
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    const sb = getSupabase();
    if (!sb) return;
    sb.from("wishlist").select("book_slug").eq("user_id", user.id).then(({ data }) => {
      setSlugs((data ?? []).map((r: any) => r.book_slug));
    });
  }, [user]);

  if (loading) return <main className="min-h-screen bg-bg-primary pt-24" />;
  if (!user) {
    return (
      <main className="min-h-screen bg-bg-primary pt-24">
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-text-primary">Sign in to view your wishlist</h1>
          <a href="/auth/sign-in/" className="mt-4 inline-block text-accent-blue hover:underline">Sign in</a>
        </div>
      </main>
    );
  }

  const wished = (books as Book[]).filter((b) => slugs.includes(b.slug));
  const auths = authors as Author[];

  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">Your wishlist</h1>
        {wished.length === 0 ? (
          <div className="mt-8"><EmptyState title="No books saved yet" description="Tap the heart icon on any book to save it here." /></div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wished.map((b) => {
              const a = auths.find((x) => x.slug === b.authorSlug);
              return <BookCard key={b.slug} book={b} authorName={a?.name} />;
            })}
          </div>
        )}
      </div>
    </main>
  );
}
