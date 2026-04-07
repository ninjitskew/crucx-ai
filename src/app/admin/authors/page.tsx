"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import DataTable, { Column } from "@/components/admin/DataTable";

interface AuthorRow extends Record<string, unknown> {
  user_id: string;
  pen_name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

export default function AdminAuthorsPage() {
  const [rows, setRows] = useState<AuthorRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }
    sb.from("author_profile")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows((data ?? []) as AuthorRow[]);
        setLoading(false);
      });
  }, []);

  const columns: Column<AuthorRow>[] = [
    {
      key: "avatar",
      header: "",
      render: (r) =>
        r.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-white/5" />
        ),
    },
    {
      key: "pen_name",
      header: "Name",
      sortValue: (r) => r.pen_name.toLowerCase(),
      render: (r) => (
        <div>
          <p className="font-medium text-text-primary">{r.pen_name}</p>
          <p className="text-xs text-text-muted">{r.slug}</p>
        </div>
      ),
    },
    {
      key: "created",
      header: "Joined",
      sortValue: (r) => r.created_at,
      render: (r) => <span className="text-xs text-text-muted">{new Date(r.created_at).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <Link
          href={`/admin/authors/edit/?id=${r.user_id}`}
          className="text-xs text-accent-blue hover:underline"
        >
          Edit
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary">
            Authors
          </h1>
          <p className="mt-1 text-sm text-text-secondary">{rows.length} profiles.</p>
        </div>
        <Link
          href="/admin/authors/new/"
          className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-4 py-2 text-sm font-semibold text-white"
        >
          + New author
        </Link>
      </div>
      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : (
        <DataTable rows={rows} columns={columns} searchKeys={["pen_name", "slug"]} searchPlaceholder="Search authors…" />
      )}
    </div>
  );
}
