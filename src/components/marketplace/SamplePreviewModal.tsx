"use client";

import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  sample?: string;
}

const DEFAULT_SAMPLE =
  "Chapter 1\n\nThe first lesson of the loop is that you cannot think your way out of a feedback problem. You can only build a faster feedback loop, observe what it tells you, and adjust. Everything else is theatre.\n\nThis sample chapter is part of the free preview. Buy the book to keep reading.";

export default function SamplePreviewModal({ open, onClose, title, sample }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur" onClick={onClose}>
      <div
        className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border-default bg-bg-card p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-xl font-bold text-text-primary">Sample: {title}</h2>
          <button onClick={onClose} className="text-2xl text-text-muted hover:text-text-primary">×</button>
        </div>
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
          {sample ?? DEFAULT_SAMPLE}
        </div>
      </div>
    </div>
  );
}
