"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/stores/cart";
import { useUser } from "@/lib/hooks/useUser";
import { getSupabase } from "@/lib/supabase";
import { openCheckout } from "@/lib/payments";
import { formatUSD } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const { user } = useUser();
  const [email, setEmail] = useState(user?.email ?? "");
  const [busy, setBusy] = useState(false);

  async function pay() {
    if (!items.length) return;
    setBusy(true);
    const orderId = "ord_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    await openCheckout({
      amount: subtotal,
      orderId,
      email: email || user?.email,
      description: `${items.length} eBook(s)`,
      onSuccess: async (paymentId) => {
        const sb = getSupabase();
        if (sb && user) {
          await sb.from("order").insert({
            id: orderId,
            user_id: user.id,
            email: email || user.email,
            total_usd: subtotal,
            status: "paid",
            payment_id: paymentId,
          });
          for (const i of items) {
            await sb.from("order_item").insert({
              order_id: orderId,
              book_slug: i.slug,
              title: i.title,
              price_usd: i.price,
              qty: i.qty,
            });
            await sb.from("download_grant").insert({
              user_id: user.id,
              book_slug: i.slug,
              order_id: orderId,
            });
          }
        }
        clear();
        router.push(`/checkout/success/${orderId}/`);
      },
      onDismiss: () => setBusy(false),
    });
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-bg-primary pt-24">
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-text-primary">Your cart is empty.</h1>
          <a href="/books/" className="mt-4 inline-block text-accent-blue hover:underline">Browse books</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">Checkout</h1>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div className="rounded-2xl border border-border-default bg-bg-card p-6">
            <h2 className="text-lg font-semibold text-text-primary">Contact</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-3 w-full rounded-lg border border-border-default bg-bg-primary px-4 py-3 text-text-primary"
            />
            <p className="mt-2 text-xs text-text-muted">Your download links will be emailed here.</p>

            <h2 className="mt-8 text-lg font-semibold text-text-primary">Payment</h2>
            <p className="mt-2 text-sm text-text-secondary">Secure payment via Razorpay (test mode).</p>
            <button
              onClick={pay}
              disabled={busy || !email}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple py-3 font-semibold text-white disabled:opacity-50"
            >
              {busy ? "Opening checkout..." : `Pay ${formatUSD(subtotal)}`}
            </button>
          </div>

          <aside className="rounded-2xl border border-border-default bg-bg-card p-6 h-fit">
            <h2 className="text-lg font-semibold text-text-primary">Order summary</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {items.map((i) => (
                <li key={i.slug} className="flex justify-between text-text-secondary">
                  <span className="truncate pr-2">{i.title} × {i.qty}</span>
                  <span className="font-semibold text-text-primary">{formatUSD(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-border-default pt-3">
              <span className="text-text-secondary">Total</span>
              <span className="font-bold text-text-primary">{formatUSD(subtotal)}</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
