import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '../config/mapbox';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface InteractiveMapProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onLocationUpdate?: (location: UserLocation) => void;
}

export function InteractiveMap({ 
  className = '', 
  style = {}, 
  children,
  onLocationUpdate 
}: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAPBOX_CONFIG.defaultStyle,
        center: MAPBOX_CONFIG.defaultCenter,
        zoom: MAPBOX_CONFIG.defaultZoom,
        maxZoom: MAPBOX_CONFIG.maxZoom,
        minZoom: MAPBOX_CONFIG.minZoom,
        pitch: 0,
        bearing: 0,
        antialias: true,
        attributionControl: false,
        logoPosition: 'bottom-right'
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true
      }), 'top-right');

      // Add scale control
      map.current.addControl(new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
      }), 'bottom-left');

      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      // Handle map load
      map.current.on('load', () => {
        console.log('Map loaded successfully');
      });

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setError('Erro ao carregar o mapa');
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada neste navegador');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const location: UserLocation = { latitude, longitude, accuracy };
        
        setUserLocation(location);
        onLocationUpdate?.(location);

        // Update map center and add marker
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 16,
            duration: 2000
          });

          // Remove existing marker
          if (userMarker.current) {
            userMarker.current.remove();
          }

          // Create custom marker element
          const markerElement = document.createElement('div');
          markerElement.className = 'custom-marker';
          markerElement.style.width = '40px';
          markerElement.style.height = '40px';
          markerElement.style.backgroundImage = 'url(/pin-mapbox.svg)';
          markerElement.style.backgroundSize = 'contain';
          markerElement.style.backgroundRepeat = 'no-repeat';
          markerElement.style.backgroundPosition = 'center';
          markerElement.style.cursor = 'pointer';
          markerElement.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))';


          // Create and add marker
          userMarker.current = new mapboxgl.Marker(markerElement)
            .setLngLat([longitude, latitude])
            .addTo(map.current);

          // Add popup
          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnClick: false
          }).setHTML(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">Sua Localização</h3>
              <p class="text-xs text-gray-600">Lat: ${latitude.toFixed(6)}</p>
              <p class="text-xs text-gray-600">Lng: ${longitude.toFixed(6)}</p>
              ${accuracy ? `<p class="text-xs text-gray-500">Precisão: ±${Math.round(accuracy)}m</p>` : ''}
            </div>
          `);

          userMarker.current.setPopup(popup);
        }

        setIsLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Erro ao obter localização';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível';
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout ao obter localização';
            break;
        }
        
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, [onLocationUpdate]);

  // Zoom controls
  const zoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  const resetView = () => {
    if (map.current) {
      map.current.flyTo({
        center: MAPBOX_CONFIG.defaultCenter,
        zoom: MAPBOX_CONFIG.defaultZoom,
        duration: 1000
      });
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`} style={style}>
      {/* Map container */}
      <div 
        ref={mapContainer} 
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />
      
      {/* Custom controls */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <Card className="p-2">
          <CardContent className="p-0 space-y-1">
            <Button
              size="sm"
              variant="outline"
              onClick={getUserLocation}
              disabled={isLoading}
              className="w-full justify-start"
            >
              <Navigation className="w-4 h-4 mr-2" />
              {isLoading ? 'Localizando...' : 'Minha Localização'}
            </Button>
            
            <div className="flex space-x-1">
              <Button size="sm" variant="outline" onClick={zoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={zoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={resetView}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location info */}
      {userLocation && (
        <div className="absolute bottom-4 left-4 z-10">
          <Card className="p-3">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Localização Atual</p>
                  <p className="text-xs text-gray-600">
                    {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-4 right-4 z-10">
          <Card className="p-3 bg-red-50 border-red-200">
            <CardContent className="p-0">
              <p className="text-sm text-red-600">{error}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content overlay */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 2 }}
      >
        <div className="pointer-events-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

