import { useState } from 'react'

type Quote = { _id: string; content: string; author: string; tags: string[]; length: number }

export default function RandomQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  async function fetchQuotes() {
    setLoading(true); setError(null)
    try {
      const res = await fetch('https://api.freeapi.app/api/v1/public/quotes?limit=20')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setQuotes(data.data?.data ?? [])
      // console.log(quotes)
    } catch (e: any) {
      setError(e.message || 'Failed to load quotes')
    }
    setLoading(false)
  }

  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch { /* silent */ }
  }

  const filtered = quotes.filter(q => {
    // console.log(q)
    const low = filter.toLowerCase() // input element
    // console.log(low)
    return q.content.toLowerCase().includes(low) || q.author.toLowerCase().includes(low)
  })

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Quotes</h1>
        <p className="page-subtitle">Inspiring quotes from great minds</p>
      </div>

      <div className="toolbar">
        <button className="btn btn-primary" onClick={fetchQuotes} disabled={loading}>
          {loading ? 'Loading…' : quotes.length ? '↻ New Quotes' : '💬 Load Quotes'}
        </button>
        {quotes.length > 0 && (
          <input
            className="input"
            style={{ maxWidth: 280 }}
            placeholder="Filter by keyword or author…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        )}
        {quotes.length > 0 && <span className="badge badge-gray">{filtered.length} quotes</span>}
      </div>

      {error && (
        <div className="status-bar error">
          <span>⚠</span> {error} —{' '}
          <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={fetchQuotes}>retry</span>
        </div>
      )}

      {loading ? (
        <div className="loading-container"><div className="spinner" /><span>Loading quotes…</span></div>
      ) : filtered.length === 0 && !error ? (
        <div className="empty-state">
          <h3>{filter ? 'No matches' : 'No quotes yet'}</h3>
          <p>{filter ? `Nothing matched "${filter}"` : 'Load some quotes to get started'}</p>
        </div>
      ) : (
        <div className="quotes-list">
          {filtered.map((q, i) => (
            <div key={q._id ?? i} className="quote-card">
              <span className="quote-mark">"</span>
              <p className="quote-content">{q.content}</p>
              <div className="quote-footer">
                <div className="quote-meta">
                  <span className="quote-author">— {q.author}</span>
                  {q.tags?.slice(0, 3).map(t => (
                    <span key={t} className="badge badge-gray">{t}</span>
                  ))}
                </div>
                <button
                  className="btn btn-ghost copy-btn"
                  onClick={() => copy(`"${q.content}" — ${q.author}`, q._id ?? String(i))}
                >
                  {copied === (q._id ?? String(i)) ? '✓ Copied' : '⎘ Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .quotes-list { display: flex; flex-direction: column; gap: 16px; max-width: auto; }
        .quote-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 24px 28px;
          position: relative; transition: border-color 0.2s;
        }
        .quote-card:hover { border-color: var(--accent-2); }
        .quote-mark {
          font-size: 64px; line-height: 1;
          color: var(--accent-soft); position: absolute; top: 8px; left: 20px;
          font-family: Georgia, serif; font-weight: 700; user-select: none;
        }
        .quote-content {
          font-size: 17px; line-height: 1.7; color: var(--text);
          margin-bottom: 16px; padding-top: 8px;
          position: relative;
        }
        .quote-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .quote-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .quote-author { font-size: 14px; font-weight: 600; color: var(--text-2); }
        .copy-btn { padding: 6px 12px; font-size: 12px; }
      `}</style>
    </div>
  )
}