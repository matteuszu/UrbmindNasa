import { useState, useEffect, useCallback } from 'react';
import { getNearbyNeighborhoods, Neighborhood, UserLocation } from '../services/mapboxService';

export interface LocationData {
  userLocation: UserLocation | null;
  neighborhoods: Neighborhood[];
  isLoading: boolean;
  error: string | null;
  currentNeighborhood: string | null;
}

export function useLocationData() {
  const [locationData, setLocationData] = useState<LocationData>({
    userLocation: null,
    neighborhoods: [],
    isLoading: false,
    error: null,
    currentNeighborhood: null
  });

  const updateLocation = useCallback(async (newLocation: UserLocation) => {
    setLocationData(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      // Busca bairros próximos
      const neighborhoods = await getNearbyNeighborhoods(newLocation, 1);
      
      // Define o bairro mais próximo como atual
      const currentNeighborhood = neighborhoods.length > 0 
        ? neighborhoods[0].name.split(',')[0] // Pega apenas o nome do bairro, sem cidade
        : 'Bairro do usuario';

      setLocationData(prev => ({
        ...prev,
        userLocation: newLocation,
        neighborhoods,
        currentNeighborhood,
        isLoading: false
      }));
    } catch (error) {
      console.error('Erro ao atualizar localização:', error);
      setLocationData(prev => ({
        ...prev,
        error: 'Erro ao buscar bairros próximos',
        isLoading: false
      }));
    }
  }, []);

  const getCurrentNeighborhood = useCallback(() => {
    return locationData.currentNeighborhood || 'Bairro do usuario';
  }, [locationData.currentNeighborhood]);

  const getRandomNeighborhood = useCallback(() => {
    if (locationData.neighborhoods.length === 0) {
      return 'Bairro do usuario';
    }
    
    // Retorna um bairro aleatório da lista (exceto o primeiro que é o mais próximo)
    const randomIndex = Math.floor(Math.random() * (locationData.neighborhoods.length - 1)) + 1;
    const neighborhood = locationData.neighborhoods[randomIndex];
    return neighborhood.name.split(',')[0];
  }, [locationData.neighborhoods]);

  return {
    ...locationData,
    updateLocation,
    getCurrentNeighborhood,
    getRandomNeighborhood
  };
}
