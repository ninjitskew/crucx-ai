"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) {
      setStatus("error");
      setMsg("Supabase not configured.");
      return;
    }
    if (password.length < 6) {
      setStatus("error");
      setMsg("Password must be at least 6 characters.");
      return;
    }
    setStatus("sending");
    const { error } = await sb.auth.signUp({ email, password });
    if (error) {
      setStatus("error");
      setMsg(error.message);
      return;
    }
    // Try immediate sign-in (works when "Confirm email" is OFF)
    const { error: signInErr } = await sb.auth.signInWithPassword({ email, password });
    if (signInErr) {
      setStatus("ok");
      setMsg("Account created. Please sign in.");
      return;
    }
    setStatus("ok");
    window.location.assign("/reader/library/");
  }

  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-bold text-text-primary">Create your account</h1>
        <p className="mt-2 text-text-secondary">Email and password.</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-border-default bg-bg-card px-4 py-3 text-text-primary outline-none focus:border-accent-blue"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            className="w-full rounded-xl border border-border-default bg-bg-card px-4 py-3 text-text-primary outline-none focus:border-accent-blue"
          />
          <button type="submit" disabled={status === "sending"} className="w-full rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple py-3 font-semibold text-white disabled:opacity-50">
            {status === "sending" ? "Creating..." : "Create account"}
          </button>
        </form>
        {status === "ok" && msg && <p className="mt-4 text-sm text-accent-cyan">{msg}</p>}
        {status === "error" && <p className="mt-4 text-sm text-accent-pink">{msg}</p>}
        <p className="mt-6 text-sm text-text-muted">
          Already have an account? <a href="/auth/sign-in/" className="text-accent-blue hover:underline">Sign in</a>
        </p>
      </div>
    </main>
  );
}
