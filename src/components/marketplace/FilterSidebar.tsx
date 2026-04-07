"use client";

interface Props {
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  minRating: number;
  setMinRating: (r: number) => void;
  format: string;
  setFormat: (f: string) => void;
}

export default function FilterSidebar({
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  format,
  setFormat,
}: Props) {
  return (
    <aside className="rounded-2xl border border-border-default bg-bg-card p-5 text-sm">
      <h3 className="mb-4 text-base font-semibold text-text-primary">Filters</h3>

      <div className="mb-5">
        <label className="mb-2 block text-xs uppercase tracking-wider text-text-muted">
          Price (max ${priceRange[1]})
        </label>
        <input
          type="range"
          min={0}
          max={50}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
          className="w-full accent-accent-blue"
        />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-xs uppercase tracking-wider text-text-muted">Minimum rating</label>
        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-text-primary"
        >
          <option value={0}>Any</option>
          <option value={3}>3+ stars</option>
          <option value={4}>4+ stars</option>
          <option value={4.5}>4.5+ stars</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-text-muted">Format</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-text-primary"
        >
          <option value="any">Any</option>
          <option value="eBook">eBook</option>
        </select>
      </div>
    </aside>
  );
}
