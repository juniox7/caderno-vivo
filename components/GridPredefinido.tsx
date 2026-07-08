'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Calendar, Loader2, Sparkles, Image as ImageIcon, ListOrdered, Plus, X, Type, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import { CATEGORIAS_PREDEFINIDAS } from '@/lib/constants';
import { AtividadeGerada } from '@/lib/types';
import UpgradeModal from '@/components/UpgradeModal';
import PreviewAtividade from './PreviewAtividade';
import { salvarNoHistorico } from '@/lib/historico';
import { toast } from 'sonner';

export default function GridPredefinido() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nomes, setNomes] = useState<string[]>(['']);
  const [personagensAleatorios, setPersonagensAleatorios] = useState(false);
  const [idade, setIdade] = useState(6);
  const [loading, setLoading] = useState(false);
  const [formatoResposta, setFormatoResposta] = useState<'escrita' | 'multipla_escolha'>('escrita');
  const [gerarImagens, setGerarImagens] = useState(false);
  const [estiloImagem, setEstiloImagem] = useState<'colorir'|'ilustracao'>('colorir');
  const [qtdImagens, setQtdImagens] = useState(1);
  const [qtdQuestoes, setQtdQuestoes] = useState(5);
  const [atividadeGerada, setAtividadeGerada] = useState<AtividadeGerada | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const categoria = selectedId ? CATEGORIAS_PREDEFINIDAS.find(c => c.id === selectedId) : null;

  const handleGerar = async () => {
    const validNomes = nomes.filter(n => n.trim() !== '');
    if (!personagensAleatorios && validNomes.length === 0) return;
    if (!selectedId) return;

    setLoading(true);
    try {
      // Fetch LLM Story
      const storyPromise = fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomes: personagensAleatorios ? [] : validNomes,
          idade,
          focoPedagogico: categoria?.focoPedagogico || 'livre',
          interesse1: categoria?.titulo || 'Diversão',
          interesse2: 'Atividades infantis',
          qtdQuestoes,
          formatoResposta,
        }),
      }).then(async r => {
        if (r.status === 403) throw new Error('Payment Required');
        return r.json();
      });

      // Fetch Fal.ai Images only if requested
      const imagePromises = [];
      if (gerarImagens && qtdImagens > 0) {
        for (let i = 0; i < qtdImagens; i++) {
          imagePromises.push(
            fetch('/api/generate-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                interesse1: categoria?.titulo || 'Crianças',
                interesse2: 'desenho divertido',
                index: i,
                estiloImagem
              }),
            }).then(async r => {
              if (r.status === 403) throw new Error('Payment Required');
              return r.json();
            })
          );
        }
      }

      const [storyRes, ...imageResults] = await Promise.all([storyPromise, ...imagePromises]);

      if (storyRes.error) throw new Error(storyRes.error);
      
      const atividade = storyRes.atividade;
      
      // Inject image URLs into the result if available
      imageResults.forEach((imgRes, idx) => {
        if (imgRes && imgRes.imageUrl) {
           atividade.atividades.unshift({
             tipo: estiloImagem === 'ilustracao' ? 'ilustracao' : 'desenho_para_colorir',
             enunciado: estiloImagem === 'ilustracao'
                ? `Ilustração ${idx + 1}: ${categoria?.titulo || 'Crianças'}`
                : `Pinte o desenho ${idx + 1} do tema ${categoria?.titulo}!`,
             questoes: [],
             imagemUrl: imgRes.imageUrl
           });
        }
      });

      // Save to historico
      salvarNoHistorico({
        titulo: atividade.titulo,
        subtitulo: atividade.subtitulo,
        foco: categoria?.focoPedagogico || 'predefinido',
        modo: 'Predefinido',
        imagens: imageResults.map(img => img?.imageUrl).filter(Boolean) as string[]
      });

      // Remove the redirect and show inline instead
      setAtividadeGerada(atividade);
      setLoading(false);
      
      // Scroll smoothly to the result
      setTimeout(() => {
        document.getElementById('resultado-inline')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err: any) {
      console.error('Erro:', err);
      if (err.message === 'Payment Required') {
        setShowUpgradeModal(true);
      } else {
        toast.error('Erro ao gerar atividade. Tente novamente.');
      }
      setLoading(false);
    }
  };

  const handleAddNome = () => {
    if (nomes.length < 6) {
      setNomes([...nomes, '']);
    }
  };

  const handleRemoveNome = (index: number) => {
    if (nomes.length > 1) {
      setNomes(nomes.filter((_, i) => i !== index));
    }
  };

  const handleNomeChange = (index: number, value: string) => {
    const newNomes = [...nomes];
    newNomes[index] = value;
    setNomes(newNomes);
  };

  const isFormValid = personagensAleatorios || nomes.some(n => n.trim() !== '');

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100">
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      {/* Top bar */}
      <div className="sticky top-0 z-40 glass px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-surface-400" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-surface-800" style={{ fontFamily: 'var(--font-baloo)' }}>
              Modo Predefinido
            </h1>
            <p className="text-xs text-surface-400">Escolha uma categoria e gere em segundos</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
          {/* Categories grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger">
            {CATEGORIAS_PREDEFINIDAS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedId(cat.id)}
                className={`text-left p-4 rounded-xl border transition-all active:scale-[0.98] shadow-sm ${
                  selectedId === cat.id
                    ? 'bg-primary-50 border-primary-300 shadow-md shadow-primary-100'
                    : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 hover:border-surface-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{cat.emoji}</span>
                  <div>
                    <h3 className="font-bold text-surface-800 text-sm">{cat.titulo}</h3>
                    <p className="text-xs text-surface-400 mt-0.5 leading-relaxed">{cat.descricao}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Quick form (shown after selection) */}
          {selectedId && (
            <div className="space-y-4 animate-fade-in-up rounded-2xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 p-5 shadow-sm">
              <p className="text-sm font-semibold text-surface-500">
                Preencha os dados básicos para personalizar:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                      <User className="w-4 h-4 text-primary-500" />
                      Para quem é a atividade?
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-surface-600 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={personagensAleatorios} 
                        onChange={(e) => setPersonagensAleatorios(e.target.checked)} 
                        className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500" 
                      />
                      Personagens Aleatórios
                    </label>
                  </div>
                  
                  {!personagensAleatorios && (
                    <>
                      <div className="space-y-2">
                        {nomes.map((nomeInput, index) => (
                          <div key={index} className="flex gap-2 animate-fade-in">
                            <input
                              type="text"
                              value={nomeInput}
                              onChange={(e) => handleNomeChange(index, e.target.value)}
                              placeholder={index === 0 ? "Ex: Lucas" : `Nome ${index + 1}...`}
                              required={index === 0}
                              className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 border border-surface-200 text-surface-800 placeholder-surface-300 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                            />
                            {nomes.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveNome(index)}
                                className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100"
                                title="Remover nome"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {nomes.length < 6 && (
                        <button
                          type="button"
                          onClick={handleAddNome}
                          className="text-sm font-medium text-primary-600 flex items-center gap-1 hover:text-primary-700 transition-colors p-1"
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar outro nome
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    Idade: <span className="text-primary-600 font-extrabold">{idade} anos</span>
                  </label>
                  <input
                    type="range"
                    min={3}
                    max={12}
                    value={idade}
                    onChange={(e) => setIdade(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-200 mt-2
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-primary-400 [&::-webkit-slider-thumb]:to-primary-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary-200"
                  />
                </div>
              </div>

              {/* Gerar Imagens Toggle (Apenas Tema Livre) */}
              {categoria?.focoPedagogico === 'livre' && (
                <div className="space-y-4 pt-2 animate-fade-in-up">
                  <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-surface-200 bg-white dark:bg-surface-100 dark:text-surface-800 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={gerarImagens}
                      onChange={(e) => setGerarImagens(e.target.checked)}
                      className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <ImageIcon className="w-5 h-5 text-indigo-500" />
                      <span className="font-semibold text-surface-700 text-sm">Adicionar desenhos para colorir (IA)</span>
                    </div>
                  </label>

                  {gerarImagens && (
                    <div className="space-y-3 animate-fade-in-up">
                      {/* Estilo da Imagem */}
                      <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEstiloImagem('colorir')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all border ${
                          estiloImagem === 'colorir'
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
                            : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-500 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'
                        }`}
                      >
                        ✏️ Para Colorir
                      </button>
                      <button
                        type="button"
                        onClick={() => setEstiloImagem('ilustracao')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all border ${
                          estiloImagem === 'ilustracao'
                            ? 'bg-fuchsia-50 border-fuchsia-300 text-fuchsia-700 shadow-sm'
                            : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-500 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'
                        }`}
                      >
                        🎨 Já Ilustrada
                      </button>
                    </div>

                    {/* Quantidade */}
                    <div className="pl-4 pr-4 py-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                      <span className="text-sm font-medium text-indigo-800">Quantidade (Máx 10):</span>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={1}
                          max={10}
                          value={qtdImagens}
                          onChange={(e) => setQtdImagens(Number(e.target.value))}
                          className="w-32 h-2 rounded-full appearance-none cursor-pointer bg-indigo-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600"
                        />
                        <span className="font-bold text-indigo-700 w-6 text-center">{qtdImagens}</span>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Gerar Perguntas Slider */}
                <div className="space-y-3">
                   <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                      <ListOrdered className="w-4 h-4 text-primary-500" />
                      Quantidade de Perguntas: <span className="text-primary-600 font-extrabold">{qtdQuestoes}</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={qtdQuestoes}
                      onChange={(e) => setQtdQuestoes(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-200 mt-2
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-primary-400 [&::-webkit-slider-thumb]:to-primary-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary-200"
                    />
                </div>
                
                {/* Formato de Resposta */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                    <CheckSquare className="w-4 h-4 text-primary-500" />
                    Formato das Perguntas
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormatoResposta('escrita')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        formatoResposta === 'escrita'
                          ? 'bg-primary-50 border-primary-300 text-primary-700 shadow-sm'
                          : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-500 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'
                      }`}
                    >
                      <Type className="w-3 h-3" />
                      Escrita
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormatoResposta('multipla_escolha')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        formatoResposta === 'multipla_escolha'
                          ? 'bg-primary-50 border-primary-300 text-primary-700 shadow-sm'
                          : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-500 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'
                      }`}
                    >
                      <ListOrdered className="w-3 h-3" />
                      Múltipla
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGerar}
                disabled={loading || !isFormValid}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all hover:shadow-xl hover:shadow-primary-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Gerar Atividade
                  </>
                )}
              </button>
            </div>
          )}
          
          {/* Resultado Inline */}
          {atividadeGerada && (
            <div id="resultado-inline" className="mt-8 pt-8 border-t-2 border-dashed border-surface-200 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-surface-800 mb-6 text-center" style={{ fontFamily: 'var(--font-baloo)' }}>
                Seu Caderno Está Pronto! 🎉
              </h2>
              <PreviewAtividade 
                atividade={atividadeGerada} 
                modo="predefinido"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
