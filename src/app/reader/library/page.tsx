"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { getSupabase } from "@/lib/supabase";
import books from "@/content/books.json";
import EmptyState from "@/components/marketplace/EmptyState";
import type { Book } from "@/lib/types";

export default function ReaderLibraryPage() {
  const { user, loading } = useUser();
  const [grants, setGrants] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    const sb = getSupabase();
    if (!sb) return;
    sb.from("download_grant").select("book_slug").eq("user_id", user.id).then(({ data }) => {
      setGrants((data ?? []).map((r: any) => r.book_slug));
    });
  }, [user]);

  if (loading) return <main className="min-h-screen bg-bg-primary pt-24" />;
  if (!user) return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-text-primary">Sign in to view your library</h1>
        <a href="/auth/sign-in/" className="mt-4 inline-block text-accent-blue hover:underline">Sign in</a>
      </div>
    </main>
  );

  const owned = (books as Book[]).filter((b) => grants.includes(b.slug));

  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">My Library</h1>
        {owned.length === 0 ? (
          <div className="mt-8"><EmptyState title="No purchases yet" description="Books you buy will show up here." /></div>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {owned.map((b) => (
              <li key={b.slug} className="rounded-2xl border border-border-default bg-bg-card p-4">
                <div className="mb-3 aspect-[3/4] rounded-lg bg-gradient-to-br from-accent-blue/30 via-accent-purple/30 to-accent-pink/30" />
                <h2 className="text-base font-semibold text-text-primary">{b.title}</h2>
                <a href="#" download className="mt-3 inline-block rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple px-4 py-2 text-sm font-semibold text-white">
                  Download eBook
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
