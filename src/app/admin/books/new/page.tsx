"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { useAdmin } from "@/lib/hooks/useAdmin";
import { logAudit } from "@/lib/admin";
import BookForm, { emptyBook, BookFormValue, toBookPayload } from "@/components/admin/BookForm";
import { extractAsin, detectStore, buildCanonicalUrl } from "@/lib/amazon";
import { inputClasses } from "@/components/admin/FormField";

export default function AdminBookNewPage() {
  const [step, setStep] = useState<"intake" | "form">("intake");
  const [rawInput, setRawInput] = useState("");
  const [value, setValue] = useState<BookFormValue>(emptyBook);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAdmin();

  function slugify(s: string): string {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
  }

  function handleFetch() {
    setError(null);
    const asin = extractAsin(rawInput);
    if (!asin) {
      setError("Couldn't find an ASIN in that input. Paste an Amazon product URL or a 10-char ASIN.");
      return;
    }
    const store = detectStore(rawInput);
    const next: BookFormValue = { ...emptyBook, asin };
    if (store === "amazon.in") next.amazon_in_url = buildCanonicalUrl(asin, "amazon.in");
    if (store === "amazon.com") next.amazon_com_url = buildCanonicalUrl(asin, "amazon.com");
    // If user pasted a raw URL, preserve it exactly for whichever store it matched.
    if (store === "amazon.in") next.amazon_in_url = rawInput.trim();
    if (store === "amazon.com") next.amazon_com_url = rawInput.trim();
    // Draft slug from ASIN; admin will override.
    next.slug = `book-${asin.toLowerCase()}`;
    setValue(next);
    setStep("form");
  }

  async function save() {
    const sb = getSupabase();
    if (!sb) return;
    if (!value.slug || !value.title) {
      setError("Slug and Title are required.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = toBookPayload(value);
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

      {step === "intake" && (
        <div className="mt-8 max-w-2xl rounded-2xl border border-border-default bg-bg-card p-6">
          <h2 className="text-lg font-semibold text-text-primary">Paste an Amazon URL or ASIN</h2>
          <p className="mt-1 text-sm text-text-secondary">
            We&apos;ll extract the ASIN, pre-fill the product URL, and open the catalog form. Once PA-API is enabled,
            this step will also auto-fill title, author, price, rating, and cover.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              className={`${inputClasses} flex-1`}
              placeholder="https://www.amazon.in/dp/B0G3QKKXFD/  or  B0G3QKKXFD"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              autoFocus
            />
            <button
              onClick={handleFetch}
              className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-2 text-sm font-semibold text-white"
            >
              Continue
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-accent-pink">{error}</p>}

          <div className="mt-6 border-t border-border-default pt-4">
            <button
              onClick={() => {
                setValue(emptyBook);
                setStep("form");
              }}
              className="text-xs text-text-muted hover:text-text-primary"
            >
              Skip and enter a book manually →
            </button>
          </div>
        </div>
      )}

      {step === "form" && (
        <>
          <div className="mt-6">
            <BookForm value={value} onChange={setValue} />
          </div>
          {error && <p className="mt-4 text-sm text-accent-pink">{error}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={save}
              disabled={saving || !value.slug || !value.title}
              className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : value.status === "published" ? "Publish" : "Save draft"}
            </button>
            <button
              onClick={() => {
                // Auto-fill slug from title if still empty
                if (!value.slug && value.title) setValue({ ...value, slug: slugify(value.title) });
              }}
              className="rounded-xl border border-border-default px-5 py-2 text-sm text-text-secondary hover:bg-white/5"
            >
              Auto-slug from title
            </button>
            <Link
              href="/admin/books/"
              className="rounded-xl border border-border-default px-5 py-2 text-sm text-text-secondary hover:bg-white/5"
            >
              Cancel
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
