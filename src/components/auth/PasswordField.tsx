"use client";

import { useState } from "react";

type Rule = { key: string; label: string; test: (v: string) => boolean };

export const PASSWORD_RULES: Rule[] = [
  { key: "len", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { key: "upper", label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { key: "lower", label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { key: "num", label: "One number", test: (v) => /[0-9]/.test(v) },
  { key: "special", label: "One special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export function isPasswordValid(v: string): boolean {
  return PASSWORD_RULES.every((r) => r.test(v));
}

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  showRules?: boolean;
  autoComplete?: string;
  name?: string;
};

export default function PasswordField({
  value,
  onChange,
  placeholder = "Password",
  showRules = false,
  autoComplete = "current-password",
  name = "password",
}: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          required
          name={name}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border-default bg-bg-card px-4 py-3 pr-12 text-text-primary outline-none focus:border-accent-blue"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-text-muted hover:text-accent-blue"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {showRules && (
        <ul className="space-y-1 rounded-lg border border-border-default bg-bg-card/50 p-3 text-xs">
          {PASSWORD_RULES.map((r) => {
            const ok = r.test(value);
            return (
              <li
                key={r.key}
                className={`flex items-center gap-2 ${ok ? "text-accent-cyan" : "text-text-muted"}`}
              >
                <span aria-hidden className="inline-block w-4 text-center">
                  {ok ? "✓" : "○"}
                </span>
                {r.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
