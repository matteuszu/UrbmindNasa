// Serviço para busca de endereços usando Mapbox Geocoding API
import { MAPBOX_CONFIG } from '../config/mapbox'

export interface GeocodingResult {
  id: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
  bbox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
  place_type: string[];
  relevance: number;
  properties?: {
    accuracy?: string;
    address?: string;
    category?: string;
  };
}

export interface GeocodingResponse {
  type: string;
  query: string[];
  features: GeocodingResult[];
  attribution: string;
}

class GeocodingService {
  private accessToken: string;
  private baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  constructor() {
    this.accessToken = MAPBOX_CONFIG.accessToken;
  }

  /**
   * Busca endereços usando o termo de pesquisa
   */
  async searchAddresses(query: string, options: {
    limit?: number;
    country?: string;
    proximity?: [number, number];
    bbox?: [number, number, number, number];
    types?: string[];
  } = {}): Promise<GeocodingResult[]> {
    try {
      if (!query.trim()) {
        return [];
      }

      // Verifica se é uma busca por "Rua da conquista" para retornar dados mockados
      if (query.toLowerCase().includes('rua da conquista')) {
        console.log('🔴 Busca especial detectada: Rua da conquista - retornando dados mockados');
        return this.getMockRuaDaConquistaData();
      }

      const {
        limit = 5,
        country = 'BR', // Brasil por padrão
        proximity,
        bbox,
        types = ['address', 'poi', 'place', 'locality', 'neighborhood']
      } = options;

      // Constrói a URL de busca
      const encodedQuery = encodeURIComponent(query);
      let url = `${this.baseUrl}/${encodedQuery}.json?access_token=${this.accessToken}&limit=${limit}&country=${country}`;

      // Adiciona proximidade se fornecida
      if (proximity) {
        url += `&proximity=${proximity[0]},${proximity[1]}`;
      }

      // Adiciona bbox se fornecido
      if (bbox) {
        url += `&bbox=${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}`;
      }

      // Adiciona tipos de lugar
      if (types.length > 0) {
        url += `&types=${types.join(',')}`;
      }

      console.log('🔍 Buscando endereços:', query);
      console.log('📡 URL:', url);

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro na API do Mapbox: ${response.status} ${response.statusText}`);
      }

      const data: GeocodingResponse = await response.json();
      
      console.log('✅ Resultados encontrados:', data.features.length);
      
      // Log detalhado dos dados recebidos para análise
      console.log('📊 DADOS COMPLETOS DA API MAPBOX:');
      console.log('📋 Query:', data.query);
      console.log('📋 Attribution:', data.attribution);
      console.log('📋 Type:', data.type);
      
      data.features.forEach((feature, index) => {
        console.log(`\n🏠 FEATURE ${index + 1}:`);
        console.log('  📝 place_name:', feature.place_name);
        console.log('  📝 text:', feature.text);
        console.log('  📍 center:', feature.center);
        console.log('  📦 bbox:', feature.bbox);
        console.log('  🏷️ place_type:', feature.place_type);
        console.log('  📊 relevance:', feature.relevance);
        console.log('  🔗 id:', feature.id);
        console.log('  📋 context:', feature.context);
        console.log('  ⚙️ properties:', feature.properties);
        
        // Análise detalhada do contexto
        if (feature.context && feature.context.length > 0) {
          console.log('  🔍 ANÁLISE DO CONTEXTO:');
          feature.context.forEach((ctx, ctxIndex) => {
            console.log(`    ${ctxIndex + 1}. ID: ${ctx.id}`);
            console.log(`       Text: ${ctx.text}`);
            console.log(`       Short Code: ${ctx.short_code || 'N/A'}`);
            console.log(`       Tipo detectado: ${this.detectContextType(ctx.id)}`);
          });
        }
      });
      
      return data.features;
    } catch (error) {
      console.error('❌ Erro ao buscar endereços:', error);
      throw new Error('Erro ao buscar endereços. Tente novamente.');
    }
  }

  /**
   * Busca endereços próximos a uma localização específica
   */
  async searchNearby(
    query: string,
    center: [number, number],
    radius: number = 10000 // 10km por padrão
  ): Promise<GeocodingResult[]> {
    return this.searchAddresses(query, {
      proximity: center,
      limit: 10
    });
  }

  /**
   * Busca apenas endereços (ruas, números)
   */
  async searchAddressesOnly(query: string): Promise<GeocodingResult[]> {
    return this.searchAddresses(query, {
      types: ['address'],
      limit: 8
    });
  }

  /**
   * Busca pontos de interesse (POIs)
   */
  async searchPOIs(query: string): Promise<GeocodingResult[]> {
    return this.searchAddresses(query, {
      types: ['poi'],
      limit: 6
    });
  }

  /**
   * Busca cidades e bairros
   */
  async searchPlaces(query: string): Promise<GeocodingResult[]> {
    return this.searchAddresses(query, {
      types: ['place', 'locality', 'neighborhood'],
      limit: 5
    });
  }

  /**
   * Geocodificação reversa - converte coordenadas em endereço
   */
  async reverseGeocode(lng: number, lat: number): Promise<GeocodingResult | null> {
    try {
      const url = `${this.baseUrl}/${lng},${lat}.json?access_token=${this.accessToken}&types=address,poi,place`;
      
      console.log('🔄 Geocodificação reversa para:', { lng, lat });
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro na API do Mapbox: ${response.status} ${response.statusText}`);
      }

