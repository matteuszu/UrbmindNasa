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
    
    // Valida se as coordenadas estão dentro dos limites válidos
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      console.error('Coordenadas inválidas:', { latitude, longitude });
      return [];
    }
    
    // Limita a precisão das coordenadas para evitar problemas com a API
    const roundedLat = Math.round(latitude * 1000000) / 1000000; // 6 casas decimais
    const roundedLng = Math.round(longitude * 1000000) / 1000000; // 6 casas decimais
    
    // URL da API de Geocoding do Mapbox para busca reversa
    // Inclui types obrigatório quando limit é usado
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${roundedLng},${roundedLat}.json?access_token=${MAPBOX_CONFIG.accessToken}&types=place,locality,neighborhood&limit=10`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro detalhado da API Mapbox:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        errorText: errorText
      });
      throw new Error(`Erro na API do Mapbox: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      return [];
    }
    
    // Processa os resultados e calcula distâncias
    let neighborhoods: Neighborhood[] = data.features
      .filter((feature: any) => {
        // Filtra apenas features que são neighborhoods ou localities
        const placeType = feature.place_type?.[0];
        return placeType === 'neighborhood' || placeType === 'locality' || placeType === 'place';
      })
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
    
    // Se não encontrou neighborhoods específicos, usa os primeiros resultados disponíveis
    if (neighborhoods.length === 0 && data.features.length > 0) {
      neighborhoods = data.features
        .slice(0, 3) // Pega os primeiros 3 resultados
        .map((feature: any) => {
          const [lng, lat] = feature.center;
          const distance = calculateDistance(latitude, longitude, lat, lng);
          
          return {
            name: feature.place_name || feature.text || 'Local próximo',
            distance,
            coordinates: [lng, lat]
          };
        });
    }
    
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
 * Busca todos os bairros de uma cidade específica
 */
export async function getCityNeighborhoods(cityName: string): Promise<Neighborhood[]> {
  try {
    // URL da API de Geocoding do Mapbox para buscar bairros de uma cidade
    const encodedCity = encodeURIComponent(cityName);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedCity}.json?access_token=${MAPBOX_CONFIG.accessToken}&types=neighborhood&limit=20`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao buscar bairros da cidade:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        errorText: errorText
      });
      return [];
    }
    
    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      return [];
    }
    
    // Processa os resultados
    const neighborhoods: Neighborhood[] = data.features
      .map((feature: any) => {
        const [lng, lat] = feature.center;
        
        return {
          name: feature.place_name || feature.text || 'Bairro desconhecido',
          distance: 0, // Não calculamos distância para bairros da cidade
          coordinates: [lng, lat]
        };
      })
      .slice(0, 10); // Limita a 10 bairros
    
    return neighborhoods;
  } catch (error) {
    console.error('Erro ao buscar bairros da cidade:', error);
    return [];
  }
}

/**
 * Busca informações detalhadas de um local específico
 */
export async function getLocationDetails(coordinates: [number, number]): Promise<string | null> {
  try {
    const [longitude, latitude] = coordinates;
    
    // Valida se as coordenadas estão dentro dos limites válidos
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      console.error('Coordenadas inválidas:', { latitude, longitude });
      return null;
    }
    
    // Limita a precisão das coordenadas para evitar problemas com a API
    const roundedLat = Math.round(latitude * 1000000) / 1000000; // 6 casas decimais
    const roundedLng = Math.round(longitude * 1000000) / 1000000; // 6 casas decimais
    
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${roundedLng},${roundedLat}.json?access_token=${MAPBOX_CONFIG.accessToken}&types=place,locality,neighborhood&limit=1`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro detalhado da API Mapbox (getLocationDetails):', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        errorText: errorText
      });
      throw new Error(`Erro na API do Mapbox: ${response.status} - ${response.statusText}`);
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
