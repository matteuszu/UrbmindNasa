import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MapComponent, { MapComponentRef } from './MapComponent';
import BottomSection from './BottomSection';
import MapControls from './MapControls';
import { Book, User, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

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
  const navigate = useNavigate();

  // Set dark mode as default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

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


  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div 
      className="app-container"
      style={{ 
        minHeight: '100vh', 
        overflow: 'auto',
        touchAction: 'manipulation',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Header dividido em duas seções: Logo à esquerda e Ícones à direita */}
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
        className="header-container"
      >
        {/* Seção da Logo - Esquerda */}
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
          className="header-logo-container"
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

        {/* Seção dos Ícones - Direita */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}
        >
          {/* Botão de Documentação */}
          <Link
            to="/docs"
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
            className="header-docs-button hover:bg-slate-700/50"
            title="Abrir Documentação"
          >
            <Book className="h-5 w-5" />
          </Link>

          {/* Botão de Alertas - apenas para usuários logados */}
          {user && (
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
              className="header-alerts-button hover:bg-slate-700/50"
              title="Meus Alertas"
            >
              <Bell className="h-5 w-5" />
            </Link>
          )}

          {/* Botão de Login/Usuário */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => navigate('/settings')}
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
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                }}
                className="header-user-button hover:bg-slate-700/50"
                title={`Olá, ${user.name}`}
              >
                {getUserInitial(user.name)}
              </button>

            </div>
          ) : (
            <Link
              to="/login"
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
              className="header-login-button hover:bg-slate-700/50"
              title="Fazer Login"
            >
              <User className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>

      <div 
        className={`map-container ${isSearchExpanded ? 'map-hidden' : 'map-visible'}`}
        style={{
          height: isSearchExpanded ? '0' : '60vh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          transition: 'height 0.3s ease',
          minHeight: isSearchExpanded ? '0' : '60vh',
          maxHeight: isSearchExpanded ? '0' : '60vh'
        }}
      >
        <MapComponent 
          ref={mapRef}
          onLocationUpdate={handleLocationUpdate}
        />
        
        {/* Controles do Mapa - só mostra quando busca não está expandida */}
        {!isSearchExpanded && (
          <MapControls
            onLocationClick={handleLocationClick}
            onLabToggle={handleLabToggle}
            isLabActive={isLabActive}
            showLocationButton={showLocationButton}
            isRecenterLoading={isRecenterLoading}
          />
        )}
      </div>
      <div 
        className="bottom-section-container"
        style={{
          flex: isSearchExpanded ? 1 : 1,
          height: isSearchExpanded ? '100vh' : 'auto',
          position: isSearchExpanded ? 'fixed' : 'relative',
          top: isSearchExpanded ? 0 : 'auto',
          left: isSearchExpanded ? 0 : 'auto',
          right: isSearchExpanded ? 0 : 'auto',
          zIndex: isSearchExpanded ? 50 : 'auto',
          backgroundColor: isSearchExpanded ? '#01081a' : 'transparent',
        }}
      >
        <BottomSection 
          userLocation={userLocation} 
          isLabActive={isLabActive} 
          mapRef={mapRef}
          onSearchExpanded={handleSearchExpanded}
        />
      </div>
    </div>
  );
}
