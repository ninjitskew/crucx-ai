"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import AuthShell from "@/components/auth/AuthShell";
import PasswordField, { isPasswordValid } from "@/components/auth/PasswordField";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) {
      setStatus("error");
      setMsg("Supabase not configured.");
      return;
    }
    if (!isPasswordValid(password)) {
      setStatus("error");
      setMsg("Password doesn't meet all requirements.");
      return;
    }
    if (password !== confirm) {
      setStatus("error");
      setMsg("Passwords don't match.");
      return;
    }
    setStatus("saving");
    const { error } = await sb.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      setMsg(error.message);
      return;
    }
    setStatus("ok");
    setMsg("Password updated. Redirecting...");
    setTimeout(() => window.location.assign("/reader/library/"), 1200);
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password for your account."
      footer={
        <a href="/auth/sign-in/" className="text-accent-blue hover:underline">
          Back to sign in
        </a>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <PasswordField
          value={password}
          onChange={setPassword}
          placeholder="New password"
          showRules
          autoComplete="new-password"
        />
        <PasswordField
          value={confirm}
          onChange={setConfirm}
          placeholder="Confirm new password"
          autoComplete="new-password"
          name="confirm"
        />
        <button
          type="submit"
          disabled={status === "saving"}
          className="w-full rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple py-3 font-semibold text-white disabled:opacity-50"
        >
          {status === "saving" ? "Updating..." : "Update password"}
        </button>
      </form>
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
