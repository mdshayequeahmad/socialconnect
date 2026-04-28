import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const supabase = await createServerSupabase()

  // get user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { content } = await req.json()

  const name = user.user_metadata?.name || 'Anonymous' 

  const { error } = await supabase.from('posts').insert({
    content,
    user_id: user.id,
    name,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}