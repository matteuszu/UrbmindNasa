import { useCallback, useRef } from 'react'
import type { Map as MapboxMap, Marker } from 'mapbox-gl'

interface MapNavigationOptions {
  duration?: number;
  zoom?: number;
  pitch?: number;
  bearing?: number;
  essential?: boolean;
}

export function useMapNavigation(mapRef: React.RefObject<MapboxMap | null>) {
  const isNavigatingRef = useRef(false)
  const searchMarkerRef = useRef<Marker | null>(null)


  /**
   * Adiciona um pin de busca no mapa
   */
  const addSearchMarker = useCallback((
    coordinates: [number, number],
    title?: string
  ) => {
    console.log('📍 addSearchMarker chamado com:', coordinates, title)
    
    if (!mapRef.current) {
      console.error('❌ mapRef.current não está disponível')
      return
    }

    // Remove o pin anterior se existir
    if (searchMarkerRef.current) {
      console.log('📍 Removendo pin anterior')
      searchMarkerRef.current.remove()
    }

    // Cria um elemento HTML para o pin (igual ao pin do usuário, mas com SVG diferente)
    const markerElement = document.createElement('div')
    markerElement.className = 'search-marker'
    markerElement.style.width = '40px'
    markerElement.style.height = '40px'
    markerElement.style.backgroundImage = 'url(/3d-map.svg)'
    markerElement.style.backgroundSize = 'contain'
    markerElement.style.backgroundRepeat = 'no-repeat'
    markerElement.style.backgroundPosition = 'center'
    markerElement.style.cursor = 'pointer'
    markerElement.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'

    // Adiciona tooltip se houver título
    if (title) {
      markerElement.title = title
    }

    // Cria o marker usando a mesma lógica do pin do usuário
    const mapboxgl = (window as any).mapboxgl
    
    if (mapboxgl && mapboxgl.Marker) {
      console.log('📍 Criando marker com mapboxgl...')
      searchMarkerRef.current = new mapboxgl.Marker(markerElement)
        .setLngLat(coordinates)
        .addTo(mapRef.current)
      
      console.log('📍 Pin de busca adicionado em:', coordinates)
    } else {
      console.error('❌ mapboxgl.Marker não está disponível')
    }
  }, [mapRef])

  /**
   * Remove o pin de busca
   */
  const removeSearchMarker = useCallback(() => {
    if (searchMarkerRef.current) {
      searchMarkerRef.current.remove()
      searchMarkerRef.current = null
      console.log('📍 Pin de busca removido')
    }
  }, [])

  /**
   * Navega para uma localização específica
   */
  const navigateTo = useCallback((
    coordinates: [number, number],
    options: MapNavigationOptions = {}
  ) => {
    if (!mapRef.current) {
      console.warn('Mapa não está disponível para navegação')
      return
    }

    const {
      duration = 1500,
      zoom = 16,
      pitch = 60,
      bearing = 0,
      essential = true
    } = options

    console.log('🗺️ Navegando para:', coordinates, 'zoom:', zoom)

    // Previne múltiplas navegações simultâneas
    if (isNavigatingRef.current) {
      console.log('⚠️ Navegação já em andamento, ignorando...')
      return
    }

    isNavigatingRef.current = true

    mapRef.current.flyTo({
      center: coordinates,
      zoom,
      pitch,
      bearing,
      duration,
      essential
    })

    // Reset da flag após a animação
    setTimeout(() => {
      isNavigatingRef.current = false
    }, duration + 100)
  }, [mapRef])

  /**
   * Navega para uma localização com zoom específico
   */
  const navigateToWithZoom = useCallback((
    coordinates: [number, number],
    zoom: number,
    duration: number = 1500
  ) => {
    navigateTo(coordinates, { zoom, duration })
  }, [navigateTo])

  /**
   * Navega para uma localização com bbox (área específica)
   */
  const navigateToBounds = useCallback((
    bbox: [number, number, number, number],
    options: {
      duration?: number;
      padding?: number;
      maxZoom?: number;
    } = {}
  ) => {
    if (!mapRef.current) {
      console.warn('Mapa não está disponível para navegação')
      return
    }

    const {
      duration = 1500,
      padding = 50,
      maxZoom = 18
    } = options

    console.log('🗺️ Navegando para bounds:', bbox)

    if (isNavigatingRef.current) {
      console.log('⚠️ Navegação já em andamento, ignorando...')
      return
    }

    isNavigatingRef.current = true

    mapRef.current.fitBounds(bbox, {
      padding,
      maxZoom,
      duration
    })

    setTimeout(() => {
      isNavigatingRef.current = false
    }, duration + 100)
  }, [mapRef])

  /**
   * Navega para a localização do usuário
   */
  const navigateToUserLocation = useCallback((
    coordinates: [number, number],
    options: MapNavigationOptions = {}
  ) => {
    navigateTo(coordinates, {
      zoom: 18,
      pitch: 60,
      bearing: 0,
      duration: 2000,
      ...options
    })
  }, [navigateTo])

  /**
   * Navega para um endereço específico
   */
  const navigateToAddress = useCallback((
    coordinates: [number, number],
    addressName: string,
    options: MapNavigationOptions = {}
  ) => {
    console.log('🏠 Navegando para endereço:', addressName)
    
    // Adiciona o pin de busca
    addSearchMarker(coordinates, addressName)
    
    navigateTo(coordinates, {
      zoom: 17,
      pitch: 45,
      bearing: 0,
      duration: 1800,
      ...options
    })
  }, [navigateTo, addSearchMarker])

  /**
   * Navega para um ponto de interesse (POI)
   */
  const navigateToPOI = useCallback((
    coordinates: [number, number],
    poiName: string,
    options: MapNavigationOptions = {}
  ) => {
    console.log('📍 Navegando para POI:', poiName)
    
    // Adiciona o pin de busca também para POIs
    addSearchMarker(coordinates, poiName)
    
    navigateTo(coordinates, {
      zoom: 16,
      pitch: 50,
      bearing: 0,
      duration: 1600,
      ...options
    })
  }, [navigateTo, addSearchMarker])

  /**
   * Navega para uma cidade ou região
   */
  const navigateToCity = useCallback((
    coordinates: [number, number],
    cityName: string,
    options: MapNavigationOptions = {}
  ) => {
    console.log('🏙️ Navegando para cidade:', cityName)
    
    // Adiciona o pin de busca também para cidades
    addSearchMarker(coordinates, cityName)
    
    navigateTo(coordinates, {
      zoom: 12,
      pitch: 30,
      bearing: 0,
      duration: 2000,
      ...options
    })
  }, [navigateTo, addSearchMarker])

  /**
   * Volta para a visualização padrão
   */
  const resetView = useCallback(() => {
    if (!mapRef.current) return

    console.log('🔄 Resetando visualização do mapa')

    mapRef.current.flyTo({
      center: [-48.2772, -18.9186], // Uberlândia
      zoom: 12,
      pitch: 0,
      bearing: 0,
      duration: 1500,
      essential: true
    })
  }, [mapRef])

  /**
   * Verifica se está navegando
   */
  const isNavigating = useCallback(() => {
    return isNavigatingRef.current
  }, [])

  return {
    navigateTo,
    navigateToWithZoom,
    navigateToBounds,
    navigateToUserLocation,
    navigateToAddress,
    navigateToPOI,
    navigateToCity,
    resetView,
    isNavigating,
    addSearchMarker,
    removeSearchMarker
  }
}
