'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X, Download, Trees } from 'lucide-react';
import { concluirOnboarding, getStats } from '@/lib/gamificacao';

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Dá um pequeno delay pra animação
    const timer = setTimeout(() => {
      const stats = getStats();
      if (!stats.onboardingCompleted) {
        setIsOpen(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      concluirOnboarding();
      setIsOpen(false);
    }
  };

  const steps = [
    {
      icon: <Sparkles className="w-12 h-12 text-primary-500 mb-4 mx-auto" />,
      title: 'Bem-vindo(a) ao Caderno Vivo!',
      desc: 'Sua fábrica mágica de atividades educativas está pronta. Crie histórias, caça-palavras e labirintos exclusivos em segundos.'
    },
    {
      icon: <Download className="w-12 h-12 text-indigo-500 mb-4 mx-auto" />,
      title: 'Baixe em Alta Qualidade',
      desc: 'Depois de gerar, clique em "Baixar PDF Oficial". O material vai direto pro seu celular, pronto para imprimir e encantar.'
    },
    {
      icon: <Trees className="w-12 h-12 text-emerald-500 mb-4 mx-auto" />,
      title: 'Construa sua Fazendinha',
      desc: 'Cada atividade gera Sementes. Use-as para plantar árvores e colecionar animais na sua própria Fazendinha. Comece agora!'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-surface-100 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-scale-up text-center border-4 border-primary-100">
        <button 
          onClick={() => {
            concluirOnboarding();
            setIsOpen(false);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-surface-100 text-surface-400 hover:bg-surface-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mt-4 min-h-[220px] flex flex-col justify-center">
          {steps[step].icon}
          <h2 className="text-2xl font-extrabold text-surface-800 mb-3" style={{ fontFamily: 'var(--font-baloo)' }}>
            {steps[step].title}
          </h2>
          <p className="text-surface-600 text-sm leading-relaxed">
            {steps[step].desc}
          </p>
        </div>

        <div className="flex justify-center gap-2 mt-8 mb-6">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all ${step === i ? 'w-8 bg-primary-500' : 'w-2 bg-surface-200'}`} 
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          {step === 2 ? 'Começar a Criar!' : 'Próximo'} 
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
