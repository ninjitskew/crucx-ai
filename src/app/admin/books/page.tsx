"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import DataTable, { Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";

interface BookRow extends Record<string, unknown> {
  id: string;
  slug: string;
  title: string;
  author_id: string | null;
  cover_url: string | null;
  price_inr: number;
  status: string;
  created_at: string;
}

export default function AdminBooksPage() {
  const [rows, setRows] = useState<BookRow[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await sb.from("book").select("*").order("created_at", { ascending: false });
      setRows((data ?? []) as BookRow[]);
      setLoading(false);
    })();
  }, []);

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  const columns: Column<BookRow>[] = [
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
        <div>
          <p className="font-medium text-text-primary">{r.title}</p>
          <p className="text-xs text-text-muted">{r.slug}</p>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} />, sortValue: (r) => r.status },
    {
      key: "price",
      header: "Price",
      sortValue: (r) => r.price_inr,
      render: (r) => <span>${(r.price_inr / 100).toFixed(2)}</span>,
    },
    {
      key: "updated",
      header: "Created",
      sortValue: (r) => r.created_at,
      render: (r) => <span className="text-xs text-text-muted">{new Date(r.created_at).toLocaleDateString()}</span>,
    },
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

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary">Books</h1>
          <p className="mt-1 text-sm text-text-secondary">{rows.length} total in catalog.</p>
        </div>
        <Link
          href="/admin/books/new/"
          className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-4 py-2 text-sm font-semibold text-white"
        >
          + New book
        </Link>
      </div>

      <div className="mb-4 flex gap-2">
        {["all", "draft", "published", "archived"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
              filter === f
                ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white"
                : "border border-border-default text-text-secondary hover:text-text-primary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : (
        <DataTable
          rows={filtered}
          columns={columns}
          searchKeys={["title", "slug"]}
          searchPlaceholder="Search books…"
          initialSort="updated"
        />
      )}
    </div>
  );
}
