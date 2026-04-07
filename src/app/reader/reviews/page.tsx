"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { getSupabase } from "@/lib/supabase";
import EmptyState from "@/components/marketplace/EmptyState";

export default function ReaderReviewsPage() {
  const { user, loading } = useUser();
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const sb = getSupabase();
    if (!sb) return;
    sb.from("review").select("*").eq("user_id", user.id).then(({ data }) => setReviews(data ?? []));
  }, [user]);

  if (loading) return <main className="min-h-screen bg-bg-primary pt-24" />;
  if (!user) return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-text-primary">Sign in to see your reviews</h1>
        <a href="/auth/sign-in/" className="mt-4 inline-block text-accent-blue hover:underline">Sign in</a>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold text-text-primary">Your reviews</h1>
        {reviews.length === 0 ? (
          <div className="mt-8"><EmptyState title="No reviews yet" /></div>
        ) : (
          <ul className="mt-8 space-y-4">
            {reviews.map((r) => (
              <li key={r.id ?? r.book_slug} className="rounded-xl border border-border-default bg-bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-text-muted">{r.book_slug ?? r.book_id}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-xs capitalize ${
                    r.moderation_status === "approved"
                      ? "border-accent-cyan/30 text-accent-cyan"
                      : r.moderation_status === "rejected"
                      ? "border-accent-pink/30 text-accent-pink"
                      : "border-accent-purple/30 text-accent-purple"
                  }`}>
                    {r.moderation_status ?? "pending"}
                  </span>
                </div>
                <p className="mt-1 text-text-primary">{r.rating} ★</p>
                <p className="mt-2 text-sm text-text-secondary">{r.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
