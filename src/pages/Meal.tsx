import { useState } from 'react'

type Meal = {
  idMeal: string
  strMeal: string
  strCategory: string
  strArea: string
  strInstructions: string
  strMealThumb: string
  strTags: string | null
}

export default function Meal() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState<number | null>(null)

  async function getMeals() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("https://api.freeapi.app/api/v1/public/meals")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      setMeals(data.data.data || [])
    } catch (e: any) {
      setError(e.message || "Failed to load meals")
    }

    setLoading(false)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Meal Explorer</h1>
        <p className="page-sub">Discover dishes from around the world</p>
      </div>

      <div className="toolbar">
        <button className="btn btn-primary" onClick={getMeals} disabled={loading}>
          {loading ? "Loading…" : meals.length ? "↻ Refresh" : "🍽️ Load Meals"}
        </button>
        {meals.length > 0 && (
          <span className="badge badge-stone">{meals.length} meals</span>
        )}
      </div>

      {error && (
        <div className="status-bar error">
          ⚠ {error} —{" "}
          <span onClick={getMeals} style={{ cursor: "pointer", textDecoration: "underline" }}>
            retry
          </span>
        </div>
      )}

      {loading ? (
        <div className="meal-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="meal-skeleton" />
          ))}
        </div>
      ) : meals.length === 0 && !error ? (
        <div className="empty-state">
          <h3>No meals yet</h3>
          <p>Click above to explore</p>
        </div>
      ) : (
        <div className="meal-grid">
          {meals.map((m, i) => (
            <div key={m.idMeal} className="meal-card">

              {/* IMAGE */}
              <div className="meal-img-wrap">
                <img src={m.strMealThumb} alt={m.strMeal} />
                <div className="meal-overlay" />
                <div className="meal-title">
                  <h3>{m.strMeal}</h3>
                  <span>{m.strArea}</span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="meal-body">
                <div className="meal-meta">
                  <span className="badge badge-accent">{m.strCategory}</span>
                </div>

                {/* TAGS */}
                {m.strTags && (
                  <div className="meal-tags">
                    {m.strTags.split(',').map((t, idx) => (
                      <span key={idx} className="tag">{t}</span>
                    ))}
                  </div>
                )}

                {/* TOGGLE */}
                <button
                  className="btn btn-ghost"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {open === i ? "Hide Recipe ▲" : "View Recipe ▼"}
                </button>

                {open === i && (
                  <p className="meal-desc">
                    {m.strInstructions.slice(0, 300)}...
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .meal-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
        }

        .meal-card {
          border-radius: var(--r-md);
          overflow: hidden;
          border: 1px solid var(--line);
          background: var(--paper);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .meal-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }

        .meal-img-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .meal-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .meal-card:hover img {
          transform: scale(1.1);
        }

        .meal-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
        }

        .meal-title {
          position: absolute;
          bottom: 12px;
          left: 12px;
          color: white;
        }

        .meal-title h3 {
          font-size: 16px;
          margin-bottom: 2px;
        }

        .meal-title span {
          font-size: 12px;
          opacity: 0.8;
        }

        .meal-body {
          padding: 16px;
        }

        .meal-meta {
          margin-bottom: 8px;
        }

        .meal-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }

        .tag {
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 999px;
          background: var(--paper-2);
          border: 1px solid var(--line);
        }

        .meal-desc {
          margin-top: 10px;
          font-size: 13px;
          line-height: 1.6;
          color: var(--ink-2);
        }

        /* SKELETON */
        .meal-skeleton {
          height: 260px;
          border-radius: var(--r-md);
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
      `}</style>
    </div>
  )
}