"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useAdmin } from "@/lib/hooks/useAdmin";
import { logAudit } from "@/lib/admin";
import { extractAsin, detectStore, buildCanonicalUrl, SUPER_CATEGORIES } from "@/lib/amazon";

/**
 * Bulk CSV import for affiliate books.
 *
 * Minimum columns: asin
 * Optional columns: amazon_url, super_category, title, author_name, price_usd, price_inr,
 *                   rating, review_count, format, pages, cover_url, published_date
 *
 * Rows are inserted as status='draft' — admin reviews + publishes later.
 */

type ParsedRow = {
  line: number;
  raw: Record<string, string>;
  asin: string | null;
  amazon_in_url: string | null;
  amazon_com_url: string | null;
  super_category: string | null;
  title: string;
  author_name: string;
  price_usd: number | null;
  price_inr: number | null;
  rating: number | null;
  review_count: number | null;
  format: string;
  pages: number | null;
  cover_url: string;
  published_date: string;
  issues: string[];
};

type ExistingCheck = { asin: string; existingSlug: string };

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.replace(/\r\n?/g, "\n").split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const header = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const obj: Record<string, string> = {};
    header.forEach((h, j) => (obj[h] = (cols[j] ?? "").trim()));
    rows.push(obj);
  }
  return rows;
}

// Minimal RFC4180-ish splitter supporting quoted fields with commas.
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && line[i + 1] === '"' && inQuotes) {
      cur += '"';
      i++;
    } else if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function slugifyFromAsin(asin: string, title?: string): string {
  if (title && title.length > 2) {
    const s = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);
    if (s) return `${s}-${asin.toLowerCase()}`;
  }
  return `book-${asin.toLowerCase()}`;
}

function parseRow(raw: Record<string, string>, lineNum: number): ParsedRow {
  const issues: string[] = [];
  const asinInput = raw.asin || raw.amazon_url || "";
  const asin = extractAsin(asinInput);
  if (!asin) issues.push("missing or invalid ASIN");

  const url = raw.amazon_url || "";
  let inUrl: string | null = null;
  let comUrl: string | null = null;
  if (url) {
    const store = detectStore(url);
    if (store === "amazon.in") inUrl = url;
    if (store === "amazon.com") comUrl = url;
  }
  if (!inUrl && !comUrl && asin) {
    // default to .in since primary traffic is India
    inUrl = buildCanonicalUrl(asin, "amazon.in");
    comUrl = buildCanonicalUrl(asin, "amazon.com");
  }

  const superCat = (raw.super_category || "").trim();
  if (superCat && !SUPER_CATEGORIES.includes(superCat as (typeof SUPER_CATEGORIES)[number])) {
    issues.push(`super_category '${superCat}' not in ${SUPER_CATEGORIES.join("|")}`);
  }

  const toNum = (s: string | undefined): number | null => {
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  };

  return {
    line: lineNum,
    raw,
    asin,
    amazon_in_url: inUrl,
    amazon_com_url: comUrl,
    super_category: superCat || null,
    title: (raw.title || "").trim(),
    author_name: (raw.author_name || raw.author || "").trim(),
    price_usd: toNum(raw.price_usd),
    price_inr: toNum(raw.price_inr),
    rating: toNum(raw.rating),
    review_count: toNum(raw.review_count),
    format: (raw.format || "").trim(),
    pages: toNum(raw.pages),
    cover_url: (raw.cover_url || "").trim(),
    published_date: (raw.published_date || "").trim(),
    issues,
  };
}

