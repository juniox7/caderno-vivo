import React from 'react';
import { Metadata } from 'next';
import { CheckCircle2, MonitorOff, Printer, Clock, Sparkles, Brain, Heart, ArrowRight, ShieldCheck, Gamepad2, Puzzle, BookOpen, ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
  title: "Kit 15 Minutos Sem Tela | Caderno Vivo",
  description: "30 brincadeiras rápidas para reduzir o tempo de tela e estimular letras, sílabas e leitura. Acesso imediato por R$ 9,99.",
  alternates: {
    canonical: "https://caderno-vivo.vercel.app/15-minutos",
  },
  openGraph: {
    title: "Kit 15 Minutos Sem Tela | Caderno Vivo",
    description: "30 brincadeiras rápidas para reduzir o tempo de tela e estimular letras, sílabas e leitura. Acesso imediato por R$ 9,99.",
    url: "https://caderno-vivo.vercel.app/15-minutos",
    images: [
      {
        url: "/images/og-15-minutos.jpg", // Placeholder for actual OG image
        width: 1200,
        height: 630,
        alt: "Capa do Kit 15 Minutos Sem Tela",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kit 15 Minutos Sem Tela | Caderno Vivo",
    description: "30 brincadeiras rápidas para reduzir o tempo de tela e estimular letras, sílabas e leitura. Acesso imediato por R$ 9,99.",
    images: ["/images/og-15-minutos.jpg"],
  }
};

const KIWIFY_CHECKOUT_URL = "https://pay.kiwify.com.br/rG3JQhV";

export default function LandingPage15Minutos() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-purple-200 pb-20 md:pb-0">
      
      {/* 1. PRIMEIRA DOBRA (HERO) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-900 to-purple-800 text-white pt-16 pb-24 px-6">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-700/50 border border-purple-500/30 text-purple-200 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Para famílias com crianças de 5 a 8 anos
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Troque 15 minutos de tela por uma brincadeira que estimula letras e palavras.
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Receba 30 atividades rápidas, divididas em três níveis e feitas com materiais que você já tem em casa. Sem precisar planejar e sem transformar o momento em uma aula cansativa.
          </p>

          <a 
            href={KIWIFY_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-green-500 hover:bg-green-400 text-white text-xl font-bold rounded-full shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
          >
            Quero receber o Kit por R$ 9,99
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="mt-4 text-sm text-purple-200 font-medium">
            Acesso imediato • 7 dias de garantia • Pagamento seguro
          </p>
        </div>
      </section>

      {/* 2. VEJA O QUE VOCÊ VAI RECEBER (GALERIA) */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Veja o que você vai receber
          </h2>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
            Brincadeiras simples, orientações rápidas e atividades organizadas para você abrir e começar.
          </p>

          {/* Galeria Responsiva */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="aspect-[3/4] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
              <img src="/images/preview-1.jpg" alt="Exemplo de Atividade de Letras e Sons: Caça à letra" className="object-cover w-full h-full" loading="lazy" />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 text-sm text-slate-500 font-medium opacity-0 hover:opacity-100 transition-opacity">Letras e Sons</div>
            </div>
            <div className="aspect-[3/4] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
              <img src="/images/preview-2.jpg" alt="Exemplo de Atividade: Letra misteriosa" className="object-cover w-full h-full" loading="lazy" />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 text-sm text-slate-500 font-medium opacity-0 hover:opacity-100 transition-opacity">Brincadeiras Práticas</div>
            </div>
            <div className="aspect-[3/4] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
              <img src="/images/preview-3.jpg" alt="Exemplo de Atividade de Sílabas: Complete a palavra" className="object-cover w-full h-full" loading="lazy" />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 text-sm text-slate-500 font-medium opacity-0 hover:opacity-100 transition-opacity">Sílabas</div>
            </div>
            <div className="aspect-[3/4] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
              <img src="/images/preview-4.jpg" alt="Exemplo dos Cartões de Letras Bônus" className="object-cover w-full h-full" loading="lazy" />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 text-sm text-slate-500 font-medium opacity-0 hover:opacity-100 transition-opacity">Cartões Bônus</div>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-6">*Imagens ilustrativas das páginas reais do E-book que você irá receber em PDF.</p>
        </div>
      </section>

      {/* 3. PROBLEMA (Abordagem Empática) */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
            Está difícil encontrar uma brincadeira que prenda a atenção tanto quanto o celular?
          </h2>
          <p className="text-lg text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Você não precisa proibir tudo nem planejar atividades complicadas. Precisa apenas ter a brincadeira certa pronta para começar.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                <MonitorOff className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Excesso de Telas</h3>
              <p className="text-slate-600 leading-relaxed">Vídeos rápidos prendem a atenção e dificultam o engajamento da criança em atividades reais do dia a dia.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Pouco interesse por letras e palavras</h3>
              <p className="text-slate-600 leading-relaxed">Sem estímulos práticos e divertidos, a alfabetização pode parecer apenas mais uma obrigação cansativa.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Falta de Tempo</h3>
              <p className="text-slate-600 leading-relaxed">A rotina é corrida. Pais exaustos não têm tempo de planejar e recortar brincadeiras educativas todo dia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MECANISMO DOS 15 MINUTOS */}
      <section className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Printer className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
            Sem impressora. Sem preparação longa.
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            <strong className="text-slate-800">30 atividades principais feitas com materiais de casa — sem impressora.</strong><br/> 
            Os cartões e o certificado são bônus imprimíveis opcionais.
          </p>
        </div>
      </section>

      {/* 5. OS TRÊS NÍVEIS */}
      <section className="py-24 px-6 bg-slate-900 text-white relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Os Três Níveis do Kit</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-purple-500 transition-colors">
              <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                <Gamepad2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Nível 1: Letras e Sons</h3>
              <p className="text-purple-300 text-sm font-semibold mb-4">10 atividades</p>
              <p className="text-slate-400">Brincadeiras para a criança começar a reconhecer formas e sons iniciais pelo ambiente (ex: Caça à Letra, Bingo).</p>
            </div>
            
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-teal-500 transition-colors">
              <div className="w-14 h-14 bg-teal-500/20 text-teal-400 rounded-2xl flex items-center justify-center mb-6">
                <Puzzle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Nível 2: Sílabas</h3>
              <p className="text-teal-300 text-sm font-semibold mb-4">10 atividades</p>
              <p className="text-slate-400">Brincadeiras focadas em juntar partes sonoras e construir as primeiras palavras (ex: Trem das Sílabas, Roleta).</p>
            </div>

            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-yellow-500 transition-colors">
              <div className="w-14 h-14 bg-yellow-500/20 text-yellow-400 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Nível 3: Leitura</h3>
              <p className="text-yellow-300 text-sm font-semibold mb-4">10 atividades</p>
              <p className="text-slate-400">Brincadeiras para crianças lerem pequenas instruções com compreensão real e prática (ex: Bilhete Secreto).</p>
            </div>
          </div>

          {/* 6. CTA INTERMEDIÁRIO */}
          <div className="text-center">
            <a 
              href={KIWIFY_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-green-500 hover:bg-green-400 text-white text-xl font-bold rounded-full transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
            >
              Quero as 30 atividades por R$ 9,99
            </a>
          </div>
        </div>
      </section>

      {/* 8. SEÇÃO DE CONFIANÇA */}
      <section className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-12">
            Feito para caber na rotina real da sua família
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <p className="text-slate-700">Atividades que duram aproximadamente 15 minutos.</p>
            </div>
            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <p className="text-slate-700">Orientações simples e diretas para os pais seguirem.</p>
            </div>
            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <p className="text-slate-700">Utiliza apenas materiais comuns encontrados em casa.</p>
            </div>
            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <p className="text-slate-700">Três níveis para acompanhar o momento exato da criança.</p>
            </div>
            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <p className="text-slate-700">Acesso imediato ao material digital após a compra.</p>
            </div>
            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <p className="text-slate-700">Possibilidade de repetir e adaptar as brincadeiras sempre.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. GARANTIA */}
      <section className="py-24 px-6 bg-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-100 flex flex-col md:flex-row">
            
            <div className="flex-1 p-10 md:p-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Garantia de Satisfação</h2>
              
              <div className="flex items-start gap-4 mb-6">
                <ShieldCheck className="w-10 h-10 text-orange-500 flex-shrink-0" />
                <p className="text-slate-700 leading-relaxed">
                  Você tem <strong>7 dias</strong> para conhecer o material. Se perceber que ele não faz sentido para sua família, solicite o reembolso dentro do prazo da garantia.
                </p>
              </div>
              <p className="text-sm text-slate-500">
                Compra protegida e entrega digital após a confirmação do pagamento.
              </p>
            </div>

            <div className="w-full md:w-80 bg-purple-900 text-white p-10 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-50 -translate-y-10 translate-x-10"></div>
              
              <p className="text-purple-200 mb-2 font-medium">Acesso Vitalício</p>
              <div className="flex items-start justify-center gap-1 mb-8">
                <span className="text-2xl mt-2 font-bold text-purple-300">R$</span>
                <span className="text-7xl font-extrabold tracking-tighter">9<span className="text-5xl">,99</span></span>
              </div>
              
              <a 
                href={KIWIFY_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <button className="w-full py-4 bg-green-500 hover:bg-green-400 text-white font-bold text-lg rounded-xl shadow-[0_10px_20px_rgba(34,197,94,0.3)] transition-all hover:-translate-y-1">
                  Quero receber agora
                </button>
              </a>
              <p className="text-xs text-purple-300 mt-4 leading-relaxed">
                Acesso imediato • Compra segura<br/>7 dias de garantia
              </p>
            </div>
            
          </div>
        </div>
      </section>

      {/* 11. FAQ */}
      <section className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            <details className="group bg-slate-50 border border-slate-200 rounded-xl p-6 open:bg-white open:ring-1 open:ring-purple-500/20 transition-all cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-slate-800 text-lg outline-none">
                Para qual idade o kit é indicado?
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                O Kit 15 Minutos Sem Tela foi desenvolvido principalmente para crianças de 5 a 8 anos. Como as atividades estão divididas em três níveis, os pais podem começar pelo estágio mais adequado para a criança.
              </p>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-xl p-6 open:bg-white open:ring-1 open:ring-purple-500/20 transition-all cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-slate-800 text-lg outline-none">
                Preciso de impressora?
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Não para as 30 atividades principais. Elas utilizam materiais simples encontrados em casa. Os cartões e o certificado são bônus imprimíveis opcionais.
              </p>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-xl p-6 open:bg-white open:ring-1 open:ring-purple-500/20 transition-all cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-slate-800 text-lg outline-none">
                Quais materiais vou precisar?
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Papel, lápis, objetos da casa e outros materiais simples. Cada atividade explica antecipadamente o que será necessário.
              </p>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-xl p-6 open:bg-white open:ring-1 open:ring-purple-500/20 transition-all cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-slate-800 text-lg outline-none">
                Como vou receber o material?
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Após a confirmação do pagamento, você receberá as orientações para acessar o material digital.
              </p>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-xl p-6 open:bg-white open:ring-1 open:ring-purple-500/20 transition-all cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-slate-800 text-lg outline-none">
                Posso usar com mais de um filho?
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Sim. Dentro da mesma família, você pode adaptar e repetir as atividades conforme a idade e o nível de cada criança.
              </p>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-xl p-6 open:bg-white open:ring-1 open:ring-purple-500/20 transition-all cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-slate-800 text-lg outline-none">
                Serve para crianças que ainda não leem?
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Sim. O primeiro nível trabalha letras e sons e foi pensado para crianças que estão começando o contato com a alfabetização.
              </p>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-xl p-6 open:bg-white open:ring-1 open:ring-purple-500/20 transition-all cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-slate-800 text-lg outline-none">
                É um curso?
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Não. É um kit digital de atividades práticas, acompanhado de orientações rápidas para os pais.
              </p>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-xl p-6 open:bg-white open:ring-1 open:ring-purple-500/20 transition-all cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-slate-800 text-lg outline-none">
                Como funciona a garantia?
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Você tem sete dias após a compra para conhecer o material e solicitar o reembolso, caso ele não faça sentido para sua família.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* 10. OFERTA FINAL */}
      <section className="py-24 px-6 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Comece hoje com uma brincadeira simples</h2>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed">
            Receba o Kit 15 Minutos Sem Tela e tenha sempre uma atividade rápida para substituir alguns minutos de celular por conexão, brincadeira e aprendizado.
          </p>
          <a 
            href={KIWIFY_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-green-500 hover:bg-green-400 text-white text-xl font-bold rounded-full transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
          >
            Quero receber agora por R$ 9,99
          </a>
          <p className="mt-6 text-sm text-slate-500 font-medium">
            Acesso imediato • Compra segura • 7 dias de garantia
          </p>
        </div>
      </section>

      {/* 13. RODAPÉ */}
      <footer className="bg-slate-950 text-slate-500 py-12 text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Política de Reembolso</a>
            <a href="#" className="hover:text-white transition-colors">Contato / Suporte</a>
          </div>
          <p className="mb-4">© {new Date().getFullYear()} Caderno Vivo. Todos os direitos reservados.</p>
          <p className="text-xs opacity-60 leading-relaxed max-w-2xl mx-auto">
            Este site não é afiliado ao Facebook ou a qualquer entidade do Facebook. 
            Depois que você sair do Facebook, a responsabilidade não é deles e sim do nosso site.
          </p>
        </div>
      </footer>

      {/* BARRA FIXA MOBILE (Apenas Mobile, aparece rolando a tela) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50">
        <a 
          href={KIWIFY_CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-3 bg-green-500 hover:bg-green-400 text-white font-bold text-lg rounded-xl shadow-sm transition-colors"
        >
          Receber o Kit — R$ 9,99
        </a>
      </div>

    </div>
  );
}
