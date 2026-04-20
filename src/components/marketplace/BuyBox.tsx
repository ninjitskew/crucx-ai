"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/stores/cart";
import { useCurrency } from "@/lib/hooks/useCurrency";
import type { Book } from "@/lib/types";

export default function BuyBox({ book, authorName }: { book: Book; authorName?: string }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.openDrawer);
  const { format } = useCurrency();

  const hasAmazon = Boolean(book.amazonInUrl || book.amazonComUrl);

  function handleBuyOnAmazon() {
    // Route through our tracked redirect
    window.open(`/out/${book.slug}/`, "_blank", "noopener,noreferrer");
  }

  function handleAddToCart() {
    add({ slug: book.slug, title: book.title, price: book.price, cover: book.cover, authorName });
    openDrawer();
  }

  function handleBuyNow() {
    add({ slug: book.slug, title: book.title, price: book.price, cover: book.cover, authorName });
    router.push("/checkout/");
  }

  return (
    <div className="rounded-2xl border border-border-default bg-bg-card p-6">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <span className="text-3xl font-bold text-text-primary">
          {format(book.priceUsd ?? book.price, book.priceInr)}
        </span>
        <span className="rounded-full bg-bg-secondary px-3 py-1 text-xs uppercase tracking-wider text-text-secondary">
          {book.format ?? "eBook"}
        </span>
      </div>

      {hasAmazon ? (
        <>
          <button
            onClick={handleBuyOnAmazon}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF9900] to-[#E88B00] py-3 font-semibold text-white transition hover:shadow-[0_0_30px_rgba(255,153,0,0.4)]"
          >
            <span>Buy on Amazon</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </button>
          <p className="text-center text-xs text-text-muted">
            Opens Amazon in a new tab · Your purchase supports Crucx
          </p>
        </>
      ) : (
        <>
          <button
            onClick={handleBuyNow}
            className="mb-3 w-full rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple py-3 font-semibold text-white transition hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
          >
            Buy Now
          </button>
          <button
            onClick={handleAddToCart}
            className="w-full rounded-xl border border-border-default py-3 font-semibold text-text-primary transition hover:border-accent-blue"
          >
            Add to Cart
          </button>
          <p className="mt-4 text-center text-xs text-text-muted">Instant download · Read on any device</p>
        </>
      )}
    </div>
  );
}
