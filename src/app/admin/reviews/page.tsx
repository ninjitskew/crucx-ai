"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useAdmin } from "@/lib/hooks/useAdmin";
import { logAudit } from "@/lib/admin";
import StatusBadge from "@/components/admin/StatusBadge";

type Tab = "pending" | "approved" | "rejected";

interface ReviewRow {
  id: string;
  book_id: string;
  user_id: string;
  rating: number;
  body: string | null;
  moderation_status: Tab;
  moderation_note: string | null;
  created_at: string;
  book?: { title: string } | null;
  user?: { email: string } | null;
}

export default function AdminReviewsPage() {
  const [tab, setTab] = useState<Tab>("pending");
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<Record<string, string>>({});
  const { user } = useAdmin();

  async function load() {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await sb
      .from("review")
      .select("*, book:book_id(title), user:user_id(email)")
      .eq("moderation_status", tab)
      .order("created_at", { ascending: false });
    setRows((data ?? []) as unknown as ReviewRow[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function moderate(r: ReviewRow, status: "approved" | "rejected") {
    const sb = getSupabase();
    if (!sb) return;
    const patch = {
      moderation_status: status,
      moderated_by: user?.id ?? null,
      moderated_at: new Date().toISOString(),
      moderation_note: note[r.id] || null,
    };
    await sb.from("review").update(patch).eq("id", r.id);
    await logAudit({ userId: user?.id ?? null, entity: "review", entityId: r.id, action: status, diff: patch });
    setRows((rs) => rs.filter((x) => x.id !== r.id));
  }

  async function remove(r: ReviewRow) {
    const sb = getSupabase();
    if (!sb) return;
    await sb.from("review").delete().eq("id", r.id);
    await logAudit({ userId: user?.id ?? null, entity: "review", entityId: r.id, action: "delete" });
    setRows((rs) => rs.filter((x) => x.id !== r.id));
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary">
        Reviews moderation
      </h1>

      <div className="mt-4 flex gap-2">
        {(["pending", "approved", "rejected"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
              tab === t
                ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white"
                : "border border-border-default text-text-secondary hover:text-text-primary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-text-muted">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="rounded-2xl border border-border-default bg-bg-card p-8 text-center text-sm text-text-muted">
            Nothing in this queue.
          </p>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border-default bg-bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {r.book?.title ?? r.book_id}
                  </p>
                  <p className="text-xs text-text-muted">
                    {r.user?.email ?? r.user_id} · {new Date(r.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-accent-purple">{r.rating}★</span>
                  <StatusBadge status={r.moderation_status} />
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-text-secondary">{r.body}</p>
              <textarea
                rows={2}
                value={note[r.id] ?? ""}
                onChange={(e) => setNote((n) => ({ ...n, [r.id]: e.target.value }))}
                placeholder="Moderation note (optional)"
                className="mt-3 w-full rounded-lg border border-border-default bg-bg-primary p-2 text-xs text-text-primary"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {tab !== "approved" && (
                  <button
                    onClick={() => moderate(r, "approved")}
                    className="rounded-lg bg-gradient-to-r from-accent-cyan to-accent-blue px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    Approve
                  </button>
                )}
                {tab !== "rejected" && (
                  <button
                    onClick={() => moderate(r, "rejected")}
                    className="rounded-lg border border-accent-pink/40 px-3 py-1.5 text-xs font-semibold text-accent-pink hover:bg-accent-pink/10"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => remove(r)}
                  className="rounded-lg border border-border-default px-3 py-1.5 text-xs text-text-muted hover:text-text-primary"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
