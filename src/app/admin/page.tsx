"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

interface Counts {
  books: number;
  authors: number;
  pendingReviews: number;
  ordersToday: number;
  revenueCents: number;
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Counts>({
    books: 0,
    authors: 0,
    pendingReviews: 0,
    ordersToday: 0,
    revenueCents: 0,
  });
  const [recentBooks, setRecentBooks] = useState<Array<Record<string, unknown>>>([]);
  const [recentAuthors, setRecentAuthors] = useState<Array<Record<string, unknown>>>([]);
  const [recentReviews, setRecentReviews] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    (async () => {
      const [booksC, authorsC, pendingC, books, authors, reviews] = await Promise.all([
        sb.from("book").select("*", { count: "exact", head: true }),
        sb.from("author_profile").select("*", { count: "exact", head: true }),
        sb.from("review").select("*", { count: "exact", head: true }).eq("moderation_status", "pending"),
        sb.from("book").select("id,title,status,created_at").order("created_at", { ascending: false }).limit(5),
        sb.from("author_profile").select("user_id,pen_name,slug,created_at").order("created_at", { ascending: false }).limit(5),
        sb.from("review").select("id,book_id,rating,moderation_status,created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      setCounts({
        books: booksC.count ?? 0,
        authors: authorsC.count ?? 0,
        pendingReviews: pendingC.count ?? 0,
        ordersToday: 0,
        revenueCents: 0,
      });
      setRecentBooks(books.data ?? []);
      setRecentAuthors(authors.data ?? []);
      setRecentReviews(reviews.data ?? []);
    })();
  }, []);

  const stats = [
    { label: "Books", value: counts.books, href: "/admin/books/" },
    { label: "Authors", value: counts.authors, href: "/admin/authors/" },
    { label: "Pending reviews", value: counts.pendingReviews, href: "/admin/reviews/" },
    { label: "Orders today", value: counts.ordersToday, href: "#" },
    { label: "Revenue (mock)", value: `$${(counts.revenueCents / 100).toFixed(2)}`, href: "#" },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-text-primary">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-text-secondary">Overview of your catalog and moderation queue.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-border-default bg-bg-card p-4 transition-colors hover:border-accent-purple/40"
          >
            <p className="text-xs uppercase tracking-wider text-text-muted">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-text-primary">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Section title="Recent books" href="/admin/books/">
          {recentBooks.length === 0 ? (
            <Empty />
          ) : (
            recentBooks.map((b) => (
              <Row key={String(b.id)} primary={String(b.title)} secondary={String(b.status)} />
            ))
          )}
        </Section>
        <Section title="Recent authors" href="/admin/authors/">
          {recentAuthors.length === 0 ? (
            <Empty />
          ) : (
            recentAuthors.map((a) => (
              <Row key={String(a.user_id)} primary={String(a.pen_name)} secondary={String(a.slug)} />
            ))
          )}
        </Section>
        <Section title="Recent reviews" href="/admin/reviews/">
          {recentReviews.length === 0 ? (
            <Empty />
          ) : (
            recentReviews.map((r) => (
              <Row key={String(r.id)} primary={`${r.rating}★`} secondary={String(r.moderation_status)} />
            ))
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border-default bg-bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
        <Link href={href} className="text-xs text-accent-blue hover:underline">
          View all
        </Link>
      </div>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function Row({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-border-default/60 bg-bg-primary px-3 py-2 text-sm">
      <span className="truncate text-text-primary">{primary}</span>
      <span className="ml-2 shrink-0 text-xs text-text-muted">{secondary}</span>
    </li>
  );
}

function Empty() {
  return <li className="text-xs text-text-muted">Nothing yet.</li>;
}
