// ============================
// CadernoVivo — Sistema de Gamificação (Local Storage MVP)
// ============================

export interface UserStats {
  sementes: number;
  ofensivaAtual: number;
  historicoCheckins: string[]; // YYYY-MM-DD
  dataUltimaAtividadeDiaria: string | null; // YYYY-MM-DD
  inventario: {
    arvoreNivel: number;
    animais: string[]; // 'vaca', 'cachorro', 'galinha'
  }
}

const DEFAULT_STATS: UserStats = {
  sementes: 0,
  ofensivaAtual: 0,
  historicoCheckins: [],
  dataUltimaAtividadeDiaria: null,
  inventario: {
    arvoreNivel: 0, // 0 = sem árvore
    animais: [],
  }
};

const STORAGE_KEY = '@cadernovivo_gamificacao';

// Lê o estado do localStorage
export function getStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : DEFAULT_STATS;
}

// Salva o estado no localStorage
export function saveStats(stats: UserStats) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    // Dispara evento global para componentes reagirem
    window.dispatchEvent(new Event('cadernovivo-gamificacao-update'));
  }
}

// Retorna a data de hoje formatada
export function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Faz o check-in diário
export function realizarCheckin(): { sucesso: boolean; sementesGanhadas: number } {
  const stats = getStats();
  const today = getTodayStr();
  
  if (stats.historicoCheckins.includes(today)) {
    return { sucesso: false, sementesGanhadas: 0 }; // Já fez hoje
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  
  if (stats.historicoCheckins.includes(yesterdayStr)) {
    stats.ofensivaAtual += 1;
  } else {
    stats.ofensivaAtual = 1; // Quebrou a ofensiva, volta pro 1
  }

  stats.historicoCheckins.push(today);
  stats.sementes += 5; // Recompensa padrão de check-in

  saveStats(stats);
  return { sucesso: true, sementesGanhadas: 5 };
}

// Adiciona sementes (ex: por gerar PDF)
export function adicionarSementes(quantidade: number) {
  const stats = getStats();
  stats.sementes += quantidade;
  saveStats(stats);
}

// Remove sementes com limite mínimo de 0
export function removerSementes(quantidade: number) {
  const stats = getStats();
  stats.sementes = Math.max(0, stats.sementes - quantidade);
  saveStats(stats);
}

// Verifica se a atividade diária já foi feita hoje
export function isAtividadeDiariaConcluidaHoje(): boolean {
  const stats = getStats();
  const today = getTodayStr();
  return stats.dataUltimaAtividadeDiaria === today;
}

// Marca a atividade diária como feita hoje e dá sementes
export function concluirAtividadeDiaria(bonus: number): boolean {
  if (isAtividadeDiariaConcluidaHoje()) {
    return false;
  }
  
  const stats = getStats();
  stats.dataUltimaAtividadeDiaria = getTodayStr();
  stats.sementes += bonus;
  saveStats(stats);
  return true;
}

// Compra um item na loja
export function comprarItem(itemId: string, preco: number): boolean {
  const stats = getStats();
  
  if (stats.sementes < preco) return false;
  
  stats.sementes -= preco;

  if (itemId === 'arvore_up') {
    stats.inventario.arvoreNivel = Math.min(stats.inventario.arvoreNivel + 1, 7);
  } else {
    if (!stats.inventario.animais.includes(itemId)) {
      stats.inventario.animais.push(itemId);
    }
  }

  saveStats(stats);
  return true;
}
