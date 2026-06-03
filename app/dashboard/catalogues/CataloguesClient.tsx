'use client';

import { useState } from 'react';
import Image from 'next/image';

interface TryOn {
  id: string;
  result_url: string | null;
  garment_type: string;
  status: string;
  purged_at: string | null;
}

interface CatalogueItem {
  id: string;
  position: number;
  tryon_id: string;
  tryons: TryOn;
}

export interface Catalogue {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  catalogue_items: CatalogueItem[];
}

export default function CataloguesClient({ initialCatalogues }: { initialCatalogues: Catalogue[] }) {
  const [catalogues, setCatalogues] = useState<Catalogue[]>(initialCatalogues);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    const res = await fetch('/api/catalogues', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName.trim(), description: newDesc.trim() || null }) });
    const data = await res.json();
    if (data && !data.error) setCatalogues(c => [data, ...c]);
    setNewName(''); setNewDesc(''); setShowForm(false);
    setCreating(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this catalogue? Try-ons inside will not be deleted.')) return;
    await fetch('/api/catalogues', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setCatalogues(c => c.filter(x => x.id !== id));
    if (selected === id) setSelected(null);
  }

  const activeCatalogue = catalogues.find(c => c.id === selected);
  const activeItems = activeCatalogue?.catalogue_items?.filter(i => i.tryons?.status === 'success' && !i.tryons?.purged_at)?.sort((a, b) => a.position - b.position) ?? [];

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>Catalogues</h2>
          <p className="text-sm text-zinc-400">Collections of try-on results organised for your customers</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="bg-zinc-900 text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-zinc-800 transition-colors">
          + New catalogue
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 mb-6">
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
            <input required autoFocus placeholder="Catalogue name *" value={newName} onChange={e => setNewName(e.target.value)} className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition" />
            <input placeholder="Description (optional)" value={newDesc} onChange={e => setNewDesc(e.target.value)} className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition" />
            <button type="submit" disabled={creating} className="bg-zinc-900 text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors shrink-0">
              {creating ? 'Creating…' : 'Create'}
            </button>
          </form>
        </div>
      )}

      {catalogues.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <p className="text-3xl mb-3">📖</p>
          <p className="text-sm">No catalogues yet — create your first one above</p>
          <p className="text-xs mt-2">Add try-ons to catalogues from the mobile app</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-72 shrink-0 space-y-2">
            {catalogues.map(cat => {
              const count = cat.catalogue_items?.filter(i => !i.tryons?.purged_at).length ?? 0;
              return (
                <button key={cat.id} onClick={() => setSelected(cat.id === selected ? null : cat.id)} className={`w-full text-left px-4 py-3.5 rounded-2xl border transition-all ${selected === cat.id ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm truncate">{cat.name}</p>
                    <span className="text-xs text-zinc-400 shrink-0">{count} item{count !== 1 ? 's' : ''}</span>
                  </div>
                  {cat.description && <p className="text-xs mt-0.5 truncate text-zinc-400">{cat.description}</p>}
                </button>
              );
            })}
          </div>

          {selected && activeCatalogue && (
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-zinc-900" style={{ fontFamily: 'var(--font-playfair)' }}>{activeCatalogue.name}</h3>
                  {activeCatalogue.description && <p className="text-xs text-zinc-400 mt-0.5">{activeCatalogue.description}</p>}
                </div>
                <button onClick={() => handleDelete(activeCatalogue.id)} className="text-xs text-zinc-400 hover:text-red-500 transition-colors">Delete catalogue</button>
              </div>
              {activeItems.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 bg-white rounded-2xl border border-zinc-200">
                  <p className="text-2xl mb-2">📭</p>
                  <p className="text-sm">No items in this catalogue yet</p>
                  <p className="text-xs mt-1">Add try-ons from the mobile app</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activeItems.map(item => (
                    <div key={item.id} className="aspect-[3/4] relative rounded-xl overflow-hidden bg-zinc-100">
                      {item.tryons?.result_url ? (
                        <Image src={item.tryons.result_url} alt={item.tryons.garment_type} fill className="object-cover" sizes="33vw" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-300 text-2xl">👕</div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                        <p className="text-white text-[10px] capitalize">{item.tryons?.garment_type?.replace('_', ' ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
