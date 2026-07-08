// ============================
// CadernoVivo — Constants & Suggestions
// ============================

import { CategoriaPredefinida, FocoPedagogico } from './types';

// ---- Focos Pedagógicos ----

export const FOCOS_PEDAGOGICOS: { id: FocoPedagogico; label: string; emoji: string }[] = [
  { id: 'matematica', label: 'Matemática', emoji: '🧮' },
  { id: 'leitura', label: 'Leitura', emoji: '📖' },
  { id: 'raciocinio-logico', label: 'Raciocínio Lógico', emoji: '🧩' },
  { id: 'ciencias', label: 'Ciências', emoji: '🔬' },
  { id: 'portugues', label: 'Português', emoji: '✏️' },
  { id: 'caligrafia', label: 'Caligrafia', emoji: '🖊️' },
  { id: 'interpretacao', label: 'Interpretação', emoji: '🗣️' },
  { id: 'livre', label: 'Tema Livre / História', emoji: '🌈' },
];

// ---- Sugestões de Interesses ----

export const SUGESTOES_INTERESSES: string[] = [
  '🦕 Dinossauros',
  '⚽ Futebol',
  '🎵 Música',
  '🚀 Espaço',
  '🐾 Animais',
  '🦸 Super-heróis',
  '🏎️ Carros',
  '🧚 Fadas e Magia',
  '🎮 Games',
  '🌊 Oceano',
  '🦁 Selva',
  '🏰 Castelos',
  '🍕 Comida',
  '🎨 Arte',
  '🤖 Robôs',
];

// ---- Anos Escolares ----

export const ANOS_ESCOLARES: { value: string; label: string }[] = [
  { value: 'pre', label: 'Pré-escola (4-5 anos)' },
  { value: '1ano', label: '1º Ano' },
  { value: '2ano', label: '2º Ano' },
  { value: '3ano', label: '3º Ano' },
  { value: '4ano', label: '4º Ano' },
  { value: '5ano', label: '5º Ano' },
  { value: '6ano', label: '6º Ano' },
  { value: '7ano', label: '7º Ano' },
  { value: '8ano', label: '8º Ano' },
  { value: '9ano', label: '9º Ano' },
];

// ---- Categorias Predefinidas ----

export const CATEGORIAS_PREDEFINIDAS: CategoriaPredefinida[] = [
  {
    id: 'mat-divertida',
    titulo: 'Matemática Divertida',
    descricao: 'Contas e problemas com temas que as crianças adoram',
    emoji: '🧮',
    cor: 'from-violet-500 to-purple-600',
    focoPedagogico: 'matematica',
  },
  {
    id: 'historinha',
    titulo: 'Historinha de Leitura',
    descricao: 'Mini-conto personalizado + interpretação de texto',
    emoji: '📖',
    cor: 'from-amber-500 to-orange-600',
    focoPedagogico: 'leitura',
  },
  {
    id: 'logica',
    titulo: 'Raciocínio Lógico',
    descricao: 'Sequências, padrões, enigmas e desafios mentais',
    emoji: '🧩',
    cor: 'from-teal-500 to-cyan-600',
    focoPedagogico: 'raciocinio-logico',
  },
  {
    id: 'cientista',
    titulo: 'Pequeno Cientista',
    descricao: 'Experimentos simples e curiosidades da natureza',
    emoji: '🔬',
    cor: 'from-green-500 to-emerald-600',
    focoPedagogico: 'ciencias',
  },
  {
    id: 'caligrafia',
    titulo: 'Caligrafia Criativa',
    descricao: 'Treino de escrita com frases divertidas e inspiradoras',
    emoji: '✏️',
    cor: 'from-pink-500 to-rose-600',
    focoPedagogico: 'caligrafia',
  },
];

// ---- Níveis de Dificuldade ----

export const NIVEIS_DIFICULDADE = [
  { value: 'facil', label: '🟢 Fácil', desc: 'Ideal para introdução ao tema' },
  { value: 'medio', label: '🟡 Médio', desc: 'Nível padrão para a série' },
  { value: 'desafiador', label: '🔴 Desafiador', desc: 'Para alunos avançados' },
] as const;

// ---- Séries (Professores) ----

export const SERIES_PROFESSOR = [
  'Educação Infantil',
  '1º Ano - Fundamental I',
  '2º Ano - Fundamental I',
  '3º Ano - Fundamental I',
  '4º Ano - Fundamental I',
  '5º Ano - Fundamental I',
  '6º Ano - Fundamental II',
  '7º Ano - Fundamental II',
  '8º Ano - Fundamental II',
  '9º Ano - Fundamental II',
];
