import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function GET(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    // Fallback para mock se não tiver chave (ambiente de build/teste)
    const { gerarAtividadeDiariaMock } = await import('@/lib/mock-llm');
    const atividade = await gerarAtividadeDiariaMock();
    return NextResponse.json(atividade, { status: 200 });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const randomSeed = Math.floor(Math.random() * 1000000);
    const tipos = ['desafio', 'quebra-cabeca', 'curiosidade'];
    const temas = ['espaço', 'animais', 'matemática divertida', 'dinossauros', 'fundo do mar', 'história', 'corpo humano', 'invenções', 'plantas', 'robôs', 'natureza'];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const tema = temas[Math.floor(Math.random() * temas.length)];

    const prompt = `[SEED: ${randomSeed}] Gere UMA atividade educativa curta, SUPER CRIATIVA e DIFERENTE (nunca repita as clássicas) para crianças (7 a 10 anos). 
Tema sorteado para hoje: "${tema}". O foco sugerido: "${tipo}".
A atividade deve ser do tipo 'desafio' (matemática ou lógica rápida), 'quebra-cabeca' (charada ou enigma) ou 'curiosidade' (ciências ou fatos históricos do tema).
O conteúdo precisa ser divertido e fácil de ler.

Retorne APENAS um JSON válido seguindo exatamente esta estrutura:
{
  "titulo": "Título divertido com emoji",
  "descricao": "Uma frase curta motivacional",
  "tipo": "desafio" | "quebra-cabeca" | "curiosidade",
  "conteudo": "A pergunta, o problema matemático ou o enigma em si",
  "opcoes": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
  "respostaCorreta": "O texto exato de uma das opções acima",
  "resposta": "Explicação curta e animada revelando por que está certo",
  "dica": "Uma dica legal que ajude a criança sem dar a resposta direta"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json', temperature: 0.95 }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("A resposta da IA veio vazia.");
    
    const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanJson);
    
    // Assegura que o id seja sempre gerado
    result.id = `daily-${Date.now()}-${randomSeed}`;

    // Normaliza o tipo caso o LLM mande errado
    if (!['desafio', 'quebra-cabeca', 'curiosidade'].includes(result.tipo)) {
       result.tipo = 'curiosidade';
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Erro ao gerar atividade diária com IA:', error);
    // Em caso de falha de rede ou timeout na IA, retorna o mock
    const { gerarAtividadeDiariaMock } = await import('@/lib/mock-llm');
    const atividade = await gerarAtividadeDiariaMock();
    return NextResponse.json(atividade, { status: 200 });
  }
}
