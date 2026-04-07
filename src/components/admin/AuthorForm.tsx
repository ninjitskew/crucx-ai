"use client";

import FormField, { inputClasses } from "./FormField";
import ImageUrlInput from "./ImageUrlInput";

export interface AuthorFormValue {
  user_id: string;
  pen_name: string;
  slug: string;
  bio: string;
  avatar_url: string;
  website: string;
}

export const emptyAuthor: AuthorFormValue = {
  user_id: "",
  pen_name: "",
  slug: "",
  bio: "",
  avatar_url: "",
  website: "",
};

interface Props {
  value: AuthorFormValue;
  onChange: (v: AuthorFormValue) => void;
  lockId?: boolean;
}

export default function AuthorForm({ value, onChange, lockId }: Props) {
  function set<K extends keyof AuthorFormValue>(k: K, v: AuthorFormValue[K]) {
    onChange({ ...value, [k]: v });
  }
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <FormField label="User ID (auth.users.id)" hint="Must match an existing app_user row">
        <input
          className={inputClasses}
          value={value.user_id}
          disabled={lockId}
          onChange={(e) => set("user_id", e.target.value)}
        />
      </FormField>
      <FormField label="Slug">
        <input className={inputClasses} value={value.slug} onChange={(e) => set("slug", e.target.value)} />
      </FormField>
      <FormField label="Pen name">
        <input className={inputClasses} value={value.pen_name} onChange={(e) => set("pen_name", e.target.value)} />
      </FormField>
      <FormField label="Website">
        <input className={inputClasses} value={value.website} onChange={(e) => set("website", e.target.value)} />
      </FormField>
      <div className="md:col-span-2">
        <FormField label="Bio">
          <textarea
            rows={5}
            className={inputClasses}
            value={value.bio}
            onChange={(e) => set("bio", e.target.value)}
          />
        </FormField>
      </div>
      <div className="md:col-span-2">
        <FormField label="Avatar URL">
          <ImageUrlInput value={value.avatar_url} onChange={(v) => set("avatar_url", v)} />
        </FormField>
      </div>
    </div>
  );
}
