'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { salvarNoHistorico } from '@/lib/historico';
import PreviewAtividade from './PreviewAtividade';
import UpgradeModal from './UpgradeModal';
import { AtividadeGerada } from '@/lib/types';
import { registrarAtividade } from '@/lib/gamificacao';
import LoadingMascote from './LoadingMascote';

export default function FormularioImagem() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tema, setTema] = useState('');
  const [estilo, setEstilo] = useState<'colorir' | 'ilustracao'>('colorir');
  const [quantidade, setQuantidade] = useState(1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [resultado, setResultado] = useState<AtividadeGerada | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tema.trim()) return;

    setLoading(true);

    try {
      const imageResults = [];
      for (let i = 0; i < quantidade; i++) {
        const rImg = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interesse1: tema.trim(),
            interesse2: '',
            index: i,
            estiloImagem: estilo
          }),
        });

        if (rImg.status === 403) throw new Error('Payment Required');
        const imgData = await rImg.json();
        if (imgData.error) throw new Error(imgData.error);
        
        imageResults.push(imgData);

        if (i < quantidade - 1) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }

      const imagensGeradas = imageResults.map((img, idx) => ({
        tipo: estilo === 'ilustracao' ? 'ilustracao' : 'desenho_para_colorir',
        enunciado: estilo === 'ilustracao' 
          ? `Ilustração: ${tema}`
          : `Desenho para Colorir: ${tema}`,
        questoes: [],
        imagemUrl: img.imageUrl
      }));

      const atividade: AtividadeGerada = {
        titulo: "Estúdio de Arte IA",
        subtitulo: tema,
        atividades: imagensGeradas as any
      };

      setResultado(atividade);
      setLoading(false);

      salvarNoHistorico({
        titulo: "Estúdio de Arte IA",
        subtitulo: tema,
        foco: 'Artes',
        modo: 'Arte IA',
        imagens: imageResults.map(img => img.imageUrl).filter(Boolean) as string[]
      });

      registrarAtividade('historia'); // Add generic points for now

      setTimeout(() => {
        document.getElementById('resultado-inline')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);

    } catch (err: any) {
      console.error('Erro ao gerar imagem:', err);
      if (err.message === 'Payment Required') {
        setShowUpgradeModal(true);
      } else {
        toast.error('Erro ao gerar arte. Tente novamente.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100">
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      
      <div className="sticky top-0 z-40 glass px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-surface-400" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600" style={{ fontFamily: 'var(--font-baloo)' }}>
              Estúdio de Arte IA
            </h1>
            <p className="text-xs text-surface-400">Crie desenhos incríveis em segundos</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-surface-100 p-6 sm:p-8 rounded-3xl border border-surface-200 shadow-sm">
            {/* Tema */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <Sparkles className="w-4 h-4 text-purple-500" />
                O que você quer criar?
              </label>
              <textarea
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ex: Um dinossauro astronauta andando de skate na lua..."
                rows={3}
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-[#0f172a] border border-surface-200 text-surface-800 placeholder-surface-300 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all shadow-sm resize-none"
              />
            </div>

            {/* Estilo */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <ImageIcon className="w-4 h-4 text-indigo-500" />
                Estilo da Imagem
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEstilo('colorir')}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-sm font-bold transition-all border ${
                    estilo === 'colorir'
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
                      : 'bg-surface-50 border-surface-200 text-surface-500 hover:bg-surface-100'
                  }`}
                >
                  <span className="text-2xl">✏️</span>
                  Para Colorir
                </button>
                <button
                  type="button"
                  onClick={() => setEstilo('ilustracao')}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-sm font-bold transition-all border ${
                    estilo === 'ilustracao'
                      ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-sm'
                      : 'bg-surface-50 border-surface-200 text-surface-500 hover:bg-surface-100'
                  }`}
                >
                  <span className="text-2xl">🎨</span>
                  Ilustração Completa
                </button>
              </div>
            </div>

            {/* Quantidade */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <ImageIcon className="w-4 h-4 text-pink-500" />
                Quantidade de Imagens: <span className="text-pink-600 font-extrabold">{quantidade}</span>
              </label>
              <input
                type="range"
                min={1}
                max={4}
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-200 mt-2
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-pink-400 [&::-webkit-slider-thumb]:to-pink-600 [&::-webkit-slider-thumb]:shadow-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !tema.trim()}
              className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando Obra de Arte...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Criar Arte Mágica
                </>
              )}
            </button>
          </form>

          {loading && (
            <div className="mt-8">
              <LoadingMascote
                message="Criando desenhos incríveis! O mascote está misturando as cores..."
                submessage="Isso pode levar alguns segundos dependendo da complexidade do seu pedido."
              />
            </div>
          )}

          {resultado && !loading && (
            <div id="resultado-inline" className="mt-8 pb-12 animate-fade-in-up">
              <h2 className="text-2xl font-extrabold text-surface-800 mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-baloo)' }}>
                <Sparkles className="w-6 h-6 text-purple-500" />
                Sua Arte está pronta!
              </h2>
              <div className="bg-white dark:bg-[#0f172a] rounded-3xl overflow-hidden shadow-2xl border border-surface-200 relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <PreviewAtividade 
                  atividade={resultado} 
                  idade={7} 
                  nomes={[]} 
                  tema={tema} 
                  tipo={estilo === 'ilustracao' ? 'ilustracao' : 'historia'} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
