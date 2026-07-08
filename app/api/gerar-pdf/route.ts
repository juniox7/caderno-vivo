import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { CadernoPDF } from '@/lib/pdf-generator';
import { AtividadeGerada } from '@/lib/types';
import React from 'react';

// Generates a random alphanumeric code
function generateSecretCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: Request) {
  try {
    const { atividade } = await req.json() as { atividade: AtividadeGerada };

    if (!atividade || !atividade.titulo) {
      return NextResponse.json({ error: 'Atividade inválida' }, { status: 400 });
    }

    // Generate secret code for the Phygital crossover
    const secretCode = generateSecretCode();
    
    // In a real DB, we would save this code:
    // await db.secretCodes.create({ code: secretCode, activityId: ... })

    // Render the React PDF component to a Node stream
    const stream = await renderToStream(
      React.createElement(CadernoPDF, { atividade, secretCode }) as any
    );

    // Convert Node stream to Web ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => {
          controller.enqueue(new Uint8Array(chunk));
        });
        stream.on('end', () => {
          controller.close();
        });
        stream.on('error', (err) => {
          controller.error(err);
        });
      },
    });

    const filename = `CadernoVivo_${atividade.titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return NextResponse.json({ error: 'Falha ao gerar o PDF' }, { status: 500 });
  }
}
