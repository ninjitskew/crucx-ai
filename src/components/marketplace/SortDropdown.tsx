"use client";

export type SortKey = "popular" | "newest" | "price-asc" | "price-desc" | "rating";

interface Props {
  value: SortKey;
  onChange: (v: SortKey) => void;
}

export default function SortDropdown({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortKey)}
      className="rounded-lg border border-border-default bg-bg-card px-3 py-2 text-sm text-text-primary"
    >
      <option value="popular">Most popular</option>
      <option value="newest">Newest</option>
      <option value="price-asc">Price: low to high</option>
      <option value="price-desc">Price: high to low</option>
      <option value="rating">Highest rated</option>
    </select>
  );
}
