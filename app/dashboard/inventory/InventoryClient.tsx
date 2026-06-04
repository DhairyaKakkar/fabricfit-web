'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface FabricGarment {
  id: string;
  garment_type: string;
  status: 'pending' | 'generating' | 'ready' | 'failed';
  image_path: string | null;
}

export interface Fabric {
  id: string;
  name: string;
  color_tag: string | null;
  fabric_type: string | null;
  image_url: string;
  created_at: string;
  fabric_garments: FabricGarment[];
}

const FABRIC_TYPES = ['cotton', 'silk', 'linen', 'polyester', 'other'];

export default function InventoryClient({ initialFabrics, outletId }: { initialFabrics: Fabric[]; outletId: string }) {
  const [fabrics, setFabrics] = useState<Fabric[]>(initialFabrics);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', color_tag: '', fabric_type: 'cotton' });
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function reload() {
    const res = await fetch('/api/fabrics');
    const data = await res.json();
    setFabrics(Array.isArray(data) ? data : []);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) { setError('Please select an image'); return; }
    if (!form.name.trim()) { setError('Name is required'); return; }

    setUploading(true);
    setError('');

    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const path = `${outletId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from('fabric_images').upload(path, file, { upsert: false });
      if (uploadError) throw new Error(uploadError.message);

      const { data: { publicUrl } } = supabase.storage.from('fabric_images').getPublicUrl(path);

      const res = await fetch('/api/fabrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), color_tag: form.color_tag.trim() || null, fabric_type: form.fabric_type, image_url: publicUrl }),
      });

      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }

      setForm({ name: '', color_tag: '', fabric_type: 'cotton' });
      if (fileRef.current) fileRef.current.value = '';
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch('/api/fabrics', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setFabrics(f => f.filter(x => x.id !== id));
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>Inventory</h2>
          <p className="text-sm text-zinc-400">Upload fabric images — garments are generated on the mobile app</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 p-6 mb-8">
        <h3 className="font-semibold text-zinc-900 text-sm mb-4">Add fabric</h3>
        <form onSubmit={handleUpload} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input required placeholder="Fabric name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition" />
            <input placeholder="Colour tag (e.g. Navy Blue)" value={form.color_tag} onChange={e => setForm({ ...form, color_tag: e.target.value })} className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition" />
            <select value={form.fabric_type} onChange={e => setForm({ ...form, fabric_type: e.target.value })} className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition capitalize">
              {FABRIC_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input ref={fileRef} type="file" accept="image/*" required className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-500 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:text-white file:text-xs file:font-semibold file:px-3 file:py-1.5 cursor-pointer" />
            <button type="submit" disabled={uploading} className="bg-zinc-900 text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors shrink-0">
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </form>
      </div>

      {fabrics.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <p className="text-3xl mb-3">🧵</p>
          <p className="text-sm">No fabrics yet — upload your first one above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {fabrics.map(fabric => (
            <div key={fabric.id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden group">
              <div className="aspect-square relative bg-zinc-100">
                <Image src={fabric.image_url} alt={fabric.name} fill className="object-cover" sizes="25vw" />
              </div>
              <div className="p-3">
                <p className="font-semibold text-zinc-900 text-sm truncate">{fabric.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-zinc-400 capitalize">{fabric.fabric_type ?? '—'}{fabric.color_tag ? ` · ${fabric.color_tag}` : ''}</p>
                  <button onClick={() => handleDelete(fabric.id)} className="text-xs text-zinc-300 hover:text-red-500 transition-colors">Remove</button>
                </div>
                {fabric.fabric_garments?.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {fabric.fabric_garments.map(g => (
                      <span key={g.id} className={`text-[10px] px-1.5 py-0.5 rounded-full border capitalize ${g.status === 'ready' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : g.status === 'failed' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-zinc-50 border-zinc-200 text-zinc-500'}`}>
                        {g.garment_type.replace('_', ' ')} · {g.status}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
