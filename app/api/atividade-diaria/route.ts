// GET /api/atividade-diaria
// Retorna a atividade diária do dia

import { NextResponse } from 'next/server';
import { gerarAtividadeDiariaMock } from '@/lib/mock-llm';

export async function GET() {
  try {
    const atividade = await gerarAtividadeDiariaMock();
    return NextResponse.json(atividade, { status: 200 });
  } catch (error) {
    console.error('Erro ao gerar atividade diária:', error);
    return NextResponse.json(
      { error: 'Erro interno ao gerar atividade diária.' },
      { status: 500 }
    );
  }
}