export default function AdminBooksImportPage() {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [existing, setExisting] = useState<ExistingCheck[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [publishImmediately, setPublishImmediately] = useState(false);
  const { user } = useAdmin();

  async function handleFile(file: File) {
    setResult(null);
    setFileName(file.name);
    const text = await file.text();
    const raw = parseCSV(text);
    const parsed = raw.map((r, i) => parseRow(r, i + 2));
    setRows(parsed);

    // Check for existing ASINs in the DB
    const sb = getSupabase();
    const asins = parsed.map((r) => r.asin).filter((a): a is string => !!a);
    if (sb && asins.length > 0) {
      const { data } = await sb.from("book").select("asin,slug").in("asin", asins);
      setExisting(
        ((data ?? []) as { asin: string; slug: string }[]).map((r) => ({
          asin: r.asin,
          existingSlug: r.slug,
        }))
      );
    } else {
      setExisting([]);
    }
  }

  const existingSet = useMemo(() => new Set(existing.map((e) => e.asin)), [existing]);

  const valid = rows.filter((r) => r.asin && r.issues.length === 0 && !existingSet.has(r.asin));
  const duplicates = rows.filter((r) => r.asin && existingSet.has(r.asin));
  const invalid = rows.filter((r) => !r.asin || r.issues.length > 0);

  async function runImport() {
    const sb = getSupabase();
    if (!sb || valid.length === 0) return;
    setImporting(true);
    setResult(null);

    const status = publishImmediately ? "published" : "draft";
    const nowIso = new Date().toISOString();
    const payloads = valid.map((r) => ({
      slug: slugifyFromAsin(r.asin!, r.title),
      title: r.title || `Untitled (${r.asin})`,
      author_name: r.author_name || null,
      asin: r.asin,
      amazon_in_url: r.amazon_in_url,
      amazon_com_url: r.amazon_com_url,
      price_inr: r.price_inr ?? 0,
      price_usd: r.price_usd,
      currency_primary: "USD",
      super_category: r.super_category,
      rating: r.rating,
      review_count: r.review_count,
      format: r.format || null,
      pages: r.pages,
      cover_url: r.cover_url || null,
      published_date: r.published_date || null,
      status,
      published_at: status === "published" ? nowIso : null,
    }));

    // Insert in chunks of 50 to keep request size small
    let inserted = 0;
    const errs: string[] = [];
    for (let i = 0; i < payloads.length; i += 50) {
      const chunk = payloads.slice(i, i + 50);
      const { error, count } = await sb.from("book").insert(chunk, { count: "exact" });
      if (error) {
        errs.push(error.message);
      } else {
        inserted += count ?? chunk.length;
      }
    }

    await logAudit({
      userId: user?.id ?? null,
      entity: "book",
      entityId: null,
      action: "csv_import",
      diff: { fileName, inserted, skipped: duplicates.length + invalid.length, publishImmediately },
    });

    setImporting(false);
    setResult(
      errs.length
        ? `Imported ${inserted}. Errors: ${errs.join("; ")}`
        : `Successfully imported ${inserted} book${inserted === 1 ? "" : "s"}.`
    );
    // Reset
    setRows([]);
    setExisting([]);
    setFileName("");
  }

  return (
    <div>
      <Link href="/admin/books/" className="text-xs text-text-muted hover:text-text-primary">
        ← Back to books
      </Link>
      <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary">
        Import books from CSV
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-text-secondary">
        Bulk-load Amazon affiliate books. Only <code className="text-accent-cyan">asin</code> is required; other columns
        fill the catalog directly. Rows are saved as drafts by default — you review & publish from the books list.
      </p>

      {/* CSV template */}
      <details className="mt-4 rounded-xl border border-border-default bg-bg-card p-4 text-sm">
        <summary className="cursor-pointer font-medium text-text-primary">CSV template & columns</summary>
        <div className="mt-3 space-y-2 text-xs text-text-secondary">
          <p>First row must be a header. All columns are lowercase.</p>
          <pre className="overflow-x-auto rounded-lg bg-bg-secondary p-3 font-mono text-[11px] leading-relaxed text-text-primary">
{`asin,amazon_url,super_category,title,author_name,price_usd,price_inr,rating,review_count,format,pages,cover_url,published_date
B0G3QKKXFD,https://www.amazon.in/dp/B0G3QKKXFD/,Shorts,Whispers in the Rain,Anika Agarwal,1.99,158,5.0,2,Paperback,268,,2025-11-25
0593189647,https://www.amazon.com/dp/0593189647/,Non-fiction,Atomic Habits,James Clear,17.98,,4.8,153421,Hardcover,320,,2018-10-16`}
          </pre>
          <p>
            <strong>Required:</strong> <code>asin</code>. <strong>Recommended:</strong> <code>amazon_url</code>,{" "}
            <code>super_category</code> (one of Fiction, Non-fiction, Children, Shorts), <code>title</code>,{" "}
            <code>author_name</code>, <code>price_usd</code>.
          </p>
        </div>
      </details>

      {/* File upload */}
      <div className="mt-6 rounded-2xl border border-border-default bg-bg-card p-6">
        <label className="block">
          <span className="text-sm font-medium text-text-primary">CSV file</span>
          <input
            type="file"
            accept=".csv,text/csv"
            className="mt-2 block w-full text-sm text-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-accent-blue file:to-accent-purple file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:opacity-90"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </label>
        {fileName && <p className="mt-2 text-xs text-text-muted">Parsed: {fileName}</p>}
      </div>

      {/* Preview */}
      {rows.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-3 rounded-xl border border-border-default bg-bg-card p-4 text-sm">
            <span className="rounded-full bg-accent-blue/15 px-3 py-1 text-xs text-accent-blue">
              ✓ {valid.length} new
            </span>
            <span className="rounded-full bg-accent-purple/15 px-3 py-1 text-xs text-accent-purple">
              ↻ {duplicates.length} duplicates (skipped)
            </span>
            <span className="rounded-full bg-accent-pink/15 px-3 py-1 text-xs text-accent-pink">
              ✕ {invalid.length} invalid
            </span>
          </div>

          {invalid.length > 0 && (
            <details className="rounded-xl border border-accent-pink/30 bg-bg-card p-4 text-sm">
              <summary className="cursor-pointer font-medium text-accent-pink">
                Invalid rows ({invalid.length})
              </summary>
              <ul className="mt-3 space-y-1 text-xs text-text-secondary">
                {invalid.map((r) => (
                  <li key={r.line}>
                    Line {r.line}: {r.issues.join("; ") || "missing ASIN"}
                  </li>
                ))}
              </ul>
            </details>
          )}

          {duplicates.length > 0 && (
            <details className="rounded-xl border border-accent-purple/30 bg-bg-card p-4 text-sm">
              <summary className="cursor-pointer font-medium text-accent-purple">
                Duplicate ASINs already in catalog ({duplicates.length})
              </summary>
              <ul className="mt-3 space-y-1 text-xs text-text-secondary">
                {duplicates.map((r) => (
                  <li key={r.line}>
                    Line {r.line}: {r.asin} — already present
                  </li>
                ))}
              </ul>
            </details>
          )}

          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border-default bg-bg-card p-4">
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={publishImmediately}
                onChange={(e) => setPublishImmediately(e.target.checked)}
              />
              Publish immediately (otherwise saved as draft)
            </label>
            <button
              disabled={importing || valid.length === 0}
              onClick={runImport}
              className="ml-auto rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {importing ? "Importing…" : `Import ${valid.length} book${valid.length === 1 ? "" : "s"}`}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 p-4 text-sm text-text-primary">
          {result}{" "}
          <Link href="/admin/books/" className="ml-2 text-accent-blue hover:underline">
            View books →
          </Link>
        </div>
      )}
    </div>
  );
}
