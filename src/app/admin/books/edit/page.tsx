"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { useAdmin } from "@/lib/hooks/useAdmin";
import { logAudit } from "@/lib/admin";
import BookForm, { BookFormValue, emptyBook, toBookPayload, fromBookRow } from "@/components/admin/BookForm";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { inputClasses } from "@/components/admin/FormField";

export const dynamic = "force-static";

interface Chapter {
  id: string;
  book_id: string;
  idx: number;
  title: string;
  body: string | null;
  is_sample: boolean;
}

function EditInner() {
  const params = useSearchParams();
  const id = params?.get("id") ?? null;
  const router = useRouter();
  const { user } = useAdmin();

  const [value, setValue] = useState<BookFormValue>(emptyBook);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (!id) return;
    const sb = getSupabase();
    if (!sb) return;
    (async () => {
      const { data } = await sb.from("book").select("*").eq("id", id).single();
      if (data) {
        setValue(fromBookRow(data as Record<string, unknown>));
      }
      const { data: chs } = await sb.from("chapter").select("*").eq("book_id", id).order("idx");
      setChapters((chs ?? []) as Chapter[]);
      setLoading(false);
    })();
  }, [id]);

  async function save() {
    const sb = getSupabase();
    if (!sb || !id) return;
    setSaving(true);
    setError(null);
    const payload = toBookPayload(value);
    const { error } = await sb.from("book").update(payload).eq("id", id);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    await logAudit({ userId: user?.id ?? null, entity: "book", entityId: id, action: "update", diff: payload });
  }

  async function remove() {
    const sb = getSupabase();
    if (!sb || !id) return;
    const { error } = await sb.from("book").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    await logAudit({ userId: user?.id ?? null, entity: "book", entityId: id, action: "delete" });
    router.push("/admin/books/");
  }

  async function addChapter() {
    const sb = getSupabase();
    if (!sb || !id) return;
    const nextIdx = chapters.length ? Math.max(...chapters.map((c) => c.idx)) + 1 : 1;
    const { data } = await sb
      .from("chapter")
      .insert({ book_id: id, idx: nextIdx, title: `Chapter ${nextIdx}`, body: "", is_sample: false })
      .select("*")
      .single();
    if (data) setChapters([...chapters, data as Chapter]);
  }

  async function updateChapter(c: Chapter, patch: Partial<Chapter>) {
    const sb = getSupabase();
    if (!sb) return;
    const next = { ...c, ...patch };
    setChapters((cs) => cs.map((x) => (x.id === c.id ? next : x)));
    await sb.from("chapter").update(patch).eq("id", c.id);
  }

  async function deleteChapter(c: Chapter) {
    const sb = getSupabase();
    if (!sb) return;
    await sb.from("chapter").delete().eq("id", c.id);
    setChapters((cs) => cs.filter((x) => x.id !== c.id));
  }

  if (!id) {
    return (
      <div>
        <p className="text-sm text-text-muted">No book id provided.</p>
        <Link href="/admin/books/" className="text-accent-blue hover:underline">
          Back to books
        </Link>
      </div>
    );
  }

  if (loading) return <p className="text-sm text-text-muted">Loading…</p>;

  return (
    <div>
      <Link href="/admin/books/" className="text-xs text-text-muted hover:text-text-primary">
        ← Back to books
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary">
          Edit book
        </h1>
        <button
          onClick={() => setConfirm(true)}
          className="rounded-xl border border-accent-pink/40 px-4 py-2 text-sm text-accent-pink hover:bg-accent-pink/10"
        >
          Delete
        </button>
      </div>

      <div className="mt-6">
        <BookForm value={value} onChange={setValue} />
      </div>
      {error && <p className="mt-4 text-sm text-accent-pink">{error}</p>}
      <div className="mt-6 flex gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {/* Chapters */}
      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Chapters</h2>
          <button
            onClick={addChapter}
            className="rounded-lg border border-border-default px-3 py-1.5 text-xs text-text-secondary hover:bg-white/5"
          >
            + Add chapter
          </button>
        </div>
        {chapters.length === 0 ? (
          <p className="text-sm text-text-muted">No chapters yet.</p>
        ) : (
          <ul className="space-y-3">
            {chapters.map((c) => (
              <li key={c.id} className="rounded-xl border border-border-default bg-bg-card p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="number"
                    className={`${inputClasses} w-20`}
                    value={c.idx}
                    onChange={(e) => updateChapter(c, { idx: Number(e.target.value) })}
                  />
                  <input
                    className={`${inputClasses} flex-1`}
                    value={c.title}
                    onChange={(e) => updateChapter(c, { title: e.target.value })}
                  />
                  <label className="flex items-center gap-1 text-xs text-text-secondary">
                    <input
                      type="checkbox"
                      checked={c.is_sample}
                      onChange={(e) => updateChapter(c, { is_sample: e.target.checked })}
                    />
                    Sample
                  </label>
                  <button
                    onClick={() => deleteChapter(c)}
                    className="text-xs text-accent-pink hover:underline"
                  >
                    Delete
                  </button>
                </div>
                <textarea
                  rows={4}
                  className={`${inputClasses} mt-3`}
                  placeholder="Chapter body…"
                  value={c.body ?? ""}
                  onChange={(e) => updateChapter(c, { body: e.target.value })}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={confirm}
        title="Delete this book?"
        description="This cannot be undone. All chapters will also be deleted."
        confirmLabel="Delete"
        destructive
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          remove();
        }}
      />
    </div>
  );
}

export default function AdminBookEditPage() {
  return (
    <Suspense fallback={<p className="text-sm text-text-muted">Loading…</p>}>
      <EditInner />
    </Suspense>
  );
}
