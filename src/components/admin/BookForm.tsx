"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { SUPER_CATEGORIES, AMAZON_FORMATS } from "@/lib/amazon";
import FormField, { inputClasses } from "./FormField";
import ImageUrlInput from "./ImageUrlInput";

export interface BookFormValue {
  // basic
  slug: string;
  title: string;
  subtitle: string;
  description: string;

  // authorship
  author_id: string | null;   // Crucx author profile (optional)
  author_name: string;        // free-text for affiliate books

  // Amazon affiliate
  asin: string;
  amazon_in_url: string;
  amazon_com_url: string;

  // pricing
  price_inr: number;                       // integer rupees
  price_usd: number;                       // decimal dollars
  currency_primary: "USD" | "INR";

  // catalog
  super_category: string;
  bestseller_rank: number | null;
  cover_url: string;
  rating: number | null;
  review_count: number | null;
  format: string;
  pages: number | null;
  published_date: string;                  // ISO YYYY-MM-DD

  // status
  status: "draft" | "published" | "archived";
}

export const emptyBook: BookFormValue = {
  slug: "",
  title: "",
  subtitle: "",
  description: "",
  author_id: null,
  author_name: "",
  asin: "",
  amazon_in_url: "",
  amazon_com_url: "",
  price_inr: 0,
  price_usd: 0,
  currency_primary: "USD",
  super_category: "",
  bestseller_rank: null,
  cover_url: "",
  rating: null,
  review_count: null,
  format: "",
  pages: null,
  published_date: "",
  status: "draft",
};

interface Props {
  value: BookFormValue;
  onChange: (v: BookFormValue) => void;
}

interface AuthorOpt {
  user_id: string;
  pen_name: string;
}

