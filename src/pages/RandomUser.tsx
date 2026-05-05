import { useEffect, useState } from 'react'

export default function RandomUser() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    setLoading(true); setError(null)
    try {
      const res = await fetch('https://api.freeapi.app/api/v1/public/randomusers?limit=20')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setUsers(data.data?.data ?? [])
    } catch (e: any) {
      setError(e.message || 'Failed to load users')
    }
    setLoading(false)
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return (
      `${u.name.first} ${u.name.last}`.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.location.country.toLowerCase().includes(q)
    )
  })

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Random Users</h1>
        <p className="page-subtitle">Browse randomly generated user profiles worldwide</p>
      </div>

      <div className="toolbar">
        <input
          className="input"
          style={{ maxWidth: 320 }}
          placeholder="Search by name, email, or country…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={fetchUsers} disabled={loading}>
          {loading ? 'Loading…' : '↻ Refresh'}
        </button>
        {users.length > 0 && (
          <span className="badge badge-gray">{filtered.length} / {users.length} users</span>
        )}
      </div>

      {error && (
        <div className="status-bar error">
          <span>⚠</span> {error} —{' '}
          <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={fetchUsers}>retry</span>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <span>Fetching users…</span>
        </div>
      ) : filtered.length === 0 && !error ? (
        <div className="empty-state">
          <h3>{search ? 'No results' : 'No users loaded'}</h3>
          <p>{search ? `Nothing matched "${search}"` : 'Hit refresh to load users'}</p>
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map((u, i) => (
            <div className="card user-card" key={u.login?.uuid ?? i}>
              <div className="user-avatar-wrap">
                <img src={u.picture.large} alt={`${u.name.first} ${u.name.last}`} className="user-avatar" />
                <span className="user-flag">{u.nat}</span>
              </div>
              <div className="card-body">
                <h3 className="user-name">{u.name.title} {u.name.first} {u.name.last}</h3>
                <div className="user-meta">
                  <span className="badge badge-gray">{u.gender}</span>
                  <span className="badge badge-gray">{u.dob?.age} yrs</span>
                </div>
                <div className="user-info">
                  <div className="info-row"><span>📧</span><span>{u.email}</span></div>
                  <div className="info-row"><span>📞</span><span>{u.phone}</span></div>
                  <div className="info-row"><span>📍</span><span>{u.location.city}, {u.location.country}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .user-avatar-wrap { position: relative; }
        .user-avatar { width: 100%; height: 160px; object-fit: scale-down;  }
        .user-flag {
          position: absolute; bottom: 8px; right: 10px;
          background: rgba(0,0,0,0.6); color: #fff;
          font-size: 11px; font-weight: 700; padding: 2px 6px;
          border-radius: 4px; letter-spacing: 1px;
        }
        .user-name { font-size: 15px; font-weight: 600; margin-bottom: 8px; }
        .user-meta { display: flex; gap: 6px; margin-bottom: 12px; }
        .user-info { display: flex; flex-direction: column; gap: 6px; }
        .info-row { display: flex; gap: 8px; font-size: 13px; color: var(--text-2); align-items: flex-start; }
        .info-row span:first-child { flex-shrink: 0; }
      `}</style>
    </div>
  )
}