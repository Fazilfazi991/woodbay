export default function AdminLoading() {
  return (
    <main
      className="mx-auto max-w-7xl animate-pulse p-4 sm:p-6"
      aria-busy="true"
      aria-label="Loading admin page"
    >
      <div className="h-8 w-48 rounded bg-black/10" />
      <div className="mt-3 h-4 w-80 max-w-full rounded bg-black/10" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="h-28 rounded border bg-black/5" />
        ))}
      </div>
    </main>
  );
}
