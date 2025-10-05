import { supabase } from '../utils/supabase/client';
import uberlandiaCoordinates from '../data/uberlandia-coordinates.json';
import { sendDataToAnalisarBatch } from '../config/api';
import { setApiResponse } from './apiResponseStore';

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

// Interface para o JSON final
interface WeatherPoint {
  lon: number;
  lat: number;
  chuva_mm: number; // Formato decimal com 2 casas (ex: 0.00, 5.25, 12.50)
  freq_min: number;
  modo: string;
}

export interface WeatherDataResponse {
  pontos: WeatherPoint[];
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
    
    // Array para armazenar os pontos processados
    const pontos: WeatherPoint[] = [];
    
    // Processar em lotes para otimizar performance
    const BATCH_SIZE = 50; // Processar 50 pontos por vez
    const totalBatches = Math.ceil(coordinates.length / BATCH_SIZE);
    
    console.log(`🔄 Processando em ${totalBatches} lotes de ${BATCH_SIZE} pontos cada`);
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIndex = batchIndex * BATCH_SIZE;
      const endIndex = Math.min(startIndex + BATCH_SIZE, coordinates.length);
      const batch = coordinates.slice(startIndex, endIndex);
      
      console.log(`📦 Processando lote ${batchIndex + 1}/${totalBatches} (pontos ${startIndex + 1}-${endIndex})`);
      
      // Processar lote em paralelo
      const batchPromises = batch.map(async (coord, index) => {
        const globalIndex = startIndex + index;
        
        try {
          // Buscar dados na tabela rain_forecast para esta coordenada
          const { data, error } = await supabase
            .from('rain_forecast')
            .select('*')
            .eq('latitude', coord.lat)
            .eq('longitude', coord.lon)
            .order('forecast_date', { ascending: false })
            .order('forecast_hour', { ascending: false })
            .limit(1);
          
          if (error) {
            console.warn(`⚠️ Erro ao buscar dados para ponto ${globalIndex + 1}:`, error.message);
            return {
              lon: coord.lon,
              lat: coord.lat,
              chuva_mm: 0,
              freq_min: 60,
              modo: 'geo'
            };
          }
          
          if (data && data.length > 0) {
            const forecastData: RainForecastData = data[0];
            
            // Converter dados do Supabase para o formato desejado
            // Usar precipitation como chuva_mm com 2 casas decimais
            return {
              lon: forecastData.longitude,
              lat: forecastData.latitude,
              chuva_mm: parseFloat((forecastData.precipitation || 0).toFixed(2)),
              freq_min: Math.round(forecastData.rainfall_time || 60),
              modo: 'geo'
            };
          } else {
            // Se não houver dados, usar valores padrão
            return {
              lon: coord.lon,
              lat: coord.lat,
              chuva_mm: 0.00,
              freq_min: 60,
              modo: 'geo'
            };
          }
        } catch (coordError) {
          console.warn(`⚠️ Erro ao processar ponto ${globalIndex + 1}:`, coordError);
          return {
            lon: coord.lon,
            lat: coord.lat,
            chuva_mm: 0.00,
            freq_min: 60,
            modo: 'geo'
          };
        }
      });
      
      // Aguardar processamento do lote
      const batchResults = await Promise.all(batchPromises);
      pontos.push(...batchResults);
      
      // Log de progresso
      const processedPoints = pontos.length;
      const progress = ((processedPoints / coordinates.length) * 100).toFixed(1);
      console.log(`✅ Lote ${batchIndex + 1} concluído. Progresso: ${progress}% (${processedPoints}/${coordinates.length})`);
      
      // Pequena pausa entre lotes para não sobrecarregar o banco
      if (batchIndex < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
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
    
      // Enviar dados para o endpoint analisar-batch
      try {
        console.log('🚀 Enviando dados para endpoint analisar-batch...');
        const apiResponse = await sendDataToAnalisarBatch(result);
        console.log('✅ Dados enviados com sucesso para analisar-batch');
        console.log('📋 Resposta da API:', apiResponse);
        
        // Armazenar resposta da API no store global
        setApiResponse(apiResponse);
        
      } catch (apiError) {
        console.error('❌ Erro ao enviar dados para analisar-batch:', apiError);
        // Não interrompe o fluxo, apenas loga o erro
      }
    
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
