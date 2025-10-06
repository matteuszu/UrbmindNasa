import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDevice } from '../hooks/useDevice';
import { MobileLayout, DesktopLayout } from './layouts';
import MapComponent, { MapComponentRef } from './MapComponent';

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export default function HomePage() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLabActive, setIsLabActive] = useState(false);
  const [showLocationButton, setShowLocationButton] = useState(true);
  const [isRecenterLoading, setIsRecenterLoading] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const mapRef = useRef<MapComponentRef>(null);
  const { user } = useAuth();
  const device = useDevice();

  // Set dark mode as default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // O hook useDevice já gerencia as mudanças de tamanho da tela

  // Reset do estado de busca quando o componente é montado e desmontado
  useEffect(() => {
    // Reset ao montar o componente
    setIsSearchExpanded(false);
    
    return () => {
      // Reset ao desmontar o componente
      setIsSearchExpanded(false);
    }
  }, []);

  // Debug: monitorar mudanças no isSearchExpanded
  useEffect(() => {
    console.log('🔍 HomePage - isSearchExpanded mudou para:', isSearchExpanded);
    console.log('🔍 HomePage - Altura do mapa será:', isSearchExpanded ? '0' : '60vh');
  }, [isSearchExpanded]);


  const handleLocationUpdate = (location: UserLocation) => {
    setUserLocation(location);
  };

  // Função para fechar o teclado quando a busca é fechada
  const handleSearchExpanded = (expanded: boolean) => {
    console.log('🔍 HomePage - handleSearchExpanded chamado com:', expanded);
    console.log('🔍 HomePage - isSearchExpanded atual:', isSearchExpanded);
    setIsSearchExpanded(expanded);
    console.log('🔍 HomePage - isSearchExpanded após setState:', expanded);
    
    if (!expanded) {
      // FORÇA O FECHAMENTO AGRESSIVO DO TECLADO
      const forceCloseKeyboard = () => {
        // Estratégia 1: Blur de qualquer elemento ativo
        if (document.activeElement && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        
        // Estratégia 2: Remover foco de todos os inputs
        const allInputs = document.querySelectorAll('input, textarea, [contenteditable]');
        allInputs.forEach(input => {
          if (input instanceof HTMLElement) {
            input.blur();
          }
        });
        
        // Estratégia 3: Forçar blur em intervalos
        setTimeout(() => {
          if (document.activeElement && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }, 50);
        
        setTimeout(() => {
          if (document.activeElement && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }, 100);
        
        setTimeout(() => {
          if (document.activeElement && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }, 200);
        
        // Estratégia 4: Simular clique fora da tela
        const body = document.body;
        if (body) {
          body.click();
        }
        
        // Estratégia 5: Forçar scroll para remover foco
        window.scrollTo(0, 0);
      };
      
      // Executa imediatamente e com delay
      forceCloseKeyboard();
      setTimeout(forceCloseKeyboard, 100);
      setTimeout(forceCloseKeyboard, 300);
    }
  };

  const handleLocationClick = () => {
    // Esta função será chamada quando o usuário clicar no botão de localização
    console.log('Botão de localização clicado - recentralizar mapa');
    setIsRecenterLoading(true);
    
    // Chama a função de recentralização usando a referência
    if (mapRef.current) {
      mapRef.current.recenterToUserLocation();
    }
    
    // Remove o loading após 2 segundos
    setTimeout(() => {
      setIsRecenterLoading(false);
    }, 2000);
  };

  const handleLabToggle = (active: boolean) => {
    setIsLabActive(active);
    console.log('Lab toggle:', active ? 'ativado' : 'desativado');
    // Aqui você pode implementar a lógica para mudar o conteúdo da bottom section
  };


  // Renderizar layout baseado no dispositivo
  if (device.isMobile) {
    return (
      <MobileLayout
        userLocation={userLocation}
        isLabActive={isLabActive}
        showLocationButton={showLocationButton}
        isRecenterLoading={isRecenterLoading}
        isSearchExpanded={isSearchExpanded}
        mapRef={mapRef}
        onLocationUpdate={handleLocationUpdate}
        onLocationClick={handleLocationClick}
        onLabToggle={handleLabToggle}
        onSearchExpanded={handleSearchExpanded}
      />
    );
  }

  return (
    <DesktopLayout
      userLocation={userLocation}
      isLabActive={isLabActive}
      showLocationButton={showLocationButton}
      isRecenterLoading={isRecenterLoading}
      mapRef={mapRef}
      onLocationUpdate={handleLocationUpdate}
      onLocationClick={handleLocationClick}
      onLabToggle={handleLabToggle}
      onSearchExpanded={handleSearchExpanded}
    />
  );
}
