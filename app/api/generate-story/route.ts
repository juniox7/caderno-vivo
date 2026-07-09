import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { checkAndIncrementQuota } from '@/lib/quota';
import { z } from 'zod';
import { applyRateLimit } from '@/lib/rate-limit';

const storySchema = z.object({
  nomes: z.array(z.string()).optional(),
  idade: z.union([z.string(), z.number()]).optional(),
  focosSelecionados: z.array(z.object({
    id: z.string(),
    label: z.string(),
    qtd: z.number()
  })).optional(),
  interesse1: z.string().optional(),
  interesse2: z.string().optional(),
  formatoResposta: z.string().optional(),
  promptLivre: z.string().optional(),
  nivel: z.string().optional()
}).catchall(z.any());

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 500 });
  }

  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimitResponse = applyRateLimit(ip, 5, 60000);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json();
    const parsed = storySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos", details: parsed.error.issues }, { status: 400 });
    }

    const { nomes, idade, focosSelecionados, interesse1, interesse2, formatoResposta, promptLivre, nivel } = parsed.data;

    const quota = await checkAndIncrementQuota('texto');
    if (!quota.allowed) {
      return NextResponse.json({ error: quota.error }, { status: quota.status });
    }

    // Configuração dos nomes
    const hasNomes = Array.isArray(nomes) && nomes.length > 0;
    const personagensContexto = hasNomes 
      ? `Insira os seguintes personagens como protagonistas: ${nomes.join(', ')}`
      : 'Crie personagens inventados e divertidos para protagonizar a história.';
    
    const regrasPersonagens = hasNomes
      ? `1. A atividade é estrelada por: ${nomes.join(', ')} (idade base: ${idade} anos).`
      : `1. A atividade é para crianças de ${idade} anos. Invente personagens novos e aleatórios.`;

    const listaFocos = focosSelecionados ? focosSelecionados.map(f => f.label).join(', ') : 'Livre';
    const focosTextoInstrucao = focosSelecionados 
      ? focosSelecionados.map(f => `- ${f.qtd} questões de ${f.label}`).join('\n')
      : '';

    // ===== MODO SEM PERGUNTA (Apenas História) =====
    if (formatoResposta === 'sem_pergunta') {
      const storyPrompt = `
Você é um especialista em educação infantil e um excelente contador de histórias.
Crie uma história infantil longa, encantadora e envolvente.
Retorne EXATAMENTE e APENAS um objeto JSON com o seguinte formato, sem formatação markdown:
{
  "titulo": "Título divertido da história (com emoji)",
  "subtitulo": "Uma frase mágica sobre a história",
  "atividades": [
    {
      "tipo": "História",
      "enunciado": "A HISTÓRIA COMPLETA aqui. Deve ter no mínimo 10 parágrafos, ser envolvente, com começo, meio e fim. Inclua diálogos e reviravoltas.",
      "questoes": []
    }
  ],
  "criadoEm": "${new Date().toISOString()}"
}

Regras:
${regrasPersonagens}
2. O tema principal abordará elementos de: ${listaFocos}.
3. O(s) interesse(s) são: ${interesse1} e ${interesse2}.
4. NÃO inclua perguntas. O campo "questoes" deve ser um array VAZIO [].
5. A história deve ser longa, rica em detalhes, com personagens cativantes e uma moral no final.
6. ${personagensContexto}
7. O nível de dificuldade geral (vocabulário e complexidade) deve ser: ${nivel ? nivel.toUpperCase() : 'MEDIO'}.
${promptLivre ? `8. INSTRUÇÕES ESPECIAIS: ${promptLivre}` : ''}
      `;

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY || 'dummy_key_for_build',
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: storyPrompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const resultText = response.text;
      if (!resultText) throw new Error("No response from AI");

      const cleanJson = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const jsonResult = JSON.parse(cleanJson);

      return NextResponse.json({ atividade: jsonResult });
    }

    // ===== MODO COM PERGUNTAS (Escrita ou Múltipla Escolha) =====
    const formatoInstrucao = formatoResposta === 'multipla_escolha'
      ? `IMPORTANTE: Cada questão DEVE ter um campo "opcoes" com exatamente 4 alternativas (A, B, C, D) e um campo "respostaCorreta" com o texto exato da opção correta. Exemplo: "opcoes": ["Opção A", "Opção B", "Opção C", "Opção D"], "respostaCorreta": "Opção B"`
      : `As questões devem ser de resposta escrita/livre (sem campo "opcoes").`;
    
    let basePrompt = `
Você é um especialista em educação infantil. Crie uma atividade lúdica e multidisciplinar.
A estrutura será "estilo prova": Uma única história longa de introdução no primeiro bloco, e depois as perguntas divididas por matérias.

Retorne EXATAMENTE e APENAS um objeto JSON com o seguinte formato, sem formatação markdown:
{
  "titulo": "Título divertido (com emoji)",
  "subtitulo": "Subtítulo amigável mencionando a idade",
  "atividades": [
    {
      "tipo": "História Introdutória",
      "enunciado": "CRIE A HISTÓRIA COMPLETA AQUI. Mínimo de 3 parágrafos. Use os personagens e os interesses para contar uma história envolvente.",
      "questoes": []
    },
    {
      "tipo": "Nome da Matéria (Ex: Matemática)",
      "enunciado": "Responda as questões de Matemática abaixo com base na história:",
      "questoes": [
        {
          "pergunta": "A pergunta em si",
          "resposta": "A resposta correta esperada",
          "dica": "Uma dica super gentil"${formatoResposta === 'multipla_escolha' ? `,
          "opcoes": ["Opção A", "Opção B", "Opção C", "Opção D"],
          "respostaCorreta": "Texto exato da opção correta"` : ''}
        }
      ]
    }
  ],
  "criadoEm": "${new Date().toISOString()}"
}

Regras:
${regrasPersonagens}
2. As matérias e a distribuição de perguntas DEVEM ser exatamente:
${focosTextoInstrucao}
Crie um bloco de "atividade" separado para CADA matéria solicitada acima (além do bloco inicial da História).
3. O(s) interesse(s) são: ${interesse1} e ${interesse2}.
4. Se a matéria for Matemática, as perguntas devem ser cálculos adequados para a idade. Se for Interpretação/Português, as perguntas devem ser sobre o texto.
5. O nível de dificuldade geral (vocabulário e complexidade das perguntas) deve ser: ${nivel ? nivel.toUpperCase() : 'MEDIO'}.
6. ${formatoInstrucao}
${promptLivre ? `7. INSTRUÇÕES ESPECIAIS DA MÃE/PROFESSOR: ${promptLivre}` : ''}
    `;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'dummy_key_for_build',
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: basePrompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from AI");
    }

    const cleanJson = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const jsonResult = JSON.parse(cleanJson);

    return NextResponse.json({ atividade: jsonResult });
  } catch (error) {
    console.error('Erro na geração da atividade:', error);
    return NextResponse.json({ error: 'Falha ao gerar atividade' }, { status: 500 });
  }
}
