import { WeatherDataResponse } from './weatherDataService';

// Store global para armazenar os dados meteorológicos processados
class WeatherDataStore {
  private data: WeatherDataResponse | null = null;
  private listeners: Array<(data: WeatherDataResponse | null) => void> = [];
  private isProcessing: boolean = false;

  // Definir dados processados
  setData(data: WeatherDataResponse) {
    this.data = data;
    console.log('📊 Dados meteorológicos armazenados no store global');
    this.notifyListeners();
  }

  // Obter dados armazenados
  getData(): WeatherDataResponse | null {
    return this.data;
  }

  // Verificar se está processando
  getIsProcessing(): boolean {
    return this.isProcessing;
  }

  // Definir estado de processamento
  setIsProcessing(processing: boolean) {
    this.isProcessing = processing;
  }

  // Inscrever-se para receber atualizações
  subscribe(listener: (data: WeatherDataResponse | null) => void) {
    this.listeners.push(listener);
    
    // Retornar função de unsubscribe
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notificar todos os listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.data));
  }

  // Limpar dados
  clear() {
    this.data = null;
    this.isProcessing = false;
    this.notifyListeners();
  }
}

// Instância global do store
export const weatherDataStore = new WeatherDataStore();

// Função para obter dados do store
export function getWeatherData(): WeatherDataResponse | null {
  return weatherDataStore.getData();
}

// Função para verificar se está processando
export function isWeatherDataProcessing(): boolean {
  return weatherDataStore.getIsProcessing();
}

// Função para definir dados no store
export function setWeatherData(data: WeatherDataResponse) {
  weatherDataStore.setData(data);
}

// Função para definir estado de processamento
export function setWeatherDataProcessing(processing: boolean) {
  weatherDataStore.setIsProcessing(processing);
}
