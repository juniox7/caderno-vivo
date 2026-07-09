"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AtividadeDiaria from '@/components/AtividadeDiaria';
import SeletorModo from '@/components/SeletorModo';
import StreakTracker from '@/components/StreakTracker';
import PainelFazendinha from '@/components/PainelFazendinha';
import { Printer, Sparkles, Brain, Zap, Activity } from 'lucide-react';
import { getStats, UserStats } from '@/lib/gamificacao';
import { useState, useEffect } from 'react';

export default function Home() {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero section */}
        <section className="relative overflow-hidden px-4 pt-10 pb-4">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-br from-primary-100/60 via-transparent to-success-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-600 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Personalização por Inteligência Artificial
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-surface-900 leading-tight"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              Menos tela.
              <br />
              Mais{' '}
              <span className="gradient-text">diversão impressa.</span>
            </h1>

            <p className="text-surface-400 text-base sm:text-lg mt-4 max-w-lg mx-auto leading-relaxed">
              Gere cadernos de atividades educativas
              <span className="text-surface-700 font-semibold"> 100% personalizados </span>
              com os interesses do seu filho. Prontos para imprimir em casa!
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: Brain, label: 'IA Personaliza Tudo', color: 'text-primary-600 bg-primary-50 border-primary-200' },
                { icon: Printer, label: 'Imprime em Casa', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                { icon: Zap, label: 'Pronto em Segundos', color: 'text-amber-600 bg-amber-50 border-amber-200' },
              ].map((feat) => (
                <div
                  key={feat.label}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-medium ${feat.color}`}
                >
                  <feat.icon className="w-3.5 h-3.5" />
                  {feat.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gamification / Streak Tracker & Fazendinha */}
        <section className="w-full max-w-3xl mx-auto px-4 pb-4">
          <StreakTracker />
          
          {stats && (
            <div className="bg-white dark:bg-surface-100 dark:text-surface-800 rounded-2xl p-6 border border-surface-200 shadow-sm mb-6 flex flex-col md:flex-row gap-6 items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-surface-800 flex items-center gap-2 mb-2" style={{ fontFamily: 'var(--font-baloo)' }}>
                  <Activity className="w-5 h-5 text-primary-500" />
                  Boletim de Desempenho
                </h3>
                <p className="text-surface-500 text-sm">Acompanhe seu progresso e atividades realizadas!</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center p-3 bg-primary-50 rounded-xl border border-primary-100 min-w-[100px]">
                  <div className="text-2xl font-bold text-primary-600">{stats.historicoGeral.totalAtividades}</div>
                  <div className="text-xs font-semibold text-primary-400 uppercase tracking-wide">Atividades</div>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-100 min-w-[100px]">
                  <div className="text-2xl font-bold text-emerald-600">+{stats.historicoGeral.totalSementesGanhas}</div>
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Sementes Totais</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100 min-w-[100px]">
                  <div className="text-2xl font-bold text-amber-600">{stats.conquistas.length}</div>
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Medalhas</div>
                </div>
              </div>
            </div>
          )}

          <PainelFazendinha />
        </section>

        {/* Atividade Diária */}
        <AtividadeDiaria />

        {/* Seletor de Modo */}
        <SeletorModo />

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
