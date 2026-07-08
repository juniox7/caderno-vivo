'use client';

import { useState, useEffect } from 'react';
import { Zap, CheckCircle2, Lightbulb, Loader2, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { AtividadeDiaria as AtividadeDiariaType } from '@/lib/types';
import { concluirAtividadeDiaria, isAtividadeDiariaConcluidaHoje, getStats } from '@/lib/gamificacao';

export default function AtividadeDiaria() {
  const [atividade, setAtividade] = useState<AtividadeDiariaType | null>(null);
  const [loading, setLoading] = useState(false);
  const [gerada, setGerada] = useState(false);
  const [concluida, setConcluida] = useState(false);
  const [showDica, setShowDica] = useState(false);
  const [showResposta, setShowResposta] = useState(false);
  const [sementeAnimacao, setSementeAnimacao] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [streak, setStreak] = useState(0);
  const [selectedOpcao, setSelectedOpcao] = useState<string | null>(null);
  const [erroOpcao, setErroOpcao] = useState<string | null>(null);
  const [jaFeitaHoje, setJaFeitaHoje] = useState(false);

  useEffect(() => {
    const carregarEstado = () => {
      setStreak(getStats().ofensivaAtual);
      if (isAtividadeDiariaConcluidaHoje()) {
        setJaFeitaHoje(true);
        setConcluida(true);
      }
    };

    carregarEstado();
    if (!isAtividadeDiariaConcluidaHoje() && !gerada && !loading) {
      gerarAtividade();
    }

    const handleUpdate = () => carregarEstado();
    window.addEventListener('cadernovivo-gamificacao-update', handleUpdate);
    
    return () => {
      window.removeEventListener('cadernovivo-gamificacao-update', handleUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gerarAtividade = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/atividade-diaria');
      const data = await res.json();
      setAtividade(data);
      setGerada(true);
      setShowDica(false);
      setShowResposta(false);
      setSelectedOpcao(null);
      setErroOpcao(null);
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const concluirAtividadeUI = (bonus = 1) => {
    if (concluirAtividadeDiaria(bonus)) {
      setConcluida(true);
      setSementeAnimacao(true);
      setTimeout(() => setSementeAnimacao(false), 1500);
    }
  };

  const handleOpcaoSelect = (opcao: string) => {
    if (concluida) return;
    
    setSelectedOpcao(opcao);
    if (atividade?.respostaCorreta && opcao === atividade.respostaCorreta) {
      setErroOpcao(null);
      setShowResposta(true);
      concluirAtividadeUI(2); // Bonus for getting it right!
    } else {
      setErroOpcao(opcao);
    }
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 pt-6 pb-2">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-primary-50/50 border border-primary-100 shadow-lg shadow-primary-100/30">
        {/* Decorative orbs */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-success-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* Header bar */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-primary-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center shadow-lg shadow-accent-200">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h2
                className="text-lg font-bold text-surface-800"
                style={{ fontFamily: 'var(--font-baloo)' }}
              >
                Atividade do Dia
              </h2>
              <p className="text-xs text-surface-400">
                Um desafio novo todo dia para exercitar o cérebro!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200">
              <span className="text-sm animate-streak">🔥</span>
              <span className="text-xs font-bold text-orange-600">
                {streak} dias
              </span>
            </div>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-surface-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-surface-400" />
            )}
          </div>
        </button>

        {/* Content */}
        {expanded && (
          <div className="px-5 pb-5 animate-fade-in">
            {jaFeitaHoje ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="font-bold text-surface-800 text-lg">Missão cumprida por hoje!</h3>
                <p className="text-sm text-surface-500">
                  Você já resgatou suas sementes diárias. Volte amanhã para um novo desafio! 🌱
                </p>
              </div>
            ) : (
              <>
                {!gerada && !loading && (
                  <button
                    onClick={gerarAtividade}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-bold text-base transition-all hover:shadow-lg hover:shadow-primary-200 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Gerar Atividade do Dia
                  </button>
                )}

            {loading && (
              <div className="flex items-center justify-center py-8 gap-3 text-surface-400">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                <span className="text-sm font-medium">
                  Gerando sua atividade...
                </span>
              </div>
            )}

            {gerada && atividade && !loading && (
              <div className="space-y-4 animate-fade-in-up">
                {/* Activity card */}
                <div className="rounded-xl bg-white dark:bg-surface-100 dark:text-surface-800 border border-surface-200 p-4 space-y-3 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">
                      {atividade.tipo === 'desafio' && '🧮'}
                      {atividade.tipo === 'quebra-cabeca' && '🧩'}
                      {atividade.tipo === 'curiosidade' && '🌍'}
                    </span>
                    <div>
                      <h3 className="font-bold text-surface-800 text-base">
                        {atividade.titulo}
                      </h3>
                      <p className="text-xs text-surface-400 mt-0.5">
                        {atividade.descricao}
                      </p>
                    </div>
                  </div>

                  <p className="text-surface-600 text-sm leading-relaxed pl-1">
                    {atividade.conteudo}
                  </p>

                  {/* Multiple Choice Options */}
                  {atividade.opcoes && atividade.opcoes.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {atividade.opcoes.map((opcao, i) => {
                        const letter = String.fromCharCode(65 + i); // A, B, C, D
                        const isSelected = selectedOpcao === opcao;
                        const isCorrect = atividade.respostaCorreta === opcao;
                        const isError = erroOpcao === opcao;
                        
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
                            onClick={() => handleOpcaoSelect(opcao)}
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
                  )}

                  {/* Dica & Resposta */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {atividade.dica && (
                      <button
                        onClick={() => setShowDica(!showDica)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 text-xs font-medium hover:bg-amber-100 transition-colors"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        {showDica ? 'Esconder Dica' : 'Ver Dica'}
                      </button>
                    )}
                    {atividade.resposta && (
                      <button
                        onClick={() => setShowResposta(!showResposta)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-medium hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {showResposta ? 'Esconder Resposta' : 'Ver Resposta'}
                      </button>
                    )}
                  </div>

                  {showDica && (
                    <div className="animate-fade-in rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-amber-700">
                      💡 <strong>Dica:</strong> {atividade.dica}
                    </div>
                  )}

                  {showResposta && (
                    <div className="animate-fade-in rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2 text-xs text-emerald-700">
                      ✅ <strong>Resposta:</strong> {atividade.resposta}
                    </div>
                  )}
                </div>

                {/* Concluir */}
                {!concluida ? (
                  !atividade.opcoes || atividade.opcoes.length === 0 ? (
                    <button
                      onClick={() => concluirAtividadeUI(1)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-emerald-200 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Marcar como Concluído!
                    </button>
                  ) : null
                ) : (
                  <div className="text-center py-4 animate-fade-in space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      {sementeAnimacao && (
                        <span className="text-3xl animate-seed-bounce">🌱</span>
                      )}
                      <span className="text-lg font-bold text-emerald-600">
                        Parabéns! 🎉
                      </span>
                      {sementeAnimacao && (
                        <span className="text-3xl animate-seed-bounce" style={{ animationDelay: '0.1s' }}>🌱</span>
                      )}
                    </div>
                    <p className="text-sm text-surface-400">
                      Você ganhou <span className="text-amber-600 font-bold">+{atividade.opcoes ? 2 : 1} sementes</span>! Continue assim!
                    </p>
                  </div>
                )}
              </div>
            )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
