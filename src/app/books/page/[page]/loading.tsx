export default function MarketplaceLoading() {
  return (
    <>
      <main className="min-h-screen bg-bg-primary pt-24">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb skeleton */}
          <div className="h-4 w-48 animate-pulse rounded bg-bg-card" />

          {/* Heading skeleton */}
          <div className="mt-6 space-y-3 sm:text-left">
            <div className="h-3 w-24 animate-pulse rounded bg-bg-card" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-bg-card" />
            <div className="h-4 w-40 animate-pulse rounded bg-bg-card" />
          </div>

          {/* Search skeleton */}
          <div className="mx-auto mt-8 h-12 max-w-xl animate-pulse rounded-xl bg-bg-card" />

          {/* Pills skeleton */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-9 w-20 animate-pulse rounded-full bg-bg-card" />
            ))}
          </div>

          {/* Grid skeleton */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            <div className="hidden h-96 animate-pulse rounded-2xl bg-bg-card lg:block" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[3/4] animate-pulse rounded-xl bg-bg-card" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-bg-card" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-bg-card" />
                  <div className="h-5 w-1/3 animate-pulse rounded bg-bg-card" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
