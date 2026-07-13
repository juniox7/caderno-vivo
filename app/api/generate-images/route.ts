import { NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

export async function POST(req: Request) {
  try {
    const { prompt, style } = await req.json();

    let finalPrompt = prompt;
    if (style === 'capa') {
       finalPrompt = `High quality children's book cover, 3d pixar style, colorful, vibrant, beautiful, magical, no text, about: ${prompt}`;
    } else if (style === 'colorir') {
       finalPrompt = `Black and white line art, coloring page for kids, thick clear outlines, white background, flat, no shading, cute, about: ${prompt}`;
    }

    const result = await fal.subscribe('fal-ai/flux/schnell', {
      input: {
        prompt: finalPrompt,
        image_size: style === 'capa' ? "portrait_4_3" : "square_hd",
        num_inference_steps: 4
      }
    });

    const url = Array.isArray(result.data?.images) && result.data.images.length > 0 
      ? result.data.images[0].url 
      : null;

    if (!url) {
      throw new Error('No image returned from Fal.ai');
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Fal.ai error:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
