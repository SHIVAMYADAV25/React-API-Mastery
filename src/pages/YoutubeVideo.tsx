import { useEffect, useState } from 'react'

function fmtViews(n: string | number) {
  const num = Number(n)
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return String(num)
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function YoutubeVideo() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { fetchVideos() }, [])

  async function fetchVideos() {
    setLoading(true); setError(null)
    try {
      const res = await fetch('https://api.freeapi.app/api/v1/public/youtube/videos')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setVideos(data.data?.data ?? [])
    } catch (e: any) {
      setError(e.message || 'Failed to load videos')
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">YouTube Videos</h1>
        <p className="page-subtitle">Browse YouTube video data from the API</p>
      </div>

      <div className="toolbar">
        <button className="btn btn-primary" onClick={fetchVideos} disabled={loading}>
          {loading ? 'Loading…' : '↻ Refresh'}
        </button>
        {videos.length > 0 && <span className="badge badge-gray">{videos.length} videos</span>}
      </div>

      {error && (
        <div className="status-bar error">
          <span>⚠</span> {error} —{' '}
          <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={fetchVideos}>retry</span>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <span>Loading videos…</span>
        </div>
      ) : videos.length === 0 && !error ? (
        <div className="empty-state">
          <h3>No videos</h3><p>Hit refresh to load</p>
        </div>
      ) : (
        <div className="yt-grid">
          {videos.map((v, i) => {
            const item = v.items
            const sn = item?.snippet ?? {}
            const stats = item?.statistics ?? {}
            const thumb = sn.thumbnails?.medium?.url
            const videoId = item?.id
            return (
              <a
                key={videoId ?? i}
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card yt-card"
              >
                <div className="yt-thumb-wrap">
                  {thumb ? (
                    <img src={thumb} alt={sn.title} className="yt-thumb" />
                  ) : (
                    <div className="yt-thumb-placeholder">▶</div>
                  )}
                  <span className="yt-play">▶</span>
                </div>
                <div className="card-body">
                  <h3 className="yt-title">{sn.title}</h3>
                  <p className="yt-channel">{sn.channelTitle}</p>
                  <div className="yt-stats">
                    <span>👁 {fmtViews(stats.viewCount ?? 0)} views</span>
                    <span>👍 {fmtViews(stats.likeCount ?? 0)}</span>
                    {sn.publishedAt && <span>📅 {fmtDate(sn.publishedAt)}</span>}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      )}

      <style>{`
        .yt-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .yt-card { cursor: pointer; color: inherit; }
        .yt-thumb-wrap { position: relative; overflow: hidden; }
        .yt-thumb { width: 100%; height: 170px; object-fit: cover; transition: transform 0.3s; }
        .yt-card:hover .yt-thumb { transform: scale(1.04); }
        .yt-thumb-placeholder {
          width: 100%; height: 170px;
          background: var(--surface-2);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; color: var(--text-3);
        }
        .yt-play {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          background: rgba(0,0,0,0.7); color: #fff; border-radius: 50%;
          width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
          font-size: 14px; opacity: 0; transition: opacity 0.2s;
        }
        .yt-card:hover .yt-play { opacity: 1; }
        .yt-title { font-size: 14px; font-weight: 600; line-height: 1.4; margin-bottom: 4px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .yt-channel { font-size: 12px; color: var(--text-2); margin-bottom: 10px; }
        .yt-stats { display: flex; gap: 10px; flex-wrap: wrap; font-size: 12px; color: var(--text-3); }
      `}</style>
    </div>
  )
}