import { NextResponse } from 'next/server';
import { getWhatsAppClient, getStatus } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Inicia o cliente se ele não estiver rodando
    getWhatsAppClient();
    
    const status = getStatus();
    
    return NextResponse.json(status);
  } catch (error: any) {
    console.error('Error on WhatsApp status API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
