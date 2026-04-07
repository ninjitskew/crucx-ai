"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/lib/hooks/useUser";
import { getSupabase } from "@/lib/supabase";
import { formatUSD } from "@/lib/format";
import EmptyState from "@/components/marketplace/EmptyState";

export default function ReaderOrdersPage() {
  const { user, loading } = useUser();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const sb = getSupabase();
    if (!sb) return;
    sb.from("order").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setOrders(data ?? []));
  }, [user]);

  if (loading) return <main className="min-h-screen bg-bg-primary pt-24" />;
  if (!user) return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-text-primary">Sign in to view your orders</h1>
        <a href="/auth/sign-in/" className="mt-4 inline-block text-accent-blue hover:underline">Sign in</a>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold text-text-primary">Orders</h1>
        {orders.length === 0 ? (
          <div className="mt-8"><EmptyState title="No orders yet" /></div>
        ) : (
          <ul className="mt-8 space-y-3">
            {orders.map((o) => (
              <li key={o.id} className="rounded-xl border border-border-default bg-bg-card p-4">
                <div className="flex items-center justify-between">
                  <Link href={`/checkout/success/${o.id}/`} className="font-mono text-sm text-accent-blue hover:underline">{o.id}</Link>
                  <span className="font-semibold text-text-primary">{formatUSD(Number(o.total_usd ?? 0))}</span>
                </div>
                <p className="mt-1 text-xs text-text-muted">{o.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
