// Currency formatting + conversion helpers.
// Rates are loaded lazily from public.fx_rate (readable by anon).

export type CurrencyCode = "USD" | "INR" | "EUR" | "GBP";

export const CURRENCIES: { code: CurrencyCode; symbol: string; label: string; flag: string }[] = [
  { code: "USD", symbol: "$", label: "US Dollar", flag: "🇺🇸" },
  { code: "INR", symbol: "₹", label: "Indian Rupee", flag: "🇮🇳" },
  { code: "EUR", symbol: "€", label: "Euro", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", label: "British Pound", flag: "🇬🇧" },
];

export const CURRENCY_KEY = "crucx.currency";

export function getStoredCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "USD";
  const v = window.localStorage.getItem(CURRENCY_KEY);
  if (v === "USD" || v === "INR" || v === "EUR" || v === "GBP") return v;
  return "USD";
}

export function setStoredCurrency(c: CurrencyCode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CURRENCY_KEY, c);
  window.dispatchEvent(new CustomEvent("crucx:currency", { detail: c }));
}

const symbols: Record<CurrencyCode, string> = { USD: "$", INR: "₹", EUR: "€", GBP: "£" };

/** Format a value in the target currency. Converts via fxRates map (keys like "USD_INR"). */
export function formatPrice(
  priceUsd: number | null | undefined,
  priceInr: number | null | undefined,
  target: CurrencyCode,
  fxRates: Record<string, number>
): string {
  // Choose the best source currency (prefer USD for non-INR targets, INR for INR target)
  let valueUsd = priceUsd ?? null;
  if (valueUsd == null && priceInr != null) {
    const inrToUsd = fxRates["INR_USD"] ?? 1 / (fxRates["USD_INR"] ?? 83.5);
    valueUsd = priceInr * inrToUsd;
  }
  if (valueUsd == null) return "—";
  if (target === "USD") return `${symbols.USD}${valueUsd.toFixed(2)}`;
  const rate = fxRates[`USD_${target}`];
  if (!rate) return `${symbols.USD}${valueUsd.toFixed(2)}`;
  const converted = valueUsd * rate;
  if (target === "INR") return `${symbols.INR}${Math.round(converted).toLocaleString("en-IN")}`;
  return `${symbols[target]}${converted.toFixed(2)}`;
}

/** Load FX rate map from Supabase. Keys: "USD_INR", "USD_EUR", etc. */
export async function loadFxRates(): Promise<Record<string, number>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return {};
  try {
    const res = await fetch(`${url}/rest/v1/fx_rate?select=base,quote,rate`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!res.ok) return {};
    const rows = (await res.json()) as { base: string; quote: string; rate: number | string }[];
    const map: Record<string, number> = {};
    for (const r of rows) map[`${r.base}_${r.quote}`] = Number(r.rate);
    return map;
  } catch {
    return {};
  }
}
