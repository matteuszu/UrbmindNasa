import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import MapComponent, { MapComponentRef } from '../MapComponent';
import BottomSection from '../BottomSection';
import MapControls from '../MapControls';
import { Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface DesktopLayoutProps {
  userLocation: UserLocation | null;
  isLabActive: boolean;
  showLocationButton: boolean;
  isRecenterLoading: boolean;
  mapRef: React.RefObject<MapComponentRef>;
  onLocationUpdate: (location: UserLocation) => void;
  onLocationClick: () => void;
  onLabToggle: (active: boolean) => void;
  onSearchExpanded: (expanded: boolean) => void;
}

export default function DesktopLayout({
  userLocation,
  isLabActive,
  showLocationButton,
  isRecenterLoading,
  mapRef,
  onLocationUpdate,
  onLocationClick,
  onLabToggle,
  onSearchExpanded,
}: DesktopLayoutProps) {
  const { user } = useAuth();

  // Set dark mode as default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div 
      className="desktop-app-container"
      style={{ 
        minHeight: '100vh', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        position: 'relative'
      }}
    >
      {/* Header Desktop - Layout horizontal */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          pointerEvents: 'none'
        }}
        className="desktop-header-container"
      >
        {/* Logo Desktop - Maior e mais espaçosa */}
        <div
          style={{
            backgroundColor: 'rgba(29, 29, 29, 0.4)',
            borderRadius: '999px',
            height: '68px',
            minWidth: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            overflow: 'hidden'
          }}
          className="desktop-header-logo-container"
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

        {/* Botão de Alertas Desktop - apenas para usuários logados */}
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Link
              to="/alerts"
              style={{
                backgroundColor: 'rgba(29, 29, 29, 0.4)',
                borderRadius: '999px',
                height: '48px',
                width: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                pointerEvents: 'auto',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                color: 'white'
              }}
              className="desktop-header-alerts-button hover:bg-slate-700/50"
              title="Meus Alertas"
            >
              <Bell className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>

      {/* Mapa Desktop - Ocupa a maior parte da tela */}
      <div 
        className="desktop-map-container"
        style={{
          flex: 1,
          height: '100vh',
          width: 'auto',
          position: 'relative',
          overflow: 'hidden',
          minWidth: '60%'
        }}
      >
        <MapComponent 
          ref={mapRef}
          onLocationUpdate={onLocationUpdate}
        />
        
        {/* Controles do Mapa Desktop - Sempre visíveis */}
        <MapControls
          onLocationClick={onLocationClick}
          onLabToggle={onLabToggle}
          isLabActive={isLabActive}
          showLocationButton={showLocationButton}
          isRecenterLoading={isRecenterLoading}
        />
      </div>

      {/* Sidebar Desktop - Largura fixa à direita */}
      <div 
        className="desktop-sidebar-container"
        style={{
          width: '400px',
          height: '100vh',
          backgroundColor: '#01081A',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <BottomSection 
          userLocation={userLocation || undefined} 
          isLabActive={isLabActive} 
          mapRef={mapRef}
          onSearchExpanded={onSearchExpanded}
        />
      </div>
    </div>
  );
}