export default function BookForm({ value, onChange }: Props) {
  const [authors, setAuthors] = useState<AuthorOpt[]>([]);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.from("author_profile")
      .select("user_id,pen_name")
      .order("pen_name")
      .then(({ data }) => setAuthors((data ?? []) as AuthorOpt[]));
  }, []);

  function set<K extends keyof BookFormValue>(k: K, v: BookFormValue[K]) {
    onChange({ ...value, [k]: v });
  }

  const numOrNull = (raw: string): number | null => {
    if (raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };

  return (
    <div className="space-y-8">
      {/* Amazon affiliate section */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          Amazon affiliate
        </h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField label="ASIN" hint="10-character Amazon Standard Identification Number">
            <input
              className={inputClasses}
              value={value.asin}
              onChange={(e) => set("asin", e.target.value.toUpperCase().trim())}
              placeholder="B0G3QKKXFD"
            />
          </FormField>
          <FormField label="Super-category" hint="Top-level marketplace bucket">
            <select
              className={inputClasses}
              value={value.super_category}
              onChange={(e) => set("super_category", e.target.value)}
            >
              <option value="">— Select —</option>
              {SUPER_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Amazon.in URL" hint="Canonical product URL (no affiliate tag — added at click time)">
            <input
              className={inputClasses}
              value={value.amazon_in_url}
              onChange={(e) => set("amazon_in_url", e.target.value)}
              placeholder="https://www.amazon.in/dp/B0G3QKKXFD/"
            />
          </FormField>
          <FormField label="Amazon.com URL">
            <input
              className={inputClasses}
              value={value.amazon_com_url}
              onChange={(e) => set("amazon_com_url", e.target.value)}
              placeholder="https://www.amazon.com/dp/B0G3QKKXFD/"
            />
          </FormField>
        </div>
      </section>

      {/* Identity */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">Identity</h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField label="Slug" hint="Lowercase, hyphenated URL identifier">
            <input
              className={inputClasses}
              value={value.slug}
              onChange={(e) => set("slug", e.target.value)}
            />
          </FormField>
          <FormField label="Title">
            <input className={inputClasses} value={value.title} onChange={(e) => set("title", e.target.value)} />
          </FormField>
          <FormField label="Subtitle">
            <input
              className={inputClasses}
              value={value.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
            />
          </FormField>
          <FormField label="Author name" hint="Free text — use for affiliate books not tied to a Crucx author">
            <input
              className={inputClasses}
              value={value.author_name}
              onChange={(e) => set("author_name", e.target.value)}
            />
          </FormField>
          <FormField label="Crucx author (optional)" hint="Link to a Crucx author_profile">
            <select
              className={inputClasses}
              value={value.author_id ?? ""}
              onChange={(e) => set("author_id", e.target.value || null)}
            >
              <option value="">— None —</option>
              {authors.map((a) => (
                <option key={a.user_id} value={a.user_id}>
                  {a.pen_name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Status">
            <select
              className={inputClasses}
              value={value.status}
              onChange={(e) => set("status", e.target.value as BookFormValue["status"])}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Description" hint="Full Amazon product description — mirrored on internal PDP">
              <textarea
                rows={5}
                className={inputClasses}
                value={value.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </FormField>
          </div>
          <div className="md:col-span-2">
            <FormField label="Cover image URL" hint="Amazon CDN image URL preferred">
              <ImageUrlInput value={value.cover_url} onChange={(v) => set("cover_url", v)} />
            </FormField>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">Pricing</h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FormField label="Price (USD)" hint="Primary display price. Dollars + cents, e.g. 17.98">
            <input
              type="number"
              step="0.01"
              min={0}
              className={inputClasses}
              value={value.price_usd}
              onChange={(e) => set("price_usd", Number(e.target.value) || 0)}
            />
          </FormField>
          <FormField label="Price (INR)" hint="Whole rupees (no paise)">
            <input
              type="number"
              min={0}
              className={inputClasses}
              value={value.price_inr}
              onChange={(e) => set("price_inr", Number(e.target.value) || 0)}
            />
          </FormField>
          <FormField label="Primary currency" hint="Currency shown by default if user hasn't toggled">
            <select
              className={inputClasses}
              value={value.currency_primary}
              onChange={(e) => set("currency_primary", e.target.value as BookFormValue["currency_primary"])}
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
            </select>
          </FormField>
        </div>
      </section>

      {/* Metadata */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">Metadata</h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FormField label="Rating" hint="0–5">
            <input
              type="number"
              step="0.01"
              min={0}
              max={5}
              className={inputClasses}
              value={value.rating ?? ""}
              onChange={(e) => set("rating", numOrNull(e.target.value))}
            />
          </FormField>
          <FormField label="Review count">
            <input
              type="number"
              min={0}
              className={inputClasses}
              value={value.review_count ?? ""}
              onChange={(e) => set("review_count", numOrNull(e.target.value))}
            />
          </FormField>
          <FormField label="Bestseller rank" hint="Lower = better. Leave blank if unranked">
            <input
              type="number"
              min={0}
              className={inputClasses}
              value={value.bestseller_rank ?? ""}
              onChange={(e) => set("bestseller_rank", numOrNull(e.target.value))}
            />
          </FormField>
          <FormField label="Format">
            <select
              className={inputClasses}
              value={value.format}
              onChange={(e) => set("format", e.target.value)}
            >
              <option value="">— Select —</option>
              {AMAZON_FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Pages">
            <input
              type="number"
              min={0}
              className={inputClasses}
              value={value.pages ?? ""}
              onChange={(e) => set("pages", numOrNull(e.target.value))}
            />
          </FormField>
          <FormField label="Published date">
            <input
              type="date"
              className={inputClasses}
              value={value.published_date}
              onChange={(e) => set("published_date", e.target.value)}
            />
          </FormField>
        </div>
      </section>
    </div>
  );
}

/** Shape a BookFormValue into the DB row payload for insert/update. */
export function toBookPayload(v: BookFormValue) {
  return {
    slug: v.slug,
    title: v.title,
    subtitle: v.subtitle || null,
    description: v.description || null,
    author_id: v.author_id,
    author_name: v.author_name || null,
    asin: v.asin || null,
    amazon_in_url: v.amazon_in_url || null,
    amazon_com_url: v.amazon_com_url || null,
    price_inr: v.price_inr,
    price_usd: v.price_usd,
    currency_primary: v.currency_primary,
    super_category: v.super_category || null,
    bestseller_rank: v.bestseller_rank,
    cover_url: v.cover_url || null,
    rating: v.rating,
    review_count: v.review_count,
    format: v.format || null,
    pages: v.pages,
    published_date: v.published_date || null,
    status: v.status,
    published_at: v.status === "published" ? new Date().toISOString() : null,
  };
}

/** Shape a DB row into a BookFormValue for loading in the edit page. */
export function fromBookRow(row: Record<string, unknown>): BookFormValue {
  const pickNum = (x: unknown): number | null =>
    typeof x === "number" ? x : x == null ? null : Number.isFinite(Number(x)) ? Number(x) : null;
  const pickStr = (x: unknown): string => (typeof x === "string" ? x : "");
  return {
    slug: pickStr(row.slug),
    title: pickStr(row.title),
    subtitle: pickStr(row.subtitle),
    description: pickStr(row.description),
    author_id: (row.author_id as string | null) ?? null,
    author_name: pickStr(row.author_name),
    asin: pickStr(row.asin),
    amazon_in_url: pickStr(row.amazon_in_url),
    amazon_com_url: pickStr(row.amazon_com_url),
    price_inr: pickNum(row.price_inr) ?? 0,
    price_usd: pickNum(row.price_usd) ?? 0,
    currency_primary: (row.currency_primary as "USD" | "INR") ?? "USD",
    super_category: pickStr(row.super_category),
    bestseller_rank: pickNum(row.bestseller_rank),
    cover_url: pickStr(row.cover_url),
    rating: pickNum(row.rating),
    review_count: pickNum(row.review_count),
    format: pickStr(row.format),
    pages: pickNum(row.pages),
    published_date: pickStr(row.published_date),
    status: ((row.status as string) ?? "draft") as BookFormValue["status"],
  };
}
