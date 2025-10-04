import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '../config/mapbox';
import { Header } from './Header';

// Assets do Figma
const imgDashboard = "/Users/mateus/Documents/urbmind/Login and Signup Flow/src/assets/ea63f3679223a69c1c8b4ffbccbe9c84a1c0090f.png";
const imgMoonlitRainWeatherIconK022K1 = "/Users/mateus/Documents/urbmind/Login and Signup Flow/src/assets/bf1a2cc5606758d5adae2f8e7178ec842b5add92.png";
const imgUnion = "/Users/mateus/Documents/urbmind/Login and Signup Flow/src/assets/4c4ae04daf1839ba5058b6961af9aa1fcd8ca4ed.svg";
const imgEllipse13 = "/Users/mateus/Documents/urbmind/Login and Signup Flow/src/assets/164907ed81e5266f3e690902855bc7aacda469a6.svg";
const imgEllipse14 = "/Users/mateus/Documents/urbmind/Login and Signup Flow/src/assets/23467f8e86d340cd9a73a495866f8300c7d58794.svg";
const imgGroup1 = "/Users/mateus/Documents/urbmind/Login and Signup Flow/src/assets/97095b4fbfee9d8fed84c6dc4873edfbde3438b0.svg";

interface FigmaDashboardProps {
  userName?: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
}

