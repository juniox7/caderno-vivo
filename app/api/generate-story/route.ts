import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { checkAndIncrementQuota } from '@/lib/quota';


export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 500 });
  }

  try {
    const quota = await checkAndIncrementQuota('texto');
    if (!quota.allowed) {
      return NextResponse.json({ error: quota.error }, { status: quota.status });
    }

    const dados = await req.json();
    const { nomes, idade, focoPedagogico, interesse1, interesse2, qtdQuestoes, formatoResposta, promptLivre } = dados;

    const limit = qtdQuestoes ? qtdQuestoes : 5;
    
    // Configuração dos nomes
    const hasNomes = Array.isArray(nomes) && nomes.length > 0;
    const personagensContexto = hasNomes 
      ? `Insira os seguintes personagens como protagonistas: ${nomes.join(', ')}`
      : 'Crie personagens inventados e divertidos para protagonizar a história.';
    
    const regrasPersonagens = hasNomes
      ? `1. A atividade é estrelada por: ${nomes.join(', ')} (idade base: ${idade} anos).`
      : `1. A atividade é para crianças de ${idade} anos. Invente personagens novos e aleatórios.`;

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
      "tipo": "historia",
      "enunciado": "A HISTÓRIA COMPLETA aqui. Deve ter no mínimo 10 parágrafos, ser envolvente, com começo, meio e fim. Inclua diálogos e reviravoltas.",
      "questoes": []
    }
  ],
  "criadoEm": "${new Date().toISOString()}"
}

Regras:
${regrasPersonagens}
2. O tema/foco é: ${focoPedagogico}.
3. O(s) interesse(s) são: ${interesse1} e ${interesse2}.
4. NÃO inclua perguntas. O campo "questoes" deve ser um array VAZIO [].
5. A história deve ser longa, rica em detalhes, com personagens cativantes e uma moral no final.
6. ${personagensContexto}
${promptLivre ? `7. INSTRUÇÕES ESPECIAIS: ${promptLivre}` : ''}
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
    // Configuração do formato de resposta
    const formatoInstrucao = formatoResposta === 'multipla_escolha'
      ? `IMPORTANTE: Cada questão DEVE ter um campo "opcoes" com exatamente 4 alternativas (A, B, C, D) e um campo "respostaCorreta" com o texto exato da opção correta. Exemplo: "opcoes": ["Opção A", "Opção B", "Opção C", "Opção D"], "respostaCorreta": "Opção B"`
      : `As questões devem ser de resposta escrita/livre (sem campo "opcoes").`;
    
    let basePrompt = `
Você é um especialista em educação infantil. Crie uma atividade lúdica e personalizada.
Retorne EXATAMENTE e APENAS um objeto JSON com o seguinte formato, sem formatação markdown:
{
  "titulo": "Título divertido (com emoji)",
  "subtitulo": "Subtítulo amigável mencionando o foco e a idade",
  "atividades": [
    {
      "tipo": "O foco pedagógico (ex: matematica, leitura, etc)",
      "enunciado": "Um pequeno texto contextualizando o desafio. ${personagensContexto} Use os interesses (${interesse1}, ${interesse2}).",
      "questoes": [
        {
          "pergunta": "A pergunta em si (lógica, matemática ou interpretação)",
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
2. O foco pedagógico é: ${focoPedagogico}.
3. O(s) interesse(s) são: ${interesse1} e ${interesse2}.
4. Crie EXATAMENTE ${limit} questões.
5. Se for Matemática, as perguntas devem ser cálculos adequados para a idade.
6. Se for Interpretação/Leitura, o enunciado deve ser uma historinha (mínimo de 4 linhas) e as perguntas devem ser sobre o texto.
7. ${formatoInstrucao}
${promptLivre ? `8. INSTRUÇÕES ESPECIAIS DA MÃE/PROFESSOR: ${promptLivre}` : ''}
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

    // Limpa possíveis blocos markdown
    const cleanJson = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const jsonResult = JSON.parse(cleanJson);

    return NextResponse.json({ atividade: jsonResult });
  } catch (error) {
    console.error('Erro na geração da atividade:', error);
    return NextResponse.json({ error: 'Falha ao gerar atividade' }, { status: 500 });
  }
}

