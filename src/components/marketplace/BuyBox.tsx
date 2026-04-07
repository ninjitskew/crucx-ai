"use client";

import { useRouter } from "next/navigation";
import { formatUSD } from "@/lib/format";
import { useCart } from "@/lib/stores/cart";
import type { Book } from "@/lib/types";

export default function BuyBox({ book, authorName }: { book: Book; authorName?: string }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.openDrawer);

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
      <div className="mb-4 flex items-baseline justify-between">
        <span className="text-3xl font-bold text-text-primary">{formatUSD(book.price)}</span>
        <span className="rounded-full bg-bg-secondary px-3 py-1 text-xs uppercase tracking-wider text-text-secondary">
          {book.format ?? "eBook"}
        </span>
      </div>
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
    </div>
  );
}
