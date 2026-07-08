import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Mapeamento de planos para variáveis de ambiente dos links da Kiwify
const PLAN_LINKS: Record<string, string | undefined> = {
  BASIC: process.env.KIWIFY_LINK_BASIC,
  PREMIUM: process.env.KIWIFY_LINK_PREMIUM,
  TURBO: process.env.KIWIFY_LINK_TURBO,
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { plan } = await req.json();

    const baseLink = PLAN_LINKS[plan];

    if (!baseLink) {
      return NextResponse.json(
        { error: `Link do plano "${plan}" não configurado. Configure a variável KIWIFY_LINK_${plan} no .env.local` },
        { status: 500 }
      );
    }

    // Anexa o userId como parâmetro de rastreamento (src) e o email para pré-preencher
    // A Kiwify retornará esse parâmetro no webhook (TrackingParameters.src)
    const separator = baseLink.includes('?') ? '&' : '?';
    const checkoutUrl = `${baseLink}${separator}src=${userId}`;

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('[KIWIFY_CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
