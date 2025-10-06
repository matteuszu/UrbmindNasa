import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import type { Map as MapboxMap, LngLatLike } from 'mapbox-gl'
import lottie from 'lottie-web'
import { useMapViewportFix } from '../hooks/useMapViewportFix'
import { useMapNavigation } from '../hooks/useMapNavigation'
import type { GeocodingResult } from '../services/geocodingService'
import { geocodingService } from '../services/geocodingService'

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface MapComponentProps {
  onLocationUpdate?: (location: UserLocation) => void;
  onAddressSelect?: (result: GeocodingResult) => void;
}

export interface MapComponentRef {
  recenterToUserLocation: () => void;
  navigateToAddress: (result: GeocodingResult) => void;
  flyTo: (options: any) => void;
  showRedArea: (bbox: [number, number, number, number], center: [number, number]) => void;
  hideRedArea: () => void;
  showNeighborhoodStreets: (streets: GeocodingResult[], neighborhoodName: string) => void;
  showFloodAlert: (coordinates: [number, number], radiusMeters?: number) => void;
  hideFloodAlert: () => void;
  resize: () => void;
}

const MapComponent = forwardRef<MapComponentRef, MapComponentProps>(({ onLocationUpdate, onAddressSelect }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const userMarkerRef = useRef<HTMLElement | null>(null)
  const lottieAnimationRef = useRef<any>(null)
  
  // Hook para corrigir problemas de viewport com teclado virtual
  useMapViewportFix(mapRef)
  
  // Hook para navegação do mapa
  const { navigateToAddress, navigateToPOI, navigateToCity } = useMapNavigation(mapRef)

  // Função para navegar para um endereço selecionado
  const handleAddressSelect = async (result: GeocodingResult) => {
    console.log('🔴 MAPCOMPONENT: handleAddressSelect chamado!')
    console.log('🏠 Endereço selecionado:', result.place_name)
    console.log('📍 Coordenadas:', result.center)
    console.log('🏷️ Tipos do lugar:', result.place_type)
    console.log('📋 Context completo:', result.context)
    
    // Remove área vermelha anterior se existir
    hideRedArea()
    
    // TESTE: Analisar dados do Mapbox para diferentes tipos de busca
    console.log('🧪 INICIANDO TESTES DE DADOS MAPBOX...')
    await geocodingService.testMapboxData('Rua da Conquista, Uberlândia')
    await geocodingService.testMapboxData('Centro, Uberlândia')
    await geocodingService.testMapboxData('Uberlândia, MG')
    
    // Extrai o nome do bairro do resultado
    const neighborhoodName = geocodingService.extractNeighborhoodName(result)
    console.log('🏘️ Bairro extraído:', neighborhoodName)
    
    if (neighborhoodName && result.place_type.includes('address')) {
      console.log(`🏘️ Bairro detectado: ${neighborhoodName} - iniciando busca de ruas...`)
      
      try {
        // Busca todas as ruas do bairro
        const neighborhoodStreets = await geocodingService.searchStreetsInNeighborhood(neighborhoodName)
        console.log('🔍 Ruas encontradas:', neighborhoodStreets.length)
        
        if (neighborhoodStreets.length > 0) {
          console.log(`🔴 Pintando ${neighborhoodStreets.length} ruas do bairro ${neighborhoodName} de vermelho`)
          showNeighborhoodStreets(neighborhoodStreets, neighborhoodName)
        } else {
          console.log('⚠️ Nenhuma rua encontrada no bairro')
        }
      } catch (error) {
        console.error('❌ Erro ao buscar ruas do bairro:', error)
      }
    } else {
      console.log('ℹ️ Não é um endereço ou bairro não detectado')
      console.log('ℹ️ neighborhoodName:', neighborhoodName)
      console.log('ℹ️ place_type includes address:', result.place_type.includes('address'))
    }
    
    // Determina o tipo de navegação baseado no tipo do lugar
    const placeTypes = result.place_type || []
    
    // Verifica se é a "Rua da conquista" para mostrar alerta de alagamento
    const isRuaDaConquista = result.place_name.toLowerCase().includes('rua da conquista')
    
    if (placeTypes.includes('address')) {
      console.log('🏠 Navegando como endereço com PIN')
      navigateToAddress(result.center, result.place_name)
      
      // Mostra alerta de alagamento APENAS para "Rua da conquista"
      if (isRuaDaConquista) {
        console.log('🚨 Mostrando alerta de alagamento para Rua da conquista (teste mockado)')
        showFloodAlert(result.center, 1000)
      } else {
        console.log('ℹ️ Endereço normal - não mostrando alerta de alagamento')
      }
    } else if (placeTypes.includes('poi')) {
      console.log('📍 Navegando como POI')
      navigateToPOI(result.center, result.place_name)
      
      // Mostra alerta de alagamento APENAS para "Rua da conquista"
      if (isRuaDaConquista) {
        console.log('🚨 Mostrando alerta de alagamento para Rua da conquista (teste mockado)')
        showFloodAlert(result.center, 1000)
      } else {
        console.log('ℹ️ POI normal - não mostrando alerta de alagamento')
      }
    } else if (placeTypes.includes('place') || placeTypes.includes('locality')) {
      console.log('🏙️ Navegando como cidade')
      navigateToCity(result.center, result.place_name)
      
      // Para cidades, não mostra alerta de alagamento (área muito grande)
      console.log('ℹ️ Cidade selecionada - não mostrando alerta de alagamento')
    } else {
      // Navegação padrão
      console.log('🏠 Navegação padrão com PIN')
      navigateToAddress(result.center, result.place_name)
      
      // Mostra alerta de alagamento APENAS para "Rua da conquista"
      if (isRuaDaConquista) {
        console.log('🚨 Mostrando alerta de alagamento para Rua da conquista (teste mockado)')
        showFloodAlert(result.center, 1000)
      } else {
        console.log('ℹ️ Navegação padrão normal - não mostrando alerta de alagamento')
      }
    }
    
    // Notifica o componente pai
    onAddressSelect?.(result)
  }

  // Função para mostrar área vermelha no mapa
  const showRedArea = (bbox: [number, number, number, number], center: [number, number]) => {
    if (!mapRef.current) return

    const map = mapRef.current

    // Remove área vermelha anterior se existir
    hideRedArea()

    // Cria o polígono da área vermelha
    const polygon = {
      type: 'Feature' as const,
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [bbox[0], bbox[1]], // minLng, minLat
          [bbox[2], bbox[1]], // maxLng, minLat
          [bbox[2], bbox[3]], // maxLng, maxLat
          [bbox[0], bbox[3]], // minLng, maxLat
          [bbox[0], bbox[1]]  // fecha o polígono
        ]]
      },
      properties: {
        name: 'Rua da Conquista - Área Especial'
      }
    }

    // Adiciona a fonte de dados
    if (!map.getSource('red-area-source')) {
      map.addSource('red-area-source', {
        type: 'geojson',
        data: polygon
      })
    } else {
      (map.getSource('red-area-source') as any).setData(polygon)
    }

    // Adiciona a camada de preenchimento vermelho
    if (!map.getLayer('red-area-fill')) {
      map.addLayer({
        id: 'red-area-fill',
        type: 'fill',
        source: 'red-area-source',
        paint: {
          'fill-color': '#ff0000',
          'fill-opacity': 0.3
        }
      })
    }

    // Adiciona a camada de borda vermelha
    if (!map.getLayer('red-area-border')) {
      map.addLayer({
        id: 'red-area-border',
        type: 'line',
        source: 'red-area-source',
        paint: {
          'line-color': '#ff0000',
          'line-width': 3,
          'line-opacity': 0.8
        }
      })
    }

    // Navega para a área
    map.fitBounds(bbox, {
      padding: 50,
      duration: 1000
    })

    console.log('🔴 Área vermelha criada com sucesso')
  }

  // Função para mostrar todas as ruas de um bairro em vermelho
  const showNeighborhoodStreets = (streets: GeocodingResult[], neighborhoodName: string) => {
    if (!mapRef.current || streets.length === 0) return

    const map = mapRef.current

    // Remove ruas vermelhas anteriores se existirem
    hideRedArea()

    // Cria um array de features para todas as ruas
    const streetFeatures = streets.map((street, index) => {
      if (!street.bbox) {
        // Se não tem bbox, cria um pequeno quadrado ao redor do centro
        const center = street.center
        const offset = 0.0005
        return {
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: [[
              [center[0] - offset, center[1] - offset],
              [center[0] + offset, center[1] - offset],
              [center[0] + offset, center[1] + offset],
              [center[0] - offset, center[1] + offset],
              [center[0] - offset, center[1] - offset]
            ]]
          },
          properties: {
            name: street.place_name,
            street: street.properties?.address || 'Rua',
            index: index
          }
        }
      }

      return {
        type: 'Feature' as const,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[
            [street.bbox[0], street.bbox[1]], // minLng, minLat
            [street.bbox[2], street.bbox[1]], // maxLng, minLat
            [street.bbox[2], street.bbox[3]], // maxLng, maxLat
            [street.bbox[0], street.bbox[3]], // minLng, maxLat
            [street.bbox[0], street.bbox[1]]  // fecha o polígono
          ]]
        },
        properties: {
          name: street.place_name,
          street: street.properties?.address || 'Rua',
          index: index
        }
      }
    })

    // Cria o GeoJSON com todas as ruas
    const neighborhoodGeoJSON = {
      type: 'FeatureCollection' as const,
      features: streetFeatures
    }

    // Adiciona a fonte de dados
    if (!map.getSource('neighborhood-streets-source')) {
      map.addSource('neighborhood-streets-source', {
        type: 'geojson',
        data: neighborhoodGeoJSON
      })
    } else {
      (map.getSource('neighborhood-streets-source') as any).setData(neighborhoodGeoJSON)
    }

    // Adiciona a camada de preenchimento vermelho
    if (!map.getLayer('neighborhood-streets-fill')) {
      map.addLayer({
        id: 'neighborhood-streets-fill',
        type: 'fill',
        source: 'neighborhood-streets-source',
        paint: {
          'fill-color': '#ff0000',
          'fill-opacity': 0.4
        }
      })
    }

    // Adiciona a camada de borda vermelha
    if (!map.getLayer('neighborhood-streets-border')) {
      map.addLayer({
        id: 'neighborhood-streets-border',
        type: 'line',
        source: 'neighborhood-streets-source',
        paint: {
          'line-color': '#ff0000',
          'line-width': 2,
          'line-opacity': 0.8
        }
      })
    }

    // Calcula o bounding box de todas as ruas para ajustar a visualização
    const allLngs = streets.flatMap(street => 
      street.bbox ? [street.bbox[0], street.bbox[2]] : [street.center[0]]
    )
    const allLats = streets.flatMap(street => 
      street.bbox ? [street.bbox[1], street.bbox[3]] : [street.center[1]]
    )

    const minLng = Math.min(...allLngs)
    const maxLng = Math.max(...allLngs)
    const minLat = Math.min(...allLats)
    const maxLat = Math.max(...allLats)

    // Ajusta a visualização para mostrar todas as ruas
    map.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
      padding: 100,
      duration: 1500
    })

    console.log(`🔴 ${streets.length} ruas do bairro ${neighborhoodName} pintadas de vermelho`)
  }

  // Função para mostrar alerta de alagamento (círculo vermelho com fade)
  const showFloodAlert = (coordinates: [number, number], radiusMeters: number = 1000) => {
    if (!mapRef.current) return

    const map = mapRef.current

    // Remove alerta anterior se existir
    hideFloodAlert()

    // Converte metros para graus (aproximação)
    // 1 grau de latitude ≈ 111,320 metros
    // 1 grau de longitude ≈ 111,320 * cos(latitude) metros
    const lat = coordinates[1]
    const radiusDegrees = radiusMeters / (111320 * Math.cos(lat * Math.PI / 180))

    // Cria um círculo usando um polígono com muitos lados
    const createCircle = (center: [number, number], radius: number, sides: number = 64) => {
      const points: [number, number][] = []
      for (let i = 0; i < sides; i++) {
        const angle = (i * 360) / sides
        const x = center[0] + radius * Math.cos(angle * Math.PI / 180)
        const y = center[1] + radius * Math.sin(angle * Math.PI / 180)
        points.push([x, y])
      }
      // Fecha o polígono
      points.push(points[0])
      return points
    }

    const circlePoints = createCircle(coordinates, radiusDegrees)

    // Cria o GeoJSON do círculo
    const floodAlertGeoJSON = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: [circlePoints]
          },
          properties: {
            name: 'Alerta de Alagamento',
            radius: radiusMeters,
            type: 'flood-alert'
          }
        }
      ]
    }

    // Adiciona a fonte de dados
    if (!map.getSource('flood-alert-source')) {
      map.addSource('flood-alert-source', {
        type: 'geojson',
        data: floodAlertGeoJSON
      })
    } else {
      (map.getSource('flood-alert-source') as any).setData(floodAlertGeoJSON)
    }

    // Adiciona a camada de preenchimento vermelho com fade
    if (!map.getLayer('flood-alert-fill')) {
      map.addLayer({
        id: 'flood-alert-fill',
        type: 'fill',
        source: 'flood-alert-source',
        paint: {
          'fill-color': '#ff0000',
          'fill-opacity': 0.3
        }
      })
    }

    // Adiciona a camada de borda vermelha
    if (!map.getLayer('flood-alert-border')) {
      map.addLayer({
        id: 'flood-alert-border',
        type: 'line',
        source: 'flood-alert-source',
        paint: {
          'line-color': '#ff0000',
          'line-width': 3,
          'line-opacity': 0.8
        }
      })
    }

    // Adiciona uma camada de gradiente para o fade (usando símbolos)
    if (!map.getLayer('flood-alert-gradient')) {
      map.addLayer({
        id: 'flood-alert-gradient',
        type: 'fill',
        source: 'flood-alert-source',
        paint: {
          'fill-color': '#ff0000',
          'fill-opacity': [
            'interpolate',
            ['linear'],
            ['distance', coordinates],
            0, 0.4,  // Centro: mais opaco
            radiusDegrees * 0.7, 0.2,  // 70% do raio: menos opaco
            radiusDegrees, 0.1  // Borda: bem transparente
          ]
        }
      })
    }

    console.log(`🚨 Alerta de alagamento criado: ${radiusMeters}m ao redor de ${coordinates}`)
  }

  // Função para esconder alerta de alagamento
  const hideFloodAlert = () => {
    if (!mapRef.current) return

    const map = mapRef.current

    // Remove as camadas do alerta de alagamento
    if (map.getLayer('flood-alert-gradient')) {
      map.removeLayer('flood-alert-gradient')
    }
    if (map.getLayer('flood-alert-border')) {
      map.removeLayer('flood-alert-border')
    }
    if (map.getLayer('flood-alert-fill')) {
      map.removeLayer('flood-alert-fill')
    }
    if (map.getSource('flood-alert-source')) {
      map.removeSource('flood-alert-source')
    }

    console.log('🚨 Alerta de alagamento removido')
  }

  // Função para esconder área vermelha
  const hideRedArea = () => {
    if (!mapRef.current) return

    const map = mapRef.current

    // Remove as camadas de ruas do bairro se existirem
    if (map.getLayer('neighborhood-streets-border')) {
      map.removeLayer('neighborhood-streets-border')
    }
    if (map.getLayer('neighborhood-streets-fill')) {
      map.removeLayer('neighborhood-streets-fill')
    }
    if (map.getSource('neighborhood-streets-source')) {
      map.removeSource('neighborhood-streets-source')
    }

    // Remove as camadas de área única se existirem
    if (map.getLayer('red-area-border')) {
      map.removeLayer('red-area-border')
    }
    if (map.getLayer('red-area-fill')) {
      map.removeLayer('red-area-fill')
    }
    if (map.getSource('red-area-source')) {
      map.removeSource('red-area-source')
    }

    // Remove alerta de alagamento também
    hideFloodAlert()

    console.log('🔴 Área vermelha removida')
  }

  const recenterToUserLocation = () => {
    if (mapRef.current) {
      console.log('🔄 Recentralizando mapa...')
      
      // Primeiro tenta usar a localização atual do usuário
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { longitude, latitude } = pos.coords
            console.log('📍 Localização obtida:', { longitude, latitude })
            
            // Atualiza o marcador do usuário
            if (userMarkerRef.current) {
              const marker = userMarkerRef.current
              if (marker && marker.setLngLat) {
                marker.setLngLat([longitude, latitude])
              }
            }
            
            // Recentraliza o mapa usando flyTo (mais suave e visível)
            mapRef.current?.flyTo({
              center: [longitude, latitude],
              zoom: 18, // Zoom mais próximo para mostrar a localização do usuário
              pitch: 60, // Mantém a inclinação 3D
              bearing: 0,
              essential: true, // Garante que a animação seja executada
              duration: 1500 // Duração otimizada
            })
            
            // Notifica o componente pai sobre a localização
            onLocationUpdate?.({
              latitude,
              longitude,
              accuracy: pos.coords.accuracy
            })
            console.log('✅ Mapa recentralizado na sua localização!')
          },
          (err) => {
            console.log('⚠️ Geolocalização negada, usando localização padrão (Uberlândia)')
            console.log('Erro detalhado:', err)
            
            // Fallback para Uberlândia com flyTo para ser mais visível
            mapRef.current?.flyTo({
              center: [-48.2772, -18.9186],
              zoom: 16, // Mesmo zoom inicial do mapa
              pitch: 60,
              bearing: 0,
              essential: true,
              duration: 1500
            })
            console.log('✅ Mapa recentralizado em Uberlândia!')
          },
          { 
            enableHighAccuracy: true, 
            timeout: 5000, // Timeout otimizado
            maximumAge: 30000 // Cache por 30 segundos para ser mais rápido
          }
        )
      } else {
        console.log('⚠️ Geolocalização não disponível, usando localização padrão')
        // Fallback para Uberlândia se geolocalização não estiver disponível
        mapRef.current.flyTo({
          center: [-48.2772, -18.9186],
          zoom: 16, // Mesmo zoom inicial do mapa
          pitch: 60,
          bearing: 0,
          essential: true,
          duration: 1500
        })
        console.log('✅ Mapa recentralizado em Uberlândia!')
      }
    }
  }

  // Expor as funções para o componente pai
  useImperativeHandle(ref, () => ({
    recenterToUserLocation,
    navigateToAddress: handleAddressSelect,
    flyTo: (options: any) => {
      if (mapRef.current) {
        mapRef.current.flyTo(options);
      }
    },
    showRedArea,
    hideRedArea,
    showNeighborhoodStreets,
    showFloodAlert,
    hideFloodAlert,
    resize: () => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    }
  }), []);

  useEffect(() => {
    let isMounted = true
    const token = (import.meta as any).env?.VITE_MAPBOX_TOKEN as string | undefined
    if (!token) {
      console.warn('VITE_MAPBOX_TOKEN ausente no .env')
      return
    }


    ;(async () => {
      const mapboxgl = (await import('mapbox-gl')).default
      mapboxgl.accessToken = token
      
      // Expõe mapboxgl no window para uso em outros componentes
      ;(window as any).mapboxgl = mapboxgl
      console.log('✅ mapboxgl exposto no window:', mapboxgl)

      const style = 'mapbox://styles/urbmind/cmgcff8ne00eb01qwgcvbgyqu'

      const fallbackCenter: LngLatLike = [-48.2772, -18.9186] // Uberlândia
      const map = new mapboxgl.Map({
        container: containerRef.current!,
        style,
        center: fallbackCenter,
        zoom: 16,
        pitch: 60,
        bearing: 0,
        attributionControl: false,
        interactive: true,
        scrollZoom: true,
        boxZoom: true,
        dragRotate: true,
        dragPan: true,
        keyboard: true,
        doubleClickZoom: true,
        touchZoomRotate: true,
        cooperativeGestures: false
      })
      
      if (!isMounted) return
      mapRef.current = map

      map.on('load', () => {
        if (!isMounted) return
        console.log('✅ Mapa carregado! mapboxgl disponível:', (window as any).mapboxgl)

        map.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        })

        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 })

        map.addLayer({
          'id': 'sky',
          'type': 'sky',
          'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 90.0],
            'sky-atmosphere-sun-intensity': 15
          }
        })
        if (map.getLayer('building')) {
          map.setPaintProperty('building', 'fill-extrusion-height', [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ])
          map.setPaintProperty('building', 'fill-extrusion-base', [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ])
          map.setPaintProperty('building', 'fill-extrusion-color', [
            'interpolate',
            ['linear'],
            ['get', 'height'],
            0,
            'lightblue',
            50,
            'royalblue',
            100,
            'lightgreen',
            200,
            'orange',
            300,
            'red'
          ])
        }

        const el = document.createElement('div')
        el.className = 'marker-float'
        el.style.cursor = 'pointer'
        el.style.width = '32px'
        el.style.height = '32px'
        
        // Carregar o arquivo motionpin.json completo
        const loadLottieAnimation = async () => {
          try {
            const response = await fetch('/motionpin.json')
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const animationData = await response.json()
            console.log('Lottie animation loaded successfully:', animationData)
            
            lottieAnimationRef.current = lottie.loadAnimation({
              container: el,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              animationData: animationData,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
              }
            })
          } catch (err) {
            console.error('Error loading Lottie animation:', err)
            // Fallback para SVG caso a animação Lottie falhe
            el.innerHTML = `
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4.39762C4 1.96888 5.96888 0 8.39762 0L23.6024 0C26.0311 0 28 1.96888 28 4.39762V20C28 26.6274 22.6274 32 16 32C9.37258 32 4 26.6274 4 20L4 4.39762Z" fill="#0D52FF"/>
                <path d="M8.39746 0.337891L23.6025 0.337891C25.8444 0.337975 27.662 2.15559 27.6621 4.39746V20C27.6621 26.4407 22.4407 31.6621 16 31.6621C9.55932 31.6621 4.33789 26.4407 4.33789 20L4.33789 4.39746C4.33798 2.15559 6.15559 0.337975 8.39746 0.337891Z" stroke="white" stroke-opacity="0.24" stroke-width="0.676239"/>
                <path d="M18.0057 18.47H22.8097V4.39758H18.0057V18.47ZM8.39764 18.47H16.5863V4.39758H8.39764V18.47Z" fill="white"/>
                <ellipse cx="3.0571" cy="3.15221" rx="3.0571" ry="3.15221" transform="matrix(-0.994032 0.109088 0.109088 0.994032 25.1585 6.21558)" fill="#86A8FF"/>
                <mask id="mask0_40_90" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="19" y="6" width="7" height="7">
                  <ellipse cx="22.4636" cy="9.68235" rx="3.0571" ry="3.15221" transform="rotate(-6.26272 22.4636 9.68235)" fill="#01081A"/>
                </mask>
                <g mask="url(#mask0_40_90)">
                  <ellipse cx="25.5025" cy="9.34888" rx="3.82138" ry="3.94026" transform="rotate(-6.26272 25.5025 9.34888)" fill="#01081A"/>
                </g>
                <ellipse cx="3.0571" cy="3.15221" rx="3.0571" ry="3.15221" transform="matrix(-0.994032 0.109088 0.109088 0.994032 16.816 6.78772)" fill="#86A8FF"/>
                <mask id="mask1_40_90" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="11" y="7" width="7" height="7">
                  <ellipse cx="14.1211" cy="10.2546" rx="3.0571" ry="3.15221" transform="rotate(-6.26272 14.1211 10.2546)" fill="#01081A"/>
                </mask>
                <g mask="url(#mask1_40_90)">
                  <ellipse cx="17.1598" cy="9.92115" rx="3.82138" ry="3.94026" transform="rotate(-6.26272 17.1598 9.92115)" fill="#01081A"/>
                </g>
              </svg>
            `
          }
        }
        
        loadLottieAnimation()
        
        userMarkerRef.current = el
        const marker = new mapboxgl.Marker({ 
          element: el,
          anchor: 'bottom'
        }).setLngLat(fallbackCenter).addTo(map)

        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { longitude, latitude, accuracy } = pos.coords
              marker.setLngLat([longitude, latitude])
              map.easeTo({ 
                center: [longitude, latitude], 
                duration: 1000, 
                zoom: 18,
                pitch: 60
              })
              
              // Notifica o componente pai sobre a localização
              onLocationUpdate?.({
                latitude,
                longitude,
                accuracy
              })
            },
            (err) => console.info('Geolocalização negada/indisponível:', err?.message),
            { enableHighAccuracy: true, timeout: 8000 }
          )

          watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
              const { longitude, latitude, accuracy } = pos.coords
              marker.setLngLat([longitude, latitude])
              map.easeTo({
                center: [longitude, latitude],
                duration: 2000
              })
              
              // Notifica o componente pai sobre a atualização da localização
              onLocationUpdate?.({
                latitude,
                longitude,
                accuracy
              })
            },
            (err) => console.info('watchPosition erro:', err?.message),
            { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
          )
        }

        map.on('click', (e) => {
          console.log('Map clicked at:', e.lngLat)
        })

        map.on('dblclick', (e) => {
          console.log('Map double-clicked at:', e.lngLat)
        })

        map.on('rotate', () => {
          console.log('Map rotated, bearing:', map.getBearing())
        })

        map.on('pitch', () => {
          console.log('Map pitched, pitch:', map.getPitch())
        })

        map.getCanvas().addEventListener('keydown', (e) => {
          switch(e.key) {
            case 'ArrowUp':
              map.panBy([0, -50])
              break
            case 'ArrowDown':
              map.panBy([0, 50])
              break
            case 'ArrowLeft':
              map.panBy([-50, 0])
              break
            case 'ArrowRight':
              map.panBy([50, 0])
              break
            case '+':
            case '=':
              map.zoomIn()
              break
            case '-':
              map.zoomOut()
              break
            case 'r':
              map.resetNorth()
              break
          }
        })
      })
    })()

    return () => {
      isMounted = false
      
      if (watchIdRef.current !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
      if (lottieAnimationRef.current) {
        lottieAnimationRef.current.destroy()
        lottieAnimationRef.current = null
      }
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      userMarkerRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: 1,
        pointerEvents: 'auto',
        touchAction: 'none',
        overflow: 'hidden'
      }}
    />
  )
})

MapComponent.displayName = 'MapComponent'

export default MapComponent