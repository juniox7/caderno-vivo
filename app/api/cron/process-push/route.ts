import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import webpush from 'web-push';

// Configuration
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@cadernovivo.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

// MENSAGENS POR SEGMENTO
const TEXTS = {
  S1_G1: { id: 's1_g1', title: 'CadernoVivo', body: 'Faltam só 2 passos pra você ver a primeira atividade com o nome do seu filho. Quer terminar agora?' },
  S1_G2: { id: 's1_g2', title: 'CadernoVivo', body: 'Sua primeira atividade personalizada ainda tá esperando. Leva menos de 1 minuto pra criar.' },
  S2_G1: { id: 's2_g1', title: 'CadernoVivo', body: 'Lembra como foi rápido criar a primeira atividade? Hoje é dia de fazer de novo.' },
  S2_G2_DEFAULT: { id: 's2_g2_default', title: 'CadernoVivo', body: 'Seu filho já esqueceu a última atividade? A próxima leva menos de 1 minuto pra ficar pronta.' },
  S3: [
    { id: 's3_1', title: 'Hora da Atividade!', body: 'Sua fazendinha tá esperando mais uma sementinha.' },
    { id: 's3_2', title: 'Desafio Novo!', body: 'Seu filho topa um desafio novo hoje? Leva menos de 1 minuto pra criar.' },
    { id: 's3_3', title: 'Ofensiva Ativa!', body: 'Sua ofensiva tá em {{OFENSIVA}} dias. Não deixa cair hoje.' }
  ],
  S4_G1: { id: 's4_g1', title: 'CadernoVivo', body: 'Sentimos sua falta! Que tal criar uma atividade nova pro seu filho hoje, sem gastar nada?' },
  S4_G2: { id: 's4_g2', title: 'Novidades!', body: 'Adicionamos coisas novas desde sua última visita. Vem ver o que mudou.' }
};

export async function GET(req: Request) {
  // Em produção, proteger esta rota verificando um token Cron Secret.
  
  try {
    const client = await clerkClient();
    let users = await client.users.getUserList({ limit: 500 });
    let sentCount = 0;
    const now = Date.now();
    const todayStr = new Date().toISOString().split('T')[0];

    for (const user of users.data) {
      const privateMeta: any = user.privateMetadata || {};
      const pushSub = privateMeta.pushSubscription;
      let pushState = privateMeta.pushState || {};
      
      if (!pushSub) continue;

      // Trava 1: Se ignorou 3 vezes seguidas, suspende envios diários e move pro cadência de dormente longo.
      if (pushState.consecutiveIgnores >= 3) {
         pushState.frequencyReduced = true;
      }

      // Trava 2: Nunca mais de 1 notificação por dia
      if (pushState.lastNotificationSentAt) {
        const lastSentDate = new Date(pushState.lastNotificationSentAt).toISOString().split('T')[0];
        if (lastSentDate === todayStr) {
          continue; // Já enviou hoje
        }
      }

      // Analisa estado de uso do usuário
      const createdAt = user.createdAt;
      const stats = privateMeta.gamificacao?.historicoGeral || { totalAtividades: 0, ultimaAtividade: null };
      const ofensiva = privateMeta.gamificacao?.ofensivaAtual || 0;
      const totalActivities = stats.totalAtividades;
      
      const lastActivityDate = stats.ultimaAtividade ? new Date(stats.ultimaAtividade).getTime() : 0;
      
      const hoursSinceReg = (now - createdAt) / (1000 * 60 * 60);
      const daysSinceLastActivity = lastActivityDate ? (now - lastActivityDate) / (1000 * 60 * 60 * 24) : 0;

      let notificationToSend = null;

      // Classifica no Segmento apropriado
      if (totalActivities === 0) {
        // SEGMENTO 10.1
        if (pushState.frequencyReduced) {
            // Silenciado se ignorou demais
        } else if (hoursSinceReg >= 2 && hoursSinceReg < 24 && pushState.lastTextSent !== TEXTS.S1_G1.id) {
          notificationToSend = TEXTS.S1_G1;
        } else if (hoursSinceReg >= 24 && hoursSinceReg < 48 && pushState.lastTextSent !== TEXTS.S1_G2.id) {
          notificationToSend = TEXTS.S1_G2;
        }
      } else if (totalActivities === 1) {
        // SEGMENTO 10.2
        if (daysSinceLastActivity >= 1 && daysSinceLastActivity < 2 && pushState.lastTextSent !== TEXTS.S2_G1.id) {
          notificationToSend = TEXTS.S2_G1;
        } else if (daysSinceLastActivity >= 3 && daysSinceLastActivity < 4 && pushState.lastTextSent !== TEXTS.S2_G2_DEFAULT.id) {
          // Fallback, como não salvamos o nome da criança globalmente ainda, usamos o default.
          notificationToSend = TEXTS.S2_G2_DEFAULT;
        }
      } else if (totalActivities >= 2 && totalActivities <= 5) {
        // SEGMENTO 10.3
        // Verifica timezone para enviar entre 17h e 20h
        const tz = privateMeta.pushTimezone || 'America/Sao_Paulo';
        const userHour = parseInt(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: tz }).format(new Date()));
        
        if (userHour >= 17 && userHour < 20) {
          // Pega um que seja diferente do lastTextSent
          const available = TEXTS.S3.filter(t => t.id !== pushState.lastTextSent);
          const picked = available[Math.floor(Math.random() * available.length)];
          
          if (picked) {
             notificationToSend = {
                ...picked,
                body: picked.body.replace('{{OFENSIVA}}', ofensiva.toString())
             };
          }
        }
      } else if (totalActivities > 0 && daysSinceLastActivity >= 5) {
        // SEGMENTO 10.4
        if (daysSinceLastActivity >= 5 && daysSinceLastActivity < 7 && pushState.lastTextSent !== TEXTS.S4_G1.id) {
          notificationToSend = TEXTS.S4_G1;
        } else if (daysSinceLastActivity >= 19 && daysSinceLastActivity < 21 && pushState.lastTextSent !== TEXTS.S4_G2.id) {
           // Gatilho 2 é 2 semanas após o gatilho 1 (que foi com 5 dias). 5 + 14 = 19 dias.
          notificationToSend = TEXTS.S4_G2;
        }
      }

      // Dispara a Notificação se houver uma qualificada
      if (notificationToSend) {
        try {
          await webpush.sendNotification(pushSub, JSON.stringify(notificationToSend));
          
          pushState.lastNotificationSentAt = new Date().toISOString();
          pushState.lastTextSent = notificationToSend.id;
          pushState.consecutiveIgnores = (pushState.consecutiveIgnores || 0) + 1;

          await client.users.updateUserMetadata(user.id, {
            privateMetadata: {
              ...privateMeta,
              pushState
            }
          });

          sentCount++;
        } catch (e: any) {
          if (e.statusCode === 410 || e.statusCode === 404) {
            // Subscription expired or unsubscribed
            await client.users.updateUserMetadata(user.id, {
              privateMetadata: {
                ...privateMeta,
                pushSubscription: null
              }
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true, processed: users.data.length, sent: sentCount });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
