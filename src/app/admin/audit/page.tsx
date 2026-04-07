"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import DataTable, { Column } from "@/components/admin/DataTable";

interface AuditRow extends Record<string, unknown> {
  id: string;
  user_id: string | null;
  entity: string;
  entity_id: string | null;
  action: string;
  diff: unknown;
  created_at: string;
}

export default function AdminAuditPage() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }
    sb.from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500)
      .then(({ data }) => {
        setRows((data ?? []) as AuditRow[]);
        setLoading(false);
      });
  }, []);

  const columns: Column<AuditRow>[] = [
    {
      key: "when",
      header: "When",
      sortValue: (r) => r.created_at,
      render: (r) => <span className="text-xs text-text-muted">{new Date(r.created_at).toLocaleString()}</span>,
    },
    { key: "entity", header: "Entity", sortValue: (r) => r.entity },
    { key: "action", header: "Action", sortValue: (r) => r.action },
    {
      key: "entity_id",
      header: "ID",
      render: (r) => <code className="text-xs text-text-muted">{r.entity_id ?? "—"}</code>,
    },
    {
      key: "user_id",
      header: "By",
      render: (r) => <code className="text-xs text-text-muted">{r.user_id?.slice(0, 8) ?? "—"}</code>,
    },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary">
        Audit log
      </h1>
      <p className="mt-1 text-sm text-text-secondary">Last 500 admin actions.</p>
      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-text-muted">Loading…</p>
        ) : (
          <DataTable rows={rows} columns={columns} searchKeys={["entity", "action"]} searchPlaceholder="Search log…" />
        )}
      </div>
    </div>
  );
}
