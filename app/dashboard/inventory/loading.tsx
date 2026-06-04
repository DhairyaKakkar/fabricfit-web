export default function Loading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-32 bg-zinc-100 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-64 bg-zinc-100 rounded animate-pulse" />
      </div>
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 mb-8 h-28 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="aspect-square bg-zinc-100 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-zinc-100 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-zinc-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
