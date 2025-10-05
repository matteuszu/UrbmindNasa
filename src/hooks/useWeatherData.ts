import { useState, useEffect } from 'react';
import { fetchWeatherDataForUberlandia, WeatherDataResponse } from '../services/weatherDataService';
import { weatherDataStore, isWeatherDataProcessing } from '../services/weatherDataStore';

interface UseWeatherDataReturn {
  weatherData: WeatherDataResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook personalizado para gerenciar dados meteorológicos
 * Conecta com o store global que é alimentado em background
 */
export function useWeatherData(): UseWeatherDataReturn {
  const [weatherData, setWeatherData] = useState<WeatherDataResponse | null>(weatherDataStore.getData());
  const [loading, setLoading] = useState<boolean>(isWeatherDataProcessing());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Inscrever-se para receber atualizações do store global
    const unsubscribe = weatherDataStore.subscribe((data) => {
      setWeatherData(data);
      setLoading(isWeatherDataProcessing());
    });

    // Cleanup
    return unsubscribe;
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Buscando dados meteorológicos...');
      
      // Processamento silencioso em background
      const data = await fetchWeatherDataForUberlandia();
      
      setWeatherData(data);
      console.log('✅ Dados meteorológicos carregados com sucesso');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Erro ao carregar dados meteorológicos:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    weatherData,
    loading,
    error,
    refetch: fetchData
  };
}
