import Link from 'next/link';
import { Sparkles, Brain, Pencil, Heart, ArrowRight, CheckCircle2, Shield, Star, Rocket, Zap, X } from 'lucide-react';
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

          {/* Interactive Input */}
          <div className="max-w-xl mx-auto bg-white p-2 rounded-3xl shadow-xl shadow-primary-200/50 border border-surface-200 flex flex-col sm:flex-row items-center gap-2 transition-all focus-within:ring-4 focus-within:ring-primary-100 focus-within:border-primary-400">
            <div className="flex-1 flex items-center gap-3 px-4 w-full">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <input 
                type="text" 
                placeholder="O que seu filho mais gosta? (Ex: Dinossauros)"
                className="w-full bg-transparent border-none focus:ring-0 text-surface-700 placeholder:text-surface-400 py-3 font-medium text-lg outline-none"
              />
            </div>
            <Link href="/sign-up" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-bold text-lg rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap">
              Gerar Magia <Sparkles className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-surface-500 font-medium">
            <span>Mais de 10.000 atividades geradas</span>
            <span className="w-1.5 h-1.5 rounded-full bg-surface-300" />
            <Link href="/amostra" className="text-primary-600 hover:underline">Ver exemplo de PDF</Link>
          </div>
        </div>
      </section>

      {/* Dor vs Solução */}
      <section className="py-20 px-6 bg-surface-100 dark:bg-[#1e293b]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-surface-800" style={{ fontFamily: 'var(--font-baloo)' }}>
                Tirar a criança da tela <span className="text-red-500">não precisa ser uma guerra.</span>
              </h2>
              <p className="text-lg text-surface-600 leading-relaxed">
                Sabemos como é frustrante ver o YouTube e os joguinhos dominando a rotina. Mas e se você usasse exatamente o que eles amam na tela, para trazê-los para o papel?
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-red-100 p-1 rounded-full"><X className="w-4 h-4 text-red-600" /></div>
                  <span className="text-surface-700">Brigar para fazer o dever de casa genérico da escola.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-emerald-100 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
                  <span className="text-surface-700 font-bold">Imprimir uma missão matemática sobre o Homem-Aranha que ele faz sorrindo.</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-fuchsia-500 rounded-3xl transform rotate-3 opacity-20 blur-xl"></div>
              <div className="bg-white dark:bg-surface-50 p-8 rounded-3xl border border-surface-200 shadow-xl relative z-10 transform -rotate-2 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-surface-800">O Segredo do CadernoVivo</h4>
                    <p className="text-sm text-surface-500">Hiper-personalização instantânea</p>
                  </div>
                </div>
                <p className="text-surface-700 italic">
                  "Quando a criança percebe que o problema de matemática fala sobre o personagem favorito dela, o cérebro deixa de ver como 'obrigação' e passa a ver como 'brincadeira'."
                </p>
              </div>
            </div>
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

      {/* Testimonials */}
      <section className="py-24 px-6 bg-primary-50/50 dark:bg-[#1e293b]/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-surface-800" style={{ fontFamily: 'var(--font-baloo)' }}>
              Amado por pais e professores
            </h2>
            <p className="text-surface-500 mt-4 text-lg">Veja o que acontece quando o aprendizado vira mágica</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Mariana S.", role: "Mãe do Lucas (7 anos)", text: "O Lucas odeia matemática. Hoje imprimi um desafio sobre Minecraft usando o Caderno Vivo e ele resolveu 3 páginas sem reclamar. Mágico!" },
              { name: "Profª Helena", role: "Ensino Fundamental I", text: "Uso na sala de aula para alunos com dificuldade de atenção. Crio atividades com o tema que eles mais gostam e o foco deles vai a 100% na mesma hora." },
              { name: "Rafael C.", role: "Pai da Sofia (5 anos)", text: "Estou economizando muito dinheiro com livrinhos de colorir. Agora eu digito 'Princesas que andam de Skate' e a IA cria um livro novo inteiro em segundos." }
            ].map((dep, i) => (
              <div key={i} className="bg-white dark:bg-surface-50 p-6 rounded-3xl border border-surface-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-current" />)}
                </div>
                <p className="text-surface-700 mb-6 italic flex-1">"{dep.text}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-700">
                    {dep.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-surface-800 text-sm">{dep.name}</h4>
                    <p className="text-xs text-surface-500">{dep.role}</p>
                  </div>
                </div>
              </div>
            ))}
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

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 items-start max-w-7xl mx-auto">
            
            {/* Plano Sementinha */}
            <div className="bg-white dark:bg-surface-100 dark:text-surface-800 rounded-3xl p-6 border border-surface-200 shadow-sm relative h-full flex flex-col">
              <h3 className="text-xl font-bold text-surface-800 mb-2" style={{ fontFamily: 'var(--font-baloo)' }}>Sementinha</h3>
              <p className="text-surface-500 text-xs mb-6 flex-1">Para testar a mágica.</p>
              
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-surface-800">Grátis</span>
              </div>

              <Link href="/sign-up" className="w-full block text-center py-3 px-4 rounded-xl border-2 border-primary-200 text-primary-600 font-bold hover:bg-primary-50 transition-colors mb-6 text-sm">
                Começar
              </Link>

              <div className="space-y-3 mt-auto">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-surface-600 text-xs">5 atividades / mês</span>
                </div>
                <div className="flex items-start gap-2 opacity-50">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="text-surface-600 text-xs">Sem IA de Imagens</span>
                </div>
              </div>
            </div>

            {/* Plano Basic */}
            <div className="bg-white dark:bg-surface-100 dark:text-surface-800 rounded-3xl p-6 border-2 border-indigo-200 shadow-sm relative h-full flex flex-col">
              <h3 className="text-xl font-bold text-indigo-700 mb-2" style={{ fontFamily: 'var(--font-baloo)' }}>Basic</h3>
              <p className="text-surface-500 text-xs mb-6 flex-1">Ideal para a rotina.</p>
              
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-surface-800">R$ 27</span>
                <span className="text-surface-500 text-sm">/mês</span>
              </div>

              <Link href="/checkout-redirect?plan=BASIC" className="w-full block text-center py-3 px-4 rounded-xl bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-bold transition-colors mb-6 text-sm">
                Assinar Basic
              </Link>

              <div className="space-y-3 mt-auto">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-surface-600 text-xs font-medium">30 atividades / mês</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-surface-600 text-xs">Imagens Coloridas com IA</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 shrink-0 mt-0.5 text-xs">⚠️</span>
                  <span className="text-amber-700 font-semibold text-xs">Apenas 2 desenhos para colorir</span>
                </div>
              </div>
            </div>

            {/* Plano Premium (Destaque) */}
            <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-3xl p-6 border-2 border-amber-400 shadow-xl relative h-full flex flex-col transform xl:-translate-y-4">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 px-3 py-0.5 rounded-full text-[10px] font-black tracking-wider flex items-center gap-1 shadow-md uppercase">
                <Star className="w-3 h-3" /> Mais Popular
              </div>
              
              <h3 className="text-xl font-bold text-amber-700 mb-2" style={{ fontFamily: 'var(--font-baloo)' }}>Premium</h3>
              <p className="text-amber-800/70 text-xs mb-6 flex-1">Para diversão sem limites.</p>
              
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-amber-900">R$ 39</span>
                <span className="text-amber-700 text-sm">/mês</span>
              </div>

              <Link href="/checkout-redirect?plan=PREMIUM" className="w-full block text-center py-3 px-4 rounded-xl bg-amber-400 text-amber-900 hover:bg-amber-300 font-bold transition-colors mb-6 shadow-md text-sm">
                Assinar Premium
              </Link>

              <div className="space-y-3 mt-auto">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-amber-900 text-xs font-bold">100 atividades / mês <span className="font-normal opacity-70">(Fica R$0,39 cada)</span></span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-amber-900 text-xs">Imagens Coloridas com IA</span>
                </div>
                <div className="flex items-start gap-2 bg-amber-100/50 p-2 rounded-lg -ml-2 -mr-2">
                  <span className="shrink-0 text-sm">🔥</span>
                  <span className="text-amber-900 text-xs font-black uppercase tracking-wide">Desenhos para Colorir ILIMITADOS</span>
                </div>
              </div>
            </div>

            {/* Plano Turbo */}
            <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-3xl p-6 border-2 border-violet-300 shadow-sm relative h-full flex flex-col">
              <div className="absolute top-0 right-0 bg-violet-500 text-white px-6 py-1.5 rotate-45 translate-x-6 translate-y-3 text-[10px] font-black tracking-wider shadow-md">
                ILIMITADO
              </div>

              <h3 className="text-xl font-bold text-violet-700 mb-2" style={{ fontFamily: 'var(--font-baloo)' }}>Anual Ilimitado</h3>
              <p className="text-violet-600/70 text-xs mb-6 flex-1">1 ano inteiro de paz e silêncio.</p>
              
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-violet-900">R$ 147</span>
                <span className="text-violet-700 text-sm">/ano</span>
              </div>

              <Link href="/checkout-redirect?plan=TURBO" className="w-full block text-center py-3 px-4 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 font-bold transition-colors mb-6 shadow-md text-sm">
                Assinar Anual Ilimitado
              </Link>

              <div className="space-y-3 mt-auto">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                  <span className="text-violet-900 text-xs font-bold">Atividades Ilimitadas!</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                  <span className="text-violet-900 text-xs">Tudo do plano Premium</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                  <span className="text-violet-900 text-xs">Economize mais de 60%</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-white dark:bg-surface-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-surface-800" style={{ fontFamily: 'var(--font-baloo)' }}>
              Perguntas Frequentes
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Preciso ter uma impressora em casa?", a: "Não! Você pode gerar os PDFs e resolver direto no tablet ou celular de forma interativa, ou enviar para imprimir em uma papelaria." },
              { q: "Para qual idade o Caderno Vivo é recomendado?", a: "A inteligência artificial adapta as atividades para qualquer idade, mas o formato é ideal para crianças de 4 a 12 anos (Educação Infantil e Ensino Fundamental)." },
              { q: "Posso cancelar a assinatura quando quiser?", a: "Sim. Sem burocracia, sem multas e sem precisar ligar para ninguém. Você cancela com 1 clique direto no seu painel." },
              { q: "Quais temas eu posso escolher?", a: "Literalmente qualquer um! Peppa Pig, Roblox, Dinossauros Espaciais, Receitas de Bolo... A IA cria uma atividade pedagógica baseada no que você digitar." }
            ].map((faq, i) => (
              <details key={i} className="group bg-surface-50 dark:bg-[#0f172a] rounded-2xl border border-surface-200 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-surface-800 dark:text-surface-100">
                  {faq.q}
                  <span className="transition group-open:rotate-180 text-surface-400">
                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-surface-600 dark:text-surface-300 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
