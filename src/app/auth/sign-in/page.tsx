"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) {
      setStatus("error");
      setMsg("Supabase not configured.");
      return;
    }
    setStatus("sending");
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin + "/reader/library/" : undefined },
    });
    if (error) {
      setStatus("error");
      setMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-bold text-text-primary">Sign in</h1>
        <p className="mt-2 text-text-secondary">We'll email you a magic link.</p>
        <form onSubmit={send} className="mt-8 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-border-default bg-bg-card px-4 py-3 text-text-primary outline-none focus:border-accent-blue"
          />
          <button type="submit" disabled={status === "sending"} className="w-full rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple py-3 font-semibold text-white disabled:opacity-50">
            {status === "sending" ? "Sending..." : "Send magic link"}
          </button>
        </form>
        {status === "sent" && <p className="mt-4 text-sm text-accent-cyan">Check your email for the link.</p>}
        {status === "error" && <p className="mt-4 text-sm text-accent-pink">{msg}</p>}
        <p className="mt-6 text-sm text-text-muted">
          New here? <a href="/auth/sign-up/" className="text-accent-blue hover:underline">Create an account</a>
        </p>
      </div>
    </main>
  );
}
