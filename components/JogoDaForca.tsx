"use client";

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { adicionarSementes } from '@/lib/gamificacao';
import { playSound } from '@/lib/audio';

interface ForcaProps {
  palavras: string[];
  tema: string;
}

export default function JogoDaForca({ palavras, tema }: ForcaProps) {
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  const word = palavras[currentWordIdx]?.toUpperCase() || "CADERNO";
  const maxErros = 6;

  useEffect(() => {
    if (won) {
      playSound('correct');
      confetti({ particleCount: 100, spread: 60 });
      adicionarSementes(1); // Ganha 1 semente por palavra descoberta
    }
    if (lost) {
      playSound('wrong');
    }
  }, [won, lost]);

  const guess = (letter: string) => {
    if (won || lost) return;
    
    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      const err = wrongGuesses + 1;
      setWrongGuesses(err);
      if (err >= maxErros) setLost(true);
    } else {
      // Check win
      let isWin = true;
      for (const char of word) {
        if (!newGuessed.has(char)) {
          isWin = false;
          break;
        }
      }
      if (isWin) setWon(true);
    }
  };

  const nextWord = () => {
    setCurrentWordIdx((prev) => (prev + 1) % palavras.length);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setWon(false);
    setLost(false);
  };

  const keyboard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  return (
    <div className="w-full flex flex-col items-center bg-white dark:bg-surface-100 p-6 rounded-2xl shadow-sm border border-surface-200">
      <h3 className="text-xl font-bold text-surface-800 mb-2">Jogo da Forca: {tema}</h3>
      
      {/* Forca Drawing */}
      <div className="font-mono text-2xl font-bold text-surface-700 whitespace-pre bg-surface-50 p-4 rounded-xl border border-surface-200 mb-6 w-full max-w-[200px] text-center">
        {wrongGuesses === 0 && "  +---+\n  |   |\n      |\n      |\n      |\n      |"}
        {wrongGuesses === 1 && "  +---+\n  |   |\n  O   |\n      |\n      |\n      |"}
        {wrongGuesses === 2 && "  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |"}
        {wrongGuesses === 3 && "  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |"}
        {wrongGuesses === 4 && "  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |"}
        {wrongGuesses === 5 && "  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |"}
        {wrongGuesses >= 6 && "  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |"}
      </div>

      {/* Word */}
      <div className="flex gap-2 flex-wrap justify-center mb-8">
        {word.split('').map((char, i) => (
          <div key={i} className="w-10 h-12 border-b-4 border-surface-800 flex items-center justify-center text-3xl font-black text-primary-600">
            {(guessedLetters.has(char) || lost) ? char : ''}
          </div>
        ))}
      </div>

      {/* Keyboard */}
      <div className="flex flex-wrap gap-2 justify-center max-w-lg mb-6">
        {keyboard.map((key) => {
          const isGuessed = guessedLetters.has(key);
          const isCorrect = isGuessed && word.includes(key);
          const isWrong = isGuessed && !word.includes(key);
          return (
            <button
              key={key}
              disabled={isGuessed || won || lost}
              onClick={() => guess(key)}
              className={`w-10 h-10 rounded-lg font-bold text-lg transition-all ${
                isCorrect ? 'bg-emerald-500 text-white border-b-4 border-emerald-600' :
                isWrong ? 'bg-surface-200 text-surface-400 opacity-50' :
                'bg-surface-100 text-surface-800 hover:bg-surface-200 border-b-4 border-surface-300 active:border-b-0 active:translate-y-1'
              }`}
            >
              {key}
            </button>
          )
        })}
      </div>

      {(won || lost) && (
        <div className="flex flex-col items-center animate-fade-in-up">
          <div className={`text-xl font-bold mb-4 ${won ? 'text-emerald-600' : 'text-red-500'}`}>
            {won ? '🎉 Você acertou!' : `😢 Poxa! A palavra era ${word}`}
          </div>
          <button onClick={nextWord} className="px-6 py-3 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 shadow-md">
            Próxima Palavra
          </button>
        </div>
      )}
    </div>
  );
}
