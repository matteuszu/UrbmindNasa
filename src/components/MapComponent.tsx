import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import type { Map as MapboxMap, LngLatLike } from 'mapbox-gl'
import lottie from 'lottie-web'

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface MapComponentProps {
  onLocationUpdate?: (location: UserLocation) => void;
}

export interface MapComponentRef {
  recenterToUserLocation: () => void;
}

const MapComponent = forwardRef<MapComponentRef, MapComponentProps>(({ onLocationUpdate }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const userMarkerRef = useRef<HTMLElement | null>(null)
  const lottieAnimationRef = useRef<any>(null)

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
              zoom: 16, // Mesmo zoom inicial do mapa
              pitch: 60,
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

  // Expor a função de recentralização para o componente pai
  useImperativeHandle(ref, () => ({
    recenterToUserLocation
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