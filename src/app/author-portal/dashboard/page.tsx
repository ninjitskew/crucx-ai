const STATS = [
  { label: "Total readers", value: "12,438", trend: "+24%" },
  { label: "Books published", value: "8", trend: "+2" },
  { label: "Monthly earnings", value: "₹1,24,500", trend: "+18%" },
  { label: "Avg rating", value: "4.8", trend: "+0.3" },
];

export default function AuthorDashboard() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-xs uppercase tracking-wider text-text-muted">
        Author Portal
      </p>
      <h1 className="mt-2 text-4xl font-bold text-text-primary">Dashboard</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border-default bg-bg-card p-6"
          >
            <div className="mb-2 text-xs text-text-muted">{s.label}</div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <span className="text-2xl font-bold text-text-primary">
                {s.value}
              </span>
              <span className="text-xs text-green-400">{s.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
