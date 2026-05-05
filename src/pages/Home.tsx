import { Link } from 'react-router-dom'

const PAGES = [
  { to: '/auth', label: 'Authentication', desc: 'Register, login, and manage sessions', emoji: '🔐' },
  { to: '/users', label: 'Random Users', desc: 'Browse random user profiles from around the world', emoji: '👥' },
  { to: '/youtube', label: 'YouTube Videos', desc: 'Explore a feed of YouTube videos', emoji: '▶️' },
  { to: '/jokes', label: 'Random Jokes', desc: 'Fetch and browse random jokes', emoji: '😄' },
  { to: '/products', label: 'Products', desc: 'Browse random product listings', emoji: '🛍️' },
  { to: '/quotes', label: 'Quotes', desc: 'Discover inspiring quotes', emoji: '💬' },
]

export default function Home() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">FreeAPI Explorer</h1>
        <p className="page-subtitle">Explore live data from the FreeAPI.app public endpoints</p>
      </div>
      <div className="card-grid">
        {PAGES.map(p => (
          <Link to={p.to} key={p.to} className="card home-card">
            <div className="card-body">
              <div className="home-card-icon">{p.emoji}</div>
              <h3 className="home-card-title">{p.label}</h3>
              <p className="home-card-desc">{p.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      <style>{`
        .home-card { cursor: pointer; }
        .home-card-icon { font-size: 28px; margin-bottom: 12px; }
        .home-card-title { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
        .home-card-desc { font-size: 13px; color: var(--text-2); line-height: 1.5; }
      `}</style>
    </div>
  )
}