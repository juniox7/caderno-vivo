import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { DEFAULT_STATS, UserStats } from '@/lib/gamificacao';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('gamificacao')
    .select('*')
    .eq('user_id', userId)
    .single();

  let stats = DEFAULT_STATS;
  
  if (data && data.historico_geral_json) {
    // Restauramos todo o objeto a partir do JSON para não perder os campos como inventario, conquistas, etc.
    stats = data.historico_geral_json as UserStats;
  }

  return NextResponse.json(stats);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats: UserStats = await req.json();
    
    const { error } = await supabase.from('gamificacao').upsert({
      user_id: userId,
      moedas: 0, // Campo não usado na interface atual
      sementes: stats.sementes,
      ofensiva_atual: stats.ofensivaAtual,
      historico_geral_json: stats,
      updated_at: new Date().toISOString()
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Supabase gamificacao error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
