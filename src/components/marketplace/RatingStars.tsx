interface Props {
  rating?: number;
  reviewCount?: number;
  size?: "sm" | "md";
}

export default function RatingStars({ rating = 0, reviewCount, size = "sm" }: Props) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return "full";
    if (i === full && half) return "half";
    return "empty";
  });
  const px = size === "sm" ? "text-xs" : "text-sm";
  return (
    <div className={`flex items-center gap-1 ${px} text-text-secondary`}>
      <span className="text-accent-cyan">
        {stars.map((s, i) => (
          <span key={i}>{s === "empty" ? "\u2606" : "\u2605"}</span>
        ))}
      </span>
      <span>{rating.toFixed(1)}</span>
      {typeof reviewCount === "number" && (
        <span className="text-text-muted">({reviewCount})</span>
      )}
    </div>
  );
}
