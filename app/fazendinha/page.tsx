'use client';

import { useState, useEffect } from 'react';
import { getStats, comprarItem, UserStats, adicionarSementes } from '@/lib/gamificacao';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Store, Lock, Sparkles, ArrowLeft, Ticket } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const ARVORE_NIVEIS = [
  { nivel: 0, nome: 'Terra Vazia', emoji: '🌰', custo: 0 },
  { nivel: 1, nome: 'Primeiro Broto', emoji: '🌱', custo: 5 },
  { nivel: 2, nome: 'Mudinha com Folhas', emoji: '🌿', custo: 10 },
  { nivel: 3, nome: 'Planta Jovem', emoji: '🪴', custo: 15 },
  { nivel: 4, nome: 'Árvore Pequena', emoji: '🌲', custo: 25 },
  { nivel: 5, nome: 'Árvore Madura', emoji: '🌳', custo: 40 },
  { nivel: 6, nome: 'Árvore Florida', emoji: '🌺', custo: 60 },
  { nivel: 7, nome: 'Árvore Mágica', emoji: '✨', custo: 100 },
];

const ANIMAIS_LOJA = [
  { id: 'vaca', nome: 'Mimosinha', emoji: '🐄', custo: 20 },
  { id: 'cachorro', nome: 'Totó', emoji: '🐕', custo: 30 },
  { id: 'galinha', nome: 'Pintadinha', emoji: '🐔', custo: 15 },
];

