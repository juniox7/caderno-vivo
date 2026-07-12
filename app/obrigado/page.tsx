'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ObrigadoPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Dispara confetes de comemoração!
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#f59e0b', '#10b981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#f59e0b', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-[#0f172a] text-surface-800 dark:text-surface-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-400/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl bg-white dark:bg-surface-100 border border-surface-200 shadow-2xl rounded-3xl p-8 md:p-12 z-10 relative text-center">
        
        {/* Ícone principal */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-200">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-surface-800 mb-4" style={{ fontFamily: 'var(--font-baloo)' }}>
          Pagamento Aprovado!
        </h1>
        
        <p className="text-lg text-surface-600 mb-10 leading-relaxed">
          Sua assinatura do <strong className="text-primary-600">Caderno Vivo</strong> foi ativada com sucesso. Prepare-se para transformar o aprendizado do seu filho em pura diversão.
        </p>

        {/* Caixa de Instruções */}
        <div className="bg-amber-50 dark:bg-surface-50 border-2 border-amber-200 rounded-2xl p-6 mb-10 text-left relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-amber-200 opacity-30">
            <Sparkles className="w-32 h-32" />
          </div>
          
          <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2 relative z-10" style={{ fontFamily: 'var(--font-baloo)' }}>
            ⚠️ Muito Importante: Como acessar?
          </h2>
          
          <div className="space-y-4 relative z-10">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-400 text-amber-900 rounded-full flex items-center justify-center font-black">
                1
              </div>
              <p className="text-amber-900 font-medium pt-1">
                Clique no botão de acesso abaixo para entrar na plataforma.
              </p>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-400 text-amber-900 rounded-full flex items-center justify-center font-black">
                2
              </div>
              <p className="text-amber-900 font-medium pt-1">
                Se o sistema pedir para fazer Login ou Cadastro, <strong className="bg-amber-200 px-1 py-0.5 rounded">use exatamente o mesmo E-MAIL</strong> que você acabou de usar na compra da Kiwify.
              </p>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-400 text-amber-900 rounded-full flex items-center justify-center font-black">
                3
              </div>
              <p className="text-amber-900 font-medium pt-1">
                Seu plano será reconhecido automaticamente e todas as funcionalidades estarão liberadas!
              </p>
            </div>
          </div>
        </div>

        {/* Botão de Acesso */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-10 py-5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-2xl font-black text-xl shadow-xl shadow-primary-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <BookOpen className="w-6 h-6" />
          Acessar o Meu Caderno Vivo
          <ArrowRight className="w-6 h-6" />
        </Link>
        
        <p className="text-sm text-surface-400 mt-6">
          Se tiver qualquer problema no acesso, entre em contato com nosso suporte.
        </p>
      </div>
    </div>
  );
}
