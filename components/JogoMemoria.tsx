"use client";

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { adicionarSementes } from '@/lib/gamificacao';
import { playSound } from '@/lib/audio';

interface MemoriaProps {
  cards: string[];
  tema: string;
}

export default function JogoMemoria({ cards, tema }: MemoriaProps) {
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      playSound('complete');
      confetti({ particleCount: 150, spread: 70 });
      adicionarSementes(3); // Ganha 3 sementes ao concluir
    }
  }, [solved, cards.length]);

  const handleCardClick = (index: number) => {
    if (disabled || flipped.includes(index) || solved.includes(index)) return;

    playSound('correct'); // just a little blip
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const match = cards[newFlipped[0]] === cards[newFlipped[1]];
      
      setTimeout(() => {
        if (match) {
          playSound('correct');
          setSolved(prev => [...prev, ...newFlipped]);
        } else {
          playSound('wrong');
        }
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center bg-white dark:bg-surface-100 p-6 rounded-2xl shadow-sm border border-surface-200">
      <h3 className="text-xl font-bold text-surface-800 mb-6">Jogo da Memória: {tema}</h3>
      
      <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-lg">
        {cards.map((emoji, idx) => {
          const isFlipped = flipped.includes(idx);
          const isSolved = solved.includes(idx);
          
          return (
            <button
              key={idx}
              onClick={() => handleCardClick(idx)}
              className={`aspect-square w-full rounded-xl sm:rounded-2xl flex items-center justify-center text-4xl sm:text-5xl transition-all duration-300 transform preserve-3d shadow-sm ${
                (isFlipped || isSolved) 
                  ? 'bg-primary-50 border-2 border-primary-200 rotate-y-180' 
                  : 'bg-gradient-to-br from-primary-400 to-primary-600 hover:scale-105 hover:shadow-md cursor-pointer'
              }`}
            >
              <div className={`transition-opacity duration-300 ${(isFlipped || isSolved) ? 'opacity-100' : 'opacity-0'}`}>
                {emoji}
              </div>
            </button>
          )
        })}
      </div>

      {solved.length === cards.length && cards.length > 0 && (
        <div className="mt-8 text-center animate-fade-in-up">
          <div className="text-2xl font-bold text-emerald-600 mb-2">Parabéns! 🎉</div>
          <div className="text-surface-600">+3 Sementes ganhas!</div>
        </div>
      )}
    </div>
  );
}
