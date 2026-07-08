import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { checkAndIncrementQuota } from '@/lib/quota';
import { generateWordSearch } from '@/lib/wordSearch';
import { generateMaze } from '@/lib/maze';



export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 500 });
  }

  try {
    const quota = await checkAndIncrementQuota();
    if (!quota.allowed) {
      return NextResponse.json({ error: quota.error }, { status: quota.status });
    }

    const dados = await req.json();
    const { tipoAtividade, tema, dificuldade } = dados; // tipoAtividade = 'caca_palavras' | 'labirinto'

    let tamanhoGrid = 12; // medio default
    if (dificuldade === 'facil') tamanhoGrid = 8;
    else if (dificuldade === 'dificil') tamanhoGrid = 16;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'dummy_key_for_build',
    });

    if (tipoAtividade === 'caca_palavras') {
      const prompt = `Gere uma lista de 6 a 8 palavras curtas e simples (sem acentos ou caracteres especiais) relacionadas ao tema "${tema}". 
As palavras devem ter no máximo 10 letras cada.
Retorne APENAS um JSON válido contendo um array de strings chamado "palavras". Exemplo: {"palavras": ["GATO", "CACHORRO", "VACA"]}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("A resposta da IA veio vazia.");

      // Limpa possíveis blocos markdown (```json e ```)
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanJson);
      const palavras = result.palavras || [];

      // Gerar a matriz do caça palavras
      const { grid, placements } = generateWordSearch(palavras, tamanhoGrid);

      return NextResponse.json({ 
        tipo: 'caca_palavras',
        tema,
        palavras,
        grid,
        placements
      });
    } 
    else if (tipoAtividade === 'labirinto') {
      const prompt = `Sugira dois emojis que representem o tema "${tema}" para serem o ponto de partida e o objetivo de um labirinto.
Exemplo para "Astronauta": {"inicio": "👨‍🚀", "fim": "🚀"}
Retorne APENAS um JSON válido.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("A resposta da IA veio vazia.");

      // Limpa possíveis blocos markdown
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanJson);
      const inicio = result.inicio || '🏁';
      const fim = result.fim || '🏆';

      // Gerar matriz do labirinto
      const mazeGrid = generateMaze(tamanhoGrid, tamanhoGrid);

      return NextResponse.json({
        tipo: 'labirinto',
        tema,
        inicio,
        fim,
        mazeGrid
      });
    }

    return NextResponse.json({ error: 'Tipo de atividade inválido' }, { status: 400 });

  } catch (error: any) {
    console.error('Erro na API generate-puzzle:', error);
    return NextResponse.json(
      { error: error.message || 'Ocorreu um erro inesperado' },
      { status: 500 }
    );
  }
}
