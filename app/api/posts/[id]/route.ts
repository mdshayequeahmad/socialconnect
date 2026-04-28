import { NextResponse } from "next/server";
import { createServerSupabase } from '@/lib/supabase-server'

export async function GET(_: Request, { params }: any) {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: Request, { params }: any) {
  const supabase = createServerSupabase();
  const body = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("posts")
    .update(body)
    .eq("id", params.id)
    .eq("author_id", user?.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_: Request, { params }: any) {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", params.id)
    .eq("author_id", user?.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
