// POST /api/gerar-atividade
// Recebe dados do formulário e retorna atividade gerada pelo mock LLM

import { NextRequest, NextResponse } from 'next/server';
import { gerarAtividadeMock, gerarAtividadePredefinidaMock } from '@/lib/mock-llm';
import { GerarAtividadeRequest, FormularioLivreData, FormularioPredefinidoData } from '@/lib/types';
import { z } from 'zod';
import { applyRateLimit } from '@/lib/rate-limit';

const atividadeSchema = z.object({
  modo: z.enum(['livre', 'predefinido', 'professores']),
  dados: z.any()
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimitResponse = applyRateLimit(ip, 10, 60000);
    if (rateLimitResponse) return rateLimitResponse;

    const rawBody = await request.json();
    const parsed = atividadeSchema.safeParse(rawBody);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Campos "modo" e "dados" são obrigatórios e devem estar corretos.' },
        { status: 400 }
      );
    }
    
    const body = parsed.data as GerarAtividadeRequest;

    let resultado;

    switch (body.modo) {
      case 'livre':
        resultado = await gerarAtividadeMock(body.dados as FormularioLivreData);
        break;

      case 'predefinido':
        resultado = await gerarAtividadePredefinidaMock(body.dados as FormularioPredefinidoData);
        break;

      case 'professores':
        // Para MVP, reutiliza o mock do modo livre adaptado
        resultado = await gerarAtividadeMock(body.dados as FormularioLivreData);
        break;

      default:
        return NextResponse.json(
          { error: `Modo "${body.modo}" não reconhecido.` },
          { status: 400 }
        );
    }

    return NextResponse.json(resultado, { status: 200 });
  } catch (error) {
    console.error('Erro ao gerar atividade:', error);
    return NextResponse.json(
      { error: 'Erro interno ao gerar atividade.' },
      { status: 500 }
    );
  }
}
