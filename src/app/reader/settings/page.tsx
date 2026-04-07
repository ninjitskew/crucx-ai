"use client";

import { useUser } from "@/lib/hooks/useUser";
import { getSupabase } from "@/lib/supabase";

export default function ReaderSettingsPage() {
  const { user, loading } = useUser();

  async function signOut() {
    const sb = getSupabase();
    if (!sb) return;
    await sb.auth.signOut();
    window.location.href = "/";
  }

  if (loading) return <main className="min-h-screen bg-bg-primary pt-24" />;
  if (!user) return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-text-primary">Sign in to manage your account</h1>
        <a href="/auth/sign-in/" className="mt-4 inline-block text-accent-blue hover:underline">Sign in</a>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <div className="mt-8 rounded-2xl border border-border-default bg-bg-card p-6">
          <p className="text-sm text-text-muted">Email</p>
          <p className="text-text-primary">{user.email}</p>
        </div>
        <button onClick={signOut} className="mt-6 rounded-xl border border-border-default px-5 py-3 text-sm font-semibold text-text-primary hover:border-accent-pink hover:text-accent-pink">
          Sign out
        </button>
      </div>
    </main>
  );
}
