import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '../config/mapbox';
import { Header } from './Header';

interface SimpleDashboardProps {
  userName?: string;
}

export function SimpleDashboard({ userName = "Usuário" }: SimpleDashboardProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (map.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    if (mapContainer.current) {
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [-48.2772, -18.9186], // Uberlândia, MG
          zoom: 12,
          pitch: 0,
          bearing: 0,
          antialias: true,
          attributionControl: false,
          logoPosition: 'bottom-right'
        });

        map.current.on('load', () => {
          console.log('Map loaded successfully');
          setIsLoading(false);
        });

        map.current.on('error', (e) => {
          console.error('Map error:', e);
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error creating map:', error);
        setIsLoading(false);
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-screen bg-[#01081a] relative">
      {/* Map Background */}
      <div className="absolute inset-0">
        <div 
          ref={mapContainer} 
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#01081a] flex items-center justify-center z-10">
            <div className="text-white text-lg">Carregando mapa...</div>
          </div>
        )}
      </div>

      {/* Header */}
      <Header />

      {/* Bottom Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-[#01081a] rounded-t-[32px] p-6 space-y-6">
          {/* Greeting Section */}
          <div className="space-y-4">
            <h1 className="text-white text-2xl font-bold">
              Hello, how are you?
            </h1>
            <p className="text-[#f6f6f6] text-base">
              You are in{' '}
              <span className="text-[#e7eeff] underline font-medium">
                Uberlândia, MG
              </span>
            </p>
          </div>

          {/* Weather Cards */}
          <div className="flex gap-4">
            {/* Weather Card 1 */}
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <div className="text-3xl">🌧️</div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-white text-2xl font-semibold">12°</p>
                <p className="text-[#ededed] text-sm">Tempestade intensa</p>
                <p className="text-white text-lg font-semibold">19:30 às 21:40</p>
              </div>
            </div>

            {/* Weather Card 2 */}
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <div className="text-3xl">⛅</div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-white text-2xl font-semibold">18°</p>
                <p className="text-[#ededed] text-sm">Parcialmente nublado</p>
                <p className="text-white text-lg font-semibold">22:00 às 06:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

