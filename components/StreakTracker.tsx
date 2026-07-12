'use client';

import { useState, useEffect } from 'react';
import { getTodayStr, realizarCheckin } from '@/lib/gamificacao';
import { useGamificacao } from '@/components/GamificacaoProvider';
import { Check, Flame } from 'lucide-react';

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function StreakTracker() {
  const { stats, refreshStats } = useGamificacao();
  const [hojeFezCheckin, setHojeFezCheckin] = useState(false);
  const [isAnimatingCheckin, setIsAnimatingCheckin] = useState(false);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (stats) {
      setHojeFezCheckin(stats.historicoCheckins.includes(getTodayStr()));
    }
  }, [stats]);

  if (!mounted || !stats) return null;

  const handleCheckin = () => {
    if (hojeFezCheckin) return;
    
    setIsAnimatingCheckin(true);
    const result = realizarCheckin();
    
    if (result.sucesso) {
      setTimeout(() => {
        setIsAnimatingCheckin(false);
        setHojeFezCheckin(true);
        refreshStats();
      }, 1000);
    } else {
      setIsAnimatingCheckin(false);
    }
  };

  const diasDaSemanaBase = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  
  // Gera o array com os últimos 7 dias, terminando sempre em Hoje (índice 6)
  const ultimos7Dias = Array.from({ length: 7 }).map((_, i) => {
    const diasAtras = 6 - i;
    const date = new Date();
    date.setDate(date.getDate() - diasAtras);
    return {
      letra: diasDaSemanaBase[date.getDay()],
      diasAtras,
      isToday: diasAtras === 0,
    };
  });

  return (
    <div className="w-full bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
      {hojeFezCheckin && (
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-100 rounded-full blur-3xl pointer-events-none opacity-50 animate-pulse-glow" />
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-200">
            <Flame className={`w-6 h-6 text-white ${hojeFezCheckin ? 'animate-streak' : ''}`} />
          </div>
          <div>
            <h3 className="font-bold text-surface-800 text-sm">Ofensiva Atual</h3>
            <p className="text-orange-600 font-extrabold text-lg flex items-center gap-1">
              {stats.ofensivaAtual} <span className="text-sm font-semibold text-surface-400">dias</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 p-2 rounded-xl border border-surface-100">
          {ultimos7Dias.map((dia, index) => {
            let isChecked = false;
            
            // Verifica se este dia pertence à ofensiva atual
            if (dia.isToday && hojeFezCheckin) {
              isChecked = true;
            } else if (!dia.isToday && dia.diasAtras <= stats.ofensivaAtual - (hojeFezCheckin ? 1 : 0)) {
              isChecked = true;
            }

            const isAnimating = dia.isToday && isAnimatingCheckin;

            return (
              <button
                key={index}
                onClick={dia.isToday ? handleCheckin : undefined}
                disabled={!dia.isToday || hojeFezCheckin}
                className={`relative flex flex-col items-center justify-center w-10 h-11 rounded-lg transition-all ${
                  dia.isToday 
                    ? (hojeFezCheckin 
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-200 ring-2 ring-orange-200 ring-offset-1' 
                        : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-2 border-dashed border-orange-400 text-orange-600 cursor-pointer hover:bg-orange-50 active:scale-95 animate-pulse')
                    : (isChecked 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'bg-transparent text-surface-400 opacity-50')
                }`}
              >
                <span className="text-xs font-bold mb-0.5" aria-hidden="true">{dia.letra}</span>
                <span className="sr-only">Dia {dia.diasAtras} atrás</span>
                {isChecked || isAnimating ? (
                  <Check className={`w-3.5 h-3.5 ${isAnimating ? 'animate-seed-bounce' : ''}`} />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-current opacity-30" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
