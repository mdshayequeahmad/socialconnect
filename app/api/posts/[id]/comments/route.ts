import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// GET comments
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', params.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}

// POST comment
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { content } = await req.json()

  if (!content || !content.trim()) {
    return NextResponse.json({ error: 'Empty comment' }, { status: 400 })
  }

  const name = user.user_metadata?.name || 'Anonymous'

  const { data, error } = await supabase
    .from('comments')
    .insert({
      content,
      post_id: params.id,
      user_id: user.id,
      name,
    })
    .select()
    .single()

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}