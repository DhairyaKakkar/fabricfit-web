export default function Loading() {
  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="h-8 w-32 bg-zinc-100 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-72 bg-zinc-100 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-zinc-100 rounded-xl animate-pulse" />
      </div>
      <div className="flex gap-6">
        <div className="w-72 space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-zinc-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
