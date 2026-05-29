'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price_sgd: number | null;
  image_urls: string[];
  active: boolean;
  created_at: string;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price_sgd: '' });
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setError('');
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price_sgd: form.price_sgd ? parseFloat(form.price_sgd) : null,
      }),
    });
    if (res.ok) {
      setForm({ name: '', description: '', price_sgd: '' });
      load();
    } else {
      const d = await res.json();
      setError(d.error ?? 'Failed to add product');
    }
    setAdding(false);
  }

  async function handleDelete(id: string) {
    await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setProducts((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div>
      <h2
        className="text-2xl font-bold text-zinc-900 mb-1"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Catalog
      </h2>
      <p className="text-sm text-zinc-400 mb-8" style={{ fontFamily: 'var(--font-inter)' }}>
        Add the fabrics and products shoppers can try on
      </p>

      {/* Add form */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 mb-8">
        <h3 className="font-semibold text-zinc-900 mb-4 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
          Add product
        </h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <input
            required
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="flex-1 min-w-[160px] rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition"
            style={{ fontFamily: 'var(--font-inter)' }}
          />
          <input
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="flex-1 min-w-[160px] rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition"
            style={{ fontFamily: 'var(--font-inter)' }}
          />
          <input
            placeholder="Price (S$)"
            type="number"
            step="0.01"
            min="0"
            value={form.price_sgd}
            onChange={(e) => setForm({ ...form, price_sgd: e.target.value })}
            className="w-32 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition"
            style={{ fontFamily: 'var(--font-inter)' }}
          />
          <button
            type="submit"
            disabled={adding}
            className="bg-zinc-900 text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {adding ? 'Adding…' : 'Add'}
          </button>
        </form>
        {error && (
          <p className="text-xs text-red-600 mt-3" style={{ fontFamily: 'var(--font-inter)' }}>{error}</p>
        )}
      </div>

      {/* Product list */}
      {loading ? (
        <p className="text-sm text-zinc-400" style={{ fontFamily: 'var(--font-inter)' }}>Loading…</p>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <p className="text-3xl mb-3">👗</p>
          <p className="text-sm" style={{ fontFamily: 'var(--font-inter)' }}>No products yet — add your first one above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-zinc-900 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>{p.name}</p>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-xs text-zinc-400 hover:text-red-500 transition-colors shrink-0"
                >
                  Remove
                </button>
              </div>
              {p.description && (
                <p className="text-xs text-zinc-400 leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>{p.description}</p>
              )}
              {p.price_sgd != null && (
                <p className="text-xs font-semibold text-zinc-600" style={{ fontFamily: 'var(--font-inter)' }}>S${p.price_sgd.toFixed(2)}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
