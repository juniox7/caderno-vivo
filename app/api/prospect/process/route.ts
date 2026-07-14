import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { Resend } from 'resend';
import { analyzeWebsiteAndGenerateCopy } from '@/lib/analyzer';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const { clinicas, nicho, cidade } = await req.json();

    if (!Array.isArray(clinicas) || clinicas.length === 0) {
      return NextResponse.json({ error: 'Nenhuma clínica enviada' }, { status: 400 });
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    // Inicia o processamento em background (fire-and-forget)
    processInBackground(clinicas, nicho, cidade, protocol, host).catch(console.error);

    // Retorna imediatamente para não travar a UI
    return NextResponse.json({ success: true, message: "Automação iniciada em segundo plano!" });
  } catch (error: any) {
    console.error('Erro na requisição:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function processInBackground(clinicas: any[], nicho: string, cidade: string, protocol: string, host: string) {
  console.log(`Iniciando background worker para ${clinicas.length} clínicas...`);
  
  for (const clinica of clinicas) {
    try {
      let statusEnvio = 'processando';
      let mensagemErro = '';

      // 0. Anti-Repetição: Verificar se já prospectamos
      if (clinica.fone) {
        const { data: existente } = await supabase
          .from('prospeccoes')
          .select('id')
          .eq('telefone', clinica.fone)
          .maybeSingle();

        if (existente) {
          console.log(`[${clinica.nome}] Pulando: Clínica já prospectada anteriormente.`);
          continue; // Pula para a próxima clínica
        }
      }

      // 1. Analisar com IA
      console.log(`[${clinica.nome}] Analisando site com IA...`);
      const analise = await analyzeWebsiteAndGenerateCopy(clinica.site, nicho, cidade);

      // 2. Salvar no Supabase (Agora com os campos da IA e Foto)
      const { data: dbData, error: dbError } = await supabase
        .from('prospeccoes')
        .insert({
          nicho,
          cidade,
          nome_clinica: clinica.nome,
          telefone: clinica.fone,
          email: clinica.email,
          site_atual: clinica.site,
          status_envio: statusEnvio,
          cor_primaria: analise.cor_primaria,
          copy_vendas: analise.copy_vendas,
          pontos_fracos: analise.pontos_fracos,
          foto_url: clinica.foto_url
        })
        .select()
        .single();

      if (dbError || !dbData) {
        console.error(`[${clinica.nome}] Erro BD:`, dbError);
        continue;
      }

      const propostaUrl = `${protocol}://${host}/proposta/${dbData.id}`;
      
      const textoMensagem = `Olá, equipe da ${clinica.nome}!\n\nDei uma olhada na presença digital de vocês. Usando inteligência artificial, identificamos as seguintes falhas que podem estar fazendo vocês perderem clientes para a concorrência:\n\n*Pontos Fracos Encontrados:*\n${analise.pontos_fracos}\n\nPara mostrar como podemos resolver isso hoje mesmo, minha equipe gerou uma *prévia de um novo site Premium* com tecnologia de conversão para vocês.\n\nVeja a amostra aqui: ${propostaUrl}\n\nPodemos colocar esse portal no ar, com seus serviços e WhatsApp, por apenas R$ 300 (pagamento único). O que acham?`;

      // 3. WhatsApp
      if (clinica.fone) {
        try {
          await sendWhatsAppMessage(clinica.fone, textoMensagem);
          statusEnvio = 'enviado';
        } catch (waErr: any) {
          mensagemErro = `Zap Erro: ${waErr.message}`;
          statusEnvio = 'falha_whatsapp';
        }
      }

      // 4. Email (Opcional, caso não tenha Zap ou como reforço)
      if (resend && clinica.email && clinica.email.includes('@')) {
        try {
          await resend.emails.send({
            from: 'Proposta <onboarding@resend.dev>', // Modifique para seu domínio
            to: clinica.email,
            subject: `Oportunidades de crescimento para ${clinica.nome}`,
            html: `<p>Olá equipe da <strong>${clinica.nome}</strong>!</p><p>Avaliamos sua presença online e encontramos alguns gargalos que prejudicam suas vendas:</p><p><em>${analise.pontos_fracos}</em></p><p>Criamos uma prévia de um novo portal moderno para vocês. Veja a amostra: <br><br><a href="${propostaUrl}">${propostaUrl}</a></p><p>Podemos colocá-lo no ar e resolver os problemas de conversão por apenas R$ 300. Responda este email se tiver interesse!</p>`
          });
          if (statusEnvio !== 'enviado') statusEnvio = 'enviado_email';
        } catch (emailErr: any) {
           if (!mensagemErro) mensagemErro = `Email Erro: ${emailErr.message}`;
        }
      }

      // 5. Atualizar Status Final
      await supabase
        .from('prospeccoes')
        .update({ status_envio: statusEnvio, mensagem_erro: mensagemErro })
        .eq('id', dbData.id);

      console.log(`[${clinica.nome}] Finalizado com status: ${statusEnvio}`);
      
      // Delay Inteligente Anti-Bloqueio (entre 15 e 35 segundos)
      const delayMs = Math.floor(Math.random() * (35000 - 15000 + 1)) + 15000;
      console.log(`Aguardando ${Math.round(delayMs/1000)}s antes da próxima...`);
      await new Promise(r => setTimeout(r, delayMs));
      
    } catch (err) {
      console.error(`Erro crítico na clínica ${clinica.nome}:`, err);
    }
  }
}

