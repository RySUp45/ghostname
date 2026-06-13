'use client'

import { useState } from 'react'

interface GhostName {
  label: string
  ghostname: string
  resolved_address: string
  expires_at: string
}

export default function Home() {
  const [names, setNames] = useState<GhostName[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generateName() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/mint', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate')
      setNames(prev => [data, ...prev])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function timeLeft(expires_at: string) {
    const diff = new Date(expires_at).getTime() - Date.now()
    if (diff <= 0) return 'Expired'
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    return `${h}h ${m}m remaining`
  }

  return (
    <main className="min-h-screen bg-black text-white font-mono px-6 py-12 max-w-2xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">👻 GhostNames</h1>
        <p className="text-zinc-400 mt-2 text-sm">
          Temporary, expiring ENS names that resolve to burner wallets.
          Share it. Use it. Let it disappear.
        </p>
      </div>

      <button
        onClick={generateName}
        disabled={loading}
        className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
      >
        {loading ? 'Generating...' : '+ Generate GhostName'}
      </button>

      {error && (
        <p className="text-red-400 text-sm mt-4">{error}</p>
      )}

      <div className="mt-10 flex flex-col gap-4">
        {names.length === 0 && (
          <div className="border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-500 text-sm">No active GhostNames yet. Generate one above.</p>
          </div>
        )}
        {names.map((n) => (
          <div key={n.label} className="border border-zinc-700 rounded-xl p-6 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-green-400 font-bold">{n.ghostname}</span>
              <span className="text-zinc-500 text-xs">{timeLeft(n.expires_at)}</span>
            </div>
            <p className="text-zinc-400 text-xs">
              Resolves to: <span className="text-zinc-200">{n.resolved_address}</span>
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(n.ghostname)}
              className="text-xs text-zinc-500 hover:text-white transition w-fit"
            >
              Copy name
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}