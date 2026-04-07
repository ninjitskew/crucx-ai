"use client";

import { useState } from "react";
import SamplePreviewModal from "./SamplePreviewModal";

export default function SamplePreviewLauncher({ title, sample }: { title: string; sample?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl border border-border-default px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent-blue"
      >
        Read Sample
      </button>
      <SamplePreviewModal open={open} onClose={() => setOpen(false)} title={title} sample={sample} />
    </>
  );
}
