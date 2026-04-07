"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { useAdmin } from "@/lib/hooks/useAdmin";
import { logAudit } from "@/lib/admin";
import AuthorForm, { AuthorFormValue, emptyAuthor } from "@/components/admin/AuthorForm";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export const dynamic = "force-static";

function EditInner() {
  const params = useSearchParams();
  const id = params?.get("id") ?? null;
  const router = useRouter();
  const { user } = useAdmin();
  const [value, setValue] = useState<AuthorFormValue>(emptyAuthor);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (!id) return;
    const sb = getSupabase();
    if (!sb) return;
    sb.from("author_profile")
      .select("*")
      .eq("user_id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          setValue({
            user_id: data.user_id,
            pen_name: data.pen_name ?? "",
            slug: data.slug ?? "",
            bio: data.bio ?? "",
            avatar_url: data.avatar_url ?? "",
            website: data.website ?? "",
          });
        }
        setLoading(false);
      });
  }, [id]);

  async function save() {
    const sb = getSupabase();
    if (!sb || !id) return;
    setSaving(true);
    setError(null);
    const payload = {
      pen_name: value.pen_name,
      slug: value.slug,
      bio: value.bio || null,
      avatar_url: value.avatar_url || null,
      website: value.website || null,
    };
    const { error } = await sb.from("author_profile").update(payload).eq("user_id", id);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    await logAudit({ userId: user?.id ?? null, entity: "author_profile", entityId: id, action: "update", diff: payload });
  }

  async function remove() {
    const sb = getSupabase();
    if (!sb || !id) return;
    const { error } = await sb.from("author_profile").delete().eq("user_id", id);
    if (error) {
      setError(error.message);
      return;
    }
    await logAudit({ userId: user?.id ?? null, entity: "author_profile", entityId: id, action: "delete" });
    router.push("/admin/authors/");
  }

  if (!id) return <p className="text-sm text-text-muted">No author id.</p>;
  if (loading) return <p className="text-sm text-text-muted">Loading…</p>;

  return (
    <div>
      <Link href="/admin/authors/" className="text-xs text-text-muted hover:text-text-primary">
        ← Back to authors
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary">
          Edit author
        </h1>
        <button
          onClick={() => setConfirm(true)}
          className="rounded-xl border border-accent-pink/40 px-4 py-2 text-sm text-accent-pink hover:bg-accent-pink/10"
        >
          Delete
        </button>
      </div>
      <div className="mt-6">
        <AuthorForm value={value} onChange={setValue} lockId />
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

      <ConfirmDialog
        open={confirm}
        title="Delete this author?"
        description="This cannot be undone."
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

export default function AdminAuthorEditPage() {
  return (
    <Suspense fallback={<p className="text-sm text-text-muted">Loading…</p>}>
      <EditInner />
    </Suspense>
  );
}
