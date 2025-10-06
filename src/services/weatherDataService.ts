import { supabase } from '../utils/supabase/client';
import uberlandiaCoordinates from '../data/uberlandia-coordinates.json';
import { sendDataToAnalisarBatch } from '../config/api';
import { setApiResponse, setWeatherData, setGlobalData } from './apiResponseStore';

// Interface para os dados de entrada das coordenadas
interface CoordinateData {
  lon: number;
  lat: number;
  nome: string;
}

// Interface para os dados retornados do Supabase
interface RainForecastData {
  latitude: number;
  longitude: number;
  precipitation: number;
  rainfall_mm: number;
  rainfall_time: number;
  forecast_date: string;
  forecast_hour: number;
}

// Interface para dados de weather forecast
interface WeatherForecastData {
  latitude: number;
  longitude: number;
  weather: number;
  rainfall_mm: number | null;
  rainfall_time: number | null;
  forecast_date: string;
  forecast_hour: number;
  description_en: string;
}

// Interface para o JSON final
interface WeatherPoint {
  lon: number;
  lat: number;
  chuva_mm: number; // Formato decimal com 2 casas (ex: 0.00, 5.25, 12.50)
  freq_min: number;
  modo: string;
  weather_description?: string; // Descrição do clima em inglês
}

export interface WeatherDataResponse {
  pontos: WeatherPoint[];
}

/**
 * Buscar todos os dados meteorológicos de uma vez com consulta otimizada
 * Concilia coordenadas com 2 casas decimais
 */
async function fetchAllWeatherDataForCoordinates(coordinates: CoordinateData[]): Promise<Map<string, { rainData: any, weatherData: any }>> {
  try {
    console.log('🔄 Iniciando consulta otimizada...');
    
    // Criar mapa para armazenar resultados
    const resultsMap = new Map<string, { rainData: any, weatherData: any }>();
    
    // Processar em lotes para evitar consultas muito grandes
    const BATCH_SIZE = 100;
    const totalBatches = Math.ceil(coordinates.length / BATCH_SIZE);
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIndex = batchIndex * BATCH_SIZE;
      const endIndex = Math.min(startIndex + BATCH_SIZE, coordinates.length);
      const batch = coordinates.slice(startIndex, endIndex);
      
      console.log(`📦 Processando lote ${batchIndex + 1}/${totalBatches} (${batch.length} coordenadas)`);
      
      // Criar arrays de coordenadas únicas para o lote
      const uniqueCoords = new Set<string>();
      batch.forEach(coord => {
        uniqueCoords.add(`${coord.lat.toFixed(2)},${coord.lon.toFixed(2)}`);
      });
      
      const coordArray = Array.from(uniqueCoords);
      
      // Buscar dados de rain_forecast para todas as coordenadas do lote usando range
      const rainPromises = coordArray.map(async (coordStr) => {
        const [lat, lon] = coordStr.split(',');
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        
        // Range de ±0.005 para contemplar coordenadas próximas (aproximadamente 500m)
        const { data, error } = await supabase
          .from('rain_forecast')
          .select('*')
          .gte('latitude', (latNum - 0.005).toFixed(2))
          .lte('latitude', (latNum + 0.005).toFixed(2))
          .gte('longitude', (lonNum - 0.005).toFixed(2))
          .lte('longitude', (lonNum + 0.005).toFixed(2))
          .order('search_date', { ascending: false })
          .limit(1);
        
        return { coordStr, data: data?.[0] || null, error };
      });
      
      // Buscar dados de weatherforecast para todas as coordenadas do lote usando range
      const weatherPromises = coordArray.map(async (coordStr) => {
        const [lat, lon] = coordStr.split(',');
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        
        // Primeiro buscar o código do weather usando range
        const { data: weatherData, error: weatherError } = await supabase
          .from('weatherforecast')
          .select('weather')
          .gte('latitude', (latNum - 0.005).toFixed(2))
          .lte('latitude', (latNum + 0.005).toFixed(2))
          .gte('longitude', (lonNum - 0.005).toFixed(2))
          .lte('longitude', (lonNum + 0.005).toFixed(2))
          .order('search_date', { ascending: false })
          .limit(1);
        
        if (weatherError || !weatherData?.[0]?.weather) {
          return { coordStr, data: null, error: weatherError };
        }
        
        // Agora buscar a descrição usando o código
        const { data: symbolData, error: symbolError } = await supabase
          .from('weather_symbol')
          .select('description_en')
          .eq('codigo', weatherData[0].weather)
          .single();
        
        if (symbolError) {
          return { coordStr, data: null, error: symbolError };
        }
        
        // Combinar os dados
        const combinedData = {
          weather: weatherData[0].weather,
          description_en: symbolData?.description_en || null
        };
        
        return { coordStr, data: combinedData, error: null };
      });
      
      // Executar consultas em paralelo
      const [rainResults, weatherResults] = await Promise.all([
        Promise.all(rainPromises),
        Promise.all(weatherPromises)
      ]);
      
      // Processar resultados
      rainResults.forEach(({ coordStr, data }) => {
        if (!resultsMap.has(coordStr)) {
          resultsMap.set(coordStr, { rainData: null, weatherData: null });
        }
        const existing = resultsMap.get(coordStr)!;
        existing.rainData = data;
      });
      
      weatherResults.forEach(({ coordStr, data }) => {
        if (!resultsMap.has(coordStr)) {
          resultsMap.set(coordStr, { rainData: null, weatherData: null });
        }
        const existing = resultsMap.get(coordStr)!;
        existing.weatherData = data;
      });
    }
    
    console.log(`✅ Consulta otimizada concluída. ${resultsMap.size} coordenadas processadas.`);
    return resultsMap;
    
  } catch (error) {
    console.error('❌ Erro na consulta otimizada:', error);
    return new Map();
  }
}


/**
 * Busca dados de previsão de chuva no Supabase para as coordenadas de Uberlândia
 * Processamento silencioso em background - 2478 pontos da grade 500m
 */
export async function fetchWeatherDataForUberlandia(): Promise<WeatherDataResponse> {
  try {
    console.log('Iniciando busca de dados meteorológicos para Uberlândia...');
    
    // Extrair coordenadas do arquivo JSON
    const coordinates: CoordinateData[] = uberlandiaCoordinates.coordenadas;
    console.log(`📊 Total de coordenadas a processar: ${coordinates.length}`);
    
    // Buscar todos os dados de uma vez com consulta otimizada
    console.log('🚀 Iniciando consulta otimizada para todas as coordenadas...');
    const allDataMap = await fetchAllWeatherDataForCoordinates(coordinates);
    
    // Processar resultados e criar pontos
    const pontos: WeatherPoint[] = coordinates.map((coord, index) => {
      const coordKey = `${coord.lat.toFixed(2)},${coord.lon.toFixed(2)}`;
      const data = allDataMap.get(coordKey);
      
      if (data?.rainData) {
        const forecastData: RainForecastData = data.rainData;
        
        // Converter dados do Supabase para o formato desejado
        // Manter coordenadas originais do JSON para a API
        return {
          lon: coord.lon,  // Coordenada original do JSON (alta precisão)
          lat: coord.lat,  // Coordenada original do JSON (alta precisão)
          chuva_mm: parseFloat((forecastData.precipitation || 0).toFixed(2)),
          freq_min: Math.round(forecastData.rainfall_time || 60),
          modo: 'geo',
          weather_description: data.weatherData?.description_en || undefined
        };
      } else {
        // Se não houver dados, usar valores padrão
        return {
          lon: coord.lon,
          lat: coord.lat,
          chuva_mm: 0.00,
          freq_min: 60,
          modo: 'geo',
          weather_description: data?.weatherData?.description_en || undefined
        };
      }
    });
    
    console.log(`✅ Processamento concluído. ${pontos.length} pontos processados.`);
    
    const result: WeatherDataResponse = { pontos };
    console.log(`🎉 Processamento concluído! Total de pontos: ${pontos.length}`);
    
    // Estatísticas
    const pontosComChuva = pontos.filter(p => p.chuva_mm > 0).length;
    console.log(`📈 Estatísticas: ${pontosComChuva} pontos com chuva, ${pontos.length - pontosComChuva} pontos sem chuva`);
    
    // Console.log com o body completo do JSON
    console.log('='.repeat(80));
    console.log('📋 BODY COMPLETO - ARRAY DE COORDENADAS COM DADOS DO BANCO:');
    console.log('='.repeat(80));
    console.log(JSON.stringify(result, null, 2));
    console.log('='.repeat(80));
    
    // Armazenar dados de weather no store global ANTES de enviar para API
    setWeatherData(result);
    
    let apiResponse = null;
    
    // Enviar dados para o endpoint analisar-batch
    try {
      apiResponse = await sendDataToAnalisarBatch(result);
      setApiResponse(apiResponse);
    } catch (apiError) {
      console.error('❌ Erro ao enviar dados para analisar-batch:', apiError);
    }
    
    // Criar variável global completa com weather data e API response
    const globalData = {
      weatherData: result,
      apiResponse: apiResponse,
      weatherDetails: {
        totalPontos: result.pontos.length,
        pontosComWeather: result.pontos.filter(p => p.weather_description).length,
        weatherTypes: [...new Set(result.pontos.filter(p => p.weather_description).map(p => p.weather_description).filter(Boolean))] as string[],
        weatherCodes: [...new Set(result.pontos.filter(p => p.weather_description).map(p => p.weather_description).filter(Boolean))] as string[]
      },
      timestamp: new Date().toISOString()
    };
    
    // Armazenar dados globais completos no store
    setGlobalData(globalData);
    
    // Console.log final da variável global completa
    console.log('🎯 VARIÁVEL GLOBAL COMPLETA:');
    console.log(JSON.stringify(globalData, null, 2));
    
    return result;
    
  } catch (error) {
    console.error('❌ Erro ao buscar dados meteorológicos:', error);
    
    // Em caso de erro geral, retornar dados padrão para todas as coordenadas
    const defaultPoints: WeatherPoint[] = uberlandiaCoordinates.coordenadas.map(coord => ({
      lon: coord.lon,
      lat: coord.lat,
      chuva_mm: 0.00,
      freq_min: 60,
      modo: 'geo'
    }));
    
    console.log(`🔄 Retornando dados padrão para ${defaultPoints.length} pontos`);
    return { pontos: defaultPoints };
  }
}

