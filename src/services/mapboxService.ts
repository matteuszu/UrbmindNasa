import { MAPBOX_CONFIG } from '../config/mapbox';

export interface Neighborhood {
  name: string;
  distance: number;
  coordinates: [number, number];
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

/**
 * Busca bairros próximos à localização do usuário em um raio de 1km
 */
export async function getNearbyNeighborhoods(
  userLocation: UserLocation,
  radiusKm: number = 1
): Promise<Neighborhood[]> {
  try {
    const { latitude, longitude } = userLocation;
    
    // URL da API de Geocoding do Mapbox para busca reversa
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_CONFIG.accessToken}&types=neighborhood,locality&limit=10`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro na API do Mapbox: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      return [];
    }
    
    // Processa os resultados e calcula distâncias
    const neighborhoods: Neighborhood[] = data.features
      .map((feature: any) => {
        const [lng, lat] = feature.center;
        const distance = calculateDistance(latitude, longitude, lat, lng);
        
        return {
          name: feature.place_name || feature.text || 'Bairro desconhecido',
          distance,
          coordinates: [lng, lat]
        };
      })
      .filter((neighborhood: Neighborhood) => neighborhood.distance <= radiusKm)
      .sort((a: Neighborhood, b: Neighborhood) => a.distance - b.distance)
      .slice(0, 5); // Limita a 5 bairros mais próximos
    
    return neighborhoods;
  } catch (error) {
    console.error('Erro ao buscar bairros próximos:', error);
    return [];
  }
}

/**
 * Calcula a distância entre duas coordenadas usando a fórmula de Haversine
 */
function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

/**
 * Busca informações detalhadas de um local específico
 */
export async function getLocationDetails(coordinates: [number, number]): Promise<string | null> {
  try {
    const [longitude, latitude] = coordinates;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_CONFIG.accessToken}&types=neighborhood,locality&limit=1`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro na API do Mapbox: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      return data.features[0].place_name || data.features[0].text || null;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar detalhes do local:', error);
    return null;
  }
}
