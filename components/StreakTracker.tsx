'use client';

import { useState, useEffect } from 'react';
import { getStats, getTodayStr, realizarCheckin, UserStats } from '@/lib/gamificacao';
import { Check, Flame } from 'lucide-react';

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function StreakTracker() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [hojeFezCheckin, setHojeFezCheckin] = useState(false);
  const [animatingDay, setAnimatingDay] = useState<number | null>(null);

  useEffect(() => {
    // Carregar stats iniciais
    const updateStats = () => {
      const s = getStats();
      setStats(s);
      setHojeFezCheckin(s.historicoCheckins.includes(getTodayStr()));
    };

    updateStats();

    // Escutar eventos de update de outros lugares (ex: Loja)
    window.addEventListener('cadernovivo-gamificacao-update', updateStats);
    return () => window.removeEventListener('cadernovivo-gamificacao-update', updateStats);
  }, []);

  if (!stats) return null; // Hydration safety

  const todayIndex = new Date().getDay();

  const handleCheckin = () => {
    if (hojeFezCheckin) return;
    
    setAnimatingDay(todayIndex);
    const result = realizarCheckin();
    
    if (result.sucesso) {
      setTimeout(() => {
        setAnimatingDay(null);
        setHojeFezCheckin(true);
      }, 1000);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
      {/* Decorative fire glow */}
      {hojeFezCheckin && (
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-100 rounded-full blur-3xl pointer-events-none opacity-50 animate-pulse-glow" />
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Info lateral */}
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

        {/* Calendario D S T Q Q S S */}
        <div className="flex items-center gap-1 sm:gap-2 bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 p-2 rounded-xl border border-surface-100">
          {DIAS_SEMANA.map((letra, index) => {
            const isToday = index === todayIndex;
            
            // Lógica super simples pro MVP: se a ofensiva for N, marcamos os N dias para trás a partir de hoje
            // (Para um sistema real usaríamos a data real de cada bolinha, mas para UI ilustrativa de MVP, preenchemos retroativamente)
            let isChecked = false;
            
            if (isToday && hojeFezCheckin) isChecked = true;
            else if (isToday && !hojeFezCheckin) isChecked = false;
            else if (index < todayIndex && (todayIndex - index <= stats.ofensivaAtual - (hojeFezCheckin ? 1 : 0))) {
              isChecked = true;
            }

            const isAnimating = animatingDay === index;

            return (
              <button
                key={index}
                onClick={isToday ? handleCheckin : undefined}
                disabled={!isToday || hojeFezCheckin}
                className={`relative flex flex-col items-center justify-center w-10 h-11 rounded-lg transition-all ${
                  isToday 
                    ? (hojeFezCheckin 
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-200 ring-2 ring-orange-200 ring-offset-1' 
                        : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-2 border-dashed border-orange-400 text-orange-600 cursor-pointer hover:bg-orange-50 active:scale-95 animate-pulse')
                    : (isChecked 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'bg-transparent text-surface-400 opacity-50')
                }`}
              >
                <span className="text-xs font-bold mb-0.5">{letra}</span>
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
