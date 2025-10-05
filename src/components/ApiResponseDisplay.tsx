/**
 * Componente para exibir a resposta da API analisar-batch
 * Demonstra como usar a resposta da API em qualquer parte do projeto
 */

import React from 'react';
import { useApiResponse } from '../hooks/useApiResponse';

export function ApiResponseDisplay() {
  const { apiResponse, hasData, timestamp, isLoading } = useApiResponse();

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          📊 Resposta da API
        </h3>
        <p className="text-blue-600">Aguardando resposta da API...</p>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          📊 Resposta da API
        </h3>
        <p className="text-gray-600">Nenhuma resposta da API disponível</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-lg font-semibold text-green-800 mb-2">
        📊 Resposta da API
      </h3>
      
      {timestamp && (
        <p className="text-sm text-green-600 mb-3">
          ⏰ Recebido em: {new Date(timestamp).toLocaleString()}
        </p>
      )}
      
      <div className="bg-white p-3 rounded border">
        <pre className="text-xs text-gray-700 overflow-auto max-h-64">
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      </div>
    </div>
  );
}

/**
 * Componente simples para mostrar apenas se há dados
 */
export function ApiResponseStatus() {
  const { hasData, timestamp } = useApiResponse();

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`w-3 h-3 rounded-full ${hasData ? 'bg-green-500' : 'bg-gray-400'}`}></span>
      <span className={hasData ? 'text-green-600' : 'text-gray-500'}>
        {hasData ? 'API Response Available' : 'No API Response'}
      </span>
      {hasData && timestamp && (
        <span className="text-xs text-gray-500">
          ({new Date(timestamp).toLocaleTimeString()})
        </span>
      )}
    </div>
  );
}
