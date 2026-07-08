import { WordSearchGrid } from '@/lib/wordSearch';
import { Sparkles, Lightbulb, Printer } from 'lucide-react';

interface CacaPalavrasProps {
  grid: WordSearchGrid;
  palavras: string[];
  tema: string;
}

export default function CacaPalavras({ grid, palavras, tema }: CacaPalavrasProps) {
  return (
    <div className="bg-white dark:bg-surface-100 dark:text-surface-800 rounded-2xl shadow-xl overflow-hidden border border-surface-200 p-6 sm:p-8 animate-fade-in text-center max-w-xl mx-auto w-full print:break-inside-avoid print:shadow-none print:border-none print:w-full print:max-w-none print:mx-0 print:my-4 print:p-0">
      <div className="flex items-center justify-between mb-8 no-print">
        <div>
          <h2 className="text-2xl font-bold text-surface-800 flex items-center gap-2" style={{ fontFamily: 'var(--font-baloo)' }}>
            <Sparkles className="w-6 h-6 text-primary-500" />
            Caça-Palavras: {tema}
          </h2>
          <p className="text-surface-500 text-left">Encontre todas as palavras escondidas no quadro!</p>
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
        <div className="inline-block bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 border-2 border-surface-200 rounded-xl p-2 sm:p-4">
          <div className="grid gap-1 sm:gap-2" style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}>
            {grid.map((row, rowIndex) => (
              row.map((letter, colIndex) => (
                <div 
                  key={`${rowIndex}-${colIndex}`} 
                  className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-base font-bold text-surface-700 bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 rounded sm:rounded-md cursor-pointer hover:bg-primary-50 hover:text-primary-600 transition-colors select-none"
                >
                  {letter}
                </div>
              ))
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
              className="px-3 py-1.5 bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 rounded-lg text-sm sm:text-base font-bold text-surface-600 shadow-sm"
            >
              {palavra}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
