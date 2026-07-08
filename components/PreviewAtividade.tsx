'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Download,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
  Share2,
  Printer,
} from 'lucide-react';
import Link from 'next/link';
import { AtividadeGerada } from '@/lib/types';
import { adicionarSementes, removerSementes, registrarAtividade } from '@/lib/gamificacao';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface PreviewAtividadeProps {
  atividade: AtividadeGerada;
  modo: string;
}

export default function PreviewAtividade({ atividade, modo }: PreviewAtividadeProps) {
  const [expandedDicas, setExpandedDicas] = useState<Set<string>>(new Set());
  const [expandedRespostas, setExpandedRespostas] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [concluida, setConcluida] = useState(false);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [errosOpcoes, setErrosOpcoes] = useState<Record<string, string>>({});
  const [sementeAnimacao, setSementeAnimacao] = useState(false);
  const [sementeGanhas, setSementesGanhas] = useState<number>(0);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  const getTotalQuestoes = () => {
    return atividade.atividades.reduce((total, atv) => total + atv.questoes.length, 0);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Registrar que baixou um PDF para incentivar a gamificação
      adicionarSementes(2);
      
      const element = document.getElementById('pdf-content');
      if (!element) throw new Error('Elemento não encontrado');

      // Remover botões "Dica/Resposta" e classes interativas antes de tirar print
      const buttonsHidden = document.querySelectorAll('.dica-resposta-btn');
      buttonsHidden.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });

      const canvas = await html2canvas(element, {
        scale: 2, // Alta resolução
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff' // Força fundo branco
      });

      // Restaurar botões
      buttonsHidden.forEach((el) => {
        (el as HTMLElement).style.display = 'flex';
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      let position = 0;
      let heightLeft = pdfHeight;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      pdf.setFontSize(10);
      pdf.setTextColor(150);
      pdf.text('Criado magicamente por CadernoVivo.com', pdfWidth / 2, pageHeight - 5, { align: 'center' });
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        pdf.text('Criado magicamente por CadernoVivo.com', pdfWidth / 2, pageHeight - 5, { align: 'center' });
        heightLeft -= pageHeight;
      }

      pdf.save(`CadernoVivo_${atividade.titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
      toast.success('PDF Oficial baixado com sucesso! 🎉');
    } catch (error) {
      console.error(error);
      toast.error('Houve um problema ao gerar o PDF. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleDica = (id: string) => {
    const next = new Set(expandedDicas);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedDicas(next);
  };

  const toggleResposta = (id: string) => {
    const next = new Set(expandedRespostas);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedRespostas(next);
  };

  const handleConcluir = () => {
    setMensagemErro(null);
    
    // Validar se todas as perguntas foram respondidas
    const totalQuestoes = getTotalQuestoes();
    const respondidasCount = Object.keys(respostas).length;
    
    const todasRespondidas = respondidasCount === totalQuestoes && Object.values(respostas).every(r => r && r.trim() !== '');

    if (!todasRespondidas) {
      setMensagemErro('Ops! Você precisa responder todas as perguntas antes de concluir.');
      return;
    }

    setConcluida(true);
    
    // Auto-expand respostas for written questions so the child can self-evaluate
    const allRespostas = new Set(expandedRespostas);
    
    let pontosCalculados = 0;

    atividade.atividades.forEach((atv, atvIdx) => {
      atv.questoes.forEach((q, qIdx) => {
        const qId = `${atvIdx}-${qIdx}`;
        if (!q.opcoes || q.opcoes.length === 0) {
          allRespostas.add(qId);
          pontosCalculados += 0.50; // 0.50 per written question
        } else {
          // Multiple choice
          if (q.respostaCorreta && respostas[qId] === q.respostaCorreta) {
            pontosCalculados += 0.25; // 0.25 per correct multiple choice
          }
        }
      });
    });
    setExpandedRespostas(allRespostas);

    adicionarSementes(pontosCalculados);
    setSementesGanhas(pontosCalculados);
    setSementeAnimacao(true);
    setTimeout(() => setSementeAnimacao(false), 2000);
  };

  const handleDesistir = () => {
    if (confirm('Tem certeza que deseja desistir? Você perderá 3 sementes!')) {
      setMensagemErro(null);
      setConcluida(true);
      removerSementes(3);
      setSementesGanhas(-3);
      
      // Reveal all answers
      const allRespostas = new Set<string>();
      atividade.atividades.forEach((atv, atvIdx) => {
        atv.questoes.forEach((_, qIdx) => {
          allRespostas.add(`${atvIdx}-${qIdx}`);
        });
      });
      setExpandedRespostas(allRespostas);
    }
  };

  const handleOpcaoSelect = (qId: string, opcao: string, respostaCorreta?: string) => {
    if (concluida) return;
    
    setRespostas({ ...respostas, [qId]: opcao });
    
    if (respostaCorreta && opcao === respostaCorreta) {
      // Clear error for this question if any
      const newErros = { ...errosOpcoes };
      delete newErros[qId];
      setErrosOpcoes(newErros);
      
      // Optionally show the answer block as well
      const next = new Set(expandedRespostas);
      next.add(qId);
      setExpandedRespostas(next);
    } else {
      setErrosOpcoes({ ...errosOpcoes, [qId]: opcao });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100">
      {/* Top bar */}
      <div className="sticky top-0 z-40 glass px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-surface-400" />
            </Link>
            <div>
              <h1
                className="text-lg font-bold text-surface-800 truncate max-w-[200px] sm:max-w-none"
                style={{ fontFamily: 'var(--font-baloo)' }}
              >
                Resultado
              </h1>
              <p className="text-xs text-surface-400 capitalize">Modo {modo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsInteractive(!isInteractive)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border ${isInteractive ? 'bg-primary-50 text-primary-600 border-primary-200' : 'bg-white dark:bg-surface-100 dark:text-surface-800 text-surface-500 border-surface-200 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100'}`}
              title="Responder no Celular"
            >
              📱 {isInteractive ? 'Modo Interativo ON' : 'Responder no Celular'}
            </button>
            <button className="hidden sm:block p-2 rounded-lg hover:bg-surface-100 transition-colors text-surface-400 hover:text-surface-600" title="Imprimir">
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <div id="pdf-content" className="max-w-3xl mx-auto space-y-6 animate-fade-in-up bg-white sm:bg-transparent p-2 sm:p-0">
          {/* Header card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 p-6 shadow-xl shadow-primary-200">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white dark:bg-surface-100 dark:text-surface-800/10 rounded-full blur-3xl pointer-events-none" />

            <h2
              className="text-2xl sm:text-3xl font-extrabold text-white leading-tight"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              {atividade.titulo}
            </h2>
            <p className="text-sm text-white/70 mt-2">{atividade.subtitulo}</p>

            <div className="flex items-center gap-2 mt-4 text-xs text-white/50">
              <span>🕐 Gerado em {new Date(atividade.criadoEm).toLocaleString('pt-BR')}</span>
            </div>
          </div>

          {/* Activities */}
          {atividade.atividades.map((atv, atvIdx) => (
            <div
              key={atvIdx}
              className="rounded-2xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 overflow-hidden shadow-sm"
            >
              {/* Activity header */}
              <div className="px-5 py-4 border-b border-surface-100 bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary-600 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-primary-500" />
                  {atv.tipo.replace(/_/g, ' ')}
                </div>
              </div>

              {/* Enunciado */}
              <div className="px-5 py-4 border-b border-surface-100">
                <p className="text-surface-700 text-sm sm:text-base leading-relaxed">
                  {atv.enunciado}
                </p>
                {atv.imagemUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden border-2 border-surface-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={atv.imagemUrl} alt="Desenho para colorir" crossOrigin="anonymous" className="w-full h-auto object-cover" />
                  </div>
                )}
              </div>

              {/* Questões */}
              <div className="divide-y divide-surface-100">
                {atv.questoes.map((q, qIdx) => {
                  const qId = `${atvIdx}-${qIdx}`;
                  return (
                    <div key={qIdx} className="px-5 py-4 space-y-3">
                      {/* Pergunta */}
                      <div className="flex gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                          {qIdx + 1}
                        </span>
                        <p className="text-surface-700 text-sm sm:text-base leading-relaxed pt-0.5">
                          {q.pergunta}
                        </p>
                      </div>

                      {/* Espaço para resposta / Opções de Múltipla Escolha */}
                      <div className="ml-10">
                        {isInteractive ? (
                          q.opcoes && q.opcoes.length > 0 ? (
                            <div className="space-y-2 mt-2">
                              {q.opcoes.map((opcao, i) => {
                                const letter = String.fromCharCode(65 + i); // A, B, C, D
                                const isSelected = respostas[qId] === opcao;
                                const isCorrect = q.respostaCorreta === opcao;
                                const isError = errosOpcoes[qId] === opcao;
                                
                                let btnClass = "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ";
                                if (concluida && isCorrect) {
                                  btnClass += "bg-emerald-50 border-emerald-500 text-emerald-800";
                                } else if (isError) {
                                  btnClass += "bg-red-50 border-red-300 text-red-700 animate-shake";
                                } else if (isSelected) {
                                  btnClass += "bg-primary-50 border-primary-300 text-primary-800";
                                } else {
                                  btnClass += "bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 border-surface-200 hover:border-primary-300 hover:bg-white dark:bg-surface-100 dark:text-surface-800 text-surface-700";
                                }

                                return (
                                  <button
                                    key={opcao}
                                    onClick={() => handleOpcaoSelect(qId, opcao, q.respostaCorreta)}
                                    disabled={concluida}
                                    className={btnClass}
                                  >
                                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${concluida && isCorrect ? 'bg-emerald-500 text-white' : 'bg-surface-200 text-surface-600'}`}>
                                      {letter}
                                    </span>
                                    <span className="text-sm font-medium">{opcao}</span>
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <textarea
                              disabled={concluida}
                              placeholder="Digite sua resposta aqui..."
                              value={respostas[qId] || ''}
                              onChange={(e) => setRespostas({...respostas, [qId]: e.target.value})}
                              className={`w-full mt-2 p-3 rounded-xl border transition-all text-surface-700 min-h-[80px] resize-none ${concluida ? 'bg-surface-100 border-surface-200 text-surface-500' : 'border-surface-200 bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 focus:bg-white dark:bg-surface-100 dark:text-surface-800 focus:ring-2 focus:ring-primary-500'}`}
                            />
                          )
                        ) : (
                          <div className="border-b-2 border-dashed border-surface-200 py-4 mt-2">
                            <p className="text-[10px] text-surface-300 uppercase tracking-widest">
                              Espaço para resposta
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="ml-10 flex flex-wrap gap-2 dica-resposta-btn">
                        <button
                          onClick={() => toggleDica(qId)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 text-xs font-medium hover:bg-amber-100 transition-colors"
                        >
                          <Lightbulb className="w-3.5 h-3.5" />
                          {expandedDicas.has(qId) ? 'Esconder' : 'Ver Dica'}
                        </button>
                        <button
                          onClick={() => toggleResposta(qId)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-medium hover:bg-emerald-100 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {expandedRespostas.has(qId) ? 'Esconder' : 'Ver Resposta'}
                        </button>
                      </div>

                      {expandedDicas.has(qId) && (
                        <div className="ml-10 animate-fade-in rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-amber-700">
                          💡 <strong>Dica:</strong> {q.dica}
                        </div>
                      )}

                      {expandedRespostas.has(qId) && (
                        <div className={`ml-10 animate-fade-in rounded-lg px-3 py-2 text-xs border ${concluida && (!q.opcoes || q.opcoes.length === 0) ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                          {concluida && (!q.opcoes || q.opcoes.length === 0) ? '📝' : '✅'} <strong>Resposta Esperada:</strong> {q.resposta}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Action buttons */}
          <div className="flex flex-col gap-4 pb-6">
            {isInteractive && (
              !concluida ? (
                <div className="animate-fade-in-up space-y-3">
                  {mensagemErro && (
                    <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm text-center font-bold">
                      {mensagemErro}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={handleDesistir}
                      className="w-full sm:w-auto px-6 py-4 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center"
                    >
                      Desistir (-3 Sementes)
                    </button>
                    <button 
                      onClick={handleConcluir}
                      className="flex-1 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-lg transition-all shadow-lg hover:shadow-emerald-200 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-6 h-6" />
                      Concluir Atividade!
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`w-full p-6 rounded-xl border-2 text-center animate-fade-in ${sementeGanhas >= 0 ? 'border-emerald-400 bg-emerald-50' : 'border-red-400 bg-red-50'}`}>
                  <div className="flex items-center justify-center gap-3">
                    {sementeAnimacao && sementeGanhas > 0 && <span className="text-4xl animate-seed-bounce">🌱</span>}
                    <h3 className={`text-2xl font-bold ${sementeGanhas >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {sementeGanhas >= 0 ? 'Atividade Concluída!' : 'Atividade Finalizada'}
                    </h3>
                    {sementeAnimacao && sementeGanhas > 0 && <span className="text-4xl animate-seed-bounce" style={{animationDelay: '0.1s'}}>🌱</span>}
                  </div>
                  <p className={`${sementeGanhas >= 0 ? 'text-emerald-700' : 'text-red-700'} font-medium mt-2`}>
                    {sementeGanhas >= 0 ? 'Você ganhou ' : 'Você perdeu '}
                    <span className="font-bold text-amber-600">
                      {sementeGanhas > 0 ? '+' : ''}{sementeGanhas % 1 === 0 ? sementeGanhas : sementeGanhas.toFixed(2)} Sementes
                    </span>!
                  </p>
                </div>
              )
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:opacity-50 text-white font-bold text-sm transition-all hover:shadow-xl hover:shadow-primary-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Gerando PDF Profissional...' : 'Baixar PDF Oficial'}
              </button>
              <Link
                href="/"
                className="flex-1 py-3.5 rounded-xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 hover:bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 text-surface-600 hover:text-surface-800 font-bold text-sm transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Criar Outra Atividade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
