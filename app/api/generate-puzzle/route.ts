import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { checkAndIncrementQuota } from '@/lib/quota';
import { generateWordSearch } from '@/lib/wordSearch';
import { generateMaze } from '@/lib/maze';
import { z } from 'zod';
import { applyRateLimit } from '@/lib/rate-limit';

const generateSchema = z.object({
  tipoAtividade: z.enum(['caca_palavras', 'labirinto', 'forca', 'memoria']),
  tema: z.string().min(1, "Tema é obrigatório").max(100, "Tema muito longo"),
  dificuldade: z.enum(['facil', 'medio', 'dificil']),
});



export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 500 });
  }

  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimitResponse = applyRateLimit(ip, 5, 60000); // 5 reqs per minute
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json();
    const parsed = generateSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos", details: parsed.error.issues }, { status: 400 });
    }

    const { tipoAtividade, tema, dificuldade } = parsed.data;

    const quota = await checkAndIncrementQuota(tipoAtividade);
    if (!quota.allowed) {
      return NextResponse.json({ error: quota.error }, { status: 403 });
    }

    let tamanhoGrid = 12; // medio default
    if (dificuldade === 'facil') tamanhoGrid = 8;
    else if (dificuldade === 'dificil') tamanhoGrid = 16;

    let palavrasConfig = { qtd: '6 a 8', tamanho: '10' };
    if (dificuldade === 'facil') palavrasConfig = { qtd: '5 a 6', tamanho: '7' };
    else if (dificuldade === 'dificil') palavrasConfig = { qtd: '8 a 12', tamanho: '14' };

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'dummy_key_for_build',
    });

    if (tipoAtividade === 'caca_palavras' || tipoAtividade === 'forca') {
      const isForca = tipoAtividade === 'forca';
      const randomSeed = Math.floor(Math.random() * 1000000);
      const prompt = isForca 
        ? `[SEED: ${randomSeed}] Gere uma lista de 5 palavras INCOMUNS e DIFERENTES, sem acentos ou caracteres especiais, relacionadas ao tema "${tema}" para um jogo de Forca. Não repita palavras clichês. Considere o nível de dificuldade como: ${dificuldade.toUpperCase()}. Retorne APENAS um JSON contendo um array de strings chamado "palavras".`
        : `[SEED: ${randomSeed}] Gere uma lista de ${palavrasConfig.qtd} palavras curtas, simples, CRIATIVAS E VARIADAS (sem acentos ou caracteres especiais) relacionadas ao tema "${tema}". 
As palavras devem ter no máximo ${palavrasConfig.tamanho} letras cada. Considere o nível de dificuldade como: ${dificuldade.toUpperCase()}. Evite respostas muito óbvias ou comuns.
Retorne APENAS um JSON válido contendo um array de strings chamado "palavras". Exemplo: {"palavras": ["GATO", "CACHORRO", "VACA"]}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', temperature: 0.7 }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("A resposta da IA veio vazia.");
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanJson);
      const palavras = result.palavras || [];

      if (isForca) {
        return NextResponse.json({ tipo: 'forca', tema, palavras });
      } else {
        const { grid, placements } = generateWordSearch(palavras, tamanhoGrid);
        return NextResponse.json({ tipo: 'caca_palavras', tema, palavras, grid, placements });
      }
    } 
    else if (tipoAtividade === 'labirinto') {
      const randomSeed = Math.floor(Math.random() * 1000000);
      const prompt = `[SEED: ${randomSeed}] Sugira dois emojis CRIATIVOS, DIFERENTES E POUCO ÓBVIOS que representem o tema "${tema}" para serem o ponto de partida e o objetivo de um labirinto.
Evite usar sempre os mesmos emojis para este tema. Explore variações divertidas!
Exemplo para "Astronauta": {"inicio": "👨‍🚀", "fim": "🚀"}
Retorne APENAS um JSON válido.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', temperature: 0.8 }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("A resposta da IA veio vazia.");
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanJson);
      const inicio = result.inicio || '🏁';
      const fim = result.fim || '🏆';
      const mazeGrid = generateMaze(tamanhoGrid, tamanhoGrid);

      return NextResponse.json({ tipo: 'labirinto', tema, inicio, fim, mazeGrid });
    }
    else if (tipoAtividade === 'memoria') {
      const numPares = 8;
      const randomSeed = Math.floor(Math.random() * 1000000);
      const prompt = `[SEED: ${randomSeed}] Sugira uma lista com EXATAMENTE ${numPares} emojis diferentes, altamente VARIADOS E CRIATIVOS, relacionados ao tema "${tema}". 
Evite emojis genéricos ou clichês; misture elementos divertidos do tema.
Retorne APENAS um JSON válido contendo um array de strings (emojis) chamado "emojis". 
Exemplo para "Animais": {"emojis": ["🐶", "🐱", "🐰", "🦊", "🐻", "🐼", "🦁", "🐯"]}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', temperature: 0.8 }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("A resposta da IA veio vazia.");
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanJson);
      
      // Duplicate and shuffle for memory game
      let emojis = result.emojis || ["⭐", "🌟", "✨", "💫", "🎯", "🎲", "🎮", "🎨"];
      // Ensure we have exactly 8
      while(emojis.length < 8) emojis.push("❓");
      emojis = emojis.slice(0, 8);
      
      const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

      return NextResponse.json({ tipo: 'memoria', tema, cards });
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
