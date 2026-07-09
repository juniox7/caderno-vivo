import { NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { checkAndIncrementQuota } from '@/lib/quota';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { applyRateLimit } from '@/lib/rate-limit';

const imageSchema = z.object({
  interesse1: z.string().optional(),
  interesse2: z.string().optional(),
  estiloImagem: z.string().optional(),
  promptLivre: z.string().optional()
}).catchall(z.any());

export async function POST(req: Request) {
  if (!process.env.FAL_KEY) {
    return NextResponse.json({ error: 'FAL_KEY não configurada' }, { status: 500 });
  }

  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimitResponse = applyRateLimit(ip, 5, 60000);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json();
    const parsed = imageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos", details: parsed.error.issues }, { status: 400 });
    }

    const { interesse1, interesse2, estiloImagem, promptLivre } = parsed.data;

    const quota = await checkAndIncrementQuota('imagem');

    // Traduz e Otimiza o prompt com Gemini
    const systemInstruction = `You are an expert prompt engineer for Stable Diffusion/Flux. 
    Translate the given concepts into a highly descriptive English image prompt.
    Return ONLY the prompt string, nothing else.`;
    
    let userContext = promptLivre 
      ? `The user provided the following specific instruction for the image: "${promptLivre}". Ensure the prompt focuses entirely on this instruction.`
      : `The image should feature: ${interesse1} and ${interesse2}.`;

    let basePrompt = '';
    if (estiloImagem === 'ilustracao') {
      basePrompt = `Create an English prompt for a beautiful, colorful, full color children's book illustration.
      ${userContext}
      Add these keywords at the end: vibrant colors, cute cartoon style, highly detailed, children's book illustration, white background.`;
    } else {
      basePrompt = `Create an English prompt for a kids coloring book page.
      ${userContext}
      Add these keywords at the end: line art, strictly black and white, no shading, thick lines, coloring book style for kids, simple details, white background, highly detailed outlines.`;
    }

    let optimizedPrompt = basePrompt;
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY || 'dummy_key_for_build',
      });

      const geminiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemInstruction}\n\n${basePrompt}`,
      });
      if (geminiResponse.text) {
        optimizedPrompt = geminiResponse.text;
      }
    } catch (e: any) {
      console.warn("Gemini limit reached for image translation. Using basePrompt fallback:", e.message);
    }

    console.log('Optimized Prompt for Fal:', optimizedPrompt);

    const result: any = await fal.subscribe('fal-ai/flux/schnell', {
      input: {
        prompt: optimizedPrompt,
        image_size: 'landscape_4_3',
        num_inference_steps: 4,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('Gerando imagem com fal.ai...');
        }
      },
    });

    if (result.data && result.data.images && result.data.images.length > 0) {
      return NextResponse.json({ imageUrl: result.data.images[0].url });
    } else if (result.images && result.images.length > 0) { // Fallback just in case
      return NextResponse.json({ imageUrl: result.images[0].url });
    } else {
      throw new Error("Nenhuma imagem retornada da API. Resultado: " + JSON.stringify(result));
    }
  } catch (error) {
    console.error('Erro na geração da imagem:', error);
    return NextResponse.json({ error: 'Falha ao gerar imagem' }, { status: 500 });
  }
}
