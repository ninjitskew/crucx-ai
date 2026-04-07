"use client";

import { useState } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { getSupabase } from "@/lib/supabase";

export default function ReviewComposer({ bookSlug }: { bookSlug: string }) {
  const { user } = useUser();
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  if (!user) {
    return (
      <p className="text-sm text-text-muted">
        <a href="/auth/sign-in/" className="text-accent-blue hover:underline">Sign in</a> to leave a review.
      </p>
    );
  }

  async function submit() {
    const sb = getSupabase();
    if (!sb || !user) return;
    setStatus("saving");
    const { error } = await sb.from("review").upsert({
      book_slug: bookSlug,
      user_id: user.id,
      rating,
      body,
    });
    setStatus(error ? "error" : "saved");
  }

  return (
    <div className="rounded-xl border border-border-default bg-bg-card p-4">
      <h4 className="mb-2 text-sm font-semibold text-text-primary">Write a review</h4>
      <div className="mb-3 flex items-center gap-2 text-sm text-text-secondary">
        <span>Rating:</span>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rounded border border-border-default bg-bg-primary px-2 py-1 text-text-primary">
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Share your thoughts..."
        className="w-full rounded-lg border border-border-default bg-bg-primary p-3 text-sm text-text-primary"
      />
      <button
        onClick={submit}
        disabled={status === "saving"}
        className="mt-3 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple px-4 py-2 text-sm font-semibold text-white"
      >
        {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : "Post review"}
      </button>
      {status === "error" && <p className="mt-2 text-xs text-accent-pink">Couldn't save. Check your connection.</p>}
    </div>
  );
}
