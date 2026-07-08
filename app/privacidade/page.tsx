import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Privacidade() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-surface-100 dark:text-surface-800 p-8 rounded-2xl shadow-sm border border-surface-200">
          <h1 className="text-3xl font-extrabold text-surface-800 mb-6" style={{ fontFamily: 'var(--font-baloo)' }}>Política de Privacidade</h1>
          
          <div className="space-y-6 text-surface-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-surface-800 mb-2">1. Coleta de Dados</h2>
              <p>Para fornecer atividades personalizadas, solicitamos informações como nomes e interesses das crianças. Esses dados são utilizados estritamente para a geração do conteúdo pela Inteligência Artificial e não são vendidos ou compartilhados com terceiros para fins publicitários.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-surface-800 mb-2">2. Armazenamento Seguro</h2>
              <p>O histórico de atividades geradas e o progresso da gamificação são armazenados de forma segura vinculados à sua conta (via Clerk Auth). Protegemos seus dados utilizando padrões modernos de criptografia em trânsito e em repouso.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-surface-800 mb-2">3. Uso da Inteligência Artificial</h2>
              <p>Os prompts gerados pelos usuários são processados por APIs de Inteligência Artificial (Google e Parceiros). Não retemos direitos sobre as criações processadas, e as interações seguem as políticas de privacidade de dados rigorosas dos provedores de IA.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-surface-800 mb-2">4. Exclusão de Conta</h2>
              <p>Você tem o direito de solicitar a exclusão de sua conta e de todos os dados gerados (histórico, PDFs e pontuações) a qualquer momento. Basta entrar em contato com o suporte ou usar o painel da conta.</p>
            </section>

            <p className="text-sm text-surface-400 pt-8">Última atualização: Julho de 2026</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
