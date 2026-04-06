export default function AuthorEarningsPage() {
  const months = [
    { month: "Jan 2026", amount: "₹98,200" },
    { month: "Feb 2026", amount: "₹1,12,400" },
    { month: "Mar 2026", amount: "₹1,24,500" },
  ];
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <p className="text-xs uppercase tracking-wider text-text-muted">
        Author Portal
      </p>
      <h1 className="mt-2 text-4xl font-bold text-text-primary">Earnings</h1>
      <div className="mt-8 rounded-2xl border border-border-default bg-bg-card p-8">
        <p className="text-sm text-text-muted">Lifetime earnings</p>
        <p className="mt-2 text-5xl font-bold text-accent-primary">₹3,35,100</p>
      </div>
      <div className="mt-8 space-y-3">
        {months.map((m) => (
          <div
            key={m.month}
            className="flex items-center justify-between rounded-xl border border-border-default bg-bg-card px-6 py-4"
          >
            <span className="text-text-secondary">{m.month}</span>
            <span className="font-semibold text-text-primary">{m.amount}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
