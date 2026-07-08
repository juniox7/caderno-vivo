import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Termos() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-surface-100 dark:text-surface-800 p-8 rounded-2xl shadow-sm border border-surface-200">
          <h1 className="text-3xl font-extrabold text-surface-800 mb-6" style={{ fontFamily: 'var(--font-baloo)' }}>Termos de Uso</h1>
          
          <div className="space-y-6 text-surface-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-surface-800 mb-2">1. Aceitação dos Termos</h2>
              <p>Ao acessar e usar o CadernoVivo.com, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concorda com alguma parte destes termos, não deve usar nossos serviços.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-surface-800 mb-2">2. Geração de Conteúdo por IA</h2>
              <p>O CadernoVivo utiliza Inteligência Artificial avançada para gerar atividades, textos e imagens. Reconhecemos que, embora nos esforcemos para garantir a qualidade educacional, a IA pode ocasionalmente produzir resultados inesperados. O usuário é responsável por revisar as atividades antes de entregá-las a crianças.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-surface-800 mb-2">3. Direitos Autorais</h2>
              <p>Você detém os direitos de uso comercial e pessoal de todas as atividades (PDFs, Histórias, Imagens) que você gerar utilizando a sua cota paga dentro do CadernoVivo. No entanto, não é permitido revender o acesso direto à plataforma.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-surface-800 mb-2">4. Assinaturas e Reembolsos</h2>
              <p>Trabalhamos com assinaturas mensais e pacotes através de plataformas parceiras (Kiwify/Stripe). Você pode cancelar a qualquer momento. Em caso de insatisfação, respeitamos o prazo de garantia estabelecido por lei e pela plataforma de pagamento.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-surface-800 mb-2">5. Isenção de Responsabilidade</h2>
              <p>A plataforma é fornecida "como está". Não garantimos disponibilidade 100% ininterrupta devido a dependências de APIs terceirizadas de Inteligência Artificial.</p>
            </section>

            <p className="text-sm text-surface-400 pt-8">Última atualização: Julho de 2026</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
