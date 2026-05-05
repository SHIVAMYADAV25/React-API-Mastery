import { useState } from 'react'

type Joke = { id: number; content: string; categories: string[] }

export default function RandomJokes() {
  const [jokes, setJokes] = useState<Joke[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  async function fetchJokes() {
    setLoading(true); setError(null)
    try {
      const res = await fetch('https://api.freeapi.app/api/v1/public/randomjokes?limit=20')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setJokes(data.data?.data ?? [])
      setRevealed(new Set())
    } catch (e: any) {
      setError(e.message || 'Failed to load jokes')
    }
    setLoading(false)
  }

  function toggle(id: number) {
    setRevealed(s => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Random Jokes</h1>
        <p className="page-subtitle">Click a joke to reveal the punchline</p>
      </div>

      <div className="toolbar">
        <button className="btn btn-primary" onClick={fetchJokes} disabled={loading}>
          {loading ? 'Loading…' : jokes.length ? '↻ New Jokes' : '😄 Load Jokes'}
        </button>
        {jokes.length > 0 && <span className="badge badge-gray">{jokes.length} jokes</span>}
      </div>

      {error && (
        <div className="status-bar error">
          <span>⚠</span> {error} —{' '}
          <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={fetchJokes}>retry</span>
        </div>
      )}

      {loading ? (
        <div className="loading-container"><div className="spinner" /><span>Fetching jokes…</span></div>
      ) : jokes.length === 0 && !error ? (
        <div className="empty-state">
          <h3>No jokes yet</h3>
          <p>Hit the button above to load some!</p>
        </div>
      ) : (
        <div className="jokes-list">
          {jokes.map((j, i) => (
            <div
              key={j.id ?? i}
              className={`joke-card ${revealed.has(i) ? 'open' : ''}`}
              onClick={() => toggle(i)}
            >
              <div className="joke-num">#{i + 1}</div>
              <div className="joke-body">
                {j.categories?.length > 0 && (
                  <div className="joke-tags">
                    {j.categories.map(c => <span key={c} className="badge badge-green">{c}</span>)}
                  </div>
                )}
                {revealed.has(i) ? (
                  <p className="joke-text revealed">{j.content}</p>
                ) : (
                  <p className="joke-text hidden">Click to reveal joke 😄</p>
                )}
              </div>
              <span className="joke-arrow">{revealed.has(i) ? '▲' : '▼'}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .jokes-list { display: flex; flex-direction: column; gap: 12px; max-width: auto; }
        .joke-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 18px 20px;
          cursor: pointer; display: flex; gap: 16px; align-items: flex-start;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .joke-card:hover { border-color: var(--accent); box-shadow: var(--shadow-sm); }
        .joke-card.open { border-color: var(--accent); background: var(--accent-soft); }
        .joke-num { font-size: 11px; font-weight: 700; color: var(--text-3); flex-shrink: 0; padding-top: 3px; }
        .joke-body { flex: 1; }
        .joke-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
        .joke-text { font-size: 15px; line-height: 1.6; }
        .joke-text.hidden { color: var(--text-3); font-style: italic; }
        .joke-text.revealed { color: var(--text); }
        .joke-arrow { font-size: 11px; color: var(--text-3); flex-shrink: 0; padding-top: 3px; }
      `}</style>
    </div>
  )
}