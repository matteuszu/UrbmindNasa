import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Assets do Figma (serão criados automaticamente)
const imgDashboard = "/Users/mateus/Documents/urbmind/Login and Signup Flow/src/assets/ea63f3679223a69c1c8b4ffbccbe9c84a1c0090f.png";
const imgMoonlitRainWeatherIconK022K1 = "/Users/mateus/Documents/urbmind/Login and Signup Flow/src/assets/bf1a2cc5606758d5adae2f8e7178ec842b5add92.png";
const imgUnion = "/Users/mateus/Documents/urbmind/Login and Signup Flow/src/assets/4c4ae04daf1839ba5058b6961af9aa1fcd8ca4ed.svg";
const imgEllipse13 = "/Users/mateus/Documents/urbmind/Login and Signup Flow/src/assets/164907ed81e5266f3e690902855bc7aacda469a6.svg";
const imgEllipse14 = "/Users/mateus/Documents/urbmind/Login and Signup Flow/src/assets/23467f8e86d340cd9a73a495866f8300c7d58794.svg";
const imgGroup1 = "/Users/mateus/Documents/urbmind/Login and Signup Flow/src/assets/97095b4fbfee9d8fed84c6dc4873edfbde3438b0.svg";

interface UrbMindDashboardProps {
  userName: string;
}

