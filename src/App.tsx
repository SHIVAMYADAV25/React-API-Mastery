import { useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import YoutubeVideo from './pages/YoutubeVideo'
import RandomUser from './pages/RandomUser'
import Auth from './pages/AuthenticationApp'
import Home from './pages/Home'
import RandomJokes from './pages/RandomJokes'
import RandomProducts from './pages/RandomProducts'
import RandomQuotes from './pages/RandomQuotes'
import './App.css'
import RandomCats from './pages/RandomCats'
import Meal from './pages/Meal'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/auth', label: 'Auth' },
  { to: '/users', label: 'Users' },
  { to: '/youtube', label: 'YouTube' },
  { to: '/jokes', label: 'Jokes' },
  { to: '/products', label: 'Products' },
  { to: '/quotes', label: 'Quotes' },
  { to : "/cats" , label : "Cats"},
  { to : "/meals" , label : "Meals"}
]

function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-dot" />
        <span className="brand-name">FreeAPI</span>
        <span className="brand-tag">Explorer</span>
      </div>
      <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {NAV_LINKS.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/users" element={<RandomUser />} />
          <Route path="/youtube" element={<YoutubeVideo />} />
          <Route path="/jokes" element={<RandomJokes />} />
          <Route path="/products" element={<RandomProducts />} />
          <Route path="/quotes" element={<RandomQuotes />} />
          <Route path="/cats" element={<RandomCats/>}/>
          <Route path="/meals" element={<Meal/>}/>
        </Routes>
      </main>
    </div>
  )
}

export default App