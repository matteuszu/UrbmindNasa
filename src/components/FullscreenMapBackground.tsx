import React, { useEffect, useRef, useState } from 'react'
import type { Map as MapboxMap, LngLatLike } from 'mapbox-gl'
import lottie from 'lottie-web'

export default function MapComponent() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const userMarkerRef = useRef<HTMLElement | null>(null)
  const userLocationRef = useRef<LngLatLike | null>(null)
  const lottieAnimationRef = useRef<any>(null)
  const [showRecenterButton, setShowRecenterButton] = useState(false)

  const recenterToUserLocation = () => {
    if (mapRef.current && userLocationRef.current) {
      mapRef.current.easeTo({
        center: userLocationRef.current,
        duration: 1000,
        zoom: 18,
        pitch: 60
      })
      setShowRecenterButton(false)
    }
  }

  const checkDistanceFromUserLocation = (currentCenter: LngLatLike) => {
    if (!userLocationRef.current) return false
    
    const userLng = Array.isArray(userLocationRef.current) ? userLocationRef.current[0] : (userLocationRef.current as any).lng || (userLocationRef.current as any).lon
    const userLat = Array.isArray(userLocationRef.current) ? userLocationRef.current[1] : (userLocationRef.current as any).lat
    const currentLng = Array.isArray(currentCenter) ? currentCenter[0] : (currentCenter as any).lng || (currentCenter as any).lon
    const currentLat = Array.isArray(currentCenter) ? currentCenter[1] : (currentCenter as any).lat
    
    // Calcular distância em graus (aproximação simples)
    const distance = Math.sqrt(Math.pow(userLng - currentLng, 2) + Math.pow(userLat - currentLat, 2))
    
    // Se a distância for maior que ~0.0005 graus (aproximadamente 50m), mostrar o botão
    return distance > 0.0005
  }

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
              const { longitude, latitude } = pos.coords
              const userLocation = [longitude, latitude] as LngLatLike
              userLocationRef.current = userLocation
              marker.setLngLat(userLocation)
              map.easeTo({ 
                center: userLocation, 
                duration: 1000, 
                zoom: 18,
                pitch: 60
              })
            },
            (err) => console.info('Geolocalização negada/indisponível:', err?.message),
            { enableHighAccuracy: true, timeout: 8000 }
          )

          watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
              const { longitude, latitude } = pos.coords
              const userLocation = [longitude, latitude] as LngLatLike
              userLocationRef.current = userLocation
              marker.setLngLat(userLocation)
              // Não recentralizar automaticamente no watchPosition para não interferir com o drag do usuário
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

        // Detectar quando o usuário move o mapa (drag, pan, etc.)
        map.on('moveend', () => {
          if (!isMounted) return
          const currentCenter = map.getCenter()
          const shouldShowButton = checkDistanceFromUserLocation(currentCenter)
          console.log('Moveend - shouldShowButton:', shouldShowButton, 'currentCenter:', currentCenter, 'userLocation:', userLocationRef.current)
          setShowRecenterButton(shouldShowButton)
        })

        map.on('dragend', () => {
          if (!isMounted) return
          const currentCenter = map.getCenter()
          const shouldShowButton = checkDistanceFromUserLocation(currentCenter)
          console.log('Dragend - shouldShowButton:', shouldShowButton, 'currentCenter:', currentCenter, 'userLocation:', userLocationRef.current)
          setShowRecenterButton(shouldShowButton)
        })

        // Também detectar durante o movimento para resposta mais rápida
        map.on('move', () => {
          if (!isMounted) return
          const currentCenter = map.getCenter()
          const shouldShowButton = checkDistanceFromUserLocation(currentCenter)
          setShowRecenterButton(shouldShowButton)
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
        height: '60vh',
        position: 'relative',
        zIndex: 1,
        pointerEvents: 'auto',
        touchAction: 'none',
        overflow: 'hidden'
      }}
    >
      {/* Logo UrbMind */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          pointerEvents: 'none', // Não interfere com interações do mapa
          opacity: 0.95,
          filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          padding: '8px 12px',
          backdropFilter: 'blur(4px)'
        }}
      >
        <img 
          src="/logo urbmind.svg" 
          alt="UrbMind Logo"
          style={{
            height: '20px',
            width: 'auto',
            display: 'block'
          }}
          onError={(e) => {
            console.error('Erro ao carregar logo:', e);
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Botão de Recentralizar - Temporariamente sempre visível para teste */}
      {(showRecenterButton || true) && (
        <button
          onClick={recenterToUserLocation}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10000,
            backgroundColor: '#0D52FF',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            width: '52px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(13, 82, 255, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            opacity: 0.95
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(13, 82, 255, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 82, 255, 0.3)'
          }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM20.94 11C20.48 6.83 17.17 3.52 13 3.06V1H11V3.06C6.83 3.52 3.52 6.83 3.06 11H1V13H3.06C3.52 17.17 6.83 20.48 11 20.94V23H13V20.94C17.17 20.48 20.48 17.17 20.94 13H23V11H20.94ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z" 
              fill="white"
            />
          </svg>
        </button>
      )}
    </div>
  )
}