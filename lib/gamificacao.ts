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
  };
  conquistas: string[];
  historicoGeral: {
    totalAtividades: number;
    totalSementesGanhas: number;
    diasSeguidos: number;
    ultimaAtividade: string | null;
  };
  redeemedCodes: string[];
  atividadesGeradas: number;
  historiasGeradas: number;
  labirintosGerados: number;
  cacasGerados: number;
  onboardingCompleted: boolean;
}

export const DEFAULT_STATS: UserStats = {
  sementes: 0,
  ofensivaAtual: 0,
  historicoCheckins: [],
  dataUltimaAtividadeDiaria: null,
  inventario: {
    arvoreNivel: 0, // 0 = sem árvore
    animais: [],
  },
  conquistas: [],
  historicoGeral: {
    totalAtividades: 0,
    totalSementesGanhas: 0,
    diasSeguidos: 0,
    ultimaAtividade: null,
  },
  redeemedCodes: [],
  atividadesGeradas: 0,
  historiasGeradas: 0,
  labirintosGerados: 0,
  cacasGerados: 0,
  onboardingCompleted: false
};

let currentUserId: string | null = null;

export function setUserId(id: string | null) {
  currentUserId = id;
}

function getStorageKey() {
  return currentUserId ? `@cadernovivo_gamificacao_${currentUserId}` : '@cadernovivo_gamificacao_anon';
}

// Lê o estado do localStorage
export function getStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  const data = localStorage.getItem(getStorageKey());
  const parsed = data ? JSON.parse(data) : null;
  
  if (!parsed) return DEFAULT_STATS;

  return { 
    ...DEFAULT_STATS, 
    ...parsed,
    inventario: {
      ...DEFAULT_STATS.inventario,
      ...(parsed.inventario || {})
    },
    historicoGeral: {
      ...DEFAULT_STATS.historicoGeral,
      ...(parsed.historicoGeral || {})
    },
    conquistas: parsed.conquistas || [],
    historicoCheckins: parsed.historicoCheckins || [],
    redeemedCodes: parsed.redeemedCodes || []
  };
}

// Salva o estado no localStorage e sincroniza na nuvem
export function saveStats(stats: UserStats) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(getStorageKey(), JSON.stringify(stats));
    // Dispara evento global para componentes reagirem
    window.dispatchEvent(new Event('cadernovivo-gamificacao-update'));

    // Sincroniza em background
    if (currentUserId) {
      fetch('/api/gamificacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats)
      }).catch(err => console.error("Falha ao sincronizar gamificação", err));
    }
  }
}

