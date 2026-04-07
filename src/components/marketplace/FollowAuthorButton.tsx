"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { getSupabase } from "@/lib/supabase";

export default function FollowAuthorButton({ authorSlug }: { authorSlug: string }) {
  const { user } = useUser();
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    const sb = getSupabase();
    if (!sb) return;
    sb.from("follow")
      .select("author_slug")
      .eq("follower_id", user.id)
      .eq("author_slug", authorSlug)
      .maybeSingle()
      .then(({ data }) => setFollowing(!!data));
  }, [user, authorSlug]);

  async function toggle() {
    if (!user) {
      window.location.href = "/auth/sign-in/";
      return;
    }
    const sb = getSupabase();
    if (!sb) return;
    setBusy(true);
    if (following) {
      await sb.from("follow").delete().eq("follower_id", user.id).eq("author_slug", authorSlug);
      setFollowing(false);
    } else {
      await sb.from("follow").insert({ follower_id: user.id, author_slug: authorSlug });
      setFollowing(true);
    }
    setBusy(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
        following
          ? "border border-border-default text-text-secondary hover:border-accent-pink hover:text-accent-pink"
          : "bg-gradient-to-r from-accent-blue to-accent-purple text-white"
      }`}
    >
      {following ? "Following" : "Follow Author"}
    </button>
  );
}
