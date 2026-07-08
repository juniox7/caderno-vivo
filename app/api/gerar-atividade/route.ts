// POST /api/gerar-atividade
// Recebe dados do formulário e retorna atividade gerada pelo mock LLM

import { NextRequest, NextResponse } from 'next/server';
import { gerarAtividadeMock, gerarAtividadePredefinidaMock } from '@/lib/mock-llm';
import { GerarAtividadeRequest, FormularioLivreData, FormularioPredefinidoData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: GerarAtividadeRequest = await request.json();

    if (!body.modo || !body.dados) {
      return NextResponse.json(
        { error: 'Campos "modo" e "dados" são obrigatórios.' },
        { status: 400 }
      );
    }

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
