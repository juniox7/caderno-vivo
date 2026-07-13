import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, MessageCircle, MapPin } from 'lucide-react';

export default function Contato() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-surface-100 dark:text-surface-800 p-8 rounded-2xl shadow-sm border border-surface-200">
          <h1 className="text-3xl font-extrabold text-surface-800 mb-2" style={{ fontFamily: 'var(--font-baloo)' }}>Contato e Suporte</h1>
          <p className="text-surface-600 mb-8">Estamos aqui para ajudar! Escolha um dos canais abaixo para falar com a nossa equipe.</p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-surface-50 dark:bg-[#1e293b] rounded-xl border border-surface-100 dark:border-surface-700">
              <Mail className="w-8 h-8 text-primary-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-surface-800">E-mail Oficial</h3>
                <p className="text-surface-600 mt-1 mb-2">Para dúvidas sobre produtos, reembolsos ou parcerias.</p>
                <a href="mailto:suporte@cadernovivo.com" className="text-primary-600 font-semibold hover:underline">suporte@cadernovivo.com</a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-surface-50 dark:bg-[#1e293b] rounded-xl border border-surface-100 dark:border-surface-700">
              <MessageCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-surface-800">WhatsApp de Atendimento</h3>
                <p className="text-surface-600 mt-1 mb-2">Apenas para clientes e suporte técnico rápido.</p>
                <span className="text-green-600 font-semibold">(Disponibilizado após a compra)</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-surface-50 dark:bg-[#1e293b] rounded-xl border border-surface-100 dark:border-surface-700">
              <MapPin className="w-8 h-8 text-surface-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-surface-800">Informações Corporativas</h3>
                <p className="text-surface-600 mt-1">Caderno Vivo Educação Digital Ltda.<br />CNPJ: 00.000.000/0000-00 (Exemplo)</p>
              </div>
            </div>
            
            <p className="text-sm text-surface-400 pt-8 text-center">Nosso tempo médio de resposta é de 24 horas úteis.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
