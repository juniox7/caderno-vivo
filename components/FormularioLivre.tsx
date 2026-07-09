'use client';

import { useState, useEffect } from 'react';
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
  Plus,
  X,
  Type,
  CheckSquare,
  Image as ImageIcon,
  Puzzle,
  Minus,
} from 'lucide-react';
import { salvarNoHistorico } from '@/lib/historico';
import Link from 'next/link';
import UpgradeModal from '@/components/UpgradeModal';
import { FOCOS_PEDAGOGICOS, SUGESTOES_INTERESSES, ANOS_ESCOLARES } from '@/lib/constants';
import { AtividadeGerada } from '@/lib/types';
import PreviewAtividade from './PreviewAtividade';
import { toast } from 'sonner';
import CacaPalavras from './CacaPalavras';
import Labirinto from './Labirinto';
import { registrarAtividade } from '@/lib/gamificacao';
import LoadingMascote from './LoadingMascote';

export default function FormularioLivre() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nomes, setNomes] = useState<string[]>(['']);
  const [personagensAleatorios, setPersonagensAleatorios] = useState(false);
  const [idade, setIdade] = useState(7);
  const [anoEscolar, setAnoEscolar] = useState('2ano');
  
  // NEW STATE: Focos Selecionados
  const [focosSelecionados, setFocosSelecionados] = useState<{id: string, label: string, emoji: string, qtd: number}[]>([
    {id: 'matematica', label: 'Matemática', emoji: '🔢', qtd: 5}
  ]);
  const isLivre = focosSelecionados.some(f => f.id === 'livre');
  const qtdQuestoes = focosSelecionados.reduce((acc, curr) => acc + curr.qtd, 0);

  const [nivel, setNivel] = useState('medio');
  const [interesse1, setInteresse1] = useState('');
  const [interesse2, setInteresse2] = useState('');
  const [formatoResposta, setFormatoResposta] = useState<'escrita' | 'multipla_escolha' | 'sem_pergunta'>('escrita');
  const [showSugestoes1, setShowSugestoes1] = useState(false);
  const [showSugestoes2, setShowSugestoes2] = useState(false);
  const [tipoAtividade, setTipoAtividade] = useState<'historia' | 'caca_palavras' | 'labirinto'>('historia');
  const [puzzleGerados, setPuzzleGerados] = useState<any[]>([]);
  
  const [gerarImagens, setGerarImagens] = useState(false);
  const [estiloImagem, setEstiloImagem] = useState<'colorir'|'ilustracao'>('colorir');
  const [qtdImagens, setQtdImagens] = useState(1);
  const [qtdPuzzles, setQtdPuzzles] = useState(1);
  const [promptLivre, setPromptLivre] = useState('');
  
  const [atividadeGerada, setAtividadeGerada] = useState<AtividadeGerada | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('cadernoVivo_ultimoForm');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nomes) setNomes(parsed.nomes);
        if (parsed.idade) setIdade(parsed.idade);
        if (parsed.focosSelecionados) setFocosSelecionados(parsed.focosSelecionados);
        if (parsed.nivel) setNivel(parsed.nivel);
        if (parsed.formatoResposta) setFormatoResposta(parsed.formatoResposta);
      }
    } catch (e) {}
  }, []);

  const preencherRecomendado = () => {
    const nomesRandom = ['Leo', 'Malu', 'Pedro', 'Bia', 'João', 'Clara', 'Miguel', 'Alice', 'Enzo', 'Valentina'];
    const nomeSorteado = nomesRandom[Math.floor(Math.random() * nomesRandom.length)];
    
    // Pegar foco aleatório (exceto o último que é 'livre')
    const focoIndex = Math.floor(Math.random() * (FOCOS_PEDAGOGICOS.length - 1));
    const focoSorteado = FOCOS_PEDAGOGICOS[focoIndex];
    
    // Pegar interesses aleatórios diferentes
    const int1Index = Math.floor(Math.random() * SUGESTOES_INTERESSES.length);
    let int2Index = Math.floor(Math.random() * SUGESTOES_INTERESSES.length);
    while (int2Index === int1Index) {
      int2Index = Math.floor(Math.random() * SUGESTOES_INTERESSES.length);
    }
    
    const removeEmoji = (str: string) => str.replace(/^[\u{1F300}-\u{1FAD6}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u, '');
    
    const idades = [5, 6, 7, 8, 9, 10];
    const idadeSorteada = idades[Math.floor(Math.random() * idades.length)];

    setNomes([nomeSorteado]);
    setIdade(idadeSorteada);
    setFocosSelecionados([{ id: focoSorteado.id, label: focoSorteado.label, emoji: focoSorteado.emoji, qtd: 5 }]);
    setInteresse1(removeEmoji(SUGESTOES_INTERESSES[int1Index]));
    setInteresse2(removeEmoji(SUGESTOES_INTERESSES[int2Index]));
  };

  const handleToggleFoco = (foco: typeof FOCOS_PEDAGOGICOS[0]) => {
    if (focosSelecionados.find(f => f.id === foco.id)) {
      if (focosSelecionados.length > 1) {
        setFocosSelecionados(focosSelecionados.filter(f => f.id !== foco.id));
      } else {
        toast.error('Você precisa selecionar pelo menos uma matéria.');
      }
    } else {
      if (focosSelecionados.length < 3) {
        // Find remaining questions up to 10
        const currentTotal = focosSelecionados.reduce((acc, curr) => acc + curr.qtd, 0);
        let newQtd = 3; // default
        if (currentTotal + newQtd > 10) {
          newQtd = Math.max(1, 10 - currentTotal);
        }
        setFocosSelecionados([...focosSelecionados, { id: foco.id, label: foco.label, emoji: foco.emoji, qtd: newQtd }]);
      } else {
        toast.error('Você pode selecionar no máximo 3 matérias ao mesmo tempo.');
      }
    }
  };

  const handleUpdateFocoQtd = (id: string, delta: number) => {
    const currentTotal = focosSelecionados.reduce((acc, curr) => acc + curr.qtd, 0);
    
    setFocosSelecionados(focosSelecionados.map(f => {
      if (f.id === id) {
        const newQtd = f.qtd + delta;
        if (newQtd < 1) return f;
        if (delta > 0 && currentTotal >= 10) {
          toast.error('O máximo total é de 10 perguntas.');
          return f;
        }
        return { ...f, qtd: newQtd };
      }
      return f;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validNomes = nomes.filter(n => n.trim() !== '');
    if (!personagensAleatorios && validNomes.length === 0 && tipoAtividade === 'historia') return;

    setLoading(true);

    try {
      // Save form state for retry
      sessionStorage.setItem('cadernoVivo_ultimoForm', JSON.stringify({
        nomes: validNomes,
        idade,
        focosSelecionados,
        nivel,
        formatoResposta
      }));

      if (tipoAtividade !== 'historia') {
        const puzzlesData = [];
        for (let i = 0; i < qtdPuzzles; i++) {
          const r = await fetch('/api/generate-puzzle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tipoAtividade,
              tema: interesse1 || 'Aleatório',
              dificuldade: nivel,
            }),
          });
          if (r.status === 403) throw new Error('Payment Required');
          const data = await r.json();
          if (data.error) throw new Error(data.error);
          puzzlesData.push(data);
          
          if (i < qtdPuzzles - 1) {
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        }

        setPuzzleGerados(puzzlesData);
        setAtividadeGerada(null);
        setLoading(false);
        registrarAtividade(tipoAtividade); // gamification
        setTimeout(() => {
          document.getElementById('resultado-inline')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        return;
      }

      // Fetch LLM Story
      const rStory = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomes: personagensAleatorios ? [] : validNomes,
          idade,
          focosSelecionados,
          interesse1: interesse1.trim(),
          interesse2: interesse2.trim(),
          nivel,
          formatoResposta,
          promptLivre: isLivre ? promptLivre : undefined,
        }),
      });
      if (rStory.status === 403) throw new Error('Payment Required');
      const storyRes = await rStory.json();
      if (storyRes.error) throw new Error(storyRes.error);

      // Fetch Fal.ai Images only if requested
      const imageResults = [];
      if (gerarImagens && qtdImagens > 0) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Espera 5s após a história
        
        for (let i = 0; i < qtdImagens; i++) {
          const rImg = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              interesse1: interesse1.trim(),
              interesse2: interesse2.trim(),
              promptLivre: isLivre ? promptLivre : undefined,
              index: i,
              estiloImagem
            }),
          });
          if (rImg.status === 403) throw new Error('Payment Required');
          const imgData = await rImg.json();
          if (imgData.error) throw new Error(imgData.error);
          imageResults.push(imgData);

          if (i < qtdImagens - 1) {
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        }
      }
      
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
        foco: focosSelecionados.map(f => f.label).join(', '),
        modo: 'Livre',
        imagens: imageResults.map(img => img?.imageUrl).filter(Boolean) as string[]
      });
      
      registrarAtividade('historia'); // gamification
      
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

            {/* Idade */}
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
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-primary-400 [&::-webkit-slider-thumb]:to-primary-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary-200 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                />
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
            </>
            )}

            {/* Dificuldade */}
            <div className="space-y-2 animate-fade-in-up">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <Target className="w-4 h-4 text-primary-500" />
                Dificuldade
              </label>
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 border border-surface-200 text-surface-800 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all appearance-none cursor-pointer shadow-sm"
              >
                <option value="facil">Fácil</option>
                <option value="medio">Médio</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>

            {tipoAtividade === 'historia' && (
              <>
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

            {/* Foco pedagógico - MULTIPLE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                  <Target className="w-4 h-4 text-primary-500" />
                  Matérias (Selecione de 1 a 3)
                </label>
                <span className="text-xs font-bold bg-primary-100 text-primary-700 px-2 py-1 rounded-md">
                  {focosSelecionados.length}/3
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {FOCOS_PEDAGOGICOS.map((foco) => {
                  const isSelected = focosSelecionados.some(f => f.id === foco.id);
                  return (
                    <button
                      key={foco.id}
                      type="button"
                      onClick={() => handleToggleFoco(foco)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                          : 'bg-white dark:bg-surface-100 dark:text-surface-800 text-surface-500 border border-surface-200 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 shadow-sm'
                      }`}
                    >
                      {foco.emoji} {foco.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Distribuição de Questões */}
            {formatoResposta !== 'sem_pergunta' && (
              <div className="space-y-3 bg-white dark:bg-surface-100 dark:text-surface-800 p-4 border border-surface-200 rounded-xl shadow-sm animate-fade-in-up">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                    <ListOrdered className="w-4 h-4 text-primary-500" />
                    Distribuição de Perguntas
                  </label>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${qtdQuestoes === 10 ? 'bg-amber-100 text-amber-700' : 'bg-primary-100 text-primary-700'}`}>
                    Total: {qtdQuestoes}/10
                  </span>
                </div>
                
                <div className="space-y-3">
                  {focosSelecionados.map(foco => (
                    <div key={foco.id} className="flex items-center justify-between bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 p-2 rounded-lg border border-surface-100">
                      <span className="text-sm font-medium flex items-center gap-2">
                        {foco.emoji} {foco.label}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleUpdateFocoQtd(foco.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-surface-200 text-surface-600 hover:bg-surface-100 active:scale-95 transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold w-4 text-center">{foco.qtd}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateFocoQtd(foco.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-surface-200 text-surface-600 hover:bg-surface-100 active:scale-95 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prompt Personalizado */}
            {isLivre && (
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
                  placeholder="Ex: Quero que a história passe uma lição sobre amizade..."
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
              </label>
              <div className="relative">
                <input
                  id="interesse1-input"
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
                  Escrita
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
                <button
                  type="button"
                  onClick={() => setFormatoResposta('sem_pergunta')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all border ${
                    formatoResposta === 'sem_pergunta'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                      : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-500 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Só História
                </button>
              </div>
            </div>

            {/* Gerar Imagens Toggle */}
            {isLivre && (
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

                  <div className="pl-4 pr-4 py-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-800">Quantidade (Máx 5):</span>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={qtdImagens > 5 ? 5 : qtdImagens}
                        onChange={(e) => setQtdImagens(Number(e.target.value))}
                        className="w-32 h-2 rounded-full appearance-none cursor-pointer bg-indigo-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600"
                      />
                      <span className="font-bold text-indigo-700 w-6 text-center">{qtdImagens > 5 ? 5 : qtdImagens}</span>
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
                  Quantidade de Puzzles (Máx 5): <span className="text-primary-600 font-extrabold">{qtdPuzzles > 5 ? 5 : qtdPuzzles}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={qtdPuzzles > 5 ? 5 : qtdPuzzles}
                  onChange={(e) => setQtdPuzzles(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-200 mt-2
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-primary-400 [&::-webkit-slider-thumb]:to-primary-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary-200"
                />
              </div>
            )}

            )}
            
            {loading ? (
              <LoadingMascote 
                nomes={nomes} 
                interesse={interesse1} 
                focos={focosSelecionados.map(f => f.label)} 
              />
            ) : (
              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base transition-all hover:shadow-xl hover:shadow-primary-200 active:scale-[0.98] flex items-center justify-center gap-2.5 mt-2"
              >
                <Sparkles className="w-5 h-5" />
                Gerar Meu Caderno
              </button>
            )}
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
              
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => {
                    setPuzzleGerados([]);
                    setAtividadeGerada(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // Focus na div do interesse
                    document.getElementById('interesse1-input')?.focus();
                  }}
                  className="px-6 py-3 rounded-xl bg-primary-100 text-primary-700 font-bold hover:bg-primary-200 transition-colors"
                >
                  Criar Outra Atividade
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
