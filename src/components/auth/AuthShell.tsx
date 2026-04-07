"use client";

import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <main className="min-h-screen bg-bg-primary pt-20 pb-12">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <Link href="/" className="mb-6 inline-block text-sm text-text-muted hover:text-accent-blue">
          ← Back to crucx.ai
        </Link>
        <div className="rounded-2xl border border-border-default bg-bg-card/60 p-6 sm:p-8 backdrop-blur">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-sm text-text-muted">{footer}</div>}
      </div>
    </main>
  );
}

export function GoogleButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-border-default bg-bg-card py-3 text-sm font-medium text-text-primary transition hover:border-accent-blue disabled:opacity-50"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4 5.5l6.3 5.3C41.9 35.6 44 30.2 44 24c0-1.2-.1-2.3-.4-3.5z" />
      </svg>
      Continue with Google
    </button>
  );
}

export function Divider({ label = "OR" }: { label?: string }) {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-border-default" />
      <span className="text-xs uppercase tracking-wider text-text-muted">{label}</span>
      <div className="h-px flex-1 bg-border-default" />
    </div>
  );
}

export function MethodToggle({
  value,
  onChange,
}: {
  value: "password" | "magic";
  onChange: (v: "password" | "magic") => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-border-default bg-bg-card p-1 text-xs">
      <button
        type="button"
        onClick={() => onChange("password")}
        className={`rounded-md px-3 py-1.5 transition ${
          value === "password" ? "bg-accent-blue/20 text-accent-blue" : "text-text-muted"
        }`}
      >
        Password
      </button>
      <button
        type="button"
        onClick={() => onChange("magic")}
        className={`rounded-md px-3 py-1.5 transition ${
          value === "magic" ? "bg-accent-blue/20 text-accent-blue" : "text-text-muted"
        }`}
      >
        Magic link
      </button>
    </div>
  );
}
