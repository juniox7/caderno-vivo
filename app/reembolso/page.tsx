import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Reembolso() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-surface-100 dark:text-surface-800 p-8 rounded-2xl shadow-sm border border-surface-200">
          <h1 className="text-3xl font-extrabold text-surface-800 mb-6" style={{ fontFamily: 'var(--font-baloo)' }}>Política de Reembolso</h1>
          
          <div className="space-y-6 text-surface-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-surface-800 mb-2">1. Prazo de Garantia</h2>
              <p>O Caderno Vivo atua em conformidade com o Código de Defesa do Consumidor e com as políticas das nossas plataformas parceiras de pagamento (Kiwify). Todos os nossos produtos digitais possuem uma garantia incondicional de 7 (sete) dias corridos a partir da data de confirmação da compra.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-surface-800 mb-2">2. Como Solicitar</h2>
              <p>Caso o produto não atenda às suas expectativas, você pode solicitar o reembolso total diretamente pelo painel do cliente na plataforma de pagamento ou enviando um e-mail para o nosso suporte oficial. A solicitação deve ocorrer dentro do prazo legal mencionado acima.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-surface-800 mb-2">3. Cancelamento de Assinaturas</h2>
              <p>Se você for assinante de um plano recorrente (mensal ou anual), poderá cancelar a renovação da sua assinatura a qualquer momento. O cancelamento impede cobranças futuras, mas não reembolsa retroativamente meses já utilizados.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-surface-800 mb-2">4. Acesso Pós-Reembolso</h2>
              <p>Ao aprovar a solicitação de reembolso, o seu acesso ao material digital, sistema de Inteligência Artificial e bônus será imediatamente revogado de forma automática pelo sistema.</p>
            </section>

            <p className="text-sm text-surface-400 pt-8">Última atualização: Julho de 2026</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
