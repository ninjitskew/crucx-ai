"use client";

import Link from "next/link";
import { useCart } from "@/lib/stores/cart";
import { formatUSD } from "@/lib/format";

export default function CartDrawer() {
  const open = useCart((s) => s.drawerOpen);
  const close = useCart((s) => s.closeDrawer);
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90]" aria-modal>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-border-default bg-bg-primary">
        <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
          <h2 className="text-lg font-semibold text-text-primary">Your cart</h2>
          <button onClick={close} className="text-2xl text-text-muted hover:text-text-primary">×</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="text-center text-sm text-text-muted">Cart is empty.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((i) => (
                <li key={i.slug} className="flex items-start gap-3 rounded-xl border border-border-default bg-bg-card p-3">
                  <div className="h-16 w-12 flex-shrink-0 rounded bg-gradient-to-br from-accent-blue/30 to-accent-purple/30" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary">{i.title}</p>
                    {i.authorName && <p className="text-xs text-text-muted">by {i.authorName}</p>}
                    <p className="mt-1 text-sm font-bold text-text-primary">{formatUSD(i.price)} × {i.qty}</p>
                  </div>
                  <button onClick={() => remove(i.slug)} className="text-xs text-text-muted hover:text-accent-pink">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-border-default px-5 py-4">
          <div className="mb-3 flex justify-between text-text-secondary">
            <span>Subtotal</span>
            <span className="font-semibold text-text-primary">{formatUSD(subtotal)}</span>
          </div>
          <Link href="/cart/" onClick={close} className="mb-2 block rounded-xl border border-border-default py-2.5 text-center text-sm font-semibold text-text-primary">
            View cart
          </Link>
          <Link href="/checkout/" onClick={close} className="block rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple py-2.5 text-center text-sm font-semibold text-white">
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
