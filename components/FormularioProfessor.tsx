'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Users,
  GraduationCap,
  Target,
  BookOpen,
  BarChart3,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  X,
  Type,
  CheckSquare,
  ListOrdered,
  Wand2,
  Puzzle,
  Minus
} from 'lucide-react';
import Link from 'next/link';
import { FOCOS_PEDAGOGICOS, SERIES_PROFESSOR, NIVEIS_DIFICULDADE, SUGESTOES_INTERESSES } from '@/lib/constants';
import { NivelDificuldade, AtividadeGerada } from '@/lib/types';
import PreviewAtividade from './PreviewAtividade';
import UpgradeModal from '@/components/UpgradeModal';
import { salvarNoHistorico } from '@/lib/historico';
import { registrarAtividade } from '@/lib/gamificacao';
import { toast } from 'sonner';
import CacaPalavras from './CacaPalavras';
import Labirinto from './Labirinto';
import JogoDaForca from './JogoDaForca';
import JogoMemoria from './JogoMemoria';
import LoadingMascote from './LoadingMascote';

export default function FormularioProfessor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nomeProfessor, setNomeProfessor] = useState('');
  const [nomesAlunos, setNomesAlunos] = useState<string[]>([]);
  const [turma, setTurma] = useState('');
  const [serie, setSerie] = useState(SERIES_PROFESSOR[2]);
  const [quantidadeAlunos, setQuantidadeAlunos] = useState(25);
  
  // Focos Múltiplos
  const [focosSelecionados, setFocosSelecionados] = useState<{id: string, label: string, emoji: string, qtd: number}[]>([
    {id: 'matematica', label: 'Matemática', emoji: '🔢', qtd: 10}
  ]);
  const isLivre = focosSelecionados.some(f => f.id === 'livre');
  const qtdQuestoes = focosSelecionados.reduce((acc, curr) => acc + curr.qtd, 0);

  const [objetivoPedagogico, setObjetivoPedagogico] = useState('');
  const [nivel, setNivel] = useState<NivelDificuldade>('medio');
  
  // Puzzles
  const [tipoAtividade, setTipoAtividade] = useState<'historia' | 'caca_palavras' | 'labirinto' | 'forca' | 'memoria'>('historia');
  const [puzzleGerados, setPuzzleGerados] = useState<any[]>([]);
  const [qtdPuzzles, setQtdPuzzles] = useState(1);

  const [gerarImagens, setGerarImagens] = useState(false);
  const [estiloImagem, setEstiloImagem] = useState<'colorir'|'ilustracao'>('colorir');
  const [qtdImagens, setQtdImagens] = useState(1);
  const [formatoResposta, setFormatoResposta] = useState<'escrita' | 'multipla_escolha' | 'sem_pergunta'>('escrita');
  const [promptLivre, setPromptLivre] = useState('');
  
  const [atividadeGerada, setAtividadeGerada] = useState<AtividadeGerada | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('cadernoVivo_ultimoProfessor');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nomeProfessor) setNomeProfessor(parsed.nomeProfessor);
        if (parsed.turma) setTurma(parsed.turma);
        if (parsed.focosSelecionados) setFocosSelecionados(parsed.focosSelecionados);
        if (parsed.nivel) setNivel(parsed.nivel);
        if (parsed.formatoResposta) setFormatoResposta(parsed.formatoResposta);
        if (parsed.objetivoPedagogico) setObjetivoPedagogico(parsed.objetivoPedagogico);
      }
    } catch (e) {}
  }, []);

  const preencherRecomendado = () => {
    const profsRandom = ['Prof. Maria', 'Prof. João', 'Profa. Ana', 'Prof. Carlos', 'Profa. Beatriz'];
    const turmasRandom = ['3º Ano A', '2º Ano B', '4º Ano C', '1º Ano A', '5º Ano B'];
    
    const profSorteado = profsRandom[Math.floor(Math.random() * profsRandom.length)];
    const turmaSorteada = turmasRandom[Math.floor(Math.random() * turmasRandom.length)];
    const focoIndex = Math.floor(Math.random() * (FOCOS_PEDAGOGICOS.length - 1));
    const focoSorteado = FOCOS_PEDAGOGICOS[focoIndex];
    const int1Index = Math.floor(Math.random() * SUGESTOES_INTERESSES.length);
    const removeEmoji = (str: string) => str.replace(/^[\u{1F300}-\u{1FAD6}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u, '');
    
    setNomeProfessor(profSorteado);
    setTurma(turmaSorteada);
    setFocosSelecionados([{ id: focoSorteado.id, label: focoSorteado.label, emoji: focoSorteado.emoji, qtd: 10 }]);
    setObjetivoPedagogico(removeEmoji(SUGESTOES_INTERESSES[int1Index]));
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
        const currentTotal = focosSelecionados.reduce((acc, curr) => acc + curr.qtd, 0);
        let newQtd = 5;
        if (currentTotal + newQtd > 20) {
          newQtd = Math.max(1, 20 - currentTotal);
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
        if (delta > 0 && currentTotal >= 20) {
          toast.error('O máximo total é de 20 perguntas para turmas.');
          return f;
        }
        return { ...f, qtd: newQtd };
      }
      return f;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeProfessor.trim() || !turma.trim()) return;

    setLoading(true);
    try {
      // Save form state for retry
      sessionStorage.setItem('cadernoVivo_ultimoProfessor', JSON.stringify({
        nomeProfessor,
        turma,
        focosSelecionados,
        nivel,
        formatoResposta,
        objetivoPedagogico
      }));

      if (tipoAtividade !== 'historia') {
        const puzzlesData = [];
        for (let i = 0; i < qtdPuzzles; i++) {
          const r = await fetch('/api/generate-puzzle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tipoAtividade,
              tema: objetivoPedagogico || 'Pedagógico',
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
        registrarAtividade(tipoAtividade);
        setTimeout(() => {
          document.getElementById('resultado-inline')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        return;
      }

      // Fetch LLM Story
      const validNomesAlunos = nomesAlunos.filter(n => n.trim() !== '');
      const studentNamesContext = validNomesAlunos.length > 0 ? validNomesAlunos : [turma];
      
      const rStory = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomes: studentNamesContext,
          idade: 8,
          focosSelecionados,
          interesse1: objetivoPedagogico || 'Pedagógico',
          interesse2: `Turma: ${turma} | Prof: ${nomeProfessor}`,
          formatoResposta,
          promptLivre: isLivre ? promptLivre : undefined,
          nivel
        }),
      });
      if (rStory.status === 403) throw new Error('Payment Required');
      const storyRes = await rStory.json();
      if (storyRes.error) throw new Error(storyRes.error);

      // Fetch Fal.ai Images sequentially
      const imageResults = [];
      if (gerarImagens && qtdImagens > 0) {
        await new Promise(resolve => setTimeout(resolve, 5000)); 
        
        for (let i = 0; i < qtdImagens; i++) {
          const rImg = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              interesse1: 'Material escolar e crianças estudando',
              interesse2: objetivoPedagogico || 'divertido',
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
      
      imageResults.forEach((imgRes, idx) => {
        if (imgRes && imgRes.imageUrl) {
           atividade.atividades.unshift({
             tipo: estiloImagem === 'ilustracao' ? 'ilustracao' : 'desenho_para_colorir',
             enunciado: estiloImagem === 'ilustracao'
                ? `Ilustração da Turma ${turma}`
                : `Atividade de Colorir - Turma ${turma}`,
             questoes: [],
             imagemUrl: imgRes.imageUrl
           });
        }
      });

      setAtividadeGerada(atividade);
      setLoading(false);
      
      salvarNoHistorico({
        titulo: atividade.titulo,
        subtitulo: atividade.subtitulo,
        foco: focosSelecionados.map(f => f.label).join(', '),
        modo: 'Professor',
        imagens: imageResults.map(img => img?.imageUrl).filter(Boolean) as string[]
      });
      
      registrarAtividade('historia');
      
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

  const handleAddNomeAluno = () => {
    if (nomesAlunos.length < 6) {
      setNomesAlunos([...nomesAlunos, '']);
    }
  };

  const handleRemoveNomeAluno = (index: number) => {
    setNomesAlunos(nomesAlunos.filter((_, i) => i !== index));
  };

  const handleNomeAlunoChange = (index: number, value: string) => {
    const newNomes = [...nomesAlunos];
    newNomes[index] = value;
    setNomesAlunos(newNomes);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100">
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      {/* Top bar */}
      <div className="sticky top-0 z-40 glass px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-surface-400" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-surface-800" style={{ fontFamily: 'var(--font-baloo)' }}>
              Modo Professores
            </h1>
            <p className="text-xs text-surface-400">Crie atividades para turmas inteiras</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto animate-fade-in-up space-y-6">
          <button
            onClick={preencherRecomendado}
            type="button"
            className="w-full py-3.5 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 hover:bg-amber-100 hover:border-amber-400 text-amber-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Wand2 className="w-4 h-4" />
            ✨ Recomendado — Preencher turma e foco aleatório
          </button>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tipo de Atividade */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <Wand2 className="w-4 h-4 text-amber-500" />
                Tipo de Atividade
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => setTipoAtividade('historia')}
                  className={`p-3 rounded-xl border text-sm font-bold transition-all flex flex-col items-center gap-2 ${
                    tipoAtividade === 'historia' ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm' : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-500 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'
                  }`}
                >
                  <span className="text-2xl">📖</span>
                  <span>História</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTipoAtividade('caca_palavras')}
                  className={`p-3 rounded-xl border text-sm font-bold transition-all flex flex-col items-center gap-2 ${
                    tipoAtividade === 'caca_palavras' ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm' : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-500 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'
                  }`}
                >
                  <span className="text-2xl">🔍</span>
                  <span>Caça-Palavras</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTipoAtividade('labirinto')}
                  className={`p-3 rounded-xl border text-sm font-bold transition-all flex flex-col items-center gap-2 ${
                    tipoAtividade === 'labirinto' ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm' : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-500 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'
                  }`}
                >
                  <span className="text-2xl">🌀</span>
                  <span>Labirinto</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTipoAtividade('forca')}
                  className={`p-3 rounded-xl border text-sm font-bold transition-all flex flex-col items-center gap-2 ${
                    tipoAtividade === 'forca' ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm' : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-500 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'
                  }`}
                >
                  <span className="text-2xl">🅰️</span>
                  <span>Forca</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTipoAtividade('memoria')}
                  className={`p-3 rounded-xl border text-sm font-bold transition-all flex flex-col items-center gap-2 ${
                    tipoAtividade === 'memoria' ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm' : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-500 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'
                  }`}
                >
                  <span className="text-2xl">🧠</span>
                  <span>Memória</span>
                </button>
              </div>
            </div>

            {/* Professor & Turma row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                  <User className="w-4 h-4 text-amber-500" />
                  Seu Nome
                </label>
                <input
                  type="text"
                  value={nomeProfessor}
                  onChange={(e) => setNomeProfessor(e.target.value)}
                  placeholder="Prof. Maria"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 text-surface-800 placeholder-surface-300 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                  <Users className="w-4 h-4 text-amber-500" />
                  Turma
                </label>
                <input
                  type="text"
                  value={turma}
                  onChange={(e) => setTurma(e.target.value)}
                  placeholder="3º Ano B"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 text-surface-800 placeholder-surface-300 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all shadow-sm"
                />
              </div>
            </div>

            {tipoAtividade === 'historia' && (
              <>
            {/* Nomes dos Alunos (Opcional, max 6) */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <User className="w-4 h-4 text-amber-500" />
                Alunos na História <span className="text-xs text-surface-400 font-normal">(Opcional, até 6 nomes)</span>
              </label>
              
              <div className="space-y-2">
                {nomesAlunos.map((nomeInput, index) => (
                  <div key={index} className="flex gap-2 animate-fade-in">
                    <input
                      type="text"
                      value={nomeInput}
                      onChange={(e) => handleNomeAlunoChange(index, e.target.value)}
                      placeholder={`Nome do Aluno ${index + 1}...`}
                      className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 text-surface-800 placeholder-surface-300 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNomeAluno(index)}
                      className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100"
                      title="Remover nome"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
              
              {nomesAlunos.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddNomeAluno}
                  className="text-sm font-medium text-amber-600 flex items-center gap-1 hover:text-amber-700 transition-colors p-1"
                >
                  <Plus className="w-4 h-4" />
                  {nomesAlunos.length === 0 ? "Adicionar um aluno protagonista" : "Adicionar outro aluno"}
                </button>
              )}
            </div>
            </>
            )}

            {/* Série & Alunos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                  Série
                </label>
                <select
                  value={serie}
                  onChange={(e) => setSerie(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 text-surface-800 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all shadow-sm appearance-none cursor-pointer"
                >
                  {SERIES_PROFESSOR.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                  <Users className="w-4 h-4 text-amber-500" />
                  Qtd. de Alunos: <span className="text-amber-600 font-extrabold">{quantidadeAlunos}</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={50}
                  value={quantidadeAlunos}
                  onChange={(e) => setQuantidadeAlunos(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-200 mt-2
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-amber-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-amber-200"
                />
              </div>
            </div>

            {tipoAtividade === 'historia' && (
              <>
            {/* Foco Pedagógico - MULTIPLE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                  <Target className="w-4 h-4 text-amber-500" />
                  Matérias (Selecione de 1 a 3)
                </label>
                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-md">
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
                      className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                          : 'bg-white dark:bg-surface-100 dark:text-surface-800 text-surface-500 border border-surface-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 shadow-sm'
                      }`}
                    >
                      {foco.emoji} {foco.label}
                    </button>
                  );
                })}
              </div>
            </div>
            </>
            )}

            {/* Nível */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                Nível de Dificuldade
              </label>
              <div className="grid grid-cols-3 gap-2">
                {NIVEIS_DIFICULDADE.map((n) => (
                  <button
                    key={n.value}
                    type="button"
                    onClick={() => setNivel(n.value as any)}
                    className={`py-3 rounded-xl text-center transition-all active:scale-95 ${
                      nivel === n.value
                        ? 'bg-amber-50 border-2 border-amber-400 text-amber-700'
                        : 'bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 text-surface-400 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 shadow-sm'
                    }`}
                  >
                    <div className="text-sm font-bold">{n.label}</div>
                    <div className="text-[10px] text-surface-300 mt-0.5">{n.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Objetivo pedagógico / Tema */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <BookOpen className="w-4 h-4 text-amber-500" />
                {tipoAtividade === 'historia' ? 'Objetivo Pedagógico ou BNCC' : 'Tema do Desafio'}
              </label>
              <textarea
                value={objetivoPedagogico}
                onChange={(e) => setObjetivoPedagogico(e.target.value)}
                placeholder={tipoAtividade === 'historia' ? "Ex: Desenvolver habilidade EF03MA06..." : "Ex: Animais, Cores..."}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 text-surface-800 placeholder-surface-300 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all shadow-sm resize-none"
              />
            </div>

            {tipoAtividade === 'historia' && (
              <>
            {/* Prompt Personalizado */}
            {isLivre && (
              <div className="space-y-2 animate-fade-in-up">
                <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                  Instruções Especiais
                </label>
                <textarea
                  value={promptLivre}
                  onChange={(e) => setPromptLivre(e.target.value)}
                  placeholder="Ex: Quero um texto sobre o ciclo da água..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 text-surface-800 placeholder-surface-300 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all shadow-sm resize-none"
                />
              </div>
            )}

            {/* Distribuição de Questões e Formato */}
            <div className="pt-2">
              {formatoResposta !== 'sem_pergunta' && (
                <div className="space-y-3 bg-white dark:bg-surface-100 dark:text-surface-800 p-4 border border-surface-200 rounded-xl shadow-sm mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                      <ListOrdered className="w-4 h-4 text-amber-500" />
                      Distribuição de Perguntas
                    </label>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${qtdQuestoes === 20 ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'}`}>
                      Total: {qtdQuestoes}/20
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

              {/* Formato de Resposta */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                  <CheckSquare className="w-4 h-4 text-amber-500" />
                  Formato das Perguntas
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormatoResposta('escrita')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      formatoResposta === 'escrita'
                        ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
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
                        ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
                        : 'bg-white dark:bg-surface-100 dark:text-surface-800 border-surface-200 text-surface-500 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'
                    }`}
                  >
                    <ListOrdered className="w-3 h-3" />
                    Múltipla
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormatoResposta('sem_pergunta')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition-all border ${
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
            </div>

            {/* Gerar Imagens Toggle */}
            {isLivre && (
              <div className="space-y-4 pt-2 animate-fade-in-up">
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-surface-200 bg-white dark:bg-surface-100 dark:text-surface-800 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={gerarImagens}
                    onChange={(e) => setGerarImagens(e.target.checked)}
                    className="w-5 h-5 rounded border-surface-300 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <ImageIcon className="w-5 h-5 text-amber-500" />
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
                          ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
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

                  <div className="pl-4 pr-4 py-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-800">Quantidade (Máx 5):</span>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={qtdImagens > 5 ? 5 : qtdImagens}
                        onChange={(e) => setQtdImagens(Number(e.target.value))}
                        className="w-32 h-2 rounded-full appearance-none cursor-pointer bg-amber-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600"
                      />
                      <span className="font-bold text-amber-700 w-6 text-center">{qtdImagens > 5 ? 5 : qtdImagens}</span>
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
                  <Puzzle className="w-4 h-4 text-amber-500" />
                  Quantidade de Puzzles (Máx 5): <span className="text-amber-600 font-extrabold">{qtdPuzzles > 5 ? 5 : qtdPuzzles}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={qtdPuzzles > 5 ? 5 : qtdPuzzles}
                  onChange={(e) => setQtdPuzzles(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-200 mt-2
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-amber-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-amber-200"
                />
              </div>
            )}

            {/* Submit */}
            {loading ? (
              <LoadingMascote 
                nomes={[`a turma da ${nomeProfessor}`]} 
                interesse={objetivoPedagogico} 
                focos={focosSelecionados.map(f => f.label)} 
              />
            ) : (
              <button
                type="submit"
                disabled={!nomeProfessor.trim() || !turma.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base transition-all hover:shadow-xl hover:shadow-amber-200 active:scale-[0.98] flex items-center justify-center gap-2.5"
              >
                <Sparkles className="w-5 h-5" />
                Gerar Atividades para a Turma
              </button>
            )}
          </form>
          
          {/* Resultado Inline */}
          {atividadeGerada && (
            <div id="resultado-inline" className="mt-8 pt-8 border-t-2 border-dashed border-surface-200 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-surface-800 mb-6 text-center" style={{ fontFamily: 'var(--font-baloo)' }}>
                Caderno da Turma Pronto! 🎉
              </h2>
              <PreviewAtividade 
                atividade={atividadeGerada} 
                modo="professor"
                onRefazer={() => {
                  setAtividadeGerada(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
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
                  {puzzle.tipo === 'forca' && (
                    <JogoDaForca 
                      palavras={puzzle.palavras || []}
                      tema={`${puzzle.tema} #${index + 1}`}
                    />
                  )}
                  {puzzle.tipo === 'memoria' && (
                    <JogoMemoria 
                      cards={puzzle.cards || []}
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
