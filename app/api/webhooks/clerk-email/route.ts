import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getWelcomeEmailHtml } from '@/lib/email-templates';
import { headers } from 'next/headers';

// Evita crash no build se a variável não estiver presente (Next.js avalia arquivos no build)
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const headersList = await headers();
    
    // Clerk Webhook Verification (Optional but recommended for production)
    // const svix_id = headersList.get("svix-id");
    // const svix_timestamp = headersList.get("svix-timestamp");
    // const svix_signature = headersList.get("svix-signature");
    // if (!svix_id || !svix_timestamp || !svix_signature) {
    //   return new Response('Error occured -- no svix headers', { status: 400 });
    // }

    const eventType = payload.type;
    
    // Dispara o e-mail apenas quando uma nova conta for criada
    if (eventType === 'user.created') {
      const emailAddress = payload.data.email_addresses?.[0]?.email_address;
      const firstName = payload.data.first_name || 'Fazendeiro(a)';
      
      if (emailAddress) {
        // Envia o e-mail de Boas-Vindas usando Resend
        const data = await resend.emails.send({
          from: 'CadernoVivo <onboarding@resend.dev>', // Use onboarding@resend.dev para testes gratuitos
          to: [emailAddress],
          subject: 'Seja Bem-vindo(a) ao CadernoVivo! 🌱',
          html: getWelcomeEmailHtml(firstName),
        });
        
        console.log('E-mail enviado via Resend:', data);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Erro no webhook de email do Clerk:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
