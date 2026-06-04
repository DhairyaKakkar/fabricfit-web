export default function Loading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-24 bg-zinc-100 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-56 bg-zinc-100 rounded animate-pulse" />
      </div>
      <div className="h-3 w-20 bg-zinc-100 rounded animate-pulse mb-5" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-zinc-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
