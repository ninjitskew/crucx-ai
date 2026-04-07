"use client";

import { useEffect, useState } from "react";
import BookCarousel from "./BookCarousel";
import { useUser } from "@/lib/hooks/useUser";
import { getSupabase } from "@/lib/supabase";
import booksJson from "@/content/books.json";
import authorsJson from "@/content/authors.json";
import type { Book, Author } from "@/lib/types";

export default function FollowedAuthorsCarousel() {
  const { user } = useUser();
  const [followed, setFollowed] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    const sb = getSupabase();
    if (!sb) return;
    sb.from("follow")
      .select("author_slug")
      .eq("follower_id", user.id)
      .then(({ data }) => setFollowed((data ?? []).map((r: any) => r.author_slug)));
  }, [user]);

  if (!user || !followed.length) return null;
  const recs = (booksJson as Book[]).filter((b) => followed.includes(b.authorSlug));
  if (!recs.length) return null;
  return (
    <BookCarousel
      title="Based on Authors You Follow"
      subtitle="New from authors in your library"
      books={recs}
      authors={authorsJson as Author[]}
    />
  );
}
