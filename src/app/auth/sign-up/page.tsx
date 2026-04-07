"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
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
      options: { shouldCreateUser: true, emailRedirectTo: typeof window !== "undefined" ? window.location.origin + "/reader/library/" : undefined },
    });
    if (error) { setStatus("error"); setMsg(error.message); } else { setStatus("sent"); }
  }

  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-bold text-text-primary">Create your reader account</h1>
        <p className="mt-2 text-text-secondary">Magic-link sign up. No passwords.</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
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
        {status === "sent" && <p className="mt-4 text-sm text-accent-cyan">Check your inbox.</p>}
        {status === "error" && <p className="mt-4 text-sm text-accent-pink">{msg}</p>}
      </div>
    </main>
  );
}
