/**
 * Serviço para teste com parâmetros fixos em background
 * Funcionalidade sem interface visual - apenas processamento
 */

import { sendDataToAnalisarBatchWithFixedParams, FixedParams } from '../config/api';
import gradeData from '../public/grade_500m_uberlandia.json';
import { setWeatherData, setApiResponse, setGlobalData } from './apiResponseStore';

/**
 * Executa teste com parâmetros fixos em background
 * @param chuvaMm - Valor fixo de chuva em mm (padrão: 50.0)
 * @param freqMin - Valor fixo de frequência em minutos (padrão: 60)
 * @returns Promise com resultado da operação
 */
export async function executeTestWithFixedParams(
  chuvaMm: number = 50.0,
  freqMin: number = 60
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    console.log('🧪 Iniciando teste com parâmetros fixos em background...');

    // Valores fixos para teste
    const fixedParams: FixedParams = {
      chuva_mm: chuvaMm,
      freq_min: freqMin
    };

    // Usar TODAS as coordenadas do arquivo grade_500m_uberlandia.json
    const allCoordinates = gradeData.pontos.map(coord => ({
      lon: coord.longitude,
      lat: coord.latitude
    }));

    // Criar dados de weather no formato esperado
    const weatherData = {
      pontos: allCoordinates.map(coord => ({
        lon: coord.lon,
        lat: coord.lat,
        chuva_mm: fixedParams.chuva_mm,
        freq_min: fixedParams.freq_min,
        modo: 'geo'
      }))
    };

    console.log('📊 Parâmetros de teste:', fixedParams);
    console.log('📍 Total de coordenadas:', allCoordinates.length);
    console.log('📋 Arquivo usado: grade_500m_uberlandia.json');

    // Console.log com o body completo do JSON
    console.log('='.repeat(80));
    console.log('📋 BODY COMPLETO - ARRAY DE COORDENADAS COM PARÂMETROS FIXOS:');
    console.log('='.repeat(80));
    console.log(JSON.stringify(weatherData, null, 2));
    console.log('='.repeat(80));

    // Armazenar dados de weather no store global ANTES de enviar para API
    setWeatherData(weatherData);

    let apiResponse = null;

    // Enviar dados para o endpoint analisar-batch
    try {
      apiResponse = await sendDataToAnalisarBatchWithFixedParams(allCoordinates, fixedParams);
      setApiResponse(apiResponse);
    } catch (apiError) {
      console.error('❌ Erro ao enviar dados para analisar-batch:', apiError);
      throw apiError;
    }

    // Criar variável global completa com weather data e API response
    const globalData = {
      weatherData: weatherData,
      apiResponse: apiResponse,
      weatherDetails: {
        totalPontos: weatherData.pontos.length,
        pontosComWeather: weatherData.pontos.length, // Todos os pontos têm dados mockados
        weatherTypes: ['Teste com parâmetros fixos'],
        weatherCodes: ['TESTE_FIXED_PARAMS']
      },
      timestamp: new Date().toISOString()
    };

    // Armazenar dados globais completos no store
    setGlobalData(globalData);

    // Console.log final da variável global completa
    console.log('🎯 VARIÁVEL GLOBAL COMPLETA (TESTE):');
    console.log(JSON.stringify(globalData, null, 2));
    
    console.log('✅ Teste concluído com sucesso!', apiResponse);
    
    return {
      success: true,
      message: `Teste concluído! ${allCoordinates.length} coordenadas enviadas. Variável global alimentada.`,
      data: {
        coordinatesCount: allCoordinates.length,
        fixedParams,
        apiResponse,
        globalData
      }
    };

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    
    return {
      success: false,
      message: `Erro no teste: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      data: { error }
    };
  }
}

/**
 * Função de conveniência para teste rápido com valores padrão
 */
export async function quickTestWithFixedParams(): Promise<{ success: boolean; message: string; data?: any }> {
  return executeTestWithFixedParams(50.0, 60);
}

/**
 * Função para teste com valores customizados
 */
export async function customTestWithFixedParams(chuvaMm: number, freqMin: number): Promise<{ success: boolean; message: string; data?: any }> {
  return executeTestWithFixedParams(chuvaMm, freqMin);
}
