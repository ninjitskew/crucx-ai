"use client";

import Link from "next/link";
import { useCart } from "@/lib/stores/cart";
import { formatUSD } from "@/lib/format";
import EmptyState from "@/components/marketplace/EmptyState";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);
  const subtotal = useCart((s) => s.subtotal());

  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">Your cart</h1>

        {items.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Your cart is empty"
              description="Find your next favorite read."
              cta={<Link href="/books/" className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-3 text-sm font-semibold text-white">Browse books</Link>}
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.slug} className="flex items-center gap-4 rounded-2xl border border-border-default bg-bg-card p-4">
                  <div className="h-20 w-16 flex-shrink-0 rounded bg-gradient-to-br from-accent-blue/30 to-accent-purple/30" />
                  <div className="flex-1">
                    <Link href={`/books/${i.slug}/`} className="font-semibold text-text-primary hover:text-accent-blue">{i.title}</Link>
                    {i.authorName && <p className="text-xs text-text-muted">by {i.authorName}</p>}
                    <p className="mt-1 text-sm font-bold text-text-primary">{formatUSD(i.price)}</p>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={i.qty}
                    onChange={(e) => setQty(i.slug, Number(e.target.value))}
                    className="w-16 rounded border border-border-default bg-bg-primary px-2 py-1 text-text-primary"
                  />
                  <button onClick={() => remove(i.slug)} className="text-sm text-text-muted hover:text-accent-pink">Remove</button>
                </li>
              ))}
            </ul>
            <aside className="rounded-2xl border border-border-default bg-bg-card p-6 h-fit">
              <h2 className="text-lg font-semibold text-text-primary">Order summary</h2>
              <div className="mt-4 flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="font-semibold text-text-primary">{formatUSD(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-text-muted">Taxes calculated at checkout.</p>
              <Link href="/checkout/" className="mt-6 block rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple py-3 text-center font-semibold text-white">
                Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
