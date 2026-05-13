"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadAnalytics, type AnalyticsSnapshot, type RangeDays } from "@/lib/admin-analytics";

const RANGES: { days: RangeDays; label: string }[] = [
  { days: 7, label: "Last 7 days" },
  { days: 30, label: "Last 30 days" },
  { days: 90, label: "Last 90 days" },
];

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<RangeDays>(30);
  const [snap, setSnap] = useState<AnalyticsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    loadAnalytics(range)
      .then((s) => {
        if (!mounted) return;
        if (!s) setError("Supabase not configured");
        setSnap(s);
      })
      .catch((e) => setError(String(e)))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [range]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Marketplace traffic, book engagement, and Amazon click-through.
          </p>
        </div>
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setRange(r.days)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                range === r.days
                  ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white"
                  : "border border-border-default text-text-secondary hover:text-text-primary"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-accent-pink/40 bg-accent-pink/10 p-4 text-sm text-accent-pink">
          {error}
        </div>
      )}

      {loading && !snap ? (
        <p className="text-sm text-text-muted">Loading analytics…</p>
      ) : snap ? (
        <Dashboard snap={snap} loading={loading} />
      ) : null}
    </div>
  );
}

function Dashboard({ snap, loading }: { snap: AnalyticsSnapshot; loading: boolean }) {
  const empty = snap.totals.views === 0 && snap.totals.clicks === 0;

  return (
    <div className={`space-y-8 ${loading ? "opacity-60" : ""}`}>
      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Page views" value={snap.totals.views.toLocaleString()} accent="from-accent-blue/30 to-accent-blue/5" />
        <KpiCard label="Unique visitors" value={snap.totals.uniqueVisitors.toLocaleString()} accent="from-accent-purple/30 to-accent-purple/5" />
        <KpiCard label="Amazon clicks" value={snap.totals.clicks.toLocaleString()} accent="from-accent-cyan/30 to-accent-cyan/5" />
        <KpiCard label="CTR" value={`${snap.totals.ctr.toFixed(1)}%`} accent="from-accent-pink/30 to-accent-pink/5" />
      </div>

      {/* Empty state */}
      {empty && (
        <div className="rounded-2xl border border-border-default bg-bg-card p-10 text-center">
          <h2 className="text-lg font-semibold text-text-primary">No traffic yet in this window</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Once readers visit book pages or click &quot;Buy on Amazon&quot;, events show up here automatically.
          </p>
          <p className="mt-3 text-xs text-text-muted">
            Test it: open a book on crucx.ai, then refresh this page.
          </p>
        </div>
      )}

      {/* Daily timeseries */}
      {!empty && <DailyChart daily={snap.daily} />}

      {/* Two-column section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top books */}
        <div className="rounded-2xl border border-border-default bg-bg-card p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Top books by Amazon clicks</h3>
            <Link href="/admin/books/" className="text-xs text-accent-blue hover:underline">
              Manage books →
            </Link>
          </div>
          {snap.topBooks.length === 0 ? (
            <p className="py-6 text-center text-xs text-text-muted">No book activity yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-text-muted">
                  <th className="pb-2">Book</th>
                  <th className="pb-2 text-right">Views</th>
                  <th className="pb-2 text-right">Clicks</th>
                  <th className="pb-2 text-right">CTR</th>
                </tr>
              </thead>
              <tbody>
                {snap.topBooks.map((b) => (
                  <tr key={b.slug} className="border-t border-border-default">
                    <td className="py-2 pr-2">
                      <Link href={`/books/${b.slug}/`} className="text-text-primary hover:text-accent-blue">
                        {b.slug}
                      </Link>
                    </td>
                    <td className="py-2 text-right text-text-secondary">{b.views}</td>
                    <td className="py-2 text-right font-medium text-text-primary">{b.clicks}</td>
                    <td className="py-2 text-right text-text-secondary">{b.ctr.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top referrers + Top countries stacked */}
        <div className="space-y-6">
          <SmallTable
            title="Top referrers"
            rows={snap.topReferrers.map((r) => ({ key: r.ref, value: r.views }))}
          />
          <SmallTable
            title="Top countries"
            rows={snap.topCountries.map((c) => ({ key: c.country, value: c.views }))}
          />
        </div>
      </div>

      {/* Recent activity feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActivityList title="Recent Amazon clicks" items={snap.recentClicks.map((c) => ({
          slug: c.book_slug,
          ts: c.ts,
          meta: c.target_store ?? "amazon",
          country: c.country,
        }))} />
        <ActivityList title="Recent page views" items={snap.recentViews.map((v) => ({
          slug: v.book_slug,
          ts: v.ts,
          meta: v.utm_source ? `utm:${v.utm_source}` : "(organic)",
          country: v.country,
        }))} />
      </div>

      {/* Revenue link card — Amazon owns the truth */}
      <div className="rounded-2xl border border-[#FF9900]/40 bg-gradient-to-br from-[#FF9900]/10 to-transparent p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-text-primary">Revenue & commissions</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Per-user purchase data lives in Amazon&apos;s system. View click + earnings reports in your Associates dashboard.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="https://affiliate-program.amazon.in/home/reports"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[#FF9900]/40 bg-[#FF9900]/10 px-4 py-2 text-sm font-medium text-[#FF9900] hover:bg-[#FF9900]/20"
            >
              Amazon.in reports ↗
            </a>
            <a
              href="https://affiliate-program.amazon.com/home/reports"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[#FF9900]/40 bg-[#FF9900]/10 px-4 py-2 text-sm font-medium text-[#FF9900] hover:bg-[#FF9900]/20"
            >
              Amazon.com reports ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className={`rounded-2xl border border-border-default bg-gradient-to-br ${accent} p-5`}>
      <p className="text-xs uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary">
        {value}
      </p>
    </div>
  );
}

function DailyChart({ daily }: { daily: { day: string; views: number; clicks: number }[] }) {
  const maxViews = useMemo(() => Math.max(1, ...daily.map((d) => d.views)), [daily]);

  return (
    <div className="rounded-2xl border border-border-default bg-bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">Daily activity</h3>
      <div className="flex h-32 items-end gap-1">
        {daily.map((d) => {
          const viewH = (d.views / maxViews) * 100;
          const clickH = d.clicks > 0 ? (d.clicks / maxViews) * 100 : 0;
          return (
            <div
              key={d.day}
              className="group relative flex flex-1 flex-col items-stretch justify-end"
              title={`${d.day}: ${d.views} views · ${d.clicks} clicks`}
            >
              <div
                className="w-full rounded-t bg-accent-blue/30 transition group-hover:bg-accent-blue/60"
                style={{ height: `${viewH}%` }}
              />
              {clickH > 0 && (
                <div
                  className="-mt-px w-full bg-accent-cyan/60 transition group-hover:bg-accent-cyan"
                  style={{ height: `${clickH}%` }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-4 text-[10px] text-text-muted">
        <span className="flex items-center gap-1">
          <span className="h-2 w-3 rounded bg-accent-blue/40" /> Views
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-3 rounded bg-accent-cyan/70" /> Amazon clicks
        </span>
        <span className="ml-auto">
          {daily[0]?.day} → {daily[daily.length - 1]?.day}
        </span>
      </div>
    </div>
  );
}

function SmallTable({ title, rows }: { title: string; rows: { key: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="rounded-2xl border border-border-default bg-bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold text-text-primary">{title}</h3>
      {rows.length === 0 ? (
        <p className="py-2 text-xs text-text-muted">No data.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.key} className="flex items-center gap-2 text-xs">
              <span className="w-32 truncate text-text-secondary">{r.key}</span>
              <div className="relative h-2 flex-1 overflow-hidden rounded bg-bg-secondary">
                <div
                  className="absolute inset-y-0 left-0 rounded bg-gradient-to-r from-accent-blue to-accent-purple"
                  style={{ width: `${(r.value / max) * 100}%` }}
                />
              </div>
              <span className="w-10 text-right tabular-nums text-text-primary">{r.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ActivityList({
  title,
  items,
}: {
  title: string;
  items: { slug: string; ts: string; meta: string; country: string | null }[];
}) {
  return (
    <div className="rounded-2xl border border-border-default bg-bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold text-text-primary">{title}</h3>
      {items.length === 0 ? (
        <p className="py-2 text-xs text-text-muted">No activity yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((i, idx) => (
            <li key={idx} className="flex items-center justify-between gap-3 border-t border-border-default pt-2 text-xs first:border-0 first:pt-0">
              <Link href={`/books/${i.slug}/`} className="truncate text-text-primary hover:text-accent-blue">
                {i.slug}
              </Link>
              <div className="flex shrink-0 items-center gap-2 text-text-muted">
                <span>{i.meta}</span>
                {i.country && <span className="rounded bg-bg-secondary px-1.5 py-0.5">{i.country}</span>}
                <span>{relTime(i.ts)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}