export function UrbMindDashboard({ userName }: UrbMindDashboardProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; city: string } | null>(null);

  useEffect(() => {
    if (map.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoidXJibWluZCIsImEiOiJjbWdjZThmcXgwbXdiMmlwbWsxc2d2czcxIn0.zy2SVmAiQREsG2TeosmyUA';

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

                // Add user marker
                const markerElement = document.createElement('div');
                markerElement.className = 'user-location-marker';
                markerElement.style.width = '40px';
                markerElement.style.height = '40px';
                markerElement.style.backgroundImage = 'url(/pin-mapbox.svg)';
                markerElement.style.backgroundSize = 'contain';
                markerElement.style.backgroundRepeat = 'no-repeat';
                markerElement.style.backgroundPosition = 'center';
                markerElement.style.cursor = 'pointer';
                markerElement.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))';

                new mapboxgl.Marker(markerElement)
                  .setLngLat([longitude, latitude])
                  .addTo(map.current!);
              },
              (error) => {
                console.error('Geolocation error:', error);
                // Default to Uberlândia
                setUserLocation({ latitude: -18.9186, longitude: -48.2772, city: 'Uberlândia, MG' });
              }
            );
          } else {
            // Default to Uberlândia
            setUserLocation({ latitude: -18.9186, longitude: -48.2772, city: 'Uberlândia, MG' });
          }
        });

        map.current.on('error', (e) => {
          console.error('Map error:', e);
        });
      } catch (error) {
        console.error('Error creating map:', error);
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
    <div className="box-border content-stretch flex flex-col items-center justify-end pb-0 pt-[80px] px-0 relative size-full min-h-screen">
      {/* Background with Map */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute bg-[#01081a] inset-0" />
        <div className="absolute inset-0 overflow-hidden">
          <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="bg-[#01081a] box-border content-stretch flex flex-col gap-[24px] items-start pb-[40px] pt-[32px] px-[16px] relative rounded-tl-[32px] rounded-tr-[32px] shrink-0 w-full">
        {/* Greeting Section */}
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full">
            <p className="font-['Poppins',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[24px] text-white tracking-[0.48px] w-full">
              Hello, how are you?
            </p>
            <p className="font-['Poppins',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#f6f6f6] text-[16px] tracking-[0.32px] w-full">
              <span>You are in </span>
              <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid font-['Poppins',_sans-serif] font-medium not-italic text-[#e7eeff] underline">
                {userLocation?.city || 'Uberlândia, MG'}
              </span>
            </p>
          </div>
        </div>

        {/* Weather Cards */}
        <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
          {/* Weather Card 1 */}
          <div className="box-border content-stretch flex flex-col gap-[32px] items-start p-[16px] relative rounded-[12px] shrink-0 w-[240px] bg-[rgba(255,255,255,0.05)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
            <div className="h-[62px] relative shrink-0 w-[72px] flex items-center justify-center">
              <div className="text-4xl">🌧️</div>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full">
              <p className="font-['Poppins',_sans-serif] font-semibold leading-none relative shrink-0 text-[24px] text-nowrap text-white tracking-[0.48px] whitespace-pre">
                12º
              </p>
              <p className="font-['Poppins',_sans-serif] font-normal leading-[normal] min-w-full relative shrink-0 text-[#ededed] text-[14px] tracking-[0.28px] w-[min-content]">
                Tempestade intensa
              </p>
              <p className="font-['Poppins',_sans-serif] font-semibold leading-[normal] min-w-full relative shrink-0 text-[18px] text-white tracking-[0.36px] w-[min-content]">
                19:30 às 21:40
              </p>
            </div>
          </div>

          {/* Weather Card 2 */}
          <div className="box-border content-stretch flex flex-col gap-[32px] items-start p-[16px] relative rounded-[12px] shrink-0 w-[240px] bg-[rgba(255,255,255,0.05)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
            <div className="h-[62px] relative shrink-0 w-[72px] flex items-center justify-center">
              <div className="text-4xl">⛅</div>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full">
              <p className="font-['Poppins',_sans-serif] font-semibold leading-none relative shrink-0 text-[24px] text-nowrap text-white tracking-[0.48px] whitespace-pre">
                18º
              </p>
              <p className="font-['Poppins',_sans-serif] font-normal leading-[normal] min-w-full relative shrink-0 text-[#ededed] text-[14px] tracking-[0.28px] w-[min-content]">
                Parcialmente nublado
              </p>
              <p className="font-['Poppins',_sans-serif] font-semibold leading-[normal] min-w-full relative shrink-0 text-[18px] text-white tracking-[0.36px] w-[min-content]">
                22:00 às 06:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Header */}
      <div className="absolute box-border content-stretch flex h-[80px] items-center justify-between left-0 pb-0 pt-[12px] px-[16px] top-0 w-full">
        <div className="backdrop-blur-[7.5px] backdrop-filter basis-0 bg-[rgba(29,29,29,0.4)] box-border content-stretch flex grow h-full items-center justify-between min-h-px min-w-px p-[20px] relative rounded-[999px] shrink-0">
          <div className="h-[20px] relative shrink-0 w-[139px] flex items-center">
            <span className="text-white font-['Poppins',_sans-serif] font-semibold text-lg">UrbMind</span>
          </div>
        </div>
      </div>

      {/* Location Marker */}
      <div className="absolute h-[13px] left-[161px] top-[345px] w-[54px]">
        <div className="w-full h-full bg-[#0d52ff] rounded-full opacity-60"></div>
      </div>
      <div className="absolute h-[21px] left-[144px] top-[341px] w-[88px]">
        <div className="w-full h-full bg-[#0d52ff] rounded-full opacity-30"></div>
      </div>

      {/* Custom Marker */}
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.1304643750190735)+(var(--transform-inner-height)*0.9914529919624329)))] items-center justify-center left-[170.86px] top-[300.9px] w-[calc(1px*((var(--transform-inner-height)*0.1304643750190735)+(var(--transform-inner-width)*0.9914529919624329)))]" style={{ "--transform-inner-width": "37.296875", "--transform-inner-height": "48.8125" } as React.CSSProperties}>
        <div className="flex-none rotate-[7.496deg]">
          <div className="bg-[#0d52ff] border border-[rgba(255,255,255,0.24)] border-solid box-border content-stretch flex flex-col gap-[6.503px] items-start pb-[19.509px] pl-[6.503px] pr-[3px] pt-[6.503px] relative rounded-bl-[32.515px] rounded-br-[32.515px] rounded-tl-[6.503px] rounded-tr-[6.503px]">
            <div className="flex items-center justify-center relative shrink-0">
              <div className="flex-none rotate-[180deg] scale-y-[-100%]">
                <div className="h-[20.81px] relative w-[25.802px] flex items-center justify-center">
                  <span className="text-white text-sm">📍</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for markers */}
      <style jsx>{`
      `}</style>
    </div>
  );
}

