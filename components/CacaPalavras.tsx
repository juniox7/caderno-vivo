"use client";

import { WordSearchGrid } from '@/lib/wordSearch';
import { Sparkles, Printer } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CacaPalavrasProps {
  grid: WordSearchGrid;
  palavras: string[];
  tema: string;
}

interface Pos {
  r: number;
  c: number;
}

export default function CacaPalavras({ grid, palavras, tema }: CacaPalavrasProps) {
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectionStart, setSelectionStart] = useState<Pos | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Pos | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [foundCells, setFoundCells] = useState<Pos[]>([]);

  const gridRef = useRef<HTMLDivElement>(null);

  // Normaliza as palavras (sem espaços, tudo maiúsculo) para facilitar a comparação
  const normalizedPalavras = palavras.map(p => p.toUpperCase().replace(/\s/g, ''));

  useEffect(() => {
    if (foundWords.length > 0 && foundWords.length === palavras.length) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [foundWords, palavras]);

  const getCellFromEvent = (e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent): Pos | null => {
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const element = document.elementFromPoint(clientX, clientY);
    if (!element) return null;

    const r = element.getAttribute('data-r');
    const c = element.getAttribute('data-c');

    if (r !== null && c !== null) {
      return { r: parseInt(r, 10), c: parseInt(c, 10) };
    }
    return null;
  };

  const getLineCells = (start: Pos, end: Pos): Pos[] => {
    const cells: Pos[] = [];
    const dr = end.r - start.r;
    const dc = end.c - start.c;
    
    // Determinar direção
    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
    
    // Ignora se não for reta (horizontal, vertical ou diagonal)
    if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) {
      return cells; 
    }

    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    
    for (let i = 0; i <= steps; i++) {
      cells.push({ r: start.r + i * stepR, c: start.c + i * stepC });
    }
    return cells;
  };

  const handlePointerDown = (e: React.TouchEvent | React.MouseEvent) => {
    const pos = getCellFromEvent(e);
    if (pos) {
      setIsDragging(true);
      setSelectionStart(pos);
      setSelectionEnd(pos);
    }
  };

  const handlePointerMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !selectionStart) return;
    
    const pos = getCellFromEvent(e);
    if (pos) {
      setSelectionEnd(pos);
    }
  };

  const handlePointerUp = () => {
    if (isDragging && selectionStart && selectionEnd) {
      const line = getLineCells(selectionStart, selectionEnd);
      const word = line.map(p => grid[p.r][p.c]).join('');
      const wordReverse = word.split('').reverse().join('');

      let matchedWord = '';
      if (normalizedPalavras.includes(word) && !foundWords.includes(word)) {
        matchedWord = word;
      } else if (normalizedPalavras.includes(wordReverse) && !foundWords.includes(wordReverse)) {
        matchedWord = wordReverse;
      }

      if (matchedWord) {
        setFoundWords(prev => [...prev, matchedWord]);
        setFoundCells(prev => [...prev, ...line]);
      }
    }

    setIsDragging(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const currentSelectionCells = isDragging && selectionStart && selectionEnd 
    ? getLineCells(selectionStart, selectionEnd) 
    : [];

  const isCellSelected = (r: number, c: number) => {
    return currentSelectionCells.some(p => p.r === r && p.c === c);
  };

  const isCellFound = (r: number, c: number) => {
    return foundCells.some(p => p.r === r && p.c === c);
  };

  const isWordFound = (palavra: string) => {
    const normalized = palavra.toUpperCase().replace(/\s/g, '');
    return foundWords.includes(normalized);
  };

  return (
    <div className="bg-white dark:bg-surface-100 dark:text-surface-800 rounded-2xl shadow-xl overflow-hidden border border-surface-200 p-6 sm:p-8 animate-fade-in text-center max-w-xl mx-auto w-full print:break-inside-avoid print:shadow-none print:border-none print:w-full print:max-w-none print:mx-0 print:my-4 print:p-0">
      <div className="flex items-center justify-between mb-8 no-print">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-surface-800 flex items-center gap-2" style={{ fontFamily: 'var(--font-baloo)' }}>
            <Sparkles className="w-6 h-6 text-primary-500" />
            Caça-Palavras: {tema}
          </h2>
          <p className="text-surface-500">Encontre todas as palavras escondidas! Arraste para selecionar.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 font-bold text-sm transition-colors border border-primary-200"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>
      
      <div className="flex justify-center mb-8">
        <div 
          className="inline-block bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 border-2 border-surface-200 rounded-xl p-2 sm:p-4 touch-none"
          ref={gridRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          <div className="grid gap-1 sm:gap-2" style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}>
            {grid.map((row, rowIndex) => (
              row.map((letter, colIndex) => {
                const selected = isCellSelected(rowIndex, colIndex);
                const found = isCellFound(rowIndex, colIndex);
                
                let bgColor = "bg-white dark:bg-surface-100 text-surface-700 dark:text-surface-800 border-surface-200";
                if (found) {
                  bgColor = "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border-green-300 shadow-sm";
                } else if (selected) {
                  bgColor = "bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 border-primary-300 scale-110 shadow-md z-10 relative";
                }

                return (
                  <div 
                    key={`${rowIndex}-${colIndex}`} 
                    data-r={rowIndex}
                    data-c={colIndex}
                    className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-base font-bold border rounded sm:rounded-md cursor-pointer transition-all select-none ${bgColor}`}
                  >
                    {letter}
                  </div>
                );
              })
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 p-4 rounded-xl border border-surface-200">
        <h3 className="font-bold text-surface-700 mb-3 flex items-center justify-center gap-2">
          <span>🔍</span> Palavras para Encontrar:
        </h3>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {palavras.map((palavra, index) => (
            <div 
              key={index} 
              className={`px-3 py-1.5 border rounded-lg text-sm sm:text-base font-bold shadow-sm transition-all ${isWordFound(palavra) ? 'bg-green-100 dark:bg-green-900 border-green-300 text-green-700 dark:text-green-200 line-through opacity-70' : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-600'}`}
            >
              {palavra}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
