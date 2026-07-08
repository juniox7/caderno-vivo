// ============================
// CadernoVivo — Type Definitions
// ============================

export type Modo = 'livre' | 'predefinido' | 'professores';

export type FocoPedagogico =
  | 'matematica'
  | 'leitura'
  | 'raciocinio-logico'
  | 'ciencias'
  | 'portugues'
  | 'caligrafia'
  | 'livre'
  | 'interpretacao';

export type NivelDificuldade = 'facil' | 'medio' | 'desafiador';

// ---- Formulário Inputs ----

export interface FormularioLivreData {
  nomes: string[];
  idade: number;
  anoEscolar: string;
  focoPedagogico: FocoPedagogico;
  interesse1: string;
  interesse2: string;
  formatoResposta: 'escrita' | 'multipla_escolha' | 'sem_pergunta';
}

export interface FormularioPredefinidoData {
  nomes: string[];
  idade: number;
  categoriaId: string;
  formatoResposta: 'escrita' | 'multipla_escolha' | 'sem_pergunta';
}

export interface FormularioProfessorData {
  nomeProfessor: string;
  nomesAlunos: string[]; // Up to 6 specific names to include
  turma: string;
  serie: string;
  quantidadeAlunos: number;
  focoPedagogico: FocoPedagogico;
  objetivoPedagogico: string;
  nivel: NivelDificuldade;
  formatoResposta: 'escrita' | 'multipla_escolha' | 'sem_pergunta';
}

// ---- API Request ----

export interface GerarAtividadeRequest {
  modo: Modo;
  dados: FormularioLivreData | FormularioPredefinidoData | FormularioProfessorData;
}

// ---- API Response ----

export interface Questao {
  pergunta: string;
  resposta: string;
  dica: string;
  opcoes?: string[];
  respostaCorreta?: string;
}

export interface Atividade {
  tipo: string;
  enunciado: string;
  questoes: Questao[];
  imagemUrl?: string;
}

export interface AtividadeGerada {
  titulo: string;
  subtitulo: string;
  atividades: Atividade[];
  criadoEm: string;
}

export interface AtividadeDiaria {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'desafio' | 'curiosidade' | 'quebra-cabeca';
  conteudo: string;
  opcoes?: string[];
  respostaCorreta?: string;
  resposta?: string; // Fallback text explanation
  dica?: string;
}

// ---- Categoria Predefinida ----

export interface CategoriaPredefinida {
  id: string;
  titulo: string;
  descricao: string;
  emoji: string;
  cor: string;
  focoPedagogico: FocoPedagogico;
}

// ---- Semente / Gamificação ----

export interface ProgressoDiario {
  sementes: number;
  streak: number;
  ultimaAtividade: string | null;
  concluida: boolean;
  dataUltimaAtividadeDiaria: string | null;
}
