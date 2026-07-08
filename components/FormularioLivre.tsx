'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowLeft,
  User,
  Calendar,
  GraduationCap,
  Target,
  Heart,
  Loader2,
  Wand2,
  MessageSquare,
  ListOrdered,
  Palette,
  Plus,
  X,
  Type,
  CheckSquare,
  Image as ImageIcon,
  Puzzle,
} from 'lucide-react';
import { salvarNoHistorico } from '@/lib/historico';
import Link from 'next/link';
import UpgradeModal from '@/components/UpgradeModal';
import { FOCOS_PEDAGOGICOS, SUGESTOES_INTERESSES, ANOS_ESCOLARES } from '@/lib/constants';
import { FocoPedagogico, AtividadeGerada } from '@/lib/types';
import PreviewAtividade from './PreviewAtividade';
import { toast } from 'sonner';
import CacaPalavras from './CacaPalavras';
import Labirinto from './Labirinto';

export default function FormularioLivre() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nomes, setNomes] = useState<string[]>(['']);
  const [personagensAleatorios, setPersonagensAleatorios] = useState(false);
  const [idade, setIdade] = useState(7);
  const [anoEscolar, setAnoEscolar] = useState('2ano');
  const [focoPedagogico, setFocoPedagogico] = useState<FocoPedagogico>('matematica');
  const [interesse1, setInteresse1] = useState('');
  const [interesse2, setInteresse2] = useState('');
  const [formatoResposta, setFormatoResposta] = useState<'escrita' | 'multipla_escolha'>('escrita');
  const [showSugestoes1, setShowSugestoes1] = useState(false);
  const [showSugestoes2, setShowSugestoes2] = useState(false);
  const [tipoAtividade, setTipoAtividade] = useState<'historia' | 'caca_palavras' | 'labirinto'>('historia');
  const [puzzleGerados, setPuzzleGerados] = useState<any[]>([]);
  
  const [gerarImagens, setGerarImagens] = useState(false);
  const [estiloImagem, setEstiloImagem] = useState<'colorir'|'ilustracao'>('colorir');
  const [qtdImagens, setQtdImagens] = useState(1);
  const [qtdPuzzles, setQtdPuzzles] = useState(1);
  const [qtdQuestoes, setQtdQuestoes] = useState(5);
  const [promptLivre, setPromptLivre] = useState('');
  
  const [atividadeGerada, setAtividadeGerada] = useState<AtividadeGerada | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const preencherRecomendado = () => {
    setNomes(['Lucas']);
    setIdade(8);
    setAnoEscolar('3ano');
    setFocoPedagogico('matematica');
    setInteresse1('Futebol (Fluminense e Manchester City)');
    setInteresse2('Música (Violão e teclado com teclas sensíveis ao toque)');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validNomes = nomes.filter(n => n.trim() !== '');
    if (!personagensAleatorios && validNomes.length === 0 && tipoAtividade === 'historia') return;

    setLoading(true);

    try {
      if (tipoAtividade !== 'historia') {
        const puzzlePromises = [];
        for (let i = 0; i < qtdPuzzles; i++) {
          puzzlePromises.push(
            fetch('/api/generate-puzzle', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                tipoAtividade,
                tema: interesse1 || 'Aleatório',
              }),
            }).then(async r => {
              if (r.status === 403) throw new Error('Payment Required');
              const data = await r.json();
              if (data.error) throw new Error(data.error);
              return data;
            })
          );
        }

        const puzzlesData = await Promise.all(puzzlePromises);
        setPuzzleGerados(puzzlesData);
        setAtividadeGerada(null);
        setLoading(false);
        setTimeout(() => {
          document.getElementById('resultado-inline')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        return;
      }

      // Fetch LLM Story
      const storyPromise = fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomes: personagensAleatorios ? [] : validNomes,
          idade,
          focoPedagogico,
          interesse1: interesse1.trim(),
          interesse2: interesse2.trim(),
          qtdQuestoes,
          formatoResposta,
          promptLivre: focoPedagogico === 'livre' ? promptLivre : undefined,
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
                interesse1: interesse1.trim(),
                interesse2: interesse2.trim(),
                promptLivre: focoPedagogico === 'livre' ? promptLivre : undefined,
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
                ? `Ilustração ${idx + 1}: ${interesse1} e ${interesse2}`
                : `Pinte o desenho ${idx + 1} baseado em ${interesse1} e ${interesse2}!`,
             questoes: [],
             imagemUrl: imgRes.imageUrl
           });
        }
      });

      // Remove the redirect and show inline instead
      setAtividadeGerada(atividade);
      setLoading(false);
      
      // Save to historico
      salvarNoHistorico({
        titulo: atividade.titulo,
        subtitulo: atividade.subtitulo,
        foco: focoPedagogico,
        modo: 'Livre',
        imagens: imageResults.map(img => img?.imageUrl).filter(Boolean) as string[]
      });
      
      // Scroll smoothly to the result
      setTimeout(() => {
        document.getElementById('resultado-inline')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err: any) {
      console.error('Erro ao gerar atividade:', err);
      if (err.message === 'Payment Required') {
        setShowUpgradeModal(true);
      } else {
        toast.error('Erro ao gerar atividade. Tente novamente.');
      }
      setLoading(false);
    }
  };

  const selecionarSugestao = (
    sugestao: string,
    campo: 1 | 2
  ) => {
    const clean = sugestao.replace(/^[\u{1F300}-\u{1FAD6}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u, '');
    if (campo === 1) {
      setInteresse1(clean);
      setShowSugestoes1(false);
    } else {
      setInteresse2(clean);
      setShowSugestoes2(false);
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

  const isFormValid = tipoAtividade !== 'historia' ? interesse1.trim() !== '' : (personagensAleatorios || nomes.some(n => n.trim() !== ''));

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100">
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      {/* Top bar */}
      <div className="sticky top-0 z-40 glass px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-surface-400" />
          </Link>
          <div>
            <h1
              className="text-lg font-bold text-surface-800"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              Modo Livre
            </h1>
            <p className="text-xs text-surface-400">
              Personalize cada detalhe da atividade
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
          {/* Recomendado button */}
          <button
            onClick={preencherRecomendado}
            type="button"
            className="w-full py-3.5 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 hover:bg-amber-100 hover:border-amber-400 text-amber-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Wand2 className="w-4 h-4" />
            ✨ Recomendado — Preencher automaticamente
          </button>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tipo de Atividade */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <Wand2 className="w-4 h-4 text-primary-500" />
                Tipo de Atividade
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTipoAtividade('historia')}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border ${
                    tipoAtividade === 'historia' ? 'bg-primary-50 border-primary-300 text-primary-700 shadow-sm' : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-500 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'
                  }`}
                >📖 História</button>
                <button
                  type="button"
                  onClick={() => setTipoAtividade('caca_palavras')}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border ${
                    tipoAtividade === 'caca_palavras' ? 'bg-primary-50 border-primary-300 text-primary-700 shadow-sm' : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-500 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'
                  }`}
                >🔍 Caça-Palavras</button>
                <button
                  type="button"
                  onClick={() => setTipoAtividade('labirinto')}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border ${
                    tipoAtividade === 'labirinto' ? 'bg-primary-50 border-primary-300 text-primary-700 shadow-sm' : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-500 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'
                  }`}
                >🌀 Labirinto</button>
              </div>
            </div>

            {tipoAtividade === 'historia' && (
              <>
            {/* Nomes */}
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
                          placeholder={index === 0 ? "Ex: Lucas, Maria..." : `Nome ${index + 1}...`}
                          required={index === 0}
                          className="flex-1 px-4 py-3.5 rounded-xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 text-surface-800 placeholder-surface-300 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all shadow-sm"
                        />
                        {nomes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveNome(index)}
                            className="p-3.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100"
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

            {/* Idade - slider visual */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <Calendar className="w-4 h-4 text-primary-500" />
                Idade:{' '}
                <span className="text-primary-600 font-extrabold text-lg">
                  {idade} anos
                </span>
              </label>
              <div className="relative">
                <input
                  type="range"
                  min={3}
                  max={12}
                  value={idade}
                  onChange={(e) => setIdade(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-200
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-primary-400 [&::-webkit-slider-thumb]:to-primary-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary-200 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
                    [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-primary-400 [&::-moz-range-thumb]:to-primary-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg"
                />
                {/* Age labels */}
                <div className="flex justify-between mt-1.5 px-1">
                  {Array.from({ length: 10 }, (_, i) => i + 3).map((n) => (
                    <span
                      key={n}
                      className={`text-[10px] font-medium ${n === idade ? 'text-primary-600' : 'text-surface-300'}`}
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Ano escolar */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <GraduationCap className="w-4 h-4 text-primary-500" />
                Ano Escolar
              </label>
              <select
                value={anoEscolar}
                onChange={(e) => setAnoEscolar(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 text-surface-800 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all shadow-sm appearance-none cursor-pointer"
              >
                {ANOS_ESCOLARES.map((ano) => (
                  <option key={ano.value} value={ano.value}>
                    {ano.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Foco pedagógico - chips */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <Target className="w-4 h-4 text-primary-500" />
                Foco Pedagógico
              </label>
              <div className="flex flex-wrap gap-2">
                {FOCOS_PEDAGOGICOS.map((foco) => (
                  <button
                    key={foco.id}
                    type="button"
                    onClick={() => setFocoPedagogico(foco.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                      focoPedagogico === foco.id
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                        : 'bg-white dark:bg-surface-100 dark:text-surface-800 text-surface-500 border border-surface-200 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 shadow-sm'
                    }`}
                  >
                    {foco.emoji} {foco.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Personalizado (Apenas Tema Livre) */}
            {focoPedagogico === 'livre' && (
              <div className="space-y-2 animate-fade-in-up">
                <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                  <MessageSquare className="w-4 h-4 text-primary-500" />
                  Instruções Especiais
                  <span className="text-xs text-surface-300 font-normal">
                    (opcional)
                  </span>
                </label>
                <textarea
                  value={promptLivre}
                  onChange={(e) => setPromptLivre(e.target.value)}
                  placeholder="Ex: Quero que a história passe uma lição sobre amizade e que as perguntas sejam sobre os animais que ele encontrou..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 text-surface-800 placeholder-surface-300 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all shadow-sm resize-none"
                />
              </div>
            )}
            </>
            )}

            {/* Interesse 1 */}
            <div className="space-y-2 relative z-20">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <Heart className="w-4 h-4 text-primary-500" />
                {tipoAtividade === 'historia' ? 'Interesses da criança' : 'Tema do Desafio'}
                <span className="text-xs text-surface-300 font-normal">
                  (o que a criança adora?)
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={interesse1}
                  onChange={(e) => setInteresse1(e.target.value)}
                  onFocus={() => setShowSugestoes1(true)}
                  onBlur={() => setTimeout(() => setShowSugestoes1(false), 200)}
                  placeholder="Ex: Futebol, Dinossauros, Música..."
                  className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 text-surface-800 placeholder-surface-300 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all shadow-sm pr-10"
                />
                <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              </div>
              {showSugestoes1 && (
                <div className="flex flex-wrap gap-1.5 animate-fade-in">
                  {SUGESTOES_INTERESSES.slice(0, 8).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={() => selecionarSugestao(s, 1)}
                      className="px-2.5 py-1 rounded-lg bg-surface-100 text-surface-500 text-xs hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Interesse 2 */}
            {tipoAtividade === 'historia' && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <Heart className="w-4 h-4 text-pink-500" />
                Interesse 2
                <span className="text-xs text-surface-300 font-normal">
                  (outro tema que anima!)
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={interesse2}
                  onChange={(e) => setInteresse2(e.target.value)}
                  onFocus={() => setShowSugestoes2(true)}
                  onBlur={() => setTimeout(() => setShowSugestoes2(false), 200)}
                  placeholder="Ex: Espaço, Games, Animais..."
                  className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 text-surface-800 placeholder-surface-300 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all shadow-sm pr-10"
                />
                <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              </div>
              {showSugestoes2 && (
                <div className="flex flex-wrap gap-1.5 animate-fade-in">
                  {SUGESTOES_INTERESSES.slice(7, 15).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={() => selecionarSugestao(s, 2)}
                      className="px-2.5 py-1 rounded-lg bg-surface-100 text-surface-500 text-xs hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            )}

            {tipoAtividade === 'historia' && (
              <>
            {/* Formato de Resposta */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <CheckSquare className="w-4 h-4 text-primary-500" />
                Formato das Perguntas
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormatoResposta('escrita')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all border ${
                    formatoResposta === 'escrita'
                      ? 'bg-primary-50 border-primary-300 text-primary-700 shadow-sm'
                      : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-500 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  Escrita (Livre)
                </button>
                <button
                  type="button"
                  onClick={() => setFormatoResposta('multipla_escolha')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all border ${
                    formatoResposta === 'multipla_escolha'
                      ? 'bg-primary-50 border-primary-300 text-primary-700 shadow-sm'
                      : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-500 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'
                  }`}
                >
                  <ListOrdered className="w-4 h-4" />
                  A, B, C, D
                </button>
              </div>
            </div>

            {/* Gerar Perguntas Toggle & Slider */}
            <div className="space-y-3 pt-2">
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

            {/* Gerar Imagens Toggle (Apenas Tema Livre) */}
            {focoPedagogico === 'livre' && (
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
            </>
            )}

            {tipoAtividade !== 'historia' && (
              <div className="space-y-3 pt-2 animate-fade-in-up">
                <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                  <Puzzle className="w-4 h-4 text-primary-500" />
                  Quantidade de Puzzles (Máx 10): <span className="text-primary-600 font-extrabold">{qtdPuzzles}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={qtdPuzzles}
                  onChange={(e) => setQtdPuzzles(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-200 mt-2
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-primary-400 [&::-webkit-slider-thumb]:to-primary-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary-200"
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base transition-all hover:shadow-xl hover:shadow-primary-200 active:scale-[0.98] flex items-center justify-center gap-2.5 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando atividade com IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Meu Caderno
                </>
              )}
            </button>
          </form>
          
          {/* Resultado Inline */}
          {atividadeGerada && (
            <div id="resultado-inline" className="mt-8 pt-8 border-t-2 border-dashed border-surface-200 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-surface-800 mb-6 text-center" style={{ fontFamily: 'var(--font-baloo)' }}>
                Seu Caderno Está Pronto! 🎉
              </h2>
              <PreviewAtividade 
                atividade={atividadeGerada} 
                modo="livre"
              />
            </div>
          )}

          {puzzleGerados.length > 0 && (
            <div id="resultado-inline" className="mt-8 pt-8 border-t-2 border-dashed border-surface-200 animate-fade-in-up space-y-6">
              <h2 className="text-2xl font-bold text-surface-800 mb-6 text-center" style={{ fontFamily: 'var(--font-baloo)' }}>
                Seus Quebra-Cabeças Estão Prontos! 🎉
              </h2>
              {puzzleGerados.map((puzzle, index) => (
                <div key={index} className="print:break-after-page print:mt-12">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
