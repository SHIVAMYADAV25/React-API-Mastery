import { useState } from 'react'

type Cat = {
  name: string
  origin: string
  temperament: string
  description: string
  life_span: string
  image: string
}

export default function RandomCats() {
  const [cat, setCat] = useState<Cat | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchCat() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("https://api.freeapi.app/api/v1/public/cats/cat/random")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setCat(data.data)
    } catch (e: any) {
      setError(e.message || "Failed to load cat")
    }

    setLoading(false)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Cat Explorer</h1>
        <p className="page-sub">A curated look into cat breeds</p>
      </div>

      <div className="toolbar">
        <button className="btn btn-primary" onClick={fetchCat} disabled={loading}>
          {loading ? "Loading…" : cat ? "↻ Discover Another" : "🐱 Discover Cat"}
        </button>
      </div>

      {error && (
        <div className="status-bar error">
          ⚠ {error} —{" "}
          <span onClick={fetchCat} style={{ cursor: "pointer", textDecoration: "underline" }}>
            retry
          </span>
        </div>
      )}

      {loading ? (
        <div className="cat-skeleton" />
      ) : !cat && !error ? (
        <div className="empty-state">
          <h3>No cat loaded</h3>
          <p>Start exploring</p>
        </div>
      ) : cat && (
        <div className="cat-premium">
          
          {/* IMAGE */}
          <div className="cat-visual">
            <img src={cat.image} alt={cat.name} />
            <div className="cat-overlay" />
            <div className="cat-title">
              <h2>{cat.name}</h2>
              <span>{cat.origin}</span>
            </div>
          </div>

          {/* CONTENT */}
          <div className="cat-content">
            <div className="cat-top">
              <span className="badge badge-accent">Life {cat.life_span} yrs</span>
            </div>

            <p className="cat-description">{cat.description}</p>

            <div className="cat-tags">
              {cat.temperament.split(',').map((t, i) => (
                <span key={i} className="tag">{t.trim()}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* MAIN CARD */
        .cat-premium {
          border-radius: var(--r-lg);
          overflow: hidden;
          border: 1px solid var(--line);
          background: var(--paper);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          transition: transform 0.3s ease;
        }

        .cat-premium:hover {
          transform: translateY(-4px);
        }

        /* IMAGE SECTION */
        .cat-visual {
          position: relative;
          height: 340px;
          overflow: hidden;
        }

        .cat-visual img {
          width: 100%;
          height: 100%;
          object-fit:  scale-down;
          object-position: center;
          transform: scale(1.05);
          transition: transform 0.6s ease;
        }

        .cat-premium:hover img {
          transform: scale(1.12);
        }

        .cat-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
        }

        .cat-title {
          position: absolute;
          bottom: 20px;
          left: 20px;
          color: white;
        }

        .cat-title h2 {
          font-family: var(--serif);
          font-size: 32px;
          margin-bottom: 4px;
        }

        .cat-title span {
          font-size: 13px;
          opacity: 0.8;
        }

        /* CONTENT */
        .cat-content {
          padding: 22px;
        }

        .cat-description {
          font-size: 14px;
          line-height: 1.7;
          color: var(--ink-2);
          margin: 16px 0;
        }

        /* TAGS */
        .cat-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          padding: 6px 10px;
          font-size: 11px;
          border-radius: 999px;
          background: var(--paper-2);
          border: 1px solid var(--line);
          color: var(--ink-2);
          transition: all 0.2s;
        }

        .tag:hover {
          background: var(--accent-muted);
          color: var(--accent-dark);
        }

        /* SKELETON LOADER */
        .cat-skeleton {
          height: 420px;
          border-radius: var(--r-lg);
          background: linear-gradient(
            90deg,
            var(--paper-2) 25%,
            var(--paper-3) 50%,
            var(--paper-2) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.2s infinite;
        }

        @keyframes shimmer {
          to { background-position: -200% 0; }
        }

        @media (max-width: 768px) {
          .cat-visual {
            height: 240px;
          }
          .cat-title h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  )
}