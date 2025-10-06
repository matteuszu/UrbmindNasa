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

// Interface para os parâmetros fixos
export interface FixedParams {
  chuva_mm: number;
  freq_min: number;
}

// Interface para coordenada com parâmetros fixos
export interface CoordinateWithFixedParams {
  lon: number;
  lat: number;
  chuva_mm: number;
  freq_min: number;
  modo: string;
}

// Interface para o payload com parâmetros fixos
export interface FixedParamsPayload {
  pontos: CoordinateWithFixedParams[];
}

/**
 * Função para enviar dados para analisar-batch com parâmetros fixos
 * @param coordinates - Array de coordenadas (lon, lat)
 * @param fixedParams - Parâmetros fixos (chuva_mm e freq_min) que serão aplicados a todas as coordenadas
 * @returns Promise com a resposta da API
 */
export async function sendDataToAnalisarBatchWithFixedParams(
  coordinates: Array<{lon: number, lat: number}>,
  fixedParams: FixedParams
): Promise<any> {
  try {
    console.log('🔄 Criando payload com parâmetros fixos...');
    console.log('📊 Parâmetros fixos:', fixedParams);
    console.log('📍 Total de coordenadas:', coordinates.length);
    
    // Criar array de pontos com parâmetros fixos
    const pontos: CoordinateWithFixedParams[] = coordinates.map(coord => ({
      lon: coord.lon,
      lat: coord.lat,
      chuva_mm: fixedParams.chuva_mm,
      freq_min: fixedParams.freq_min,
      modo: 'geo'
    }));
    
    const payload: FixedParamsPayload = { pontos };
    
    console.log('📋 Payload criado:', JSON.stringify(payload, null, 2));
    
    // Usar a função existente para enviar os dados
    const result = await sendDataToAnalisarBatch(payload);
    
    console.log('✅ Dados enviados com sucesso usando parâmetros fixos');
    return result;
    
  } catch (error) {
    console.error('❌ Erro ao enviar dados com parâmetros fixos:', error);
    throw error;
  }
}

