'use client';

import { useState } from 'react';
import Image from 'next/image';

export interface TryOn {
  id: string;
  result_url: string;
  garment_type: string;
  created_at: string;
  fabrics: { name: string; color_tag: string | null } | null;
  outfits: { name: string | null } | null;
}

export default function GalleryClient({ initialTryons }: { initialTryons: TryOn[] }) {
  const [tryons, setTryons] = useState<TryOn[]>(initialTryons);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch('/api/tryons', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setTryons(t => t.filter(x => x.id !== id));
    setDeleting(null);
  }

  const label = (t: TryOn) => t.fabrics?.name ?? t.outfits?.name ?? t.garment_type;

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>Gallery</h2>
          <p className="text-sm text-zinc-400">All saved try-on results from the app</p>
        </div>
        <div className="bg-zinc-900 text-white rounded-xl px-4 py-2.5 text-xs font-semibold hidden sm:block">
          📱 New try-ons → mobile app only
        </div>
      </div>

      {tryons.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🖼️</p>
          <p className="font-semibold text-zinc-900 mb-2">No try-ons yet</p>
          <p className="text-sm text-zinc-400 mb-6">Generate try-ons on the TrialRoomStudio mobile app — they'll appear here automatically.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-zinc-400 mb-5">{tryons.length} result{tryons.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {tryons.map((t) => (
              <div key={t.id} className="group relative rounded-2xl overflow-hidden bg-zinc-100 aspect-[3/4]">
                {t.result_url ? (
                  <Image src={t.result_url} alt={label(t)} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300 text-3xl">👕</div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100">
                  <button onClick={() => handleDelete(t.id)} disabled={deleting === t.id} className="self-end bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors">
                    {deleting === t.id ? '…' : 'Delete'}
                  </button>
                  <div>
                    <p className="text-white text-xs font-semibold truncate">{label(t)}</p>
                    <p className="text-white/60 text-[10px] capitalize">{t.garment_type.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
