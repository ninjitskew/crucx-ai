import Link from "next/link";

interface Props {
  current: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}

export default function Pagination({ current, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-12 flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          className={`rounded-lg px-4 py-2 text-sm ${
            p === current
              ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white"
              : "border border-border-default text-text-secondary hover:text-text-primary"
          }`}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}
