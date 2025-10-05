export interface AnalysisRequest {
  lon: number;
  lat: number;
  chuva_mm: number;
  freq_min: number;
  modo: 'geo';
}

export interface AnalysisResponse {
  entrada: AnalysisRequest;
  probabilidade: number;
  risco_base: number;
  raio_influencia: {
    raio_m: number;
    prob_media: number;
  };
  status: 'sucesso' | 'erro';
}

export class AnalysisService {
  private readonly baseUrl = 'https://api.urbmind.com';

  async analyzeFloodRisk(request: AnalysisRequest): Promise<AnalysisResponse> {
    try {
      console.log('🔬 Enviando requisição de análise:', request);
      
      const response = await fetch(`${this.baseUrl}/analisar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AnalysisResponse = await response.json();
      console.log('🔬 Resposta da análise recebida:', data);
      
      return data;
    } catch (error) {
      console.error('🔬 Erro na análise:', error);
      throw error;
    }
  }

  // Método para simular dados quando a API não estiver disponível
  async simulateAnalysis(request: AnalysisRequest): Promise<AnalysisResponse> {
    console.log('🔬 Simulando análise (modo offline):', request);
    
    // Simula um delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Calcula uma probabilidade baseada nos parâmetros
    const baseProb = Math.min(0.9, Math.max(0.1, (request.chuva_mm / 100) * 0.8));
    const freqFactor = Math.min(1.2, Math.max(0.8, request.freq_min / 60));
    const finalProb = Math.min(0.95, baseProb * freqFactor);
    
    return {
      entrada: request,
      probabilidade: Math.round(finalProb * 100) / 100,
      risco_base: Math.round((finalProb * 0.7) * 100) / 100,
      raio_influencia: {
        raio_m: Math.round(300 + (finalProb * 400)),
        prob_media: Math.round((finalProb * 0.9) * 100) / 100
      },
      status: 'sucesso'
    };
  }
}

export const analysisService = new AnalysisService();
