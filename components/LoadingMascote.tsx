'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingMascoteProps {
  nomes: string[];
  interesse: string;
  focos: string[]; // labels
}

export default function LoadingMascote({ nomes, interesse, focos }: LoadingMascoteProps) {
  const [fraseIndex, setFraseIndex] = useState(0);

  const nomesStr = nomes.filter(n => n.trim()).join(' e ') || 'você';
  const int = interesse || 'muita diversão';
  const foco = focos.length > 0 ? focos[0] : 'aprender';

  const frases = [
    `Desenhando aventuras de ${int} para ${nomesStr}...`,
    `Escondendo pistas secretas no labirinto...`,
    `Organizando os desafios de ${foco}...`,
    `Adicionando uma pitada de pó mágico... ✨`,
    `Quase lá! Nossa IA está caprichando nos detalhes...`
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setFraseIndex((prev) => (prev + 1) % frases.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [frases.length]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-surface-50 dark:bg-[#0f172a] rounded-2xl border-2 border-dashed border-primary-200 mt-8 animate-fade-in-up">
      <div className="relative mb-6">
        {/* Mascote Emoji Animate */}
        <div className="text-7xl animate-bounce">
          🐶
        </div>
        <div className="absolute -top-2 -right-4 animate-spin-slow">
          <Sparkles className="w-8 h-8 text-amber-400" />
        </div>
      </div>
      
      <div className="h-8 flex items-center justify-center">
        <p key={fraseIndex} className="text-primary-700 dark:text-primary-400 font-semibold text-lg text-center animate-fade-in" style={{ fontFamily: 'var(--font-baloo)' }}>
          {frases[fraseIndex]}
        </p>
      </div>
      
      <div className="w-48 h-2 bg-surface-200 rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full w-full animate-progress-indeterminate origin-left"></div>
      </div>
    </div>
  );
}
