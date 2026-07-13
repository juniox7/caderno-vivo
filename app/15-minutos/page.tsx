import React from 'react';
import Link from 'next/link';
import { CheckCircle2, MonitorOff, Printer, Clock, Sparkles, Brain, Heart, ArrowRight, ShieldCheck, Gamepad2, Puzzle, BookOpen } from 'lucide-react';

export default function LandingPage15Minutos() {
  const KIWIFY_CHECKOUT_URL = "#"; // Substituir pelo link real do checkout depois

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-purple-200">
      
      {/* HEADER / HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-900 to-purple-800 text-white pt-16 pb-24 px-6">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-700/50 border border-purple-500/30 text-purple-200 text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Lançamento Especial: Kit Educativo para Famílias
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Liberte seu filho das telas com apenas <span className="text-yellow-400">15 minutos</span> de brincadeira por dia!
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Um kit prático com 30 atividades que não exigem impressora. Focado em ajudar na alfabetização enquanto cria uma conexão real e divertida entre vocês.
          </p>

          <Link href={KIWIFY_CHECKOUT_URL}>
            <button className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-green-500 hover:bg-green-400 text-white text-xl font-bold rounded-full shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all hover:scale-105 active:scale-95">
              Quero o Kit por apenas R$ 9,99
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <p className="mt-4 text-sm text-purple-300 opacity-80 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Pagamento 100% Seguro via Kiwify
          </p>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12">
            Você sente que o celular está <span className="text-red-500 underline decoration-red-200 underline-offset-4">roubando</span> a infância do seu filho?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                <MonitorOff className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Excesso de Telas</h3>
              <p className="text-slate-600 leading-relaxed">O TikTok e o YouTube oferecem dopamina rápida, dificultando a concentração da criança em atividades reais.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Atraso na Leitura</h3>
              <p className="text-slate-600 leading-relaxed">Sem estímulos práticos no dia a dia, a criança pode apresentar dificuldades e frustrações na escola.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Falta de Tempo</h3>
              <p className="text-slate-600 leading-relaxed">A rotina é corrida. Pais exaustos não têm tempo de planejar brincadeiras educativas do zero todo dia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE SOLUTION SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              A solução não é proibir, é <span className="text-teal-500">substituir com qualidade.</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              O <strong>Kit 15 Minutos Sem Tela</strong> foi desenhado para famílias reais. Você não precisa ser professor para aplicar, basta seguir as nossas instruções curtas e brincar junto!
            </p>
            
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-teal-100 text-teal-600 rounded-full">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800">Sem Impressora</h4>
                  <p className="text-slate-600">Esqueça a papelada. As atividades usam objetos da sua própria casa, lápis e papel comum.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-teal-100 text-teal-600 rounded-full">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800">Apenas 15 Minutos</h4>
                  <p className="text-slate-600">O foco é consistência, não exaustão. Pare antes da criança se cansar.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex-1 w-full bg-slate-100 rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden border border-slate-200">
             <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 to-teal-50 opacity-50"></div>
             {/* Simulação visual do Ebook */}
             <div className="w-3/4 h-5/6 bg-white shadow-2xl rounded-lg border border-slate-200 flex flex-col z-10 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="h-40 bg-teal-500 rounded-t-lg p-6 flex flex-col justify-end">
                   <h3 className="text-white font-bold text-2xl">15 MINUTOS<br/>SEM TELA</h3>
                   <p className="text-teal-100 text-sm mt-2">Kit de Atividades para Famílias</p>
                </div>
                <div className="p-6 flex-1 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-80">
                   <div className="w-full h-4 bg-slate-100 rounded mb-4"></div>
                   <div className="w-3/4 h-4 bg-slate-100 rounded mb-4"></div>
                   <div className="w-5/6 h-4 bg-slate-100 rounded mb-10"></div>
                   
                   <div className="flex justify-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center font-bold text-purple-700">A</div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center font-bold text-purple-700">M</div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center font-bold text-purple-700">O</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET SECTION */}
      <section className="py-24 px-6 bg-slate-900 text-white relative">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
            <svg className="relative block w-full h-12" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
            </svg>
        </div>
        
        <div className="max-w-5xl mx-auto mt-12">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">O que tem dentro do Kit?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-purple-500 transition-colors">
              <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                <Gamepad2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Nível 1: Letras e Sons</h3>
              <p className="text-slate-400">10 brincadeiras (ex: Caça à Letra, Bingo, Letra Misteriosa) para a criança começar a reconhecer formas e sons iniciais pelo ambiente.</p>
            </div>
            
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-teal-500 transition-colors">
              <div className="w-14 h-14 bg-teal-500/20 text-teal-400 rounded-2xl flex items-center justify-center mb-6">
                <Puzzle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Nível 2: Sílabas</h3>
              <p className="text-slate-400">10 brincadeiras (ex: Trem das Sílabas, Batalha de Rimas, Roleta) para juntar partes sonoras e construir as primeiras palavras.</p>
            </div>

            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-yellow-500 transition-colors">
              <div className="w-14 h-14 bg-yellow-500/20 text-yellow-400 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Nível 3: Leitura</h3>
              <p className="text-slate-400">10 brincadeiras (ex: Bilhete Secreto, Caça ao Tesouro) para crianças lerem instruções curtas com compreensão real e prática.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING & GUARANTEE SECTION */}
      <section className="py-24 px-6 bg-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-100 flex flex-col md:flex-row">
            
            <div className="flex-1 p-10 md:p-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Comece hoje mesmo!</h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Acesso imediato ao PDF completo</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>30 Atividades Exclusivas</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Bônus: Cartões e Cartelas para Recortar</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Certificado de Curiosidade para a criança</span>
                </li>
              </ul>
              
              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <ShieldCheck className="w-8 h-8 text-orange-500" />
                <div>
                  <h4 className="font-bold text-slate-800">Garantia de 7 Dias</h4>
                  <p className="text-sm text-slate-600">Risco zero. Se não gostar, devolvemos seu dinheiro.</p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-80 bg-purple-900 text-white p-10 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-50 -translate-y-10 translate-x-10"></div>
              
              <p className="text-purple-200 mb-2">Preço especial de lançamento</p>
              <div className="flex items-start justify-center gap-1 mb-8">
                <span className="text-2xl mt-2 font-bold text-purple-300">R$</span>
                <span className="text-7xl font-extrabold tracking-tighter">9<span className="text-5xl">,99</span></span>
              </div>
              
              <Link href={KIWIFY_CHECKOUT_URL} className="w-full">
                <button className="w-full py-4 bg-green-500 hover:bg-green-400 text-white font-bold text-lg rounded-xl shadow-[0_10px_20px_rgba(34,197,94,0.3)] transition-all hover:-translate-y-1">
                  Comprar Agora
                </button>
              </Link>
              <p className="text-xs text-purple-300 mt-4">Acesso vitalício ao arquivo</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center border-t border-slate-800">
        <p>© {new Date().getFullYear()} Caderno Vivo. Todos os direitos reservados.</p>
        <p className="text-sm mt-2 max-w-2xl mx-auto px-6 opacity-70">
          Este site não é afiliado ao Facebook ou a qualquer entidade do Facebook. 
          Depois que você sair do Facebook, a responsabilidade não é deles e sim do nosso site.
        </p>
      </footer>
    </div>
  );
}
