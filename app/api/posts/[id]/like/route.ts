import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

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

  const postId = params.id

  // check existing like
  const { data: existing } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single()

  if (existing) {
    // unlike
    await supabase
      .from('likes')
      .delete()
      .eq('user_id', user.id)
      .eq('post_id', postId)

    return NextResponse.json({ liked: false })
  } else {
    // like
    await supabase.from('likes').insert({
      user_id: user.id,
      post_id: postId,
    })

    return NextResponse.json({ liked: true })
  }
}