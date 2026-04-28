import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file)

    if (uploadError) {
      console.error('UPLOAD ERROR:', uploadError)
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      )
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    const publicUrl = data.publicUrl

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        avatar_url: publicUrl,
      },
    })

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: publicUrl })
  } catch (err: any) {
    console.error('SERVER ERROR:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}