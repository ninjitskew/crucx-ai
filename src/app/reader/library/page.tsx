import Link from "next/link";

export default function ReaderLibraryPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <p className="text-xs uppercase tracking-wider text-text-muted">
        Reader Portal
      </p>
      <h1 className="mt-2 text-4xl font-bold text-text-primary">My Library</h1>
      <p className="mt-4 text-text-secondary">
        Books you&apos;ve purchased will appear here.
      </p>
      <div className="mt-12 rounded-2xl border border-dashed border-border-default p-12 text-center">
        <p className="text-text-muted">Your library is empty.</p>
        <Link
          href="/books"
          className="mt-4 inline-block rounded-lg bg-accent-primary px-6 py-3 font-semibold text-white"
        >
          Browse marketplace
        </Link>
      </div>
    </main>
  );
}
