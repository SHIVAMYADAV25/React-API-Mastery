import { useEffect, useState } from 'react'

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#e07c24', fontSize: 13 }}>
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
      {/* <span style={{ color: 'var(--text-3)', marginLeft: 5 }}>{rating.toFixed(1)}</span> */}
    </span>
  )
}

export default function RandomProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default')

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    setLoading(true); setError(null)
    try {
      const res = await fetch('https://api.freeapi.app/api/v1/public/randomproducts?limit=20')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setProducts(data.data?.data ?? [])
      console.log(products)
    } catch (e: any) {
      setError(e.message || 'Failed to load products')
    }
    setLoading(false)
  }

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'rating') return b.rating.rate - a.rating.rate
    return 0
  })

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <p className="page-subtitle">Random products catalog</p>
      </div>

      <div className="toolbar">
        <button className="btn btn-primary" onClick={fetchProducts} disabled={loading}>
          {loading ? 'Loading…' : '↻ Refresh'}
        </button>
        <select
          className="input"
          style={{ width: 'auto', padding: '8px 12px' }}
          value={sort}
          onChange={e => setSort(e.target.value as any)}
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
        {products.length > 0 && <span className="badge badge-gray">{products.length} items</span>}
      </div>

      {error && (
        <div className="status-bar error">
          <span>⚠</span> {error} —{' '}
          <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={fetchProducts}>retry</span>
        </div>
      )}

      {loading ? (
        <div className="loading-container"><div className="spinner" /><span>Loading products…</span></div>
      ) : sorted.length === 0 && !error ? (
        <div className="empty-state"><h3>No products</h3><p>Hit refresh to load</p></div>
      ) : (
        <div className="card-grid">
          {sorted.map((p, i) => (
            <div key={p.id ?? i} className="card product-card">
              <div className="product-img-wrap">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="product-img" />
                ) : (
                  <div className="product-img-placeholder">🛍️</div>
                )}
                <span className="product-category">{p.category}</span>
              </div>
              <div className="card-body">
                <h3 className="product-title">{p.title}</h3>
                <p className="product-desc">{p.description?.slice(0, 80)}…</p>
                <div className="product-footer">
                  <span className="product-price">${Number(p.price).toFixed(2)}</span>
                  {p.rating && <Stars rating={p.rating.rate} />}
                </div>
                {p.rating && (
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{p.rating.count} reviews</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .product-img-wrap { position: relative; background: var(--surface-2); }
        .product-img { width: 100%; height: 180px; object-fit: contain; padding: 12px; }
        .product-img-placeholder {
          width: 100%; height: 180px;
          display: flex; align-items: center; justify-content: center; font-size: 40px;
        }
        .product-category {
          position: absolute; top: 10px; left: 10px;
          background: var(--surface); border: 1px solid var(--border);
          font-size: 10px; font-weight: 600; color: var(--text-2);
          padding: 2px 8px; border-radius: 999px; text-transform: capitalize;
        }
        .product-title {
          font-size: 13px; font-weight: 600; margin-bottom: 6px; line-height: 1.4;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .product-desc { font-size: 12px; color: var(--text-2); margin-bottom: 12px; line-height: 1.5; }
        .product-footer { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        .product-price { font-size: 18px; font-weight: 700; color: var(--text); }
      `}</style>
    </div>
  )
}