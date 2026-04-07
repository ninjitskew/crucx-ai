"use client";

import { useMemo, useState, type ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
}

interface Props<T> {
  rows: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  empty?: ReactNode;
  initialSort?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  rows,
  columns,
  searchKeys,
  searchPlaceholder = "Search...",
  empty,
  initialSort,
}: Props<T>) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(initialSort ?? null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let r = rows;
    if (term && searchKeys?.length) {
      r = r.filter((row) =>
        searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(term))
      );
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col?.sortValue) {
        r = [...r].sort((a, b) => {
          const av = col.sortValue!(a);
          const bv = col.sortValue!(b);
          if (av < bv) return sortDir === "asc" ? -1 : 1;
          if (av > bv) return sortDir === "asc" ? 1 : -1;
          return 0;
        });
      }
    }
    return r;
  }, [rows, q, searchKeys, sortKey, sortDir, columns]);

  return (
    <div>
      {searchKeys && searchKeys.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full max-w-sm rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-blue"
          />
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-border-default bg-bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-default bg-white/[0.02] text-xs uppercase tracking-wider text-text-muted">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`px-4 py-3 font-semibold ${c.sortValue ? "cursor-pointer select-none" : ""} ${c.className ?? ""}`}
                  onClick={() => {
                    if (!c.sortValue) return;
                    if (sortKey === c.key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                    else {
                      setSortKey(c.key);
                      setSortDir("asc");
                    }
                  }}
                >
                  {c.header}
                  {sortKey === c.key && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-text-muted">
                  {empty ?? "No results"}
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr key={i} className="border-t border-border-default/60 hover:bg-white/[0.02]">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-3 align-middle text-text-secondary ${c.className ?? ""}`}>
                      {c.render ? c.render(row) : String(row[c.key as keyof T] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
