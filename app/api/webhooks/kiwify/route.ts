import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { createHash } from 'crypto';

// Mapeamento de product_id da Kiwify para o tier do plano no Clerk
// Você precisará preencher esses IDs com os IDs reais dos seus produtos na Kiwify
const PRODUCT_PLAN_MAP: Record<string, string> = {
  // Exemplo: 'kiwify_product_id_aqui': 'BASIC',
  // Preencha com os IDs reais dos produtos
};

/**
 * Verifica a assinatura do webhook da Kiwify.
 * 
 * A Kiwify usa Ed25519 para assinar os webhooks.
 * Headers enviados:
 *   - x-kiwify-digital-signature: assinatura base64url (sem padding)
 *   - x-kiwify-timestamp: timestamp unix em milissegundos
 * 
 * Mensagem para verificar: `{url_path}:POST:{raw_body}:{timestamp}`
 * 
 * Para uma implementação simplificada (MVP), usamos validação por token secreto.
 * Em produção, implemente a verificação Ed25519 completa.
 */
function verifyWebhookSignature(
  body: string,
  signature: string | null,
  timestamp: string | null,
  secret: string
): boolean {
  if (!signature || !timestamp) return false;

  // Verificação simplificada via HMAC com o webhook secret
  // Rejeitar timestamps mais antigos que 5 minutos
  const now = Date.now();
  const ts = parseInt(timestamp, 10);
  if (Math.abs(now - ts) > 5 * 60 * 1000) {
    console.warn('[KIWIFY_WEBHOOK] Timestamp expirado:', { now, ts });
    return false;
  }

  // Verificação com HMAC-SHA256 usando o secret configurado
  const message = `${body}:${timestamp}`;
  const expectedSignature = createHash('sha256')
    .update(`${message}:${secret}`)
    .digest('hex');

  return signature === expectedSignature;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-kiwify-digital-signature');
  const timestamp = req.headers.get('x-kiwify-timestamp');
  const webhookSecret = process.env.KIWIFY_WEBHOOK_SECRET;

  // ===== VALIDAÇÃO DE SEGURANÇA =====
  // Em modo desenvolvimento, podemos pular a validação se não houver secret configurado
  if (webhookSecret) {
    const isValid = verifyWebhookSignature(body, signature, timestamp, webhookSecret);
    if (!isValid) {
      console.error('[KIWIFY_WEBHOOK] Assinatura inválida');
      return new NextResponse('Assinatura inválida', { status: 401 });
    }
  } else {
    console.warn('[KIWIFY_WEBHOOK] ⚠️ KIWIFY_WEBHOOK_SECRET não configurado. Pulando verificação de assinatura.');
  }

  // ===== PROCESSAR EVENTO =====
  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return new NextResponse('JSON inválido', { status: 400 });
  }

  console.log('[KIWIFY_WEBHOOK] Evento recebido:', event.type, event.id);

  // Eventos que nos interessam para assinatura:
  // - order_status === 'approved' ou 'paid'
  const eventStatus = event.order_status || event.status || event.type;
  
  if (eventStatus === 'approved' || eventStatus === 'paid' || eventStatus === 'order_approved') {
    // A Kiwify normalmente envia os dados na raiz do JSON, mas alguns formatos vêm dentro de 'data'
    const data = event.data || event;

    if (!data) {
      console.error('[KIWIFY_WEBHOOK] Payload sem campo data');
      return new NextResponse('Payload inválido', { status: 400 });
    }

    // Extrair o userId do parâmetro de rastreamento (src)
    const trackingParams = data.TrackingParameters || data.tracking_parameters || data.trackingParameters || {};
    let userId = trackingParams.src;
    
    const client = await clerkClient();

    if (!userId) {
      console.warn('[KIWIFY_WEBHOOK] userId (src) não encontrado. Tentando buscar pelo email...');
      const customerEmail = data.customer?.email || data.Customer?.email || data.email;
      
      if (customerEmail) {
        try {
          const users = await client.users.getUserList({ emailAddress: [customerEmail] });
          if (users.data && users.data.length > 0) {
            userId = users.data[0].id;
            console.log(`[KIWIFY_WEBHOOK] Usuário encontrado pelo email: ${userId}`);
          }
        } catch (searchError) {
          console.error('[KIWIFY_WEBHOOK] Erro ao buscar usuário pelo email:', searchError);
        }
      }

      if (!userId) {
        console.error('[KIWIFY_WEBHOOK] Não foi possível identificar o usuário (sem src e email não encontrado no Clerk).', { email: customerEmail });
        return new NextResponse('userId não encontrado e email não correspondente', { status: 400 });
      }
    }

    // Determinar o plano baseado no product_id
    const productId = data.product_id || data.Product?.id || '';
    const productName = (data.product_name || data.Product?.name || '').toLowerCase();

    // Tentar mapear pelo ID primeiro, depois pelo nome do produto
    let planTier = PRODUCT_PLAN_MAP[productId];

    if (!planTier) {
      // Fallback: tentar identificar pelo nome do produto
      if (productName.includes('turbo') || productName.includes('anual')) {
        planTier = 'TURBO';
      } else if (productName.includes('premium')) {
        planTier = 'PREMIUM';
      } else if (productName.includes('basic') || productName.includes('básico')) {
        planTier = 'BASIC';
      } else {
        // Se não conseguir mapear, usa BASIC como fallback seguro
        console.warn('[KIWIFY_WEBHOOK] Não foi possível mapear o produto ao plano. Usando BASIC como fallback.', {
          productId,
          productName,
        });
        planTier = 'BASIC';
      }
    }

    console.log('[KIWIFY_WEBHOOK] Atualizando usuário:', { userId, planTier, productId });

    try {
      const client = await clerkClient();

      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          plan_tier: planTier,
          kiwify_order_id: data.order_id || data.id,
          kiwify_product_id: productId,
          kiwify_customer_email: data.customer?.email || data.Customer?.email || data.email || '',
          kiwify_updated_at: new Date().toISOString(),
        },
      });

      console.log('[KIWIFY_WEBHOOK] ✅ Usuário atualizado com sucesso:', userId, planTier);
    } catch (clerkError) {
      console.error('[KIWIFY_WEBHOOK] Erro ao atualizar Clerk:', clerkError);
      return new NextResponse('Erro ao atualizar usuário', { status: 500 });
    }
  } else {
    console.log('[KIWIFY_WEBHOOK] Evento ignorado (status não aprovado):', eventStatus);
  }

  return new NextResponse(null, { status: 200 });
}