export default function Fazendinha() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [codigo, setCodigo] = useState('');
  const [resgatando, setResgatando] = useState(false);

  useEffect(() => {
    setStats(getStats());
  }, []);

  const handleComprar = (id: string, preco: number) => {
    if (comprarItem(id, preco)) {
      setStats(getStats());
      toast.success('Compra realizada com sucesso! 🎉');
    } else {
      toast.error('Sementes insuficientes!');
    }
  };

  const handleResgatarCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigo.trim().length !== 6) {
      toast.error('O código mágico deve ter 6 letras/números!');
      return;
    }

    setResgatando(true);
    setTimeout(() => {
      // MVP: Accepts any 6-char string, giving 10 seeds
      adicionarSementes(10);
      setStats(getStats());
      setCodigo('');
      setResgatando(false);
      toast.success('Código validado! Você ganhou +10 Sementes! 🌱');
    }, 1000);
  };

  if (!stats) return null;

  const proximoNivelArvore = ARVORE_NIVEIS.find(n => n.nivel === stats.inventario.arvoreNivel + 1);
  const arvoreAtual = ARVORE_NIVEIS.find(n => n.nivel === stats.inventario.arvoreNivel);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="p-2 rounded-lg hover:bg-surface-200 transition-colors bg-white dark:bg-surface-100 dark:text-surface-800 shadow-sm border border-surface-200">
              <ArrowLeft className="w-5 h-5 text-surface-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-surface-800" style={{ fontFamily: 'var(--font-baloo)' }}>
                Sua Fazendinha 🚜
              </h1>
              <p className="text-surface-500">Gaste suas sementes para decorar o seu espaço!</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Visual da Fazenda Atual */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 border-4 border-white shadow-xl relative overflow-hidden h-[400px] flex flex-col items-center justify-end">
              {/* Sol e nuvens */}
              <div className="absolute top-8 left-8 text-6xl opacity-80 animate-pulse">☀️</div>
              <div className="absolute top-12 right-12 text-5xl opacity-60 animate-float" style={{ animationDelay: '1s' }}>☁️</div>
              <div className="absolute top-24 left-1/3 text-4xl opacity-50 animate-float" style={{ animationDelay: '2s' }}>☁️</div>

              {/* Chão */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-400 to-green-300 rounded-b-2xl border-t-4 border-green-400/30" />

              {/* Entidades Renderizadas */}
              <div className="relative z-10 w-full flex items-end justify-center gap-4 pb-8">
                {/* Animais comprados */}
                {stats.inventario.animais.includes('vaca') && (
                  <div className="text-5xl animate-fade-in-up hover:animate-bounce cursor-pointer">🐄</div>
                )}
                {stats.inventario.animais.includes('galinha') && (
                  <div className="text-4xl animate-fade-in-up hover:animate-bounce cursor-pointer">🐔</div>
                )}
                
                {/* Árvore Central */}
                <div className="text-8xl md:text-9xl transform hover:scale-110 transition-transform cursor-pointer filter drop-shadow-xl z-20">
                  {arvoreAtual?.emoji}
                </div>

                {/* Animais comprados */}
                {stats.inventario.animais.includes('cachorro') && (
                  <div className="text-5xl animate-fade-in-up hover:animate-bounce cursor-pointer">🐕</div>
                )}
              </div>
            </div>

            {/* A Loja e Resgate */}
            <div className="space-y-6">
              
              {/* Resgate de Código */}
              <div className="bg-gradient-to-br from-indigo-500 to-primary-600 rounded-2xl p-5 border-0 shadow-lg text-white">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-indigo-200" />
                  Código Mágico do Caderno
                </h3>
                <p className="text-sm text-indigo-100 mb-4 leading-relaxed">
                  Terminou uma atividade impressa? Digite o código de 6 letras que está no final da página para ganhar <strong>10 Sementes</strong>!
                </p>
                <form onSubmit={handleResgatarCodigo} className="flex gap-2">
                  <input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                    placeholder="Ex: A7X9P2"
                    maxLength={6}
                    className="flex-1 px-4 py-2 rounded-xl text-surface-800 font-bold tracking-widest outline-none border-2 border-transparent focus:border-indigo-300 transition-all uppercase"
                  />
                  <button
                    type="submit"
                    disabled={resgatando || codigo.length < 6}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold rounded-xl transition-all disabled:opacity-50 shadow-md"
                  >
                    {resgatando ? '⏳' : 'Resgatar'}
                  </button>
                </form>
              </div>

              <div className="bg-white dark:bg-surface-100 dark:text-surface-800 rounded-2xl p-5 border border-surface-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Store className="w-5 h-5 text-amber-500" />
                  Evoluir Árvore Mágica
                </h3>
                
                {proximoNivelArvore ? (
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{proximoNivelArvore.emoji}</div>
                      <div>
                        <div className="font-bold text-surface-800">{proximoNivelArvore.nome}</div>
                        <div className="text-xs text-surface-500">Nível {proximoNivelArvore.nivel}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleComprar('arvore_up', proximoNivelArvore.custo)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${
                        stats.sementes >= proximoNivelArvore.custo
                          ? 'bg-amber-400 text-amber-900 hover:bg-amber-300 hover:shadow-md'
                          : 'bg-surface-200 text-surface-400 cursor-not-allowed opacity-50'
                      }`}
                    >
                      🌱 {proximoNivelArvore.custo}
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-emerald-700 font-bold flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" /> Árvore no Nível Máximo!
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-surface-100 dark:text-surface-800 rounded-2xl p-5 border border-surface-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Store className="w-5 h-5 text-amber-500" />
                  Animais da Fazenda
                </h3>
                
                <div className="space-y-3">
                  {ANIMAIS_LOJA.map(animal => {
                    const hasBought = stats.inventario.animais.includes(animal.id);
                    return (
                      <div key={animal.id} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 hover:bg-surface-100 rounded-xl border border-surface-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl bg-white dark:bg-surface-100 dark:text-surface-800 p-2 rounded-lg shadow-sm">{animal.emoji}</div>
                          <div className="font-bold text-surface-700">{animal.nome}</div>
                        </div>
                        {hasBought ? (
                          <div className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Adquirido
                          </div>
                        ) : (
                          <button
                            onClick={() => handleComprar(animal.id, animal.custo)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all shadow-sm ${
                              stats.sementes >= animal.custo
                                ? 'bg-amber-400 text-amber-900 hover:bg-amber-300 hover:shadow-md'
                                : 'bg-surface-200 text-surface-400 cursor-not-allowed opacity-50'
                            }`}
                          >
                            🌱 {animal.custo}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
