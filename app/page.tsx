'use client'

import { usePrivy } from '@privy-io/react-auth'

export default function Home() {
  const { ready, authenticated, login, logout, user } = usePrivy()

  if (!ready) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-500 font-mono text-sm">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white font-mono px-6 py-12 max-w-2xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">👻 GhostNames</h1>
        <p className="text-zinc-400 mt-2 text-sm">
          Temporary, expiring ENS names that resolve to burner wallets. Share it. Use it. Let it disappear.
        </p>
      </div>

      {!authenticated ? (
        <button
          onClick={login}
          className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-zinc-200 transition"
        >
          Sign in to get started
        </button>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <p className="text-zinc-400 text-sm">
              Signed in as <span className="text-white">{user?.email?.address ?? user?.wallet?.address}</span>
            </p>
            <button
              onClick={logout}
              className="text-zinc-500 text-xs hover:text-white transition"
            >
              Sign out
            </button>
          </div>

          <button
            className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-zinc-200 transition w-fit"
          >
            + Generate GhostName
          </button>

          <div className="border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-500 text-sm">No active GhostNames yet. Generate one above.</p>
          </div>
        </div>
      )}
    </main>
  )
}