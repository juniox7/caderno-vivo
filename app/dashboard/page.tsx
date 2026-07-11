"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AtividadeDiaria from '@/components/AtividadeDiaria';
import SeletorModo from '@/components/SeletorModo';
import StreakTracker from '@/components/StreakTracker';
import PainelFazendinha from '@/components/PainelFazendinha';
import PushManager from '@/components/PushManager';
import { Printer, Sparkles, Brain, Zap, Activity } from 'lucide-react';
import { getStats, UserStats } from '@/lib/gamificacao';
import { useState, useEffect } from 'react';

export default function Home() {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getStats());
    const handleUpdate = () => setStats(getStats());
    window.addEventListener('cadernovivo-gamificacao-update', handleUpdate);
    return () => window.removeEventListener('cadernovivo-gamificacao-update', handleUpdate);
  }, []);
  return (
    <>
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden px-4 pt-10 pb-6 text-center animate-fade-in-up">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-br from-primary-100/60 via-transparent to-success-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 leading-tight mb-2" style={{ fontFamily: 'var(--font-baloo)' }}>
              Oi, bem-vindo de volta! 👋
            </h1>
            <p className="text-surface-500 text-lg mb-8">Vamos criar a atividade de hoje?</p>
            
            <a href="#como-funciona" onClick={(e) => {
              e.preventDefault();
              document.querySelector('#seletor-modo')?.scrollIntoView({ behavior: 'smooth' });
            }} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg hover:shadow-lg hover:scale-105 transition-all">
              <Sparkles className="w-5 h-5" />
              Criar Atividade Agora
            </a>
          </div>
        </section>

        {/* Atividade Diária no TOPO */}
        <div className="mb-4">
          <AtividadeDiaria />
        </div>

        {/* Gamification / Streak Tracker & Fazendinha */}
        <section className="w-full max-w-3xl mx-auto px-4 pb-4">
          <StreakTracker />
          
          {stats && (
            <div className="bg-white dark:bg-surface-100 dark:text-surface-800 rounded-2xl p-6 border border-surface-200 shadow-sm mb-6 flex flex-col md:flex-row gap-6 items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-surface-800 flex items-center gap-2 mb-2" style={{ fontFamily: 'var(--font-baloo)' }}>
                  <Activity className="w-5 h-5 text-primary-500" />
                  Boletim Semanal
                </h3>
                <p className="text-surface-500 text-sm">Resumo dos seus últimos dias.</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center p-3 bg-primary-50 rounded-xl border border-primary-100 min-w-[90px]">
                  <div className="text-2xl font-bold text-primary-600">{stats.historicoGeral.diasSeguidos}</div>
                  <div className="text-[10px] font-semibold text-primary-400 uppercase tracking-wide mt-1">Dias Ativos</div>
                </div>
                {stats.historicoGeral.totalSementesGanhas === 0 ? (
                  <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex-1 min-w-[120px] flex items-center justify-center">
                    <span className="text-xs font-medium text-emerald-600">Crie sua primeira atividade e ganhe sementes! 🌱</span>
                  </div>
                ) : (
                  <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-100 min-w-[90px]">
                    <div className="text-2xl font-bold text-emerald-600">+{stats.historicoGeral.totalSementesGanhas}</div>
                    <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide mt-1">Sementes Totais</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <PainelFazendinha />
        </section>

        {/* Seletor de Modo */}
        <div id="seletor-modo">
          <SeletorModo />
        </div>

        {/* Gerenciador de Push Notifications */}
        <div className="w-full max-w-4xl mx-auto px-4 mt-8">
          <PushManager />
        </div>

        {/* Como Funciona */}
        <section id="como-funciona" className="w-full max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8 animate-fade-in-up">
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-surface-800"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              Como funciona?
            </h2>
            <p className="text-surface-400 text-sm mt-2">Três passos simples para atividades incríveis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            {[
              {
                step: '1',
                emoji: '📝',
                title: 'Preencha',
                desc: 'Diga o nome, idade, interesses e foco pedagógico da criança.',
                gradient: 'from-primary-500 to-primary-600',
              },
              {
                step: '2',
                emoji: '🤖',
                title: 'IA Gera',
                desc: 'Nossa IA cruza todas as variáveis e cria atividades únicas e divertidas.',
                gradient: 'from-emerald-500 to-teal-500',
              },
              {
                step: '3',
                emoji: '🖨️',
                title: 'Imprima',
                desc: 'Baixe o PDF otimizado para impressão caseira e divirta-se offline!',
                gradient: 'from-amber-500 to-orange-500',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all shadow-sm"
              >
                {/* Step number */}
                <div
                  className={`inline-flex w-10 h-10 rounded-full bg-gradient-to-br ${item.gradient} items-center justify-center text-white font-bold text-sm shadow-lg mb-4`}
                >
                  {item.step}
                </div>
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3
                  className="text-lg font-bold text-surface-800 mb-2"
                  style={{ fontFamily: 'var(--font-baloo)' }}
                >
                  {item.title}
                </h3>
                <p className="text-surface-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
