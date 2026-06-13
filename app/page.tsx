'use client'

import { useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'

interface GhostName {
  label: string
  ghostname: string
  resolved_address: string
  private_key: string
  expires_at: string
}

export default function Home() {
  const { ready, authenticated, login, logout, user } = usePrivy()
  console.log('privy user:', user)
  const [names, setNames] = useState<GhostName[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  async function generateName() {
  setLoading(true)
  setError('')
  
  const owner = user?.wallet?.address ?? (user as any)?.google?.subject ?? user?.id ?? '0xDEMO'
  console.log('owner being sent:', owner) // temporary, remove later
  
  try {
    const res = await fetch('/api/mint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner })
    })
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

  if (!ready) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-500 font-mono text-sm">Loading...</p>
      </main>
    )
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center gap-6">
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">👻 GhostNames</h1>
          <p className="text-zinc-400 text-sm max-w-sm">
            Temporary, expiring ENS names that resolve to burner wallets.
            Share it. Use it. Let it disappear.
          </p>
        </div>
        <button
          onClick={login}
          className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-zinc-200 transition"
        >
          Sign in to get started
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white font-mono px-6 py-12 max-w-2xl mx-auto">
      <div className="mb-12 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">👻 GhostNames</h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Temporary, expiring ENS names that resolve to burner wallets.
            Share it. Use it. Let it disappear.
          </p>
        </div>
        <button
          onClick={logout}
          className="text-zinc-500 text-xs hover:text-white transition mt-1"
        >
          Sign out
        </button>
      </div>

      <button
        onClick={generateName}
        disabled={loading}
        className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
      >
        {loading ? 'Generating...' : '+ Generate GhostName'}
      </button>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

      <div className="mt-10 flex flex-col gap-4">
        {names.length === 0 && (
          <div className="border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-500 text-sm">No active GhostNames yet. Generate one above.</p>
          </div>
        )}
        {names.map((n, i) => (
  <div key={`${n.label}-${i}`} className="border border-zinc-700 rounded-xl p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-green-400 font-bold">{n.ghostname}</span>
              <span className="text-zinc-500 text-xs">{timeLeft(n.expires_at)}</span>
            </div>

            <p className="text-zinc-400 text-xs">
              Resolves to:{' '}
              <span className="text-zinc-200 break-all">{n.resolved_address}</span>
            </p>

            <div className="border border-yellow-800 bg-yellow-950 rounded-lg p-3 flex flex-col gap-2">
              <p className="text-yellow-400 text-xs font-bold">
                ⚠️ Private Key — save this now, it will not be shown again
              </p>
              {revealed[n.label] ? (
                <p className="text-yellow-200 text-xs break-all">{n.private_key}</p>
              ) : (
                <button
                  onClick={() => setRevealed(prev => ({ ...prev, [n.label]: true }))}
                  className="text-yellow-400 text-xs hover:text-yellow-200 transition w-fit"
                >
                  Click to reveal private key
                </button>
              )}
              {revealed[n.label] && (
                <button
                  onClick={() => navigator.clipboard.writeText(n.private_key)}
                  className="text-yellow-600 text-xs hover:text-yellow-400 transition w-fit"
                >
                  Copy private key
                </button>
              )}
            </div>

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