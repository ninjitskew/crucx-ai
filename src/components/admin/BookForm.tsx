"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import FormField, { inputClasses } from "./FormField";
import ImageUrlInput from "./ImageUrlInput";

export interface BookFormValue {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  author_id: string | null;
  cover_url: string;
  price_cents: number;
  status: "draft" | "published" | "archived";
}

export const emptyBook: BookFormValue = {
  slug: "",
  title: "",
  subtitle: "",
  description: "",
  author_id: null,
  cover_url: "",
  price_cents: 0,
  status: "draft",
};

interface Props {
  value: BookFormValue;
  onChange: (v: BookFormValue) => void;
}

interface AuthorOpt {
  user_id: string;
  pen_name: string;
}

export default function BookForm({ value, onChange }: Props) {
  const [authors, setAuthors] = useState<AuthorOpt[]>([]);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.from("author_profile")
      .select("user_id,pen_name")
      .order("pen_name")
      .then(({ data }) => setAuthors((data ?? []) as AuthorOpt[]));
  }, []);

  function set<K extends keyof BookFormValue>(k: K, v: BookFormValue[K]) {
    onChange({ ...value, [k]: v });
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <FormField label="Slug" hint="Lowercase, hyphenated URL identifier">
        <input
          className={inputClasses}
          value={value.slug}
          onChange={(e) => set("slug", e.target.value)}
        />
      </FormField>
      <FormField label="Title">
        <input className={inputClasses} value={value.title} onChange={(e) => set("title", e.target.value)} />
      </FormField>
      <FormField label="Subtitle">
        <input
          className={inputClasses}
          value={value.subtitle}
          onChange={(e) => set("subtitle", e.target.value)}
        />
      </FormField>
      <FormField label="Author">
        <select
          className={inputClasses}
          value={value.author_id ?? ""}
          onChange={(e) => set("author_id", e.target.value || null)}
        >
          <option value="">— None —</option>
          {authors.map((a) => (
            <option key={a.user_id} value={a.user_id}>
              {a.pen_name}
            </option>
          ))}
        </select>
      </FormField>
      <div className="md:col-span-2">
        <FormField label="Description">
          <textarea
            rows={5}
            className={inputClasses}
            value={value.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </FormField>
      </div>
      <div className="md:col-span-2">
        <FormField label="Cover image URL">
          <ImageUrlInput value={value.cover_url} onChange={(v) => set("cover_url", v)} />
        </FormField>
      </div>
      <FormField label="Price (USD cents)" hint="Stored in existing price_inr column for compatibility">
        <input
          type="number"
          min={0}
          className={inputClasses}
          value={value.price_cents}
          onChange={(e) => set("price_cents", Number(e.target.value) || 0)}
        />
      </FormField>
      <FormField label="Status">
        <select
          className={inputClasses}
          value={value.status}
          onChange={(e) => set("status", e.target.value as BookFormValue["status"])}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </FormField>
    </div>
  );
}
