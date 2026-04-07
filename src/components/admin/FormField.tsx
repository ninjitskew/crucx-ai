import React from "react";

interface Props {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export default function FormField({ label, htmlFor, error, hint, children }: Props) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-accent-pink">{error}</span>}
    </label>
  );
}

export const inputClasses =
  "w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent-blue";
