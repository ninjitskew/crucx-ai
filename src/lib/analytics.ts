// Analytics event writer. Writes to:
//   1. Supabase event tables (book_view_event, book_outbound_click_event) — for admin dashboard
//   2. PostHog (if configured) — for funnels, retention, full product analytics
//
// Both sinks are best-effort and never block the UI. Respects Do-Not-Track.

import { getSupabase } from "@/lib/supabase";
import type { AmazonStore } from "@/lib/amazon";

const SESSION_KEY = "crucx.session_id";
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

function dnt(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { doNotTrack?: string; msDoNotTrack?: string };
  return nav.doNotTrack === "1" || nav.msDoNotTrack === "1";
}

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let s = window.sessionStorage.getItem(SESSION_KEY);
  if (!s) {
    s = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(SESSION_KEY, s);
  }
  return s;
}

function getUtm(): { utm_source: string | null; utm_medium: string | null; utm_campaign: string | null } {
  if (typeof window === "undefined") return { utm_source: null, utm_medium: null, utm_campaign: null };
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source"),
    utm_medium: p.get("utm_medium"),
    utm_campaign: p.get("utm_campaign"),
  };
}

function getReferrer(): string | null {
  if (typeof document === "undefined") return null;
  return document.referrer || null;
}

function getUserAgent(): string | null {
  if (typeof navigator === "undefined") return null;
  return navigator.userAgent ?? null;
}

async function getUserId(): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data } = await sb.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

// -------------------- PostHog (lightweight, no official SDK needed) --------------------

let posthogDistinctId: string | null = null;
function getPosthogDistinctId(): string {
  if (posthogDistinctId) return posthogDistinctId;
  if (typeof window === "undefined") return "server";
  const KEY = "crucx.posthog_id";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(KEY, id);
  }
  posthogDistinctId = id;
  return id;
}

async function sendPosthog(event: string, properties: Record<string, unknown>) {
  if (!POSTHOG_KEY || dnt()) return;
  const payload = {
    api_key: POSTHOG_KEY,
    event,
    distinct_id: getPosthogDistinctId(),
    properties: {
      ...properties,
      $current_url: typeof window !== "undefined" ? window.location.href : undefined,
      $referrer: getReferrer(),
    },
    timestamp: new Date().toISOString(),
  };
  try {
    // Use sendBeacon when available so the call survives page unload (redirects).
    const body = JSON.stringify(payload);
    const url = `${POSTHOG_HOST}/i/v0/e/`;
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      return;
    }
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // ignore
  }
}

// -------------------- Public API --------------------

export async function trackBookView(params: { slug: string; country?: string | null }) {
  if (dnt()) return;
  const utm = getUtm();
  const userId = await getUserId();
  const sessionId = getSessionId();

  sendPosthog("book_viewed", {
    book_slug: params.slug,
    country: params.country ?? null,
    ...utm,
  });

  const sb = getSupabase();
  if (!sb) return;
  try {
    await sb.from("book_view_event").insert({
      book_slug: params.slug,
      user_id: userId,
      session_id: sessionId,
      referrer: getReferrer(),
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      country: params.country ?? null,
      user_agent: getUserAgent(),
    });
  } catch {
    // ignore
  }
}

export async function trackOutboundClick(params: {
  slug: string;
  store: AmazonStore;
  country?: string | null;
}) {
  if (dnt()) return;
  const userId = await getUserId();
  const sessionId = getSessionId();

  sendPosthog("amazon_click", {
    book_slug: params.slug,
    target_store: params.store,
    country: params.country ?? null,
  });

  const sb = getSupabase();
  if (!sb) return;
  try {
    await sb.from("book_outbound_click_event").insert({
      book_slug: params.slug,
      user_id: userId,
      session_id: sessionId,
      target_store: params.store,
      referrer: getReferrer(),
      country: params.country ?? null,
      user_agent: getUserAgent(),
    });
  } catch {
    // ignore
  }
}
