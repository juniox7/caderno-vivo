'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getHistorico, HistoricoItem } from '@/lib/historico';
import { ArrowLeft, Clock, Image as ImageIcon, Search, Activity } from 'lucide-react';
import Link from 'next/link';

export default function Perfil() {
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [tab, setTab] = useState<'historico' | 'galeria' | 'totais'>('historico');

  useEffect(() => {
    setHistorico(getHistorico());
  }, []);

  const imagens = historico.flatMap(h => h.imagens || []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          
          {/* Top Bar */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="p-2 rounded-lg hover:bg-surface-200 transition-colors bg-white dark:bg-surface-100 dark:text-surface-800 shadow-sm border border-surface-200">
              <ArrowLeft className="w-5 h-5 text-surface-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-surface-800" style={{ fontFamily: 'var(--font-baloo)' }}>
                Seu Perfil
              </h1>
              <p className="text-surface-500">Acompanhe suas criações e desenhos</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-surface-200 pb-2">
            <button
              onClick={() => setTab('historico')}
              className={`flex items-center gap-2 pb-2 px-2 text-sm font-bold border-b-2 transition-all ${
                tab === 'historico' ? 'border-primary-600 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              Histórico de Atividades
            </button>
            <button
              onClick={() => setTab('galeria')}
              className={`flex items-center gap-2 pb-2 px-2 text-sm font-bold border-b-2 transition-all ${
                tab === 'galeria' ? 'border-primary-600 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Galeria de Desenhos
            </button>
            <button
              onClick={() => setTab('totais')}
              className={`flex items-center gap-2 pb-2 px-2 text-sm font-bold border-b-2 transition-all ${
                tab === 'totais' ? 'border-primary-600 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              Atividades Totais
            </button>
          </div>

          {/* Content */}
          {tab === 'historico' && (
            <div className="space-y-4 animate-fade-in-up">
              {historico.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-surface-100 dark:text-surface-800 rounded-2xl border border-surface-200">
                  <Search className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                  <p className="text-surface-500 font-medium">Nenhuma atividade gerada ainda.</p>
                </div>
              ) : (
                historico.map(item => (
                  <div key={item.id} className="bg-white dark:bg-surface-100 dark:text-surface-800 rounded-2xl p-5 border border-surface-200 shadow-sm flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                          Modo {item.modo}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-surface-500 bg-surface-100 px-2 py-0.5 rounded-full">
                          {item.foco}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-surface-800">{item.titulo}</h3>
                      <p className="text-sm text-surface-500 mt-1">{item.subtitulo}</p>
                      <p className="text-xs text-surface-400 mt-3">Gerado em: {new Date(item.data).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'galeria' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in-up">
              {imagens.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white dark:bg-surface-100 dark:text-surface-800 rounded-2xl border border-surface-200">
                  <ImageIcon className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                  <p className="text-surface-500 font-medium">Nenhum desenho gerado ainda.</p>
                </div>
              ) : (
                imagens.map((img, i) => (
                  <div key={i} className="aspect-square bg-white dark:bg-surface-100 dark:text-surface-800 rounded-2xl border border-surface-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Desenho ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'totais' && (
            <div className="bg-white dark:bg-surface-100 dark:text-surface-800 rounded-2xl p-6 border border-surface-200 shadow-sm animate-fade-in-up text-center max-w-md mx-auto mt-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-surface-800 mb-2">Total de Atividades</h2>
              <p className="text-5xl font-black text-primary-600 mb-4" style={{ fontFamily: 'var(--font-baloo)' }}>
                {historico.length}
              </p>
              <p className="text-surface-500 text-sm">
                Você está indo muito bem! Continue gerando novas atividades para aprender brincando.
              </p>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}
