"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS: { href: string; label: string }[] = [
  { href: "/admin/", label: "Dashboard" },
  { href: "/admin/books/", label: "Books" },
  { href: "/admin/authors/", label: "Authors" },
  { href: "/admin/reviews/", label: "Reviews" },
  { href: "/admin/audit/", label: "Audit Log" },
  { href: "/admin/settings/", label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname() ?? "";
  return (
    <aside className="sticky top-24 h-fit w-full shrink-0 lg:w-56">
      <nav className="flex flex-col gap-1 rounded-2xl border border-border-default bg-bg-card p-3">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Admin CMS
        </p>
        {LINKS.map((l) => {
          const active = pathname === l.href || (l.href !== "/admin/" && pathname.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 text-text-primary"
                  : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
