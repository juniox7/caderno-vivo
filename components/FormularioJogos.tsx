"use client";

import { useState } from 'react';
import { Gamepad2, Sparkles, Brain, Search, LayoutGrid, Type } from 'lucide-react';
import { toast } from 'sonner';
import { registrarAtividade } from '@/lib/gamificacao';
import CacaPalavras from './CacaPalavras';
import Labirinto from './Labirinto';
import JogoDaForca from './JogoDaForca';
import JogoMemoria from './JogoMemoria';
import LoadingMascote from './LoadingMascote';

export default function FormularioJogos() {
  const [loading, setLoading] = useState(false);
  const [tema, setTema] = useState('');
  const [tipoAtividade, setTipoAtividade] = useState<'caca_palavras' | 'labirinto' | 'forca' | 'memoria'>('caca_palavras');
  const [qtdPuzzles, setQtdPuzzles] = useState(1);
  const [puzzleGerados, setPuzzleGerados] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tema.trim()) {
      toast.error('Digite um tema para o jogo!');
      return;
    }

    setLoading(true);
    try {
      const puzzlesData = [];
      for (let i = 0; i < qtdPuzzles; i++) {
        const r = await fetch('/api/generate-puzzle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipoAtividade,
            tema: tema.trim(),
            dificuldade: 'medio',
          }),
        });
        if (r.status === 403) throw new Error('Payment Required');
        const data = await r.json();
        if (data.error) throw new Error(data.error);
        puzzlesData.push({
          ...data,
          id: `${Date.now()}-${Math.random().toString(36).substring(7)}`
        });
        
        if (i < qtdPuzzles - 1) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }

      setPuzzleGerados(puzzlesData);
      registrarAtividade(tipoAtividade);
      setTimeout(() => {
        document.getElementById('resultado-jogos')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao gerar o jogo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-surface-100 p-6 md:p-8 rounded-3xl border border-surface-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-rose-500" />
        
        {/* Tema */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
            <Gamepad2 className="w-4 h-4 text-pink-500" />
            Qual o tema do jogo?
          </label>
          <input 
            type="text" 
            value={tema}
            onChange={e => setTema(e.target.value)}
            placeholder="Ex: Dinossauros, Espaço, Super-heróis..."
            className="w-full px-4 py-3 rounded-xl border-2 border-surface-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-100 transition-all outline-none bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 font-medium"
            required
          />
        </div>

        {/* Seleção do Jogo */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
            <LayoutGrid className="w-4 h-4 text-pink-500" />
            Escolha o Jogo
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'caca_palavras', title: 'Caça-Palavras', icon: '🔍', color: 'pink' },
              { id: 'forca', title: 'Forca', icon: '🅰️', color: 'pink' },
              { id: 'labirinto', title: 'Labirinto', icon: '🌀', color: 'pink' },
              { id: 'memoria', title: 'Memória', icon: '🧠', color: 'pink' }
            ].map(jogo => (
              <button
                key={jogo.id}
                type="button"
                onClick={() => setTipoAtividade(jogo.id as any)}
                className={`p-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-2 ${
                  tipoAtividade === jogo.id 
                    ? 'bg-pink-50 border-pink-400 text-pink-700 shadow-sm scale-[1.02]' 
                    : 'bg-white dark:bg-[#0f172a] border-surface-200 text-surface-500 hover:bg-surface-50'
                }`}
              >
                <span className="text-3xl">{jogo.icon}</span>
                <span className="text-sm">{jogo.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantidade */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
            <Type className="w-4 h-4 text-pink-500" />
            Quantidade (Máx 3): <span className="text-pink-600 font-extrabold">{qtdPuzzles > 3 ? 3 : qtdPuzzles}</span>
          </label>
          <input
            type="range"
            min={1}
            max={3}
            value={qtdPuzzles > 3 ? 3 : qtdPuzzles}
            onChange={(e) => setQtdPuzzles(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-200 mt-2
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-pink-400 [&::-webkit-slider-thumb]:to-rose-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-pink-200"
          />
        </div>

        {loading ? (
          <LoadingMascote 
            nomes={['pequeno(a) jogador(a)']} 
            interesse={tema} 
            focos={['diversão']} 
          />
        ) : (
          <button
            type="submit"
            disabled={!tema.trim()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 disabled:opacity-40 text-white font-bold text-lg transition-all hover:shadow-xl hover:shadow-pink-200 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Gerar Jogos!
          </button>
        )}
      </form>

      {/* Resultados */}
      {puzzleGerados.length > 0 && (
        <div id="resultado-jogos" className="mt-8 pt-8 border-t-2 border-dashed border-surface-200 animate-fade-in-up flex flex-col gap-10">
          <h2 className="text-2xl font-bold text-surface-800 text-center" style={{ fontFamily: 'var(--font-baloo)' }}>
            Seus Jogos Estão Prontos! 🕹️
          </h2>
          {puzzleGerados.map((puzzle, index) => (
            <div key={puzzle.id || index} className="print:break-after-page print:mt-12 w-full flex justify-center">
              {puzzle.tipo === 'caca_palavras' && (
                <CacaPalavras 
                  grid={puzzle.grid} 
                  palavras={puzzle.palavras} 
                  tema={`${puzzle.tema} #${index + 1}`} 
                />
              )}
              {puzzle.tipo === 'labirinto' && (
                <Labirinto 
                  mazeGrid={puzzle.mazeGrid}
                  inicio={puzzle.inicio}
                  fim={puzzle.fim}
                  tema={`${puzzle.tema} #${index + 1}`}
                />
              )}
              {puzzle.tipo === 'forca' && (
                <JogoDaForca 
                  palavras={puzzle.palavras || []}
                  tema={`${puzzle.tema} #${index + 1}`}
                />
              )}
              {puzzle.tipo === 'memoria' && (
                <JogoMemoria 
                  cards={puzzle.cards || []}
                  tema={`${puzzle.tema} #${index + 1}`}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
