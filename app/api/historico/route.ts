import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { HistoricoItem } from '@/lib/historico';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('historico')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false });

  if (error) {
    console.error('Erro ao buscar historico:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const historicoFormatado: HistoricoItem[] = data.map(row => ({
    id: row.id,
    data: row.data,
    titulo: row.titulo,
    subtitulo: row.subtitulo,
    foco: row.foco,
    modo: row.modo,
    imagens: row.imagens_json || [],
  }));

  return NextResponse.json(historicoFormatado);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Suporta o formato antigo (array de historico) ou um novo item avulso
    let itemsToInsert: HistoricoItem[] = [];
    if (body.historico && Array.isArray(body.historico)) {
      itemsToInsert = body.historico;
    } else if (body.id) {
      itemsToInsert = [body as HistoricoItem];
    }

    if (itemsToInsert.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    const rows = itemsToInsert.map(item => ({
      id: item.id,
      user_id: userId,
      data: item.data,
      titulo: item.titulo,
      subtitulo: item.subtitulo,
      foco: item.foco,
      modo: item.modo,
      imagens_json: item.imagens || [],
    }));

    const { error } = await supabase.from('historico').upsert(rows);
    if (error) throw error;

    return NextResponse.json({ success: true, count: rows.length });
  } catch (err: any) {
    console.error('Erro ao salvar no historico:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
