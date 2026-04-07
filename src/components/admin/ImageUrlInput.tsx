"use client";

import { useState } from "react";
import { inputClasses } from "./FormField";

interface Props {
  value: string;
  onChange: (v: string) => void;
  id?: string;
  placeholder?: string;
}

export default function ImageUrlInput({ value, onChange, id, placeholder }: Props) {
  const [preview, setPreview] = useState(value);
  const [broken, setBroken] = useState(false);

  return (
    <div>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setBroken(false);
        }}
        onBlur={() => setPreview(value)}
        placeholder={placeholder ?? "https://... or /public/path.jpg"}
        className={inputClasses}
      />
      <p className="mt-1 text-xs text-text-muted">
        Paste a Drive URL or a relative <code className="text-accent-cyan">/public</code> path synced from Drive.
      </p>
      {preview && (
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-border-default bg-bg-primary p-3">
          {broken ? (
            <div className="flex h-16 w-12 items-center justify-center rounded bg-white/5 text-xs text-text-muted">
              no preview
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="preview"
              className="h-16 w-12 rounded object-cover"
              onError={() => setBroken(true)}
            />
          )}
          <span className="truncate text-xs text-text-muted">{preview}</span>
        </div>
      )}
    </div>
  );
}
