/**
 * Store global para armazenar a resposta da API analisar-batch
 * Permite acesso à resposta em qualquer parte do projeto
 */

interface ApiResponseStore {
  data: any | null;
  timestamp: number | null;
  subscribers: ((data: any | null) => void)[];
}

const store: ApiResponseStore = {
  data: null,
  timestamp: null,
  subscribers: [],
};

export const apiResponseStore = {
  /**
   * Obter dados da resposta da API
   */
  getData: () => store.data,
  
  /**
   * Obter timestamp da última resposta
   */
  getTimestamp: () => store.timestamp,
  
  /**
   * Verificar se há dados disponíveis
   */
  hasData: () => store.data !== null,
  
  /**
   * Inscrever-se para receber atualizações
   */
  subscribe: (callback: (data: any | null) => void) => {
    store.subscribers.push(callback);
    return () => {
      store.subscribers = store.subscribers.filter((sub) => sub !== callback);
    };
  },
  
  /**
   * Notificar todos os subscribers
   */
  notifySubscribers: () => {
    store.subscribers.forEach((callback) => callback(store.data));
  },
};

/**
 * Definir dados da resposta da API
 */
export function setApiResponse(data: any) {
  store.data = data;
  store.timestamp = Date.now();
  apiResponseStore.notifySubscribers();
  
  console.log('📊 Resposta da API armazenada no store global:', data);
  console.log('⏰ Timestamp:', new Date(store.timestamp).toLocaleString());
}

/**
 * Limpar dados da resposta da API
 */
export function clearApiResponse() {
  store.data = null;
  store.timestamp = null;
  apiResponseStore.notifySubscribers();
  
  console.log('🗑️ Dados da API limpos do store global');
}

/**
 * Obter dados da resposta da API (função de conveniência)
 */
export function getApiResponse(): any | null {
  return store.data;
}

/**
 * Verificar se há dados disponíveis (função de conveniência)
 */
export function hasApiResponse(): boolean {
  return store.data !== null;
}
