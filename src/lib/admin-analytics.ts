// Admin analytics helpers — query Supabase event tables and aggregate.
// At current scale (<10k events) client-side aggregation is fine.
// If we grow past that, move heavy queries into SQL RPC functions.

import { getSupabase } from "@/lib/supabase";

export type RangeDays = 7 | 30 | 90;

export interface ViewRow {
  book_slug: string;
  user_id: string | null;
  session_id: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  country: string | null;
  ts: string;
}

export interface ClickRow {
  book_slug: string;
  user_id: string | null;
  session_id: string | null;
  target_store: string | null;
  referrer: string | null;
  country: string | null;
  ts: string;
}

export interface AnalyticsSnapshot {
  range: RangeDays;
  views: ViewRow[];
  clicks: ClickRow[];
  totals: {
    views: number;
    uniqueVisitors: number;
    clicks: number;
    ctr: number; // percentage
  };
  topBooks: { slug: string; views: number; clicks: number; ctr: number }[];
  topReferrers: { ref: string; views: number }[];
  topCountries: { country: string; views: number }[];
  daily: { day: string; views: number; clicks: number }[];
  topUtm: { utm_source: string; views: number }[];
  recentClicks: ClickRow[];
  recentViews: ViewRow[];
}

/** Truncate a Date to ISO day string. */
function dayKey(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

function normReferrer(ref: string | null): string {
  if (!ref) return "(direct)";
  try {
    const u = new URL(ref);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return ref.slice(0, 60);
  }
}

/** Fetch + aggregate views + clicks for the requested window. */
export async function loadAnalytics(range: RangeDays = 30): Promise<AnalyticsSnapshot | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const since = new Date(Date.now() - range * 24 * 60 * 60 * 1000).toISOString();

  const [viewsRes, clicksRes] = await Promise.all([
    sb
      .from("book_view_event")
      .select("book_slug,user_id,session_id,referrer,utm_source,utm_medium,utm_campaign,country,ts")
      .gte("ts", since)
      .order("ts", { ascending: false })
      .limit(5000),
    sb
      .from("book_outbound_click_event")
      .select("book_slug,user_id,session_id,target_store,referrer,country,ts")
      .gte("ts", since)
      .order("ts", { ascending: false })
      .limit(5000),
  ]);

  const views = (viewsRes.data ?? []) as ViewRow[];
  const clicks = (clicksRes.data ?? []) as ClickRow[];

  // Totals
  const sessions = new Set<string>();
  for (const v of views) if (v.session_id) sessions.add(v.session_id);
  const totalViews = views.length;
  const totalClicks = clicks.length;
  const ctr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

  // Per-book aggregates
  const bookViews = new Map<string, number>();
  const bookClicks = new Map<string, number>();
  for (const v of views) bookViews.set(v.book_slug, (bookViews.get(v.book_slug) ?? 0) + 1);
  for (const c of clicks) bookClicks.set(c.book_slug, (bookClicks.get(c.book_slug) ?? 0) + 1);
  const allSlugs = new Set([...bookViews.keys(), ...bookClicks.keys()]);
  const topBooks = Array.from(allSlugs)
    .map((slug) => {
      const v = bookViews.get(slug) ?? 0;
      const c = bookClicks.get(slug) ?? 0;
      return { slug, views: v, clicks: c, ctr: v > 0 ? (c / v) * 100 : 0 };
    })
    .sort((a, b) => b.clicks - a.clicks || b.views - a.views)
    .slice(0, 15);

  // Top referrers
  const refMap = new Map<string, number>();
  for (const v of views) {
    const r = normReferrer(v.referrer);
    refMap.set(r, (refMap.get(r) ?? 0) + 1);
  }
  const topReferrers = Array.from(refMap.entries())
    .map(([ref, count]) => ({ ref, views: count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Top countries
  const countryMap = new Map<string, number>();
  for (const v of views) {
    const c = v.country ?? "(unknown)";
    countryMap.set(c, (countryMap.get(c) ?? 0) + 1);
  }
  const topCountries = Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, views: count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Top UTM sources
  const utmMap = new Map<string, number>();
  for (const v of views) {
    if (v.utm_source) utmMap.set(v.utm_source, (utmMap.get(v.utm_source) ?? 0) + 1);
  }
  const topUtm = Array.from(utmMap.entries())
    .map(([utm_source, count]) => ({ utm_source, views: count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Daily timeseries
  const days: string[] = [];
  for (let i = range - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    days.push(d.toISOString().slice(0, 10));
  }
  const viewByDay = new Map<string, number>();
  const clickByDay = new Map<string, number>();
  for (const v of views) {
    const k = dayKey(v.ts);
    viewByDay.set(k, (viewByDay.get(k) ?? 0) + 1);
  }
  for (const c of clicks) {
    const k = dayKey(c.ts);
    clickByDay.set(k, (clickByDay.get(k) ?? 0) + 1);
  }
  const daily = days.map((day) => ({
    day,
    views: viewByDay.get(day) ?? 0,
    clicks: clickByDay.get(day) ?? 0,
  }));

  return {
    range,
    views,
    clicks,
    totals: {
      views: totalViews,
      uniqueVisitors: sessions.size,
      clicks: totalClicks,
      ctr,
    },
    topBooks,
    topReferrers,
    topCountries,
    daily,
    topUtm,
    recentClicks: clicks.slice(0, 15),
    recentViews: views.slice(0, 15),
  };
}
