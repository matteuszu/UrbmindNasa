import { useEffect, useRef, useCallback } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'

interface MapState {
  zoom: number;
  center: [number, number];
  pitch: number;
  bearing: number;
}

export function useMapViewportFix(mapRef: React.RefObject<MapboxMap | null>) {
  const savedStateRef = useRef<MapState | null>(null)
  const isTransitioningRef = useRef(false)
  const lastHeightRef = useRef(window.innerHeight)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const saveMapState = useCallback(() => {
    if (mapRef.current && !isTransitioningRef.current) {
      const center = mapRef.current.getCenter()
      savedStateRef.current = {
        zoom: mapRef.current.getZoom(),
        center: [center.lng, center.lat],
        pitch: mapRef.current.getPitch(),
        bearing: mapRef.current.getBearing()
      }
      console.log('💾 Estado do mapa salvo:', savedStateRef.current)
    }
  }, [mapRef])

  const restoreMapState = useCallback(() => {
    if (mapRef.current && savedStateRef.current && isTransitioningRef.current) {
      const { zoom, center, pitch, bearing } = savedStateRef.current
      console.log('🔄 Restaurando estado do mapa:', { zoom, center, pitch, bearing })
      
      // Força o redimensionamento
      mapRef.current.resize()
      
      // Aguarda o próximo frame
      requestAnimationFrame(() => {
        if (mapRef.current && savedStateRef.current) {
          mapRef.current.easeTo({
            center,
            zoom,
            pitch,
            bearing,
            duration: 400,
            essential: true
          })
          
          // Reset da flag após a animação
          setTimeout(() => {
            isTransitioningRef.current = false
            console.log('✅ Estado do mapa restaurado!')
          }, 450)
        }
      })
    }
  }, [mapRef])

  const handleViewportChange = useCallback(() => {
    if (!mapRef.current) return
    
    const currentHeight = window.innerHeight
    const heightDiff = Math.abs(currentHeight - lastHeightRef.current)
    
    console.log('📱 Viewport mudou - altura atual:', currentHeight, 'anterior:', lastHeightRef.current, 'diferença:', heightDiff)
    
    // Se a altura mudou significativamente (teclado virtual)
    if (heightDiff > 150) {
      if (!isTransitioningRef.current) {
        console.log('🎯 Iniciando correção de viewport...')
        
        // Salva o estado atual
        saveMapState()
        isTransitioningRef.current = true
        
        // Limpa timeout anterior se existir
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        // Aguarda a mudança se estabilizar
        timeoutRef.current = setTimeout(() => {
          if (mapRef.current) {
            console.log('🔄 Aplicando correção...')
            mapRef.current.resize()
            
            // Restaura o estado após um delay
            setTimeout(() => {
              restoreMapState()
            }, 100)
          }
        }, 150)
      }
    }
    
    lastHeightRef.current = currentHeight
  }, [mapRef, saveMapState, restoreMapState])

  const handleInputFocus = useCallback(() => {
    if (mapRef.current) {
      console.log('⌨️ Input focado - preparando para mudança de viewport')
      saveMapState()
    }
  }, [mapRef, saveMapState])

  const handleInputBlur = useCallback(() => {
    console.log('⌨️ Input desfocado - aguardando restauração')
  }, [])

  useEffect(() => {
    // Inicializa a altura
    lastHeightRef.current = window.innerHeight

    // Event listeners principais
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('orientationchange', handleViewportChange)
    
    // Visual Viewport API (mais preciso para teclado virtual)
    if ('visualViewport' in window && window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange)
    }

    // Detecta foco em inputs
    document.addEventListener('focusin', (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        handleInputFocus()
      }
    })
    
    document.addEventListener('focusout', (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        handleInputBlur()
      }
    })

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('orientationchange', handleViewportChange)
      
      if ('visualViewport' in window && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange)
      }
      
      document.removeEventListener('focusin', handleInputFocus)
      document.removeEventListener('focusout', handleInputBlur)
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [handleViewportChange, handleInputFocus, handleInputBlur])

  return {
    saveMapState,
    restoreMapState
  }
}
