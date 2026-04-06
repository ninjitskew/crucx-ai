import books from "@/content/books.json";

export default function AuthorBooksPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-xs uppercase tracking-wider text-text-muted">
        Author Portal
      </p>
      <h1 className="mt-2 text-4xl font-bold text-text-primary">My Books</h1>
      <div className="mt-8 overflow-hidden rounded-2xl border border-border-default">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-secondary text-text-muted">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.slug} className="border-t border-border-default">
                <td className="px-6 py-4 font-medium text-text-primary">
                  {b.title}
                </td>
                <td className="px-6 py-4 text-text-secondary">{b.category}</td>
                <td className="px-6 py-4 text-text-secondary">₹{b.price}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">
                    Published
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
