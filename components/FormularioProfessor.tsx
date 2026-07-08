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
  Palette,
  Plus,
  X,
  Type,
  CheckSquare,
  ListOrdered,
} from 'lucide-react';
import Link from 'next/link';
import { FOCOS_PEDAGOGICOS, SERIES_PROFESSOR, NIVEIS_DIFICULDADE } from '@/lib/constants';
import { FocoPedagogico, NivelDificuldade, AtividadeGerada } from '@/lib/types';
import PreviewAtividade from './PreviewAtividade';
import UpgradeModal from '@/components/UpgradeModal';
import { salvarNoHistorico } from '@/lib/historico';
import { toast } from 'sonner';

export default function FormularioProfessor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nomeProfessor, setNomeProfessor] = useState('');
  const [nomesAlunos, setNomesAlunos] = useState<string[]>([]); // Optional up to 6 names
  const [turma, setTurma] = useState('');
  const [serie, setSerie] = useState(SERIES_PROFESSOR[2]);
  const [quantidadeAlunos, setQuantidadeAlunos] = useState(25);
  const [focoPedagogico, setFocoPedagogico] = useState<FocoPedagogico>('matematica');
  const [objetivoPedagogico, setObjetivoPedagogico] = useState('');
  const [nivel, setNivel] = useState<NivelDificuldade>('medio');
  const [gerarImagens, setGerarImagens] = useState(false);
  const [estiloImagem, setEstiloImagem] = useState<'colorir'|'ilustracao'>('colorir');
  const [qtdImagens, setQtdImagens] = useState(1);
  const [qtdQuestoes, setQtdQuestoes] = useState(10);
  const [formatoResposta, setFormatoResposta] = useState<'escrita' | 'multipla_escolha'>('escrita');
  const [promptLivre, setPromptLivre] = useState('');
  
  const [atividadeGerada, setAtividadeGerada] = useState<AtividadeGerada | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeProfessor.trim() || !turma.trim()) return;

    setLoading(true);
    try {
      // Fetch LLM Story
      const validNomesAlunos = nomesAlunos.filter(n => n.trim() !== '');
      const studentNamesContext = validNomesAlunos.length > 0 ? validNomesAlunos : [turma];
      
      const storyPromise = fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomes: studentNamesContext, // Uses students' names or class name
          idade: 8,
          focoPedagogico,
          interesse1: objetivoPedagogico || 'Pedagógico',
          interesse2: `Turma: ${turma} | Prof: ${nomeProfessor}`,
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
                interesse1: 'Material escolar e crianças estudando',
                interesse2: objetivoPedagogico || 'divertido',
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
                ? `Ilustração da Turma ${turma}`
                : `Atividade de Colorir - Turma ${turma}`,
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
        modo: 'Professor',
        imagens: imageResults.map(img => img?.imageUrl).filter(Boolean) as string[]
      });
      
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
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Foco Pedagógico */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <Target className="w-4 h-4 text-amber-500" />
                Foco Pedagógico
              </label>
              <div className="flex flex-wrap gap-2">
                {FOCOS_PEDAGOGICOS.map((foco) => (
                  <button
                    key={foco.id}
                    type="button"
                    onClick={() => setFocoPedagogico(foco.id)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                      focoPedagogico === foco.id
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                        : 'bg-white dark:bg-surface-100 dark:text-surface-800 text-surface-500 border border-surface-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 shadow-sm'
                    }`}
                  >
                    {foco.emoji} {foco.label}
                  </button>
                ))}
              </div>
            </div>

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
                    onClick={() => setNivel(n.value)}
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

            {/* Prompt Personalizado (Apenas Tema Livre) */}
            {focoPedagogico === 'livre' && (
              <div className="space-y-2 animate-fade-in-up">
                <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                  Instruções Especiais
                  <span className="text-xs text-surface-300 font-normal">
                    (O que a IA deve priorizar na história/texto?)
                  </span>
                </label>
                <textarea
                  value={promptLivre}
                  onChange={(e) => setPromptLivre(e.target.value)}
                  placeholder="Ex: Quero um texto sobre o ciclo da água com perguntas de múltipla escolha..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 text-surface-800 placeholder-surface-300 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all shadow-sm resize-none"
                />
              </div>
            )}

            {/* Objetivo pedagógico */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                <BookOpen className="w-4 h-4 text-amber-500" />
                Objetivo Pedagógico
                <span className="text-xs text-surface-300 font-normal">(BNCC)</span>
              </label>
              <textarea
                value={objetivoPedagogico}
                onChange={(e) => setObjetivoPedagogico(e.target.value)}
                placeholder="Ex: Desenvolver habilidade EF03MA06 — resolver e elaborar problemas de adição e subtração..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 text-surface-800 placeholder-surface-300 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all shadow-sm resize-none"
              />
            </div>

            {/* Gerar Perguntas e Formato Slider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-3">
                 <label className="flex items-center gap-2 text-sm font-semibold text-surface-700">
                    <ListOrdered className="w-4 h-4 text-amber-500" />
                    Qtd. Perguntas: <span className="text-amber-600 font-extrabold">{qtdQuestoes}</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={qtdQuestoes}
                    onChange={(e) => setQtdQuestoes(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-200 mt-2
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-amber-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-amber-200"
                  />
              </div>

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
                </div>
              </div>
            </div>

            {/* Gerar Imagens Toggle (Apenas Tema Livre) */}
            {focoPedagogico === 'livre' && (
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
                    {/* Estilo da Imagem */}
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

                  {/* Quantidade */}
                  <div className="pl-4 pr-4 py-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-800">Quantidade (Máx 10):</span>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={qtdImagens}
                        onChange={(e) => setQtdImagens(Number(e.target.value))}
                        className="w-32 h-2 rounded-full appearance-none cursor-pointer bg-amber-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600"
                      />
                      <span className="font-bold text-amber-700 w-6 text-center">{qtdImagens}</span>
                    </div>
                  </div>
                </div>
              )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !nomeProfessor.trim() || !turma.trim()}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base transition-all hover:shadow-xl hover:shadow-amber-200 active:scale-[0.98] flex items-center justify-center gap-2.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando para a turma...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Atividades para a Turma
                </>
              )}
            </button>
          </form>
          
          {/* Resultado Inline */}
          {atividadeGerada && (
            <div id="resultado-inline" className="mt-8 pt-8 border-t-2 border-dashed border-surface-200 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-surface-800 mb-6 text-center" style={{ fontFamily: 'var(--font-baloo)' }}>
                Caderno da Turma Pronto! 🎉
              </h2>
              <PreviewAtividade 
                atividade={atividadeGerada} 
                modo="professores"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
