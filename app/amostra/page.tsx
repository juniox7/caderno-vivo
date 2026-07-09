'use client';

import PreviewAtividade from '@/components/PreviewAtividade';
import { AtividadeGerada } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const atividadeDemonstracao: AtividadeGerada = {
  titulo: 'Aventura Espacial dos Dinossauros',
  subtitulo: 'Um caderno mágico criado especialmente para você!',
  criadoEm: new Date().toISOString(),
  atividades: [
    {
      tipo: 'historia',
      enunciado: 'Leia a história abaixo com muita atenção:',
      questoes: [
        {
          pergunta: 'Era uma vez um T-Rex chamado Rex que adorava explorar o espaço sideral. Um dia, ele encontrou uma nave espacial brilhante no meio da selva. Ele entrou e, de repente, ZUUUM! A nave decolou para a lua.',
          resposta: '',
          dica: 'Aproveite a leitura!'
        }
      ]
    },
    {
      tipo: 'matematica',
      enunciado: 'Rex encontrou alguns planetas brilhantes. Vamos contar?',
      questoes: [
        {
          pergunta: 'Se Rex viu 3 planetas vermelhos e 2 planetas azuis, quantos planetas ele viu no total?',
          opcoes: ['4 planetas', '5 planetas', '6 planetas', '7 planetas'],
          respostaCorreta: '5 planetas',
          resposta: '5 planetas',
          dica: 'Some 3 com 2.'
        },
        {
          pergunta: 'Qual número vem depois do 9?',
          opcoes: ['8', '11', '10', '12'],
          respostaCorreta: '10',
          resposta: '10',
          dica: 'Conte: sete, oito, nove...'
        }
      ]
    },
    {
      tipo: 'portugues',
      enunciado: 'Vamos testar seu vocabulário espacial!',
      questoes: [
        {
          pergunta: 'Qual a primeira letra da palavra LUA?',
          opcoes: ['A', 'E', 'L', 'U'],
          respostaCorreta: 'L',
          resposta: 'L',
          dica: 'Tem o mesmo som inicial de Lata.'
        }
      ]
    }
  ]
};

export default function AmostraPage() {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 flex flex-col">
      <div className="bg-amber-100 border-b border-amber-200 py-3 px-4 text-center">
        <p className="text-amber-800 font-medium text-sm flex items-center justify-center gap-2">
          <span>👀</span> <strong>Modo Demonstração:</strong> Este é apenas um exemplo do que o Caderno Vivo pode criar em segundos!
        </p>
      </div>

      <div className="flex-1 pb-20">
        <PreviewAtividade atividade={atividadeDemonstracao} modo="Demonstração" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-surface-100 border-t border-surface-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-surface-600 font-medium text-center sm:text-left text-sm">
            Gostou? Crie um caderno infinito com os temas que o seu filho mais ama!
          </p>
          <Link 
            href="/sign-up" 
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Quero Criar o Meu
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