// Puxa os dados reais da nuvem na inicialização
export async function syncFromCloud() {
  if (!currentUserId || typeof window === 'undefined') return;
  try {
    const res = await fetch('/api/gamificacao');
    const cloudStats = await res.json();
    if (cloudStats && !cloudStats.error) {
       localStorage.setItem(getStorageKey(), JSON.stringify(cloudStats));
       window.dispatchEvent(new Event('cadernovivo-gamificacao-update'));
    }
  } catch (err) {
    console.error("Falha ao baixar gamificação da nuvem", err);
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
  checkBadges(stats);
  return { sucesso: true, sementesGanhadas: 5 };
}

// Adiciona sementes (ex: por gerar PDF)
export function adicionarSementes(quantidade: number) {
  const stats = getStats();
  stats.sementes += quantidade;
  saveStats(stats);
  checkBadges(stats);
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
  checkBadges(stats);
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

// ============================
// CONQUISTAS (BADGES) E ATIVIDADES
// ============================

export function checkBadges(stats: UserStats) {
  const newBadges: string[] = [];

  const addBadge = (id: string) => {
    if (!stats.conquistas) stats.conquistas = [];
    if (!stats.conquistas.includes(id)) {
      stats.conquistas.push(id);
      newBadges.push(id);
    }
  };

  // 1. Aventureiro Iniciante
  if (stats.atividadesGeradas >= 1) addBadge('aventureiro_iniciante');
  
  // 2. Mestre da Frequência
  if (stats.ofensivaAtual >= 3) addBadge('mestre_frequencia');
  
  // 3. Poupador Bronze (Fazendeiro Aprendiz)
  if (stats.sementes >= 50) addBadge('poupador_bronze');
  
  // 4. Desbravador de Labirintos
  if (stats.labirintosGerados >= 1) addBadge('desbravador_labirintos');
  
  // 5. Olho de Águia (Caça-Palavras)
  if (stats.cacasGerados >= 1) addBadge('olho_aguia');
  
  // 6. Pequeno Leitor (História)
  if (stats.historiasGeradas >= 1) addBadge('pequeno_leitor');

  if (newBadges.length > 0) {
    saveStats(stats);
    // Dispara evento para mostrar confetes e toast
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cadernovivo-badge-unlocked', { detail: newBadges }));
    }
  }
}

export const registrarAtividade = (tipo: string) => {
  const stats = getStats();
  
  // Atualiza histórico
  const hoje = new Date().toISOString().split('T')[0];
  const ultima = stats.historicoGeral.ultimaAtividade;
  
  if (ultima !== hoje) {
    if (ultima === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
      stats.historicoGeral.diasSeguidos += 1;
    } else {
      stats.historicoGeral.diasSeguidos = 1;
    }
    stats.historicoGeral.ultimaAtividade = hoje;
  }
  
  stats.historicoGeral.totalAtividades += 1;
  stats.atividadesGeradas += 1;
  
  if (tipo === 'labirinto') stats.labirintosGerados += 1;
  if (tipo === 'caca_palavras') stats.cacasGerados += 1;
  if (tipo === 'historia') stats.historiasGeradas += 1;

  // Lógica de Conquistas (Lote 3)
  if (!stats.conquistas) stats.conquistas = [];
  
  if (stats.historicoGeral.totalAtividades >= 1 && !stats.conquistas.includes('aventureiro_iniciante')) {
    stats.conquistas.push('aventureiro_iniciante');
  }
  if (stats.historicoGeral.diasSeguidos >= 3 && !stats.conquistas.includes('mestre_frequencia')) {
    stats.conquistas.push('mestre_frequencia');
  }
  if (tipo === 'labirinto' && !stats.conquistas.includes('desbravador_labirintos')) {
    stats.conquistas.push('desbravador_labirintos');
  }
  if (tipo === 'caca_palavras' && !stats.conquistas.includes('olho_aguia')) {
    stats.conquistas.push('olho_aguia');
  }
  if (tipo === 'historia' && !stats.conquistas.includes('pequeno_leitor')) {
    stats.conquistas.push('pequeno_leitor');
  }

  saveStats(stats);
};

export const gerarCodigoMagico = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Save to valid codes in local storage
  const validCodesStr = localStorage.getItem('cadernoVivo_validCodes');
  const validCodes = validCodesStr ? JSON.parse(validCodesStr) : [];
  validCodes.push(code);
  localStorage.setItem('cadernoVivo_validCodes', JSON.stringify(validCodes));
  
  return code;
};

export const resgatarCodigo = (codigo: string): { success: boolean; message: string } => {
  const stats = getStats();
  const validCodesStr = localStorage.getItem('cadernoVivo_validCodes');
  const validCodes = validCodesStr ? JSON.parse(validCodesStr) : [];

  if (!stats.redeemedCodes) stats.redeemedCodes = [];

  if (stats.redeemedCodes.includes(codigo)) {
    return { success: false, message: 'Este código já foi resgatado!' };
  }

  if (validCodes.includes(codigo)) {
    stats.redeemedCodes.push(codigo);
    stats.sementes += 10;
    stats.historicoGeral.totalSementesGanhas += 10;
    saveStats(stats);
    return { success: true, message: 'Código validado! Você ganhou +10 Sementes! 🌱' };
  }

  return { success: false, message: 'Código inválido! Verifique se digitou corretamente.' };
};

export function concluirOnboarding() {
  const stats = getStats();
  stats.onboardingCompleted = true;
  saveStats(stats);
}
