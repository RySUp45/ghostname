import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST() {
  try {
    const privateKey = generatePrivateKey()
    const account = privateKeyToAccount(privateKey)
    const burnerAddress = account.address

    const label = `anon-${Math.floor(Math.random() * 900) + 100}`
    const ghostname = `${label}.ghostnames.eth`
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    const { error } = await supabase.from('subnames').insert({
      label,
      owner: '0xDEMO',
      resolved_address: burnerAddress,
      expires_at,
    })

    if (error) throw new Error(error.message)

    return NextResponse.json({ label, ghostname, resolved_address: burnerAddress, private_key: privateKey, expires_at })
  } 
    catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
