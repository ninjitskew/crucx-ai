"use client";

import { useEffect, useRef, useState } from "react";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { useCurrency } from "@/lib/hooks/useCurrency";

export default function CurrencyToggle() {
  const { currency, setCurrency, ready } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!ready) {
    return (
      <div className="h-8 w-16 animate-pulse rounded-full bg-white/5" aria-label="Currency" />
    );
  }

  const active = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-accent-blue hover:text-text-primary"
        aria-label={`Currency: ${active.label}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{active.flag}</span>
        <span>{active.code}</span>
        <svg
          className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-lg"
        >
          {CURRENCIES.map((c) => (
            <li
              key={c.code}
              role="option"
              aria-selected={currency === c.code}
              className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-xs transition hover:bg-white/5 ${
                currency === c.code ? "text-accent-blue" : "text-text-secondary"
              }`}
              onClick={() => {
                setCurrency(c.code as CurrencyCode);
                setOpen(false);
              }}
            >
              <span className="text-base">{c.flag}</span>
              <span className="flex-1">{c.label}</span>
              <span className="font-mono text-[10px] text-text-muted">{c.code}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