/**
 * Função para inicializar e executar o serviço de dados meteorológicos
 * Esta função deve ser chamada na inicialização da aplicação
 */
export async function initializeWeatherDataService(): Promise<WeatherDataResponse> {
  console.log('=== INICIALIZANDO SERVIÇO DE DADOS METEOROLÓGICOS ===');
  
  try {
    const weatherData = await fetchWeatherDataForUberlandia();
    console.log('=== SERVIÇO INICIALIZADO COM SUCESSO ===');
    
    // Console.log adicional para mostrar o resultado final
    console.log('🚀 RESULTADO FINAL DO SERVIÇO:');
    console.log('📊 Total de pontos processados:', weatherData.pontos.length);
    console.log('💧 Pontos com chuva:', weatherData.pontos.filter(p => p.chuva_mm > 0).length);
    console.log('☀️ Pontos sem chuva:', weatherData.pontos.filter(p => p.chuva_mm === 0).length);
    
    return weatherData;
  } catch (error) {
    console.error('=== ERRO NA INICIALIZAÇÃO DO SERVIÇO ===', error);
    throw error;
  }
}

/**
 * Função para testar e visualizar o resultado do serviço
 * Pode ser chamada manualmente no console do navegador
 */
export async function testWeatherService(): Promise<void> {
  console.log('🧪 TESTANDO SERVIÇO DE DADOS METEOROLÓGICOS...');
  
  try {
    const result = await fetchWeatherDataForUberlandia();
    
    console.log('✅ TESTE CONCLUÍDO COM SUCESSO!');
    console.log('📋 RESULTADO COMPLETO:');
    console.log(JSON.stringify(result, null, 2));
    
    // Estatísticas detalhadas
    const total = result.pontos.length;
    const comChuva = result.pontos.filter(p => p.chuva_mm > 0).length;
    const semChuva = result.pontos.filter(p => p.chuva_mm === 0).length;
    const chuvaMaxima = Math.max(...result.pontos.map(p => p.chuva_mm));
    
    console.log('📊 ESTATÍSTICAS:');
    console.log(`   Total de pontos: ${total}`);
    console.log(`   Pontos com chuva: ${comChuva}`);
    console.log(`   Pontos sem chuva: ${semChuva}`);
    console.log(`   Chuva máxima: ${chuvaMaxima}mm`);
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error);
  }
}

// Tornar a função disponível globalmente para testes
if (typeof window !== 'undefined') {
  (window as any).testWeatherService = testWeatherService;
}
