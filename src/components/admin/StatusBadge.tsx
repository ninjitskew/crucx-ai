type Status = "draft" | "published" | "archived" | "pending" | "approved" | "rejected";

const STYLES: Record<Status, string> = {
  draft: "bg-white/5 text-text-secondary border-border-default",
  published: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30",
  archived: "bg-white/5 text-text-muted border-border-default",
  pending: "bg-accent-purple/10 text-accent-purple border-accent-purple/30",
  approved: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30",
  rejected: "bg-accent-pink/10 text-accent-pink border-accent-pink/30",
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = STYLES[(status as Status)] ?? STYLES.draft;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {status}
    </span>
  );
}
