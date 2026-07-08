export interface HistoricoItem {
  id: string;
  data: string;
  titulo: string;
  subtitulo: string;
  foco: string;
  modo: string;
  imagens: string[]; // Base64 or URLs
}

const STORAGE_KEY = 'cadernovivo-historico';

export function salvarNoHistorico(item: Omit<HistoricoItem, 'id' | 'data'>) {
  if (typeof window === 'undefined') return;

  const historico = getHistorico();
  const novoItem: HistoricoItem = {
    ...item,
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    data: new Date().toISOString(),
  };

  historico.unshift(novoItem);
  
  // Limita a 50 itens para não estourar o localStorage
  if (historico.length > 50) {
    historico.pop();
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(historico));
  window.dispatchEvent(new Event('cadernovivo-historico-update'));
}

export function getHistorico(): HistoricoItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Erro ao ler histórico', err);
    return [];
  }
}
