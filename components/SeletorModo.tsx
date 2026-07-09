'use client';

import { Sparkles, LayoutGrid, GraduationCap, ArrowRight, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

const modos = [
  {
    id: 'livre',
    titulo: 'Modo Livre',
    descricao: 'Personalize do zero com total liberdade. Use o botão "Recomendado" para gerar automaticamente!',
    emoji: '🎲',
    icon: Sparkles,
    gradient: 'from-primary-50 to-primary-100/50',
    border: 'border-primary-100 hover:border-primary-300',
    iconBg: 'from-primary-500 to-primary-600',
    shadow: 'hover:shadow-primary-100',
    tag: '✨ Recomendado',
    tagColor: 'bg-amber-50 text-amber-600 border-amber-200',
    href: '/criar/livre',
  },
  {
    id: 'predefinido',
    titulo: 'Predefinido',
    descricao: 'Escolha entre categorias prontas e gere atividades de qualidade em segundos.',
    emoji: '📋',
    icon: LayoutGrid,
    gradient: 'from-emerald-50 to-teal-50/50',
    border: 'border-emerald-100 hover:border-emerald-300',
    iconBg: 'from-emerald-500 to-teal-500',
    shadow: 'hover:shadow-emerald-100',
    tag: '⚡ Rápido',
    tagColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    href: '/criar/predefinido',
  },
  {
    id: 'professores',
    titulo: 'Professores',
    descricao: 'Crie atividades para turmas inteiras com objetivos pedagógicos e níveis de dificuldade.',
    emoji: '👩‍🏫',
    icon: GraduationCap,
    gradient: 'from-amber-50 to-orange-50/50',
    border: 'border-amber-100 hover:border-amber-300',
    iconBg: 'from-amber-500 to-orange-500',
    shadow: 'hover:shadow-amber-100',
    tag: '🎓 Turmas',
    tagColor: 'bg-purple-50 text-purple-600 border-purple-200',
    href: '/criar/professores',
  },
  {
    id: 'jogos',
    titulo: 'Modo Jogos',
    descricao: 'Diversão rápida! Gere caça-palavras, labirintos e jogo da memória em segundos.',
    emoji: '🎮',
    icon: Gamepad2,
    gradient: 'from-pink-50 to-rose-50/50',
    border: 'border-pink-100 hover:border-pink-300',
    iconBg: 'from-pink-500 to-rose-500',
    shadow: 'hover:shadow-pink-100',
    tag: '🕹️ Passatempo',
    tagColor: 'bg-rose-50 text-rose-600 border-rose-200',
    href: '/criar/jogos',
  },
];

export default function SeletorModo() {
  return (
    <section id="modos" className="w-full max-w-5xl mx-auto px-4 py-10">
      {/* Section header */}
      <div className="text-center mb-8 animate-fade-in-up">
        <h2
          className="text-2xl sm:text-3xl font-extrabold text-surface-800"
          style={{ fontFamily: 'var(--font-baloo)' }}
        >
          Como você quer{' '}
          <span className="gradient-text">criar hoje?</span>
        </h2>
        <p className="text-surface-400 text-sm mt-2 max-w-md mx-auto">
          Escolha o modo ideal para você e comece a gerar atividades incríveis
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 stagger">
        {modos.map((modo) => {
          const Icon = modo.icon;
          return (
            <Link
              key={modo.id}
              href={modo.href}
              className={`group relative rounded-2xl bg-gradient-to-br ${modo.gradient} border ${modo.border} p-5 sm:p-6 transition-all duration-300 hover:shadow-xl ${modo.shadow} hover:-translate-y-1 active:scale-[0.98] block`}
            >
              {/* Tag */}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${modo.tagColor} mb-4`}
              >
                {modo.tag}
              </span>

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${modo.iconBg} flex items-center justify-center shadow-lg mb-4 transition-transform group-hover:scale-110`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3
                className="text-lg font-bold text-surface-800 mb-2"
                style={{ fontFamily: 'var(--font-baloo)' }}
              >
                {modo.titulo}
              </h3>
              <p className="text-surface-400 text-sm leading-relaxed mb-4">
                {modo.descricao}
              </p>

              {/* CTA arrow */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-500 group-hover:text-primary-600 transition-colors">
                <span>Começar</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>

              {/* Shimmer overlay on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer pointer-events-none" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
