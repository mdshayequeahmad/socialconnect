import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } 
) {
  const { id } = await context.params 

  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('profiles') 
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}