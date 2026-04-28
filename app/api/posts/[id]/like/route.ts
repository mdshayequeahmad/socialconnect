import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> } 
) {
  const { id } = await context.params 

  const supabase = await createServerSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // check existing like
  const { data: existing } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', user.id)
    .eq('post_id', id)
    .single()

  if (existing) {
    // unlike
    await supabase
      .from('likes')
      .delete()
      .eq('user_id', user.id)
      .eq('post_id', id)

    return NextResponse.json({ liked: false })
  } else {
    // like
    await supabase.from('likes').insert({
      user_id: user.id,
      post_id: id,
    })

    return NextResponse.json({ liked: true })
  }
}