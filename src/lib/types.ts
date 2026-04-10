export interface Book {
  slug: string;
  title: string;
  subtitle?: string;
  authorSlug: string;
  category: string;
  tags?: string[];
  cover: string;
  description: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  format?: string;
  pages?: number;
  publishedAt: string;
  toc?: string[];
  status?: "draft" | "published" | "archived";
  buyUrl?: string;
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
