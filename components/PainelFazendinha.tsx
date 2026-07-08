'use client';

import { useState, useEffect } from 'react';
import { getStats, UserStats } from '@/lib/gamificacao';
import Link from 'next/link';
import { Store } from 'lucide-react';

const ARVORE_EMOJIS = ['🌰', '🌱', '🌿', '🪴', '🌲', '🌳', '🌺', '✨'];

export default function PainelFazendinha() {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getStats());
    const handleUpdate = () => setStats(getStats());
    window.addEventListener('cadernovivo-gamificacao-update', handleUpdate);
    return () => window.removeEventListener('cadernovivo-gamificacao-update', handleUpdate);
  }, []);

  if (!stats) return null;

  const arvoreNivel = stats.inventario.arvoreNivel;
  const arvoreEmoji = ARVORE_EMOJIS[arvoreNivel];

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
      {/* Visual */}
      <div className="flex-1 flex items-end justify-center gap-4 h-24 relative z-10 w-full">
        {stats.inventario.animais.includes('vaca') && (
          <div className="text-3xl animate-fade-in-up">🐄</div>
        )}
        {stats.inventario.animais.includes('galinha') && (
          <div className="text-2xl animate-fade-in-up">🐔</div>
        )}
        
        <div className="text-6xl md:text-7xl filter drop-shadow-md z-20 transition-transform hover:scale-105">
          {arvoreEmoji}
        </div>

        {stats.inventario.animais.includes('cachorro') && (
          <div className="text-3xl animate-fade-in-up">🐕</div>
        )}

        {/* Chão simplificado */}
        <div className="absolute -bottom-4 left-0 right-0 h-8 bg-gradient-to-t from-emerald-400 to-green-300 rounded-lg -z-10" />
      </div>

      {/* CTA Loja */}
      <div className="text-center md:text-right relative z-10 bg-white dark:bg-surface-100 dark:text-surface-800/80 p-3 rounded-xl border border-white/50 backdrop-blur-sm shadow-sm">
        <h3 className="font-bold text-sm text-surface-800">Sua Fazendinha</h3>
        <p className="text-xs text-surface-500 mb-2">Continue evoluindo seu espaço!</p>
        <Link 
          href="/fazendinha"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors text-xs font-bold"
        >
          <Store className="w-3.5 h-3.5" /> Acessar Loja
        </Link>
      </div>
    </div>
  );
}