export function FigmaDashboard({ userName = "Usuário" }: FigmaDashboardProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (map.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    if (mapContainer.current) {
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v11', // Usar estilo padrão primeiro
          center: MAPBOX_CONFIG.defaultCenter,
          zoom: MAPBOX_CONFIG.defaultZoom,
          pitch: 0,
          bearing: 0,
          antialias: true,
          attributionControl: false,
          logoPosition: 'bottom-right'
        });

        map.current.on('load', () => {
          console.log('Map loaded successfully');
          console.log('Map container:', mapContainer.current);
          console.log('Map instance:', map.current);
          setIsLoading(false);
          
          // Handle missing images
          map.current?.on('styleimagemissing', (e) => {
            console.log('Missing image:', e.id);
            // Add a placeholder for missing images
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = 'transparent';
              ctx.fillRect(0, 0, 1, 1);
              map.current?.addImage(e.id, canvas);
            }
          });
          
          // Get user location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude, city: 'Uberlândia, MG' });
                
                // Fly to user location
                map.current?.flyTo({
                  center: [longitude, latitude],
                  zoom: 14,
                  duration: 2000
                });

                // Add user marker with custom design
                addUserMarker(longitude, latitude);
              },
              (error) => {
                console.error('Geolocation error:', error);
                // Default to Uberlândia
                setUserLocation({ latitude: -18.9186, longitude: -48.2772, city: 'Uberlândia, MG' });
                addUserMarker(-48.2772, -18.9186);
              }
            );
          } else {
            // Default to Uberlândia
            setUserLocation({ latitude: -18.9186, longitude: -48.2772, city: 'Uberlândia, MG' });
            addUserMarker(-48.2772, -18.9186);
          }
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

  const addUserMarker = (longitude: number, latitude: number) => {
    if (!map.current) return;

    // Remove existing marker
    if (userMarker.current) {
      userMarker.current.remove();
    }

    // Create custom marker element following Figma design
    const markerElement = document.createElement('div');
    markerElement.className = 'figma-user-marker';
    markerElement.innerHTML = `
      <div class="marker-container">
        <div class="marker-pulse-outer"></div>
        <div class="marker-pulse-inner"></div>
        <div class="marker-pin">
          <div class="marker-icon">📍</div>
        </div>
      </div>
    `;

    // Create and add marker
    userMarker.current = new mapboxgl.Marker(markerElement)
      .setLngLat([longitude, latitude])
      .addTo(map.current);
  };

  return (
    <div className="w-full h-screen bg-[#01081a] flex flex-col items-center justify-end relative" data-name="Dashboard" data-node-id="34:249">
      {/* Background with Map */}
      <div className="absolute inset-0 z-0">
        <div 
          ref={mapContainer} 
          className="absolute inset-0 w-full h-full"
          style={{ 
            backgroundColor: '#01081a',
            minHeight: '100vh',
            minWidth: '100vw'
          }}
        />
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#01081a] flex items-center justify-center z-10">
            <div className="text-white text-lg">Carregando mapa...</div>
          </div>
        )}
      </div>

      {/* Bottom Panel */}
      <div className="bg-[#01081a] flex flex-col gap-6 items-start p-6 relative rounded-t-[32px] w-full z-20" data-node-id="34:420">
        {/* Greeting Section */}
        <div className="flex flex-col gap-4 w-full" data-node-id="34:549">
          <div className="flex flex-col gap-1 w-full" data-node-id="34:562">
            <p className="font-bold text-2xl text-white w-full" data-node-id="34:563">
              Hello, how are you?
            </p>
            <p className="font-normal text-base text-[#f6f6f6] w-full" data-node-id="34:564">
              <span>You are in </span>
              <span className="font-medium text-[#e7eeff] underline">
                {userLocation?.city || 'Uberlândia, MG'}
              </span>
            </p>
          </div>
        </div>

        {/* Weather Cards */}
        <div className="flex gap-4 w-full" data-node-id="34:568">
          {/* Weather Card 1 */}
          <div className="flex flex-col gap-8 p-4 rounded-xl w-[240px] bg-white/5 backdrop-blur-sm border border-white/10" data-node-id="34:581">
            <div className="h-16 w-16 flex items-center justify-center" data-name="Moonlit Rain Weather Icon.K02.2k 1" data-node-id="35:7">
              <div className="text-4xl">🌧️</div>
            </div>
            <div className="flex flex-col gap-1 w-full" data-node-id="34:647">
              <p className="font-semibold text-2xl text-white" data-node-id="35:9">
                12º
              </p>
              <p className="font-normal text-sm text-[#ededed]" data-node-id="34:646">
                Tempestade intensa
              </p>
              <p className="font-semibold text-lg text-white" data-node-id="34:643">
                19:30 às 21:40
              </p>
            </div>
          </div>

          {/* Weather Card 2 */}
          <div className="flex flex-col gap-8 p-4 rounded-xl w-[240px] bg-white/5 backdrop-blur-sm border border-white/10" data-node-id="35:11">
            <div className="h-16 w-16 flex items-center justify-center" data-name="Moonlit Rain Weather Icon.K02.2k 1" data-node-id="35:12">
              <div className="text-4xl">⛅</div>
            </div>
            <div className="flex flex-col gap-1 w-full" data-node-id="35:13">
              <p className="font-semibold text-2xl text-white" data-node-id="35:14">
                18º
              </p>
              <p className="font-normal text-sm text-[#ededed]" data-node-id="35:15">
                Parcialmente nublado
              </p>
              <p className="font-semibold text-lg text-white" data-node-id="35:16">
                22:00 às 06:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <Header />


      {/* Custom CSS for markers */}
      <style>{`
        .figma-user-marker {
          width: 60px;
          height: 60px;
          cursor: pointer;
        }
        
        .marker-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .marker-pulse-outer {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #0d52ff;
          border-radius: 50%;
          opacity: 0.3;
          animation: pulse-outer 2s infinite;
        }
        
        .marker-pulse-inner {
          position: absolute;
          top: 8px;
          left: 8px;
          right: 8px;
          bottom: 8px;
          background: #0d52ff;
          border-radius: 50%;
          opacity: 0.5;
          animation: pulse-inner 2s infinite;
        }
        
        .marker-pin {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          bottom: 12px;
          background: #0d52ff;
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          z-index: 10;
        }
        
        .marker-icon {
          color: white;
          font-weight: bold;
          font-size: 12px;
        }
        
        @keyframes pulse-outer {
          0% { transform: scale(1); opacity: 0.3; }
          70% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        
        @keyframes pulse-inner {
          0% { transform: scale(1); opacity: 0.5; }
          70% { transform: scale(1.2); opacity: 0; }
          100% { transform: scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
