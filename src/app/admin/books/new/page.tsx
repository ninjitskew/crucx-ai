"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { useAdmin } from "@/lib/hooks/useAdmin";
import { logAudit } from "@/lib/admin";
import BookForm, { emptyBook, BookFormValue } from "@/components/admin/BookForm";

export default function AdminBookNewPage() {
  const [value, setValue] = useState<BookFormValue>(emptyBook);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAdmin();

  async function save() {
    const sb = getSupabase();
    if (!sb) return;
    setSaving(true);
    setError(null);
    const payload = {
      slug: value.slug,
      title: value.title,
      subtitle: value.subtitle || null,
      description: value.description || null,
      author_id: value.author_id,
      cover_url: value.cover_url || null,
      price_inr: value.price_cents,
      status: value.status,
      published_at: value.status === "published" ? new Date().toISOString() : null,
    };
    const { data, error } = await sb.from("book").insert(payload).select("id").single();
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    await logAudit({
      userId: user?.id ?? null,
      entity: "book",
      entityId: data?.id ?? null,
      action: "create",
      diff: payload,
    });
    router.push(`/admin/books/edit/?id=${data?.id}`);
  }

  return (
    <div>
      <Link href="/admin/books/" className="text-xs text-text-muted hover:text-text-primary">
        ← Back to books
      </Link>
      <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary">
        New book
      </h1>
      <div className="mt-6">
        <BookForm value={value} onChange={setValue} />
      </div>
      {error && <p className="mt-4 text-sm text-accent-pink">{error}</p>}
      <div className="mt-6 flex gap-3">
        <button
          onClick={save}
          disabled={saving || !value.slug || !value.title}
          className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Create book"}
        </button>
        <Link
          href="/admin/books/"
          className="rounded-xl border border-border-default px-5 py-2 text-sm text-text-secondary hover:bg-white/5"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
