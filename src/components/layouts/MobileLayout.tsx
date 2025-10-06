import React, { useEffect, useState, useRef } from 'react';
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

interface MobileLayoutProps {
  userLocation: UserLocation | null;
  isLabActive: boolean;
  showLocationButton: boolean;
  isRecenterLoading: boolean;
  isSearchExpanded: boolean;
  mapRef: React.RefObject<MapComponentRef>;
  onLocationUpdate: (location: UserLocation) => void;
  onLocationClick: () => void;
  onLabToggle: (active: boolean) => void;
  onSearchExpanded: (expanded: boolean) => void;
}

export default function MobileLayout({
  userLocation,
  isLabActive,
  showLocationButton,
  isRecenterLoading,
  isSearchExpanded,
  mapRef,
  onLocationUpdate,
  onLocationClick,
  onLabToggle,
  onSearchExpanded,
}: MobileLayoutProps) {
  const { user } = useAuth();

  // Set dark mode as default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div 
      className="mobile-app-container"
      style={{ 
        minHeight: '100vh', 
        overflow: 'hidden',
        touchAction: 'manipulation',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Header Mobile - Layout vertical */}
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
        className="mobile-header-container"
      >
        {/* Logo Mobile - Menor e mais compacta */}
        <div
          style={{
            backgroundColor: 'rgba(29, 29, 29, 0.4)',
            borderRadius: '999px',
            height: '48px',
            minWidth: '140px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 16px',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            overflow: 'hidden'
          }}
          className="mobile-header-logo-container"
        >
          <img 
            src="/logo urbmind.svg" 
            alt="UrbMind Logo"
            style={{
              height: '16px',
              width: 'auto',
              display: 'block'
            }}
            onError={(e) => {
              console.error('Erro ao carregar logo:', e);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Botão de Alertas Mobile - apenas para usuários logados */}
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
                height: '40px',
                width: '40px',
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
              className="mobile-header-alerts-button hover:bg-slate-700/50"
              title="Meus Alertas"
            >
              <Bell className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Mapa Mobile - Altura dinâmica baseada na busca */}
      <div 
        className="mobile-map-container"
        style={{
          height: isSearchExpanded ? '0' : '60vh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          transition: 'height 0.3s ease'
        }}
      >
        <MapComponent 
          ref={mapRef}
          onLocationUpdate={onLocationUpdate}
        />
        
        {/* Controles do Mapa Mobile - Ocultos quando busca está expandida */}
        {!isSearchExpanded && (
          <MapControls
            onLocationClick={onLocationClick}
            onLabToggle={onLabToggle}
            isLabActive={isLabActive}
            showLocationButton={showLocationButton}
            isRecenterLoading={isRecenterLoading}
          />
        )}
      </div>

      {/* Bottom Section Mobile - Ocupa toda a tela quando busca expandida */}
      <div 
        className="mobile-sidebar-container"
        style={{
          width: '100%',
          height: isSearchExpanded ? '100vh' : 'auto',
          backgroundColor: '#01081A',
          position: isSearchExpanded ? 'fixed' : 'relative',
          top: isSearchExpanded ? 0 : 'auto',
          left: isSearchExpanded ? 0 : 'auto',
          right: isSearchExpanded ? 0 : 'auto',
          zIndex: isSearchExpanded ? 50 : 'auto',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          marginTop: isSearchExpanded ? 0 : '-30px',
          borderTopLeftRadius: isSearchExpanded ? 0 : '16px',
          borderTopRightRadius: isSearchExpanded ? 0 : '16px'
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
