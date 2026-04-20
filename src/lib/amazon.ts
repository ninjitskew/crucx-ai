// Amazon URL / ASIN helpers and affiliate tag resolution.
// Stored URLs in DB are canonical (no tag); tag is appended at click time.

export const AFFILIATE_TAG_IN = "crucxai-21";
export const AFFILIATE_TAG_US = "crucxai-20";

export type AmazonStore = "amazon.in" | "amazon.com";

const ASIN_RE = /\b([A-Z0-9]{10})\b/;
const DP_RE = /\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i;

/** Extract an ASIN from a raw Amazon URL or return the input itself if it already looks like an ASIN. */
export function extractAsin(input: string): string | null {
  if (!input) return null;
  const s = input.trim();
  const dp = s.match(DP_RE);
  if (dp) return dp[1].toUpperCase();
  const direct = s.match(ASIN_RE);
  if (direct && s.length < 40) return direct[1].toUpperCase();
  return null;
}

/** Detect which Amazon store a URL points to. */
export function detectStore(url: string): AmazonStore | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.endsWith("amazon.in")) return "amazon.in";
    if (u.hostname.endsWith("amazon.com")) return "amazon.com";
    return null;
  } catch {
    return null;
  }
}

/** Build a canonical product URL from ASIN + store (no affiliate tag). */
export function buildCanonicalUrl(asin: string, store: AmazonStore): string {
  return `https://www.${store}/dp/${asin}/`;
}

/** Append the correct affiliate tag for outbound redirects. */
export function withAffiliateTag(url: string): string {
  const store = detectStore(url);
  if (!store) return url;
  const tag = store === "amazon.in" ? AFFILIATE_TAG_IN : AFFILIATE_TAG_US;
  try {
    const u = new URL(url);
    u.searchParams.set("tag", tag);
    return u.toString();
  } catch {
    return url;
  }
}

/** Pick the best Amazon URL for a given visitor country. IN residents → .in, else → .com. */
export function pickStoreUrl(
  book: { amazon_in_url?: string | null; amazon_com_url?: string | null },
  country: string | null | undefined
): { url: string; store: AmazonStore } | null {
  const prefersIN = country === "IN";
  if (prefersIN && book.amazon_in_url) return { url: book.amazon_in_url, store: "amazon.in" };
  if (book.amazon_com_url) return { url: book.amazon_com_url, store: "amazon.com" };
  if (book.amazon_in_url) return { url: book.amazon_in_url, store: "amazon.in" };
  return null;
}

export const SUPER_CATEGORIES = ["Fiction", "Non-fiction", "Children", "Shorts"] as const;
export type SuperCategory = (typeof SUPER_CATEGORIES)[number];

export const AMAZON_FORMATS = ["Paperback", "Hardcover", "Kindle", "Audiobook", "eBook"] as const;
