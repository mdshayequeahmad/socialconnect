import { NextResponse } from "next/server";
import { createServerSupabase } from '@/lib/supabase-server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}
