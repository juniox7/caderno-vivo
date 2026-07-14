import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode';

// Usamos global para evitar recriar a instância no hot-reload do Next.js
declare global {
  var whatsappClient: Client | undefined;
  var whatsappStatus: string;
  var whatsappQR: string | null;
}

if (!global.whatsappStatus) {
  global.whatsappStatus = 'disconnected';
  global.whatsappQR = null;
}

export const getWhatsAppClient = () => {
  if (global.whatsappClient) {
    return global.whatsappClient;
  }

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'robo-prospeccao' }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
    }
  });

  client.on('qr', async (qr) => {
    console.log('QR Code recebido!');
    global.whatsappStatus = 'qr';
    global.whatsappQR = await qrcode.toDataURL(qr);
  });

  client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
    global.whatsappStatus = 'ready';
    global.whatsappQR = null;
  });

  client.on('authenticated', () => {
    console.log('WhatsApp Authenticated!');
    global.whatsappStatus = 'authenticated';
  });

  client.on('auth_failure', msg => {
    console.error('WhatsApp Authentication failure', msg);
    global.whatsappStatus = 'error';
  });

  client.on('disconnected', (reason) => {
    console.log('WhatsApp Client was disconnected', reason);
    global.whatsappStatus = 'disconnected';
    global.whatsappClient = undefined;
  });

  console.log('Iniciando cliente WhatsApp...');
  client.initialize().catch(err => {
    console.error('Erro ao inicializar o WhatsApp:', err);
    global.whatsappStatus = 'error';
  });
  global.whatsappClient = client;

  return client;
};

export const getStatus = () => {
  return {
    status: global.whatsappStatus,
    qr: global.whatsappQR
  };
};

export const sendWhatsAppMessage = async (phone: string, message: string) => {
  if (!global.whatsappClient || global.whatsappStatus !== 'ready') {
    throw new Error('WhatsApp não está conectado');
  }
  
  // O formato do número no whatsapp-web.js precisa terminar em @c.us
  // Ex: 5511999999999@c.us
  // Aqui removemos espaços, parênteses e traços
  let formattedPhone = phone.replace(/\D/g, '');
  
  if (!formattedPhone.startsWith('55')) {
     formattedPhone = '55' + formattedPhone;
  }
  
  // Verifica se o número tem WhatsApp ativo (isso previne o erro "No LID for user")
  const numberDetails = await global.whatsappClient.getNumberId(formattedPhone);
  
  if (!numberDetails) {
    throw new Error(`O número ${formattedPhone} não possui WhatsApp ou é inválido.`);
  }
  
  await global.whatsappClient.sendMessage(numberDetails._serialized, message);
  return { success: true };
};
