import React, { useState } from 'react';
import { sendDataToAnalisarBatchWithFixedParams, FixedParams } from '../config/api';
import coordinatesData from '../data/uberlandia-coordinates.json';

/**
 * Exemplo de componente React para demonstrar o uso da função
 * sendDataToAnalisarBatchWithFixedParams
 */
export const FixedParamsExample: React.FC = () => {
  const [chuvaMm, setChuvaMm] = useState<number>(50.0);
  const [freqMin, setFreqMin] = useState<number>(60);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      // Definir parâmetros fixos
      const fixedParams: FixedParams = {
        chuva_mm: chuvaMm,
        freq_min: freqMin
      };

      // Extrair coordenadas do arquivo JSON
      const coordinates = coordinatesData.coordenadas.map(coord => ({
        lon: coord.lon,
        lat: coord.lat
      }));

      console.log('🚀 Iniciando envio com parâmetros fixos...');
      console.log('📊 Parâmetros:', fixedParams);
      console.log('📍 Total de coordenadas:', coordinates.length);

      // Enviar dados
      const apiResult = await sendDataToAnalisarBatchWithFixedParams(coordinates, fixedParams);
      
      setResult(apiResult);
      console.log('✅ Envio concluído com sucesso!');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Erro no envio:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Exemplo: Envio com Parâmetros Fixos</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Chuva (mm):
          <input
            type="number"
            step="0.1"
            value={chuvaMm}
            onChange={(e) => setChuvaMm(parseFloat(e.target.value))}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Frequência (min):
          <input
            type="number"
            value={freqMin}
            onChange={(e) => setFreqMin(parseInt(e.target.value))}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Enviando...' : 'Enviar Dados'}
      </button>

      {error && (
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px'
        }}>
          <strong>Erro:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '4px'
        }}>
          <strong>Sucesso!</strong>
          <pre style={{ marginTop: '10px', fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Total de coordenadas:</strong> {coordinatesData.coordenadas.length}</p>
        <p><strong>Parâmetros que serão aplicados a todas as coordenadas:</strong></p>
        <ul>
          <li>chuva_mm: {chuvaMm}</li>
          <li>freq_min: {freqMin}</li>
          <li>modo: "geo" (fixo)</li>
        </ul>
      </div>
    </div>
  );
};

export default FixedParamsExample;
