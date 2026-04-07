"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import AuthShell, { GoogleButton, Divider, MethodToggle } from "@/components/auth/AuthShell";
import PasswordField, { isPasswordValid } from "@/components/auth/PasswordField";

export default function SignUpPage() {
  const [method, setMethod] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  const redirect = typeof window !== "undefined" ? window.location.origin + "/reader/library/" : undefined;

  async function google() {
    const sb = getSupabase();
    if (!sb) return setErr("Supabase not configured.");
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirect },
    });
    if (error) setErr(error.message);
  }

  function setErr(m: string) {
    setStatus("error");
    setMsg(m);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return setErr("Supabase not configured.");

    if (method === "magic") {
      setStatus("sending");
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true, emailRedirectTo: redirect },
      });
      if (error) return setErr(error.message);
      setStatus("ok");
      setMsg("Check your email for the magic link.");
      return;
    }

    if (!isPasswordValid(password)) {
      return setErr("Password doesn't meet all requirements.");
    }

    setStatus("sending");
    const { error } = await sb.auth.signUp({ email, password });
    if (error) return setErr(error.message);

    // Try immediate sign-in (works when "Confirm email" is OFF in Supabase)
    const { error: signInErr } = await sb.auth.signInWithPassword({ email, password });
    if (signInErr) {
      setStatus("ok");
      setMsg("Account created. Please check your email to confirm, then sign in.");
      return;
    }
    setStatus("ok");
    window.location.assign("/reader/library/");
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join crucx.ai — publish books or discover your next great read."
      footer={
        <>
          Already have an account?{" "}
          <a href="/auth/sign-in/" className="text-accent-blue hover:underline">
            Sign in
          </a>
        </>
      }
    >
      <GoogleButton onClick={google} disabled={status === "sending"} />
      <Divider label="OR CONTINUE WITH EMAIL" />

      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-text-muted">Verification method</span>
        <MethodToggle value={method} onChange={setMethod} />
      </div>

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
        {method === "password" && (
          <PasswordField
            value={password}
            onChange={setPassword}
            placeholder="Create password"
            showRules
            autoComplete="new-password"
          />
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple py-3 font-semibold text-white disabled:opacity-50"
        >
          {status === "sending"
            ? method === "magic"
              ? "Sending link..."
              : "Creating account..."
            : method === "magic"
              ? "Send magic link"
              : "Create account"}
        </button>
      </form>

      {status === "ok" && msg && (
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
