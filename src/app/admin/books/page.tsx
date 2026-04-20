"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useAdmin } from "@/lib/hooks/useAdmin";
import { logAudit } from "@/lib/admin";
import DataTable, { Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { SUPER_CATEGORIES } from "@/lib/amazon";

interface BookRow extends Record<string, unknown> {
  id: string;
  slug: string;
  title: string;
  author_name: string | null;
  author_id: string | null;
  cover_url: string | null;
  asin: string | null;
  super_category: string | null;
  bestseller_rank: number | null;
  price_usd: number | null;
  rating: number | null;
  status: string;
  created_at: string;
}

type StatusFilter = "all" | "draft" | "published" | "archived";

export default function AdminBooksPage() {
  const [rows, setRows] = useState<BookRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const { user } = useAdmin();

  async function load() {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }
    const { data } = await sb.from("book").select("*").order("created_at", { ascending: false });
    setRows((data ?? []) as BookRow[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (categoryFilter !== "all" && r.super_category !== categoryFilter) return false;
      return true;
    });
  }, [rows, statusFilter, categoryFilter]);

  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length && filtered.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((r) => r.id)));
    }
  }

  async function bulkSetStatus(next: "draft" | "published" | "archived") {
    const sb = getSupabase();
    if (!sb || selected.size === 0) return;
    setBusy(true);
    const ids = Array.from(selected);
    const patch: Record<string, unknown> = { status: next };
    if (next === "published") patch.published_at = new Date().toISOString();
    const { error } = await sb.from("book").update(patch).in("id", ids);
    if (!error) {
      await logAudit({
        userId: user?.id ?? null,
        entity: "book",
        entityId: null,
        action: `bulk_${next}`,
        diff: { ids },
      });
      setSelected(new Set());
      await load();
    }
    setBusy(false);
  }

  const columns: Column<BookRow>[] = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          aria-label="Select all"
          checked={selected.size === filtered.length && filtered.length > 0}
          onChange={toggleAll}
        />
      ) as unknown as string,
      render: (r) => (
        <input
          type="checkbox"
          aria-label="Select row"
          checked={selected.has(r.id)}
          onChange={() => toggle(r.id)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      key: "cover",
      header: "Cover",
      render: (r) =>
        r.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.cover_url} alt="" className="h-12 w-9 rounded object-cover" />
        ) : (
          <div className="h-12 w-9 rounded bg-white/5" />
        ),
    },
    {
      key: "title",
      header: "Title",
      sortValue: (r) => r.title.toLowerCase(),
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-text-primary">{r.title}</p>
          <p className="truncate text-xs text-text-muted">
            {r.author_name ?? "—"} {r.asin && <span className="ml-2 font-mono text-[10px]">{r.asin}</span>}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortValue: (r) => r.super_category ?? "",
      render: (r) =>
        r.super_category ? (
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-text-secondary">
            {r.super_category}
          </span>
        ) : (
          <span className="text-xs text-text-muted">—</span>
        ),
    },
    {
      key: "rating",
      header: "Rating",
      sortValue: (r) => r.rating ?? 0,
      render: (r) =>
        r.rating != null ? (
          <span className="text-xs text-text-secondary">★ {r.rating.toFixed(1)}</span>
        ) : (
          <span className="text-xs text-text-muted">—</span>
        ),
    },
    {
      key: "price",
      header: "Price",
      sortValue: (r) => r.price_usd ?? 0,
      render: (r) => (
        <span className="text-xs text-text-secondary">
          {r.price_usd != null ? `$${Number(r.price_usd).toFixed(2)}` : "—"}
        </span>
      ),
    },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} />, sortValue: (r) => r.status },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <Link
          href={`/admin/books/edit/?id=${r.id}`}
          className="text-xs text-accent-blue hover:underline"
        >
          Edit
        </Link>
      ),
    },
  ];

  const publishedCount = rows.filter((r) => r.status === "published").length;
  const draftCount = rows.filter((r) => r.status === "draft").length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary">
            Books
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {rows.length} total · {publishedCount} published · {draftCount} draft
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/books/import/"
            className="rounded-xl border border-border-default px-4 py-2 text-sm font-medium text-text-secondary hover:border-accent-blue hover:text-accent-blue"
          >
            Import CSV
          </Link>
          <Link
            href="/admin/books/new/"
            className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-4 py-2 text-sm font-semibold text-white"
          >
            + New book
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {(["all", "draft", "published", "archived"] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                statusFilter === f
                  ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white"
                  : "border border-border-default text-text-secondary hover:text-text-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              categoryFilter === "all"
                ? "bg-white/10 text-text-primary"
                : "border border-border-default text-text-secondary hover:text-text-primary"
            }`}
          >
            All categories
          </button>
          {SUPER_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                categoryFilter === c
                  ? "bg-white/10 text-text-primary"
                  : "border border-border-default text-text-secondary hover:text-text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-accent-blue/40 bg-accent-blue/10 px-4 py-2 text-sm text-text-primary">
          <span>{selected.size} selected</span>
          <button
            disabled={busy}
            onClick={() => bulkSetStatus("published")}
            className="rounded-lg border border-border-default px-3 py-1 text-xs hover:bg-white/5 disabled:opacity-50"
          >
            Publish
          </button>
          <button
            disabled={busy}
            onClick={() => bulkSetStatus("draft")}
            className="rounded-lg border border-border-default px-3 py-1 text-xs hover:bg-white/5 disabled:opacity-50"
          >
            Unpublish
          </button>
          <button
            disabled={busy}
            onClick={() => bulkSetStatus("archived")}
            className="rounded-lg border border-border-default px-3 py-1 text-xs hover:bg-white/5 disabled:opacity-50"
          >
            Archive
          </button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-text-muted hover:text-text-primary">
            Clear
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : (
        <DataTable
          rows={filtered}
          columns={columns}
          searchKeys={["title", "slug", "asin", "author_name"]}
          searchPlaceholder="Search title, author, or ASIN…"
        />
      )}
    </div>
  );
}
