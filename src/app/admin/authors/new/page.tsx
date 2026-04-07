"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { useAdmin } from "@/lib/hooks/useAdmin";
import { logAudit } from "@/lib/admin";
import AuthorForm, { emptyAuthor, AuthorFormValue } from "@/components/admin/AuthorForm";

export default function AdminAuthorNewPage() {
  const [value, setValue] = useState<AuthorFormValue>(emptyAuthor);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAdmin();
  const router = useRouter();

  async function save() {
    const sb = getSupabase();
    if (!sb) return;
    setSaving(true);
    setError(null);
    const payload = {
      user_id: value.user_id,
      pen_name: value.pen_name,
      slug: value.slug,
      bio: value.bio || null,
      avatar_url: value.avatar_url || null,
      website: value.website || null,
    };
    const { error } = await sb.from("author_profile").insert(payload);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    await logAudit({ userId: user?.id ?? null, entity: "author_profile", entityId: value.user_id, action: "create", diff: payload });
    router.push("/admin/authors/");
  }

  return (
    <div>
      <Link href="/admin/authors/" className="text-xs text-text-muted hover:text-text-primary">
        ← Back to authors
      </Link>
      <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary">
        New author
      </h1>
      <div className="mt-6">
        <AuthorForm value={value} onChange={setValue} />
      </div>
      {error && <p className="mt-4 text-sm text-accent-pink">{error}</p>}
      <div className="mt-6 flex gap-3">
        <button
          onClick={save}
          disabled={saving || !value.user_id || !value.pen_name || !value.slug}
          className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Create author"}
        </button>
        <Link
          href="/admin/authors/"
          className="rounded-xl border border-border-default px-5 py-2 text-sm text-text-secondary hover:bg-white/5"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
