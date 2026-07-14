import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { nomes } = await req.json();
    if (!nomes || !Array.isArray(nomes)) return NextResponse.json([]);

    const { data, error } = await supabase
      .from('prospeccoes')
      .select('nome_clinica, status_envio, mensagem_erro')
      .in('nome_clinica', nomes);

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
