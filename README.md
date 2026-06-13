# 👻 GhostNames

> Temporary, expiring ENS names that resolve to burner wallets. Share it. Use it. Let it disappear.

Built at **ETHGlobal New York 2026** in 36 hours.

---

## The Problem

Every time you share a wallet address, you create a permanent, public link between your identity and your onchain history. ENS names make this worse — now your name is attached to everything forever.

There is no native mechanism in Ethereum for a temporary, expiring, privacy-preserving identity. Until now.

---

## What GhostNames Does

GhostNames lets you generate a human-readable ENS subname — like `anon-782.ghostnames.eth` — that:

- Resolves to a **fresh burner wallet** generated on the fly
- **Expires automatically** after 24 hours
- Requires **no gas** to create
- Works in **any ENS-aware wallet** (MetaMask, Rainbow, Uniswap Wallet)
- Leaves **no persistent onchain trace** after expiry

Sign in with Google. Get a name. Share it. When the timer runs out, it's gone.

---

## How It Works

```
User clicks "Generate GhostName"
        ↓
Fresh burner wallet generated (viem)
        ↓
Mapping stored in database:
anon-782 → 0xBurner... (expires in 24hrs)
        ↓
anon-782.ghostnames.eth is immediately ENS-resolvable
        ↓
Any ENS-aware wallet resolves the name via CCIP-Read gateway
        ↓
After 24 hours — mapping expires, name stops resolving
```

The core mechanism is **CCIP-Read (EIP-3668)** — an ENS standard that allows names to resolve via an offchain gateway instead of expensive onchain storage. Every GhostName is completely gasless because the mapping lives in a database, not on the blockchain.

ENS names are permanent by design. We made them disposable.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + Tailwind CSS |
| Auth & Embedded Wallets | Privy |
| Wallet Generation | viem |
| ENS Resolution | CCIP-Read (EIP-3668) |
| Database | Supabase (Postgres) |
| Deployment | Vercel |

---

## Sponsors & Prize Tracks

- **ENS** — Core integration. GhostNames is built entirely on ENS offchain subname resolution via CCIP-Read (EIP-3668).
- **Privy** — Embedded wallet layer enabling gasless, no-MetaMask user onboarding via Google or email login.

---

## Running Locally

```bash
git clone https://github.com/armind76/ghostnames
cd ghostnames
npm install
```

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Setup

Run this in your Supabase SQL editor:

```sql
create table subnames (
  id uuid default gen_random_uuid() primary key,
  label text not null,
  owner text,
  resolved_address text not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);
```

---

## API

### `POST /api/mint`
Generates a new GhostName with a fresh burner wallet. Returns the ENS name, resolved address, private key, and expiry timestamp.

### `GET /api/resolve?name=anon-782`
Resolves a GhostName to its burner wallet address. Returns 410 if expired, 404 if not found. This is the CCIP-Read gateway endpoint.

---

## Team

| GitHub | Role |
|--------|------|
| [@armind76](https://github.com/armind76) | Full Stack |
| [@lordvacuum](https://github.com/lordvacuum) | Full Stack |
| [@RySUp45](https://github.com/RySUp45) | Full Stack |

Built in 36 hours at ETHGlobal New York 2026 — Metropolitan Pavilion.
