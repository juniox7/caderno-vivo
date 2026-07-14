import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeWebsiteAndGenerateCopy(url: string, nicho: string, cidade: string) {
  let websiteText = "";
  try {
    if (url && url.startsWith('http')) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      const html = await res.text();
      // Regex simples para remover tags e extrair apenas o texto
      websiteText = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ').substring(0, 5000);
    }
  } catch (e) {
    console.error("Erro ao fazer scrape do site:", e);
  }

  const prompt = `
Você é um especialista em marketing digital, design e vendas.
Nicho da clínica/empresa: ${nicho}
Cidade: ${cidade}
Texto extraído do site atual (se existir): ${websiteText}

Tarefa:
1. Identifique até 2 pontos fracos graves do site atual baseado no texto (ou a ausência dele, ex: falta de site moderno).
2. Escreva uma 'copy_vendas' de 1 parágrafo persuasivo para colocar na Hero Section da nova Landing Page que vamos oferecer. A copy deve ser moderna e focar em conversão.
3. Sugira uma 'cor_primaria' em inglês (valores tailwind válidos: blue, emerald, rose, violet, amber, slate, teal, indigo) que combine perfeitamente com o nicho.

Retorne APENAS um JSON válido no seguinte formato exato (sem crases Markdown ao redor):
{
  "pontos_fracos": "1. Site antigo e lento...",
  "copy_vendas": "Transforme vidas e atraia mais clientes com um ambiente digital premium...",
  "cor_primaria": "blue"
}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = typeof response.text === 'function' ? response.text() : response.text;
    if (!text) throw new Error("Sem resposta");
    
    const jsonStr = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Erro no Gemini:", error);
    return {
      pontos_fracos: "Presença digital desatualizada e sem otimização para conversão de vendas.",
      copy_vendas: `Uma nova presença digital premium para sua empresa de ${nicho} em ${cidade}.`,
      cor_primaria: "blue"
    };
  }
}
