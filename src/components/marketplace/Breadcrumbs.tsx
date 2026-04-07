import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="text-xs text-text-muted">
      {items.map((c, i) => (
        <span key={i}>
          {c.href ? (
            <Link href={c.href} className="hover:text-text-primary">
              {c.label}
            </Link>
          ) : (
            <span className="text-text-secondary">{c.label}</span>
          )}
          {i < items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  );
}
