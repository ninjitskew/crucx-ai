"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RatingStars from "./RatingStars";
import { formatUSD } from "@/lib/format";
import { useCart } from "@/lib/stores/cart";
import { getSupabase } from "@/lib/supabase";
import { useUser } from "@/lib/lib-shim";
import type { Book } from "@/lib/types";

interface Props {
  book: Book;
  authorName?: string;
  compact?: boolean;
}

export default function BookCard({ book, authorName, compact = false }: Props) {
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.openDrawer);
  const { user } = useUser();
  const [wished, setWished] = useState(false);

  useEffect(() => {
    if (!user) return;
    const sb = getSupabase();
    if (!sb) return;
    sb.from("wishlist")
      .select("book_slug")
      .eq("user_id", user.id)
      .eq("book_slug", book.slug)
      .maybeSingle()
      .then(({ data }) => setWished(!!data));
  }, [user, book.slug]);

  async function toggleWish(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = "/auth/sign-in/";
      return;
    }
    const sb = getSupabase();
    if (!sb) return;
    if (wished) {
      await sb.from("wishlist").delete().eq("user_id", user.id).eq("book_slug", book.slug);
      setWished(false);
    } else {
      await sb.from("wishlist").insert({ user_id: user.id, book_slug: book.slug });
      setWished(true);
    }
  }

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    add({ slug: book.slug, title: book.title, price: book.price, cover: book.cover, authorName });
    openDrawer();
  }

  return (
    <Link
      href={`/books/${book.slug}/`}
      className="group block rounded-2xl border border-border-default bg-bg-card p-4 transition hover:border-accent-blue"
    >
      <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br from-accent-blue/20 via-accent-purple/20 to-accent-pink/20">
        <button
          onClick={toggleWish}
          aria-label="Wishlist"
          className="absolute right-2 top-2 z-10 rounded-full bg-bg-primary/70 p-2 text-sm backdrop-blur transition hover:bg-bg-primary"
        >
          <span className={wished ? "text-accent-pink" : "text-text-muted"}>
            {wished ? "\u2665" : "\u2661"}
          </span>
        </button>
        <span className="absolute bottom-2 left-2 rounded-full bg-bg-primary/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary backdrop-blur">
          {book.format ?? "eBook"}
        </span>
      </div>
      <h3 className="line-clamp-2 text-sm font-semibold text-text-primary group-hover:text-accent-blue">
        {book.title}
      </h3>
      {authorName && (
        <p className="mt-1 text-xs text-text-muted">by {authorName}</p>
      )}
      {!compact && (
        <div className="mt-2">
          <RatingStars rating={book.rating ?? 0} reviewCount={book.reviewCount} />
        </div>
      )}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-base font-bold text-text-primary">{formatUSD(book.price)}</span>
        <button
          onClick={handleAdd}
          className="rounded-lg border border-border-default px-2 py-1 text-[11px] font-medium text-text-secondary transition hover:border-accent-blue hover:text-accent-blue"
        >
          + Cart
        </button>
      </div>
    </Link>
  );
}
