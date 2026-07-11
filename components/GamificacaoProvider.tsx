'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getStats, UserStats } from '@/lib/gamificacao';

interface GamificacaoContextData {
  stats: UserStats | null;
  refreshStats: () => void;
}

const GamificacaoContext = createContext<GamificacaoContextData>({
  stats: null,
  refreshStats: () => {},
});

export const useGamificacao = () => useContext(GamificacaoContext);

export function GamificacaoProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<UserStats | null>(null);

  const refreshStats = () => {
    setStats(getStats());
  };

  useEffect(() => {
    refreshStats();
    
    // Escuta eventos apenas no nível do Provider
    const handleUpdate = () => refreshStats();
    window.addEventListener('cadernovivo-gamificacao-update', handleUpdate);
    
    return () => {
      window.removeEventListener('cadernovivo-gamificacao-update', handleUpdate);
    };
  }, []);

  return (
    <GamificacaoContext.Provider value={{ stats, refreshStats }}>
      {children}
    </GamificacaoContext.Provider>
  );
}
