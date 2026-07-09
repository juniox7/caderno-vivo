"use client";

import { MazeGrid } from '@/lib/maze';
import { Sparkles, Printer, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface LabirintoProps {
  mazeGrid: MazeGrid;
  tema: string;
  inicio: string;
  fim: string;
}

interface Pos {
  x: number;
  y: number;
}

export default function Labirinto({ mazeGrid, tema, inicio, fim }: LabirintoProps) {
  const height = mazeGrid.length;
  const width = mazeGrid[0].length;
  
  const [path, setPath] = useState<Pos[]>([{ x: 0, y: 0 }]);
  const [isDragging, setIsDragging] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (won) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [won]);

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

    const x = element.getAttribute('data-x');
    const y = element.getAttribute('data-y');

    if (x !== null && y !== null) {
      return { x: parseInt(x, 10), y: parseInt(y, 10) };
    }
    return null;
  };

  const isValidMove = (current: Pos, next: Pos) => {
    const dx = next.x - current.x;
    const dy = next.y - current.y;
    
    // Tem que ser vizinho (não pode pular na diagonal ou pular blocos)
    if (Math.abs(dx) + Math.abs(dy) !== 1) return false;
    
    const currentCell = mazeGrid[current.y][current.x];
    
    if (dx === 1 && !currentCell.right) return true; // Indo para direita
    if (dx === -1 && !currentCell.left) return true; // Indo para esquerda
    if (dy === 1 && !currentCell.bottom) return true; // Indo para baixo
    if (dy === -1 && !currentCell.top) return true; // Indo para cima
    
    return false;
  };

  const handlePointerDown = (e: React.TouchEvent | React.MouseEvent) => {
    if (won) return;
    const pos = getCellFromEvent(e);
    if (pos) {
      const lastPathPos = path[path.length - 1];
      // Só começa a arrastar se clicar na última posição do caminho percorrido
      if (pos.x === lastPathPos.x && pos.y === lastPathPos.y) {
        setIsDragging(true);
      }
    }
  };

  const handlePointerMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || won) return;
    
    const pos = getCellFromEvent(e);
    if (pos) {
      const lastPathPos = path[path.length - 1];
      
      // Se mover o dedo de volta para a penúltima casa, desfaz o movimento (apaga o caminho)
      if (path.length > 1) {
        const prevPathPos = path[path.length - 2];
        if (pos.x === prevPathPos.x && pos.y === prevPathPos.y) {
          setPath(prev => prev.slice(0, -1));
          return;
        }
      }

      // Se moveu para uma casa nova
      if (!(pos.x === lastPathPos.x && pos.y === lastPathPos.y)) {
        if (isValidMove(lastPathPos, pos)) {
          // Evita cruzar o próprio caminho (fazer loops)
          if (!path.some(p => p.x === pos.x && p.y === pos.y)) {
            setPath(prev => [...prev, pos]);
            
            // Verifica vitória
            if (pos.x === width - 1 && pos.y === height - 1) {
              setWon(true);
              setIsDragging(false);
            }
          }
        }
      }
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const resetPath = () => {
    setPath([{ x: 0, y: 0 }]);
    setWon(false);
  };

  return (
    <div className="bg-white dark:bg-surface-100 dark:text-surface-800 rounded-2xl shadow-xl overflow-hidden border border-surface-200 p-6 sm:p-8 animate-fade-in text-center max-w-xl mx-auto w-full print:break-inside-avoid print:shadow-none print:border-none print:w-full print:max-w-none print:mx-0 print:my-4 print:p-0">
      <div className="flex items-center justify-between mb-8 no-print">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-surface-800 flex items-center gap-2" style={{ fontFamily: 'var(--font-baloo)' }}>
            <Sparkles className="w-6 h-6 text-primary-500" />
            Labirinto: {tema}
          </h2>
          <p className="text-surface-500 text-sm">Arraste o dedo (ou mouse) a partir do começo para traçar o caminho!</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetPath}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-100 text-surface-600 hover:bg-surface-200 font-bold text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 font-bold text-sm transition-colors border border-primary-200"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>
      
      <div className="flex justify-center mb-4">
        <div 
          className="inline-block bg-white dark:bg-surface-100 dark:text-surface-800 p-2 touch-none select-none"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          <div className="flex flex-col" style={{ border: '2px solid var(--color-surface-800)' }}>
            {mazeGrid.map((row, y) => (
              <div key={y} className="flex">
                {row.map((cell, x) => {
                  const isStart = x === 0 && y === 0;
                  const isEnd = x === width - 1 && y === height - 1;
                  const inPath = path.some(p => p.x === x && p.y === y);
                  const isCurrentPos = path[path.length - 1].x === x && path[path.length - 1].y === y;

                  let bgColor = 'transparent';
                  if (inPath && !isStart && !isEnd) bgColor = 'var(--color-primary-100)';
                  if (isStart || isEnd) bgColor = 'var(--color-primary-50)';
                  if (inPath && won) bgColor = 'var(--color-green-100)';

                  return (
                    <div 
                      key={`${x}-${y}`} 
                      data-x={x}
                      data-y={y}
                      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-2xl cursor-pointer transition-colors relative"
                      style={{
                        borderTop: cell.top ? '2px solid var(--color-surface-800)' : '2px solid transparent',
                        borderRight: cell.right ? '2px solid var(--color-surface-800)' : '2px solid transparent',
                        borderBottom: cell.bottom ? '2px solid var(--color-surface-800)' : '2px solid transparent',
                        borderLeft: cell.left ? '2px solid var(--color-surface-800)' : '2px solid transparent',
                        backgroundColor: bgColor,
                      }}
                    >
                      {isStart && !inPath && <span className="animate-bounce pointer-events-none">{inicio}</span>}
                      {isCurrentPos && !won && <span className="animate-pulse pointer-events-none drop-shadow-md relative z-10">{inicio}</span>}
                      {isCurrentPos && won && <span className="animate-bounce pointer-events-none drop-shadow-md relative z-10">{inicio}</span>}
                      
                      {isEnd && <span className="pointer-events-none">{fim}</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      {won && (
        <div className="text-green-600 dark:text-green-400 font-bold text-lg animate-fade-in mt-4">
          Parabéns! Você encontrou a saída! 🎉
        </div>
      )}
    </div>
  );
}