      const data: GeocodingResponse = await response.json();
      
      if (data.features.length > 0) {
        console.log('✅ Endereço encontrado:', data.features[0].place_name);
        return data.features[0];
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erro na geocodificação reversa:', error);
      return null;
    }
  }

  /**
   * Função de teste para analisar dados do Mapbox
   */
  async testMapboxData(query: string): Promise<void> {
    console.log(`🧪 TESTE MAPBOX: Analisando dados para "${query}"`);
    
    try {
      const results = await this.searchAddresses(query, {
        limit: 3,
        types: ['address', 'poi', 'place', 'locality', 'neighborhood']
      });
      
      console.log(`🧪 TESTE MAPBOX: ${results.length} resultados encontrados para "${query}"`);
      
      results.forEach((result, index) => {
        console.log(`\n🧪 RESULTADO ${index + 1} para "${query}":`);
        console.log('  📝 place_name:', result.place_name);
        console.log('  🏷️ place_type:', result.place_type);
        console.log('  📋 context:', result.context);
        console.log('  ⚙️ properties:', result.properties);
        
        const neighborhood = this.extractNeighborhoodName(result);
        console.log('  🏘️ Bairro extraído:', neighborhood);
      });
      
    } catch (error) {
      console.error(`🧪 TESTE MAPBOX: Erro ao testar "${query}":`, error);
    }
  }

  /**
   * Busca todas as ruas de um bairro específico
   */
  async searchStreetsInNeighborhood(neighborhoodName: string, cityName: string = 'Uberlândia'): Promise<GeocodingResult[]> {
    try {
      console.log(`🔍 Buscando ruas do bairro: ${neighborhoodName} em ${cityName}`);
      
      // Busca por endereços no bairro específico
      const query = `${neighborhoodName}, ${cityName}`;
      const encodedQuery = encodeURIComponent(query);
      const url = `${this.baseUrl}/${encodedQuery}.json?access_token=${this.accessToken}&limit=50&types=address&country=BR`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro na API do Mapbox: ${response.status} ${response.statusText}`);
      }

      const data: GeocodingResponse = await response.json();
      
      // Filtra apenas resultados que contêm o nome do bairro
      const neighborhoodStreets = data.features.filter(feature => {
        const placeName = feature.place_name.toLowerCase();
        const neighborhood = neighborhoodName.toLowerCase();
        return placeName.includes(neighborhood) && feature.place_type.includes('address');
      });
      
      console.log(`✅ Encontradas ${neighborhoodStreets.length} ruas no bairro ${neighborhoodName}`);
      
      return neighborhoodStreets;
    } catch (error) {
      console.error('❌ Erro ao buscar ruas do bairro:', error);
      // Retorna dados mockados se a busca falhar
      return this.getMockNeighborhoodStreets(neighborhoodName);
    }
  }

  /**
   * Detecta o tipo de contexto baseado no ID
   */
  private detectContextType(id: string): string {
    if (id.includes('country')) return 'País';
    if (id.includes('region')) return 'Estado/Região';
    if (id.includes('district')) return 'Distrito';
    if (id.includes('neighborhood')) return 'Bairro';
    if (id.includes('locality')) return 'Localidade';
    if (id.includes('place')) return 'Cidade/Place';
    if (id.includes('postcode')) return 'CEP';
    if (id.includes('address')) return 'Endereço';
    if (id.includes('poi')) return 'Ponto de Interesse';
    return 'Desconhecido';
  }

  /**
   * Extrai o nome do bairro de um resultado de geocoding
   */
  extractNeighborhoodName(result: GeocodingResult): string | null {
    console.log('🔍 GEOCODING: extractNeighborhoodName chamado');
    console.log('📋 Context:', result.context);
    console.log('📝 Place name:', result.place_name);
    
    const { context = [], place_name } = result;
    
    // Estratégia 1: Procura por neighborhood no contexto
    const neighborhood = context.find(c => c.id.includes('neighborhood'));
    if (neighborhood) {
      console.log('✅ Bairro encontrado no contexto (neighborhood):', neighborhood.text);
      return neighborhood.text;
    }
    
    // Estratégia 2: Procura por district no contexto (às vezes o bairro vem como district)
    const district = context.find(c => c.id.includes('district'));
    if (district) {
      console.log('✅ Bairro encontrado no contexto (district):', district.text);
      return district.text;
    }
    
    // Estratégia 3: Procura por locality no contexto
    const locality = context.find(c => c.id.includes('locality'));
    if (locality) {
      console.log('✅ Bairro encontrado no contexto (locality):', locality.text);
      return locality.text;
    }
    
    // Estratégia 4: Se não encontrar no contexto, tenta extrair do place_name
    const parts = place_name.split(',');
    console.log('📝 Partes do place_name:', parts);
    
    if (parts.length >= 2) {
      // Procura por elementos que não sejam cidade, estado ou país
      for (let i = 1; i < parts.length - 2; i++) {
        const possibleNeighborhood = parts[i].trim();
        console.log(`🔍 Analisando parte ${i}:`, possibleNeighborhood);
        
        if (possibleNeighborhood && 
            !possibleNeighborhood.includes('Uberlândia') && 
            !possibleNeighborhood.includes('MG') &&
            !possibleNeighborhood.includes('Brasil') &&
            !possibleNeighborhood.includes('Brazil') &&
            possibleNeighborhood.length > 2) {
          console.log('✅ Bairro extraído do place_name:', possibleNeighborhood);
          return possibleNeighborhood;
        }
      }
    }
    
    // Estratégia 5: Se for um endereço específico, tenta usar o nome da rua como "bairro"
    if (result.place_type.includes('address') && result.properties?.address) {
      console.log('✅ Usando nome da rua como bairro:', result.properties.address);
      return result.properties.address;
    }
    
    console.log('❌ Nenhum bairro encontrado');
    return null;
  }

  /**
   * Retorna dados mockados para "Rua da conquista" com área vermelha
   */
  private getMockRuaDaConquistaData(): GeocodingResult[] {
    return [
      {
        id: 'mock-rua-da-conquista-1',
        place_name: 'Rua da Conquista, Centro, Uberlândia, MG, Brasil',
        center: [-48.2772, -18.9186] as [number, number], // Centro de Uberlândia
        bbox: [-48.2872, -18.9286, -48.2672, -18.9086] as [number, number, number, number], // Área ao redor
        context: [
          {
            id: 'neighborhood.123456',
            text: 'Centro'
          },
          {
            id: 'place.123456',
            text: 'Uberlândia'
          },
          {
            id: 'region.789012',
            text: 'Minas Gerais'
          },
          {
            id: 'country.345678',
            text: 'Brasil'
          }
        ],
        place_type: ['address'],
        relevance: 1.0,
        properties: {
          accuracy: 'street',
          address: 'Rua da Conquista',
          category: 'mock-test'
        }
      }
    ];
  }

  /**
   * Retorna dados mockados de ruas de um bairro para teste
   */
  private getMockNeighborhoodStreets(neighborhoodName: string): GeocodingResult[] {
    const baseCenter: [number, number] = [-48.2772, -18.9186];
    const streets = [
      'Rua A',
      'Rua B', 
      'Rua C',
      'Rua D',
      'Rua E'
    ];
    
    return streets.map((street, index) => {
      const offset = index * 0.001; // Pequeno offset para cada rua
      return {
        id: `mock-${neighborhoodName.toLowerCase()}-${street.toLowerCase().replace(' ', '-')}`,
        place_name: `${street}, ${neighborhoodName}, Uberlândia, MG, Brasil`,
        center: [baseCenter[0] + offset, baseCenter[1] + offset] as [number, number],
        bbox: [
          baseCenter[0] + offset - 0.0005, 
          baseCenter[1] + offset - 0.0005,
          baseCenter[0] + offset + 0.0005, 
          baseCenter[1] + offset + 0.0005
        ] as [number, number, number, number],
        context: [
          {
            id: 'neighborhood.123456',
            text: neighborhoodName
          },
          {
            id: 'place.123456',
            text: 'Uberlândia'
          },
          {
            id: 'region.789012',
            text: 'Minas Gerais'
          },
          {
            id: 'country.345678',
            text: 'Brasil'
          }
        ],
        place_type: ['address'],
        relevance: 1.0,
        properties: {
          accuracy: 'street',
          address: street,
          category: 'mock-neighborhood'
        }
      };
    });
  }

  /**
   * Formata o resultado para exibição
   */
  formatResult(result: GeocodingResult): {
    title: string;
    subtitle: string;
    fullAddress: string;
    coordinates: [number, number];
  } {
    const { place_name, center, context = [] } = result;
    
    // Extrai informações do contexto
    const city = context.find(c => c.id.includes('place'))?.text || '';
    const state = context.find(c => c.id.includes('region'))?.text || '';
    const country = context.find(c => c.id.includes('country'))?.text || '';
    
    // Cria título e subtítulo
    const title = place_name.split(',')[0] || place_name;
    const subtitle = [city, state, country].filter(Boolean).join(', ');
    
    return {
      title,
      subtitle,
      fullAddress: place_name,
      coordinates: center
    };
  }
}

// Instância singleton do serviço
export const geocodingService = new GeocodingService();
export default geocodingService;
