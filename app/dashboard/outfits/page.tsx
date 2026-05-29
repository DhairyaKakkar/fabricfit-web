'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface Outfit {
  id: string;
  name: string | null;
  image_url: string;
  created_at: string;
}

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/outfits');
    const data = await res.json();
    setOutfits(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) { setError('Please select an image'); return; }

    setUploading(true);
    setError('');

    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('outfit_images')
        .upload(path, file, { upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const { data: { publicUrl } } = supabase.storage.from('outfit_images').getPublicUrl(path);

      const res = await fetch('/api/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || null, image_url: publicUrl }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }

      setName('');
      if (fileRef.current) fileRef.current.value = '';
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch('/api/outfits', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setOutfits(o => o.filter(x => x.id !== id));
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>Outfits</h2>
          <p className="text-sm text-zinc-400">Upload full outfit photos for product-to-model try-on</p>
        </div>
      </div>

      {/* Upload form */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 mb-8">
        <h3 className="font-semibold text-zinc-900 text-sm mb-4">Add outfit</h3>
        <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3">
          <input
            placeholder="Outfit name (optional)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition"
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            required
            className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-500 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:text-white file:text-xs file:font-semibold file:px-3 file:py-1.5 cursor-pointer"
          />
          <button
            type="submit"
            disabled={uploading}
            className="bg-zinc-900 text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors shrink-0"
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </form>
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-zinc-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : outfits.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <p className="text-3xl mb-3">👗</p>
          <p className="text-sm">No outfits yet — upload your first one above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {outfits.map(outfit => (
            <div key={outfit.id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden group">
              <div className="aspect-[3/4] relative bg-zinc-100">
                <Image src={outfit.image_url} alt={outfit.name ?? 'Outfit'} fill className="object-cover" sizes="25vw" />
              </div>
              <div className="p-3 flex items-center justify-between">
                <p className="font-semibold text-zinc-900 text-sm truncate">{outfit.name ?? 'Unnamed outfit'}</p>
                <button onClick={() => handleDelete(outfit.id)} className="text-xs text-zinc-300 hover:text-red-500 transition-colors shrink-0 ml-2">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
