'use client';

import { BookOpen, Sparkles, Menu, X, Store, Bug, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs';
import { getStats, UserStats, adicionarSementes } from '@/lib/gamificacao';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const { theme, setTheme } = useTheme();
  const { isSignedIn, isLoaded } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats(getStats());
    const handleUpdate = () => setStats(getStats());
    window.addEventListener('cadernovivo-gamificacao-update', handleUpdate);
    return () => window.removeEventListener('cadernovivo-gamificacao-update', handleUpdate);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="relative">
            <BookOpen className="w-8 h-8 text-primary-500 transition-transform group-hover:scale-110" />
            <Sparkles className="w-3.5 h-3.5 text-accent-400 absolute -top-1 -right-1 animate-float" />
          </div>
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            <span className="text-primary-600">Caderno</span>
            <span className="text-success-500">Vivo</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-surface-500">
          <Link href="/" className="hover:text-primary-600 transition-colors">
            Início
          </Link>
          <Link href="/#modos" className="hover:text-primary-600 transition-colors">
            Criar Atividade
          </Link>
          <Link
            href="/#como-funciona"
            className="hover:text-primary-600 transition-colors"
          >
            Como Funciona
          </Link>
        </nav>

        {/* CTA desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/fazendinha" className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-surface-100 transition-colors text-sm font-semibold text-surface-600">
            <Store className="w-4 h-4 text-amber-500" />
            Loja
          </Link>
          <Link href="/perfil" className="px-3 py-1.5 rounded-xl hover:bg-surface-100 transition-colors text-sm font-semibold text-surface-600">
            Perfil
          </Link>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-sm font-bold shadow-sm transition-transform hover:scale-105">
            <span className="text-base">🌱</span>
            <span>{stats ? (stats.sementes % 1 === 0 ? stats.sementes : stats.sementes.toFixed(2)) : 0} sementes</span>
          </div>
          {/* Theme Toggle Desktop */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Alternar tema"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          {/* Auth */}
          {isLoaded && !isSignedIn && (
            <SignInButton mode="modal">
              <button className="px-4 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold transition-all shadow-sm">
                Entrar
              </button>
            </SignInButton>
          )}
          {isLoaded && isSignedIn && (
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 rounded-xl shadow-sm hover:scale-105 transition-transform" } }} />
          )}

          {/* Botão Dev para testes (apenas dev) */}
          {process.env.NODE_ENV === 'development' && (
            <button 
              onClick={() => adicionarSementes(100)} 
              className="p-1.5 text-surface-300 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
              title="Injetar 100 Sementes (Dev Mode)"
            >
              <Bug className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile menu and toggle */}
        <div className="md:hidden flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-surface-400 hover:text-primary-600 rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
            aria-label="Abrir menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-surface-600" />
            ) : (
              <Menu className="w-6 h-6 text-surface-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-light animate-fade-in border-t border-surface-200">
          <nav className="flex flex-col px-4 py-4 gap-3">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-surface-600 hover:bg-primary-50 hover:text-primary-600 transition-all"
            >
              Início
            </Link>
            <Link
              href="/#modos"
              onClick={() => setMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-surface-600 hover:bg-primary-50 hover:text-primary-600 transition-all"
            >
              Criar Atividade
            </Link>
            <Link
              href="/fazendinha"
              onClick={() => setMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-surface-600 hover:bg-amber-50 hover:text-amber-600 transition-all flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              Loja (Fazendinha)
            </Link>
            <Link
              href="/perfil"
              onClick={() => setMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-surface-600 hover:bg-primary-50 hover:text-primary-600 transition-all"
            >
              Perfil
            </Link>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-sm font-bold w-fit mt-1 mb-2">
              <span className="text-base">🌱</span>
              <span>{stats ? (stats.sementes % 1 === 0 ? stats.sementes : stats.sementes.toFixed(2)) : 0} sementes</span>
            </div>
            
            {/* Auth Mobile */}
            <div className="border-t border-surface-200 pt-3">
              {isLoaded && !isSignedIn && (
                <SignInButton mode="modal">
                  <button className="w-full py-2 px-3 rounded-lg bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-all">
                    Entrar / Cadastrar
                  </button>
                </SignInButton>
              )}
              {isLoaded && isSignedIn && (
                <div className="flex items-center gap-3 px-3">
                  <UserButton />
                  <span className="text-sm font-semibold text-surface-700">Sua Conta</span>
                </div>
              )}
            </div>
            {/* Botão Dev para testes mobile (apenas dev) */}
            {process.env.NODE_ENV === 'development' && (
              <button 
                onClick={() => adicionarSementes(100)} 
                className="mt-2 flex items-center gap-2 py-2 px-3 text-xs text-surface-400 hover:text-amber-600"
              >
                <Bug className="w-3 h-3" />
                Adicionar +100 Sementes (Dev)
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
