import Link from 'next/link';
import { Sparkles, Brain, Pencil, Heart, ArrowRight, CheckCircle2, Shield, Star, Rocket } from 'lucide-react';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 dark:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100">
      
      {/* Navbar LP */}
      <nav className="glass sticky top-0 z-50 px-6 py-4 border-b border-surface-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-200">
              <Pencil className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-baloo)' }}>
              CadernoVivo
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-bold text-surface-600 hover:text-primary-600 transition-colors">
              Entrar
            </Link>
            <Link href="/sign-up" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-95">
              Começar Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-300/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-700 font-bold text-sm mb-8">
            <Sparkles className="w-4 h-4 text-amber-500" />
            A Magia do Aprendizado Personalizado
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-surface-800 tracking-tight leading-tight mb-6" style={{ fontFamily: 'var(--font-baloo)' }}>
            Transforme qualquer interesse em <span className="bg-gradient-to-r from-primary-500 to-fuchsia-500 bg-clip-text text-transparent">educação</span>
          </h1>
          
          <p className="text-lg md:text-xl text-surface-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Gere atividades pedagógicas instantâneas baseadas no que o seu filho mais ama. De futebol a dinossauros, o aprendizado nunca foi tão divertido.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
              Criar Primeira Atividade
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-24 px-6 bg-white dark:bg-surface-100 dark:text-surface-800 relative dark:bg-surface-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-surface-800" style={{ fontFamily: 'var(--font-baloo)' }}>
              Como Funciona o CadernoVivo?
            </h2>
            <p className="text-surface-500 mt-4 text-lg">Três passos simples para a diversão</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 rounded-3xl p-8 border border-surface-200 text-center relative hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-amber-100 rounded-2xl flex items-center justify-center mb-6 rotate-3">
                <Heart className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-surface-800 mb-4" style={{ fontFamily: 'var(--font-baloo)' }}>1. Diga o que eles amam</h3>
              <p className="text-surface-600">Escreva o tema favorito da criança. Espaço, princesas, esportes ou games!</p>
            </div>

            <div className="bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 rounded-3xl p-8 border border-surface-200 text-center relative hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-6 -rotate-3">
                <Brain className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-surface-800 mb-4" style={{ fontFamily: 'var(--font-baloo)' }}>2. A IA faz a mágica</h3>
              <p className="text-surface-600">Nossa Inteligência Artificial cria questões lúdicas e educativas focadas no tema.</p>
            </div>

            <div className="bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 rounded-3xl p-8 border border-surface-200 text-center relative hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 rotate-3">
                <Sparkles className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-surface-800 mb-4" style={{ fontFamily: 'var(--font-baloo)' }}>3. Imprima ou Resolva</h3>
              <p className="text-surface-600">Baixe o PDF lindamente formatado ou deixe a criança resolver na própria tela.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Preços */}
      <section className="py-24 px-6 relative bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100" id="pricing">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-surface-800 mb-4" style={{ fontFamily: 'var(--font-baloo)' }}>
              Escolha o plano ideal para a diversão
            </h2>
            <p className="text-surface-500 text-lg">Cancele quando quiser. Sem taxas escondidas.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            
            {/* Plano Sementinha */}
            <div className="bg-white dark:bg-surface-100 dark:text-surface-800 rounded-3xl p-8 border border-surface-200 shadow-sm relative dark:bg-surface-100">
              <h3 className="text-2xl font-bold text-surface-800 mb-2" style={{ fontFamily: 'var(--font-baloo)' }}>Plano Sementinha</h3>
              <p className="text-surface-500 text-sm mb-6">Para quem quer conhecer a mágica do CadernoVivo.</p>
              
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-surface-800">Grátis</span>
                <span className="text-surface-500"> /sempre</span>
              </div>

              <Link href="/sign-up" className="w-full block text-center py-3.5 px-6 rounded-xl border-2 border-primary-200 text-primary-600 font-bold hover:bg-primary-50 transition-colors mb-8">
                Começar Gratuitamente
              </Link>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-surface-600 text-sm">5 atividades personalizadas por mês.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-surface-600 text-sm">Acesso ao "Modo Predefinido".</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-surface-600 text-sm">Check-in diário na Fazendinha.</span>
                </div>
                <div className="flex items-start gap-3 opacity-50">
                  <X className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="text-surface-600 text-sm">Sem ilustrações geradas por IA.</span>
                </div>
                <div className="flex items-start gap-3 opacity-50">
                  <X className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="text-surface-600 text-sm">Loja da Fazendinha bloqueada.</span>
                </div>
              </div>
            </div>

            {/* Plano Aventureiro (Destaque) */}
            <div className="bg-gradient-to-b from-primary-600 to-primary-800 rounded-3xl p-8 border border-primary-500 shadow-2xl relative transform lg:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                <Star className="w-4 h-4" /> Mais Popular
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-baloo)' }}>Plano Aventureiro</h3>
              <p className="text-primary-200 text-sm mb-6">Para crianças que querem criar todos os dias!</p>
              
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-white">R$ 19,90</span>
                <span className="text-primary-200"> /mês</span>
              </div>

              <Link href="/sign-up" className="w-full block text-center py-3.5 px-6 rounded-xl bg-white dark:bg-surface-100 dark:text-surface-800 text-primary-700 font-extrabold hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 transition-colors mb-8 shadow-lg">
                Assinar Plano Mensal
              </Link>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-white text-sm">30 atividades personalizadas por mês.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-white text-sm">Acesso total ao "Modo Livre".</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-white text-sm">Desenhos para Colorir (IA).</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-white text-sm">Loja da Fazendinha Liberada!</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-white text-sm">Suporte prioritário.</span>
                </div>
              </div>
            </div>

            {/* Plano Família Premium */}
            <div className="bg-white dark:bg-surface-100 dark:text-surface-800 rounded-3xl p-8 border border-surface-200 shadow-sm relative overflow-hidden dark:bg-surface-100">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-8 py-1 rotate-45 translate-x-8 translate-y-4 text-xs font-bold shadow-md">
                ECONOMIA
              </div>

              <h3 className="text-2xl font-bold text-surface-800 mb-2" style={{ fontFamily: 'var(--font-baloo)' }}>Família Premium</h3>
              <p className="text-surface-500 text-sm mb-6">Acesso total para pais e professores.</p>
              
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-surface-800">R$ 97</span>
                <span className="text-surface-500"> /semestral</span>
              </div>
              <p className="text-xs text-surface-400 mb-6 line-through">De R$ 119,40 no mensal</p>

              <Link href="/sign-up" className="w-full block text-center py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 font-extrabold hover:from-amber-300 hover:to-amber-400 transition-colors mb-8 shadow-lg flex items-center justify-center gap-2">
                <Rocket className="w-5 h-5" />
                Quero com Desconto
              </Link>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-surface-600 text-sm font-bold">100 atividades por mês!</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-surface-600 text-sm">Tudo do Plano Aventureiro.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-surface-600 text-sm">Modo Professor liberado (turmas inteiras).</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-surface-600 text-sm font-bold text-amber-600">Bônus: 1000 Sementes Iniciais!</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}