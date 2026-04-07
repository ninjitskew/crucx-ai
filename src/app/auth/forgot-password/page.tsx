"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import AuthShell from "@/components/auth/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
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
    setStatus("sending");
    const redirectTo =
      typeof window !== "undefined" ? window.location.origin + "/auth/reset-password/" : undefined;
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      setStatus("error");
      setMsg(error.message);
      return;
    }
    setStatus("ok");
    setMsg("Check your email for a password reset link.");
  }

  return (
    <AuthShell
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <>
          Remembered it?{" "}
          <a href="/auth/sign-in/" className="text-accent-blue hover:underline">
            Back to sign in
          </a>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-border-default bg-bg-card px-4 py-3 text-text-primary outline-none focus:border-accent-blue"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple py-3 font-semibold text-white disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Send reset link"}
        </button>
      </form>
      <p className="mt-4 text-xs text-text-muted">
        You can also{" "}
        <a href="/auth/sign-in/" className="text-accent-blue hover:underline">
          sign in with a magic link
        </a>{" "}
        instead.
      </p>
      {status === "ok" && (
        <p className="mt-4 rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-2 text-sm text-accent-cyan">
          {msg}
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 rounded-lg border border-accent-pink/30 bg-accent-pink/10 px-3 py-2 text-sm text-accent-pink">
          {msg}
        </p>
      )}
    </AuthShell>
  );
}
