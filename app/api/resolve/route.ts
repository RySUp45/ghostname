import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')

  if (!name) {
    return NextResponse.json({ error: 'Missing name parameter' }, { status: 400 })
  }

  // Strip .ghostnames.eth if they pass the full name
  const label = name.replace('.ghostnames.eth', '')

  const { data, error } = await supabase
    .from('subnames')
    .select('resolved_address, expires_at')
    .eq('label', label)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Name not found' }, { status: 404 })
  }

  const expired = new Date(data.expires_at) < new Date()

  if (expired) {
    return NextResponse.json({ error: 'Name has expired' }, { status: 410 })
  }

  return NextResponse.json({
    name: `${label}.ghostnames.eth`,
    resolved_address: data.resolved_address,
    expires_at: data.expires_at,
  })
}