import { MazeGrid } from '@/lib/maze';
import { Sparkles, Printer } from 'lucide-react';

interface LabirintoProps {
  mazeGrid: MazeGrid;
  tema: string;
  inicio: string;
  fim: string;
}

export default function Labirinto({ mazeGrid, tema, inicio, fim }: LabirintoProps) {
  const height = mazeGrid.length;
  const width = mazeGrid[0].length;

  return (
    <div className="bg-white dark:bg-surface-100 dark:text-surface-800 rounded-2xl shadow-xl overflow-hidden border border-surface-200 p-6 sm:p-8 animate-fade-in text-center max-w-xl mx-auto w-full print:break-inside-avoid print:shadow-none print:border-none print:w-full print:max-w-none print:mx-0 print:my-4 print:p-0">
      <div className="flex items-center justify-between mb-8 no-print">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-surface-800 flex items-center gap-2" style={{ fontFamily: 'var(--font-baloo)' }}>
            <Sparkles className="w-6 h-6 text-primary-500" />
            Labirinto: {tema}
          </h2>
          <p className="text-surface-500">Ajude o {inicio} a encontrar o {fim}!</p>
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
      
      <div className="flex justify-center mb-4">
        <div className="inline-block bg-white dark:bg-surface-100 dark:text-surface-800 p-2">
          <div className="flex flex-col" style={{ border: '2px solid var(--color-surface-800)' }}>
            {mazeGrid.map((row, y) => (
              <div key={y} className="flex">
                {row.map((cell, x) => {
                  const isStart = x === 0 && y === 0;
                  const isEnd = x === width - 1 && y === height - 1;

                  return (
                    <div 
                      key={`${x}-${y}`} 
                      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-2xl"
                      style={{
                        borderTop: cell.top ? '2px solid var(--color-surface-800)' : '2px solid transparent',
                        borderRight: cell.right ? '2px solid var(--color-surface-800)' : '2px solid transparent',
                        borderBottom: cell.bottom ? '2px solid var(--color-surface-800)' : '2px solid transparent',
                        borderLeft: cell.left ? '2px solid var(--color-surface-800)' : '2px solid transparent',
                        backgroundColor: (isStart || isEnd) ? 'var(--color-primary-50)' : 'transparent',
                      }}
                    >
                      {isStart && <span className="animate-bounce">{inicio}</span>}
                      {isEnd && <span>{fim}</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
