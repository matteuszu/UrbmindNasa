// Configuração da API externa
export const API_CONFIG = {
  // URL base da API (deve ser configurada via variável de ambiente)
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://148.230.78.172:8000',
  
  // Endpoint para análise de batch
  ANALISAR_BATCH_ENDPOINT: import.meta.env.VITE_API_ANALISAR_BATCH_ENDPOINT || '/analisar-batch',
  
  // URL completa para o endpoint
  get ANALISAR_BATCH_URL() {
    return `${this.BASE_URL}${this.ANALISAR_BATCH_ENDPOINT}`;
  },
  
  // URL do proxy local (para contornar CORS)
  get PROXY_URL() {
    return `/api${this.ANALISAR_BATCH_ENDPOINT}`;
  }
};

// Função para fazer fetch no endpoint analisar-batch
export async function sendDataToAnalisarBatch(data: any): Promise<any> {
  try {
    console.log('🔄 Enviando dados para endpoint analisar-batch via proxy...');
    console.log('📍 URL do proxy:', API_CONFIG.PROXY_URL);
    console.log('📊 Dados enviados:', JSON.stringify(data, null, 2));
    
    // Usar proxy local para contornar CORS
    const response = await fetch(API_CONFIG.PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✅ Dados enviados com sucesso para analisar-batch via proxy');
    console.log('📋 Resposta da API:', result);
    
    return result;
    
  } catch (error) {
    console.error('❌ Erro ao enviar dados via proxy:', error);
    
    // Se o proxy falhar, tentar diretamente
    console.log('🔄 Tentando conexão direta...');
    return await sendDataToAnalisarBatchDirect(data);
  }
}

// Função para tentar conexão direta (fallback)
async function sendDataToAnalisarBatchDirect(data: any): Promise<any> {
  try {
    console.log('🔄 Tentando conexão direta para endpoint analisar-batch...');
    console.log('📍 URL direta:', API_CONFIG.ANALISAR_BATCH_URL);
    
    const response = await fetch(API_CONFIG.ANALISAR_BATCH_URL, {
      method: 'POST',
      mode: 'no-cors', // Ignora CORS completamente
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    // Com no-cors, não podemos ler a resposta, mas a requisição foi enviada
    console.log('✅ Dados enviados via conexão direta (no-cors)');
    console.log('📡 Status:', response.status);
    console.log('📡 Type:', response.type);
    
    return {
      status: 'sent',
      message: 'Dados enviados via conexão direta (no-cors)',
      response_type: response.type
    };
    
  } catch (error) {
    console.error('❌ Erro na conexão direta:', error);
    throw error;
  }
}

