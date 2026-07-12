import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { applyRateLimit } from '@/lib/rate-limit';

const checkoutSchema = z.object({
  plan: z.enum(['BASIC', 'PREMIUM', 'TURBO']),
});

// Mapeamento de planos com fallback hardcoded
const PLAN_LINKS: Record<string, string> = {
  BASIC: process.env.KIWIFY_LINK_BASIC || 'https://pay.kiwify.com.br/Vj7UZdV',
  PREMIUM: process.env.KIWIFY_LINK_PREMIUM || 'https://pay.kiwify.com.br/ih7MjRV',
  TURBO: process.env.KIWIFY_LINK_TURBO || 'https://pay.kiwify.com.br/vQTsfuT',
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimitResponse = await applyRateLimit(ip, 10, 60000);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
    }
    
    const { plan } = parsed.data;

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
