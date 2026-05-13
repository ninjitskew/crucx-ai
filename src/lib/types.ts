export interface Book {
  slug: string;
  title: string;
  subtitle?: string;
  authorSlug: string;
  authorName?: string;              // free-text, for affiliate books
  category: string;
  superCategory?: string;           // legacy: Fiction | Non-fiction | Children | Shorts
  primaryCategory?: string;         // v2: one of the 10 canonical categories (see lib/categories)
  secondaryCategories?: string[];   // v2: 0-2 additional category memberships
  subCategory?: string;             // v2: chip filter within the primary category page
  tags?: string[];
  cover: string;
  coverUrl?: string;                // explicit Amazon image URL (preferred over `cover`)
  description: string;
  price: number;                    // legacy — USD display fallback
  priceUsd?: number;
  priceInr?: number;
  currencyPrimary?: "USD" | "INR";
  rating?: number;
  reviewCount?: number;
  format?: string;
  pages?: number;
  publishedAt: string;
  toc?: string[];
  status?: "draft" | "published" | "archived";
  buyUrl?: string;                  // legacy — falls through to amazonInUrl
  asin?: string;
  amazonInUrl?: string;
  amazonComUrl?: string;
  bestsellerRank?: number | null;
  source?: "db" | "json";           // provenance for debugging
}

export interface Author {
  slug: string;
  name: string;
  tagline?: string;
  bio?: string;
  avatar?: string;
  books: string[];
  joinedAt?: string;
}

export interface CartItem {
  slug: string;
  title: string;
  price: number;
  cover?: string;
  authorName?: string;
  qty: number;
}
