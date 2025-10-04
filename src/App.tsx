import { useEffect, useState } from 'react';
import MapComponent from './components/MapComponent';
import BottomSection from './components/BottomSection';

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export default function App() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  // Set dark mode as default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleLocationUpdate = (location: UserLocation) => {
    setUserLocation(location);
  };

  return (
    <div 
      className="app-container"
      style={{ 
        height: '100vh', 
        overflow: 'hidden',
        touchAction: 'manipulation',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div 
        className="map-container"
        style={{
          height: '60vh',
          width: '100%'
        }}
      >
        <MapComponent onLocationUpdate={handleLocationUpdate} />
      </div>
      <div 
        className="bottom-section-container"
        style={{
          flex: 1
        }}
      >
        <BottomSection userLocation={userLocation} />
      </div>
    </div>
  );
}