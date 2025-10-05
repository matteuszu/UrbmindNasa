/**
 * Hook personalizado para acessar a resposta da API analisar-batch
 * Permite usar a resposta em qualquer componente React
 */

import { useState, useEffect } from 'react';
import { apiResponseStore, getApiResponse, hasApiResponse } from '../services/apiResponseStore';

interface UseApiResponseReturn {
  apiResponse: any | null;
  hasData: boolean;
  timestamp: number | null;
  isLoading: boolean;
}

/**
 * Hook para acessar a resposta da API analisar-batch
 * @returns {UseApiResponseReturn} Dados da resposta da API
 */
export function useApiResponse(): UseApiResponseReturn {
  const [apiResponse, setApiResponse] = useState<any | null>(getApiResponse());
  const [hasData, setHasData] = useState<boolean>(hasApiResponse());
  const [timestamp, setTimestamp] = useState<number | null>(apiResponseStore.getTimestamp());
  const [isLoading, setIsLoading] = useState<boolean>(!hasApiResponse());

  useEffect(() => {
    // Inscrever-se para receber atualizações do store global
    const unsubscribe = apiResponseStore.subscribe((data) => {
      setApiResponse(data);
      setHasData(data !== null);
      setTimestamp(apiResponseStore.getTimestamp());
      setIsLoading(false);
    });

    // Cleanup
    return unsubscribe;
  }, []);

  return {
    apiResponse,
    hasData,
    timestamp,
    isLoading,
  };
}

/**
 * Hook para acessar apenas os dados da resposta (sem estado de loading)
 * @returns {any | null} Dados da resposta da API
 */
export function useApiResponseData(): any | null {
  const [apiResponse, setApiResponse] = useState<any | null>(getApiResponse());

  useEffect(() => {
    const unsubscribe = apiResponseStore.subscribe((data) => {
      setApiResponse(data);
    });

    return unsubscribe;
  }, []);

  return apiResponse;
}
