import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { HistoricoItem } from '@/lib/historico';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  
  const historico = (user.privateMetadata?.historico as HistoricoItem[]) || [];
  return NextResponse.json(historico);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { historico }: { historico: HistoricoItem[] } = await req.json();
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    // Calcula limite baseado no plano (PublicMetadata)
    const plan = (user.publicMetadata?.plan_tier as string) || 'gratis';
    let limite = 5;
    if (plan === 'basic') limite = 10;
    else if (plan === 'premium' || plan === 'elite') limite = 30;

    // Prune history to limit to avoid 8KB limit
    const trimmedHistorico = historico.slice(0, limite).map(item => ({
      // Remove any extraneous fields just in case
      id: item.id,
      data: item.data,
      titulo: item.titulo,
      subtitulo: item.subtitulo,
      foco: item.foco,
      modo: item.modo,
      imagens: item.imagens || [],
    }));

    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        historico: trimmedHistorico
      }
    });

    return NextResponse.json({ success: true, count: trimmedHistorico.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
