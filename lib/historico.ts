export interface HistoricoItem {
  id: string;
  data: string;
  titulo: string;
  subtitulo: string;
  foco: string;
  modo: string;
  imagens: string[]; // Base64 or URLs
}

let currentUserId: string | null = null;

export function setHistoricoUserId(id: string | null) {
  currentUserId = id;
}

function getStorageKey() {
  return currentUserId ? `cadernovivo-historico-${currentUserId}` : 'cadernovivo-historico-anon';
}

export function salvarNoHistorico(item: Omit<HistoricoItem, 'id' | 'data'>) {
  if (typeof window === 'undefined') return;

  const historico = getHistorico();
  const novoItem: HistoricoItem = {
    ...item,
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    data: new Date().toISOString(),
  };

  historico.unshift(novoItem);
  
  // Limita a 50 itens locais para não estourar o localStorage
  if (historico.length > 50) {
    historico.pop();
  }

  localStorage.setItem(getStorageKey(), JSON.stringify(historico));
  window.dispatchEvent(new Event('cadernovivo-historico-update'));

  // Sync with cloud in background if user is logged in
  if (currentUserId) {
    fetch('/api/historico', {
      method: 'POST',
      body: JSON.stringify({ historico }),
      headers: { 'Content-Type': 'application/json' }
    }).catch(console.error);
  }
}

export function getHistorico(): HistoricoItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(getStorageKey());
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Erro ao ler histórico', err);
    return [];
  }
}

export async function syncCloudHistorico() {
  if (!currentUserId || typeof window === 'undefined') return;

  try {
    const res = await fetch('/api/historico');
    if (res.ok) {
      const cloudHistorico: HistoricoItem[] = await res.json();
      if (cloudHistorico && cloudHistorico.length > 0) {
        const local = getHistorico();
        
        // Merge cloud and local history
        // Create a map by ID to avoid duplicates, preferring local (newer) items if same ID
        const map = new Map<string, HistoricoItem>();
        cloudHistorico.forEach(item => map.set(item.id, item));
        local.forEach(item => map.set(item.id, item));
        
        // Convert map to array and sort by date descending
        const merged = Array.from(map.values()).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
        
        // Take top 50 local
        const final = merged.slice(0, 50);
        
        localStorage.setItem(getStorageKey(), JSON.stringify(final));
        window.dispatchEvent(new Event('cadernovivo-historico-update'));
      }
    }
  } catch (err) {
    console.error('Erro ao sincronizar histórico da nuvem:', err);
  }
}
