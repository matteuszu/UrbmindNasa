/**
 * Store global para armazenar dados em background
 * Apenas para processamento - sem interface visual
 */

interface WeatherData {
  pontos: Array<{
    lon: number;
    lat: number;
    chuva_mm: number;
    freq_min: number;
    modo: string;
    weather_description?: string;
  }>;
}

interface WeatherDetails {
  totalPontos: number;
  pontosComWeather: number;
  weatherTypes: string[];
  weatherCodes: string[];
}

interface GlobalData {
  weatherData: WeatherData;
  apiResponse: any;
  weatherDetails: WeatherDetails;
  timestamp: string;
}

interface ApiResponseStore {
  data: any | null;
  weatherData: WeatherData | null;
  globalData: GlobalData | null;
  timestamp: number | null;
}

const store: ApiResponseStore = {
  data: null,
  weatherData: null,
  globalData: null,
  timestamp: null,
};

export const apiResponseStore = {
  /**
   * Obter dados globais completos
   */
  getGlobalData: () => store.globalData,
  
  /**
   * Verificar se há dados globais disponíveis
   */
  hasGlobalData: () => store.globalData !== null,
};

/**
 * Definir dados da resposta da API
 */
export function setApiResponse(data: any) {
  store.data = data;
  store.timestamp = Date.now();
}

/**
 * Definir dados de weather
 */
export function setWeatherData(weatherData: WeatherData) {
  store.weatherData = weatherData;
}

/**
 * Definir dados globais completos
 */
export function setGlobalData(globalData: GlobalData) {
  store.globalData = globalData;
  store.timestamp = Date.now();
}

/**
 * Limpar dados da resposta da API
 */
export function clearApiResponse() {
  store.data = null;
  store.timestamp = null;
}

/**
 * Obter dados da resposta da API (função de conveniência)
 */
export function getApiResponse(): any | null {
  return store.data;
}

/**
 * Obter dados de weather (função de conveniência)
 */
export function getWeatherData(): WeatherData | null {
  return store.weatherData;
}

/**
 * Verificar se há dados disponíveis (função de conveniência)
 */
export function hasApiResponse(): boolean {
  return store.data !== null;
}

/**
 * Verificar se há dados de weather disponíveis (função de conveniência)
 */
export function hasWeatherData(): boolean {
  return store.weatherData !== null;
}
