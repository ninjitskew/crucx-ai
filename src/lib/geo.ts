// Lightweight visitor-country detection via Cloudflare's public trace endpoint.
// No API keys, no rate limits (within reason). Cached in sessionStorage.

const CACHE_KEY = "crucx.country";

export async function getVisitorCountry(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const cached = window.sessionStorage.getItem(CACHE_KEY);
  if (cached) return cached;
  try {
    const res = await fetch("https://www.cloudflare.com/cdn-cgi/trace", { cache: "no-store" });
    if (!res.ok) return null;
    const text = await res.text();
    const m = text.match(/loc=([A-Z]{2})/);
    const country = m?.[1] ?? null;
    if (country) window.sessionStorage.setItem(CACHE_KEY, country);
    return country;
  } catch {
    return null;
  }
}

/** Pick a default display currency from the visitor country. */
export function defaultCurrencyForCountry(country: string | null | undefined): "USD" | "INR" | "EUR" | "GBP" {
  if (country === "IN") return "INR";
  if (country === "GB") return "GBP";
  const euCountries = new Set([
    "DE","FR","ES","IT","NL","BE","AT","IE","PT","FI","GR","SK","SI","LT","LV","EE","CY","MT","LU",
  ]);
  if (country && euCountries.has(country)) return "EUR";
  return "USD";
}
