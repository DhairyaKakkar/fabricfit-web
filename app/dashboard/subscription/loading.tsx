export default function Loading() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="h-8 w-40 bg-zinc-100 rounded-lg animate-pulse" />
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
        <div className="h-5 w-32 bg-zinc-100 rounded animate-pulse" />
        <div className="h-16 bg-zinc-100 rounded-xl animate-pulse" />
        <div className="h-10 w-40 bg-zinc-100 rounded-xl animate-pulse" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-zinc-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
