import { useState, useCallback } from 'react';
import { analysisService, AnalysisRequest, AnalysisResponse } from '../services/analysisService';

export interface LabFormData {
  longitude: number;
  latitude: number;
  chuva_mm: number;
  freq_min: number;
}

export interface UseLabAnalysisReturn {
  // Estados
  formData: LabFormData;
  analysisResult: AnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
  isSimulationMode: boolean;
  
  // Ações
  updateFormData: (field: keyof LabFormData, value: number) => void;
  resetForm: () => void;
  runAnalysis: () => Promise<void>;
  clearResults: () => void;
}

const defaultFormData: LabFormData = {
  longitude: -48.2772,
  latitude: -18.9189,
  chuva_mm: 50.0,
  freq_min: 60
};

export function useLabAnalysis(initialCoordinates?: { longitude: number; latitude: number }): UseLabAnalysisReturn {
  const initialFormData: LabFormData = initialCoordinates ? {
    ...defaultFormData,
    longitude: initialCoordinates.longitude,
    latitude: initialCoordinates.latitude
  } : defaultFormData;
  
  const [formData, setFormData] = useState<LabFormData>(initialFormData);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState(true); // Sempre inicia em modo simulação

  const updateFormData = useCallback((field: keyof LabFormData, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpa resultados quando os dados mudam
    if (analysisResult) {
      setAnalysisResult(null);
    }
    if (error) {
      setError(null);
    }
  }, [analysisResult, error]);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setAnalysisResult(null);
    setError(null);
  }, []);

  const runAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const request: AnalysisRequest = {
        lon: formData.longitude,
        lat: formData.latitude,
        chuva_mm: formData.chuva_mm,
        freq_min: formData.freq_min,
        modo: 'geo'
      };

      let result: AnalysisResponse;
      
      if (isSimulationMode) {
        result = await analysisService.simulateAnalysis(request);
      } else {
        result = await analysisService.analyzeFloodRisk(request);
      }
      
      setAnalysisResult(result);
      console.log('🔬 Análise concluída:', result);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido na análise';
      setError(errorMessage);
      console.error('🔬 Erro na análise:', err);
    } finally {
      setIsLoading(false);
    }
  }, [formData, isSimulationMode]);


  const clearResults = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
  }, []);

  return {
    // Estados
    formData,
    analysisResult,
    isLoading,
    error,
    isSimulationMode,
    
    // Ações
    updateFormData,
    resetForm,
    runAnalysis,
    clearResults
  };
}
