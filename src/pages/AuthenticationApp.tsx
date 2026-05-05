import React, { useEffect, useState } from 'react'

type Mode = 'register' | 'login' | 'dashboard'
type FormData = { username: string; email: string; password: string }

function StatusBar({ msg, type }: { msg: string; type: 'error' | 'success' | 'info' }) {
  return (
    <div className={`status-bar ${type}`}>
      <span>{type === 'error' ? '⚠' : type === 'success' ? '✓' : 'ℹ'}</span>
      {msg}
    </div>
  )
}

export default function Auth() {
  const [mode, setMode] = useState<Mode>('register')
  const [form, setForm] = useState<FormData>({ username: '', email: '', password: '' })
  const [authUser, setAuthUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ msg: string; type: 'error' | 'success' | 'info' } | null>(null)
  const [showPass, setShowPass] = useState(false)

  useEffect(() => { getUser() }, [])

  function set(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(v => ({ ...v, [field]: e.target.value }))
  }

  async function getUser() {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch('https://api.freeapi.app/api/v1/users/current-user', {
        headers: { accept: 'application/json', Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setAuthUser(data.data)
        setMode('dashboard')
      }
    } catch { /* silent */ }
    setLoading(false)
  }

  async function register() {
    if (!form.username || !form.email || !form.password)
      return setStatus({ msg: 'All fields are required', type: 'error' })
    setLoading(true); setStatus(null)
    try {
      const res = await fetch('https://api.freeapi.app/api/v1/users/register', {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, role: 'ADMIN', username: form.username })
      })
      const data = await res.json()
      if (data.success) {
        setStatus({ msg: 'Registered! Please log in.', type: 'success' })
        setMode('login')
        setForm({ username: '', email: '', password: '' })
      } else {
        setStatus({ msg: data.message || 'Registration failed', type: 'error' })
      }
    } catch {
      setStatus({ msg: 'Network error. Please try again.', type: 'error' })
    }
    setLoading(false)
  }

  async function login() {
    if (!form.username || !form.password)
      return setStatus({ msg: 'Username and password required', type: 'error' })
    setLoading(true); setStatus(null)
    try {
      const res = await fetch('https://api.freeapi.app/api/v1/users/login', {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password })
      })
      const data = await res.json()
      if (data.success) {
        setAuthUser(data.data.user)
        localStorage.setItem('accessToken', data.data.accessToken)
        setMode('dashboard')
        setForm({ username: '', email: '', password: '' })
        setStatus(null)
      } else {
        setStatus({ msg: data.message || 'Login failed', type: 'error' })
      }
    } catch {
      setStatus({ msg: 'Network error. Please try again.', type: 'error' })
    }
    setLoading(false)
  }

  async function logout() {
    setLoading(true)
    try {
      await fetch('https://api.freeapi.app/api/v1/users/logout', {
        method: 'POST',
        headers: { accept: 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      })
    } catch { /* silent */ }
    localStorage.removeItem('accessToken')
    setAuthUser(null)
    setMode('register')
    setStatus({ msg: 'Logged out successfully', type: 'info' })
    setLoading(false)
  }

  return (
    <div className="page auth-page">
      <div className="auth-center">
        <div className="auth-box">
          <div className="auth-header">
            <div className="auth-icon">🔐</div>
            <h2 className="auth-title">
              {mode === 'register' ? 'Create account' : mode === 'login' ? 'Welcome back' : 'Your profile'}
            </h2>
          </div>

          {status && <StatusBar {...status} />}
          {loading && (
            <div className="auth-loading">
              <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              <span>Please wait…</span>
            </div>
          )}

          {mode === 'register' && (
            <div className="auth-form">
              <div className="field">
                <label className="field-label">Username</label>
                <input className="input" type="text" value={form.username} onChange={set('username')} placeholder="johndoe" />
              </div>
              <div className="field">
                <label className="field-label">Email</label>
                <input className="input" type="email" value={form.email} onChange={set('email')} placeholder="john@example.com" />
              </div>
              <div className="field">
                <label className="field-label">Password</label>
                <div className="pass-wrap">
                  <input className="input" type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min. 8 characters" />
                  <button className="pass-toggle" type="button" onClick={() => setShowPass(s => !s)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button className="btn btn-primary auth-btn" onClick={register} disabled={loading}>
                {loading ? 'Creating…' : 'Create account'}
              </button>
              <p className="auth-switch">
                Already have an account?{' '}
                <span onClick={() => { setMode('login'); setStatus(null) }}>Sign in</span>
              </p>
            </div>
          )}

          {mode === 'login' && (
            <div className="auth-form">
              <div className="field">
                <label className="field-label">Username</label>
                <input className="input" type="text" value={form.username} onChange={set('username')} placeholder="johndoe" />
              </div>
              <div className="field">
                <label className="field-label">Password</label>
                <div className="pass-wrap">
                  <input className="input" type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Your password"
                    onKeyDown={e => e.key === 'Enter' && login()} />
                  <button className="pass-toggle" type="button" onClick={() => setShowPass(s => !s)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button className="btn btn-primary auth-btn" onClick={login} disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
              <p className="auth-switch">
                New here?{' '}
                <span onClick={() => { setMode('register'); setStatus(null) }}>Create account</span>
              </p>
            </div>
          )}

          {mode === 'dashboard' && authUser && (
            <div className="dashboard">
              <div className="avatar-ring">
                <span className="avatar-letter">{authUser.username?.[0]?.toUpperCase()}</span>
              </div>
              <h3 className="dashboard-name">{authUser.username}</h3>
              <p className="dashboard-email">{authUser.email}</p>
              <span className="badge badge-green" style={{ marginTop: 8 }}>{authUser.role}</span>
              <button className="btn btn-danger auth-btn" onClick={logout} disabled={loading} style={{ marginTop: 24 }}>
                {loading ? 'Logging out…' : 'Sign out'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .auth-page { display: flex; align-items: flex-start; justify-content: center; }
        .auth-center { width: 100%; display: flex; justify-content: center; }
        .auth-box {
          width: 100%; max-width: 400px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 32px;
          box-shadow: var(--shadow-md);
        }
        .auth-header { text-align: center; margin-bottom: 28px; }
        .auth-icon { font-size: 32px; margin-bottom: 10px; }
        .auth-title { font-size: 22px; font-weight: 600; }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field-label { font-size: 13px; font-weight: 500; color: var(--text-2); }
        .pass-wrap { position: relative; }
        .pass-wrap .input { padding-right: 42px; }
        .pass-toggle {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; font-size: 16px; cursor: pointer; opacity: 0.7;
        }
        .auth-btn { width: 100%; justify-content: center; padding: 12px; }
        .auth-switch { text-align: center; font-size: 13px; color: var(--text-2); margin-top: 4px; }
        .auth-switch span { color: var(--accent); cursor: pointer; font-weight: 500; }
        .auth-switch span:hover { text-decoration: underline; }
        .auth-loading { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-3); margin-bottom: 12px; }
        .dashboard { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .avatar-ring {
          width: 72px; height: 72px; border-radius: 50%;
          background: var(--accent-soft); border: 2px solid var(--accent);
          display: flex; align-items: center; justify-content: center; margin-bottom: 12px;
        }
        .avatar-letter { font-size: 28px; font-weight: 600; color: var(--accent); }
        .dashboard-name { font-size: 20px; font-weight: 600; }
        .dashboard-email { font-size: 14px; color: var(--text-2); margin-top: 2px; }
      `}</style>
    </div>
  )
}