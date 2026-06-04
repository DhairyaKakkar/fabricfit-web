export default function Loading() {
  return (
    <div className="max-w-lg space-y-6">
      <div className="h-8 w-32 bg-zinc-100 rounded-lg animate-pulse" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
          <div className="h-5 w-40 bg-zinc-100 rounded animate-pulse" />
          <div className="h-10 bg-zinc-100 rounded-xl animate-pulse" />
          <div className="h-10 bg-zinc-100 rounded-xl animate-pulse" />
        </div>
      ))}
    </div>
  );
}
