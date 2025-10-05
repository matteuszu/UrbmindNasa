import React, { useState, useEffect, useRef } from 'react'
import AddressSearch, { type AddressSearchRef } from './AddressSearch'
import Carousel from './Carousel'
import NeighborhoodCard from './NeighborhoodCard'
import LabForm from './LabForm'
import { useLocationData } from '../hooks/useLocationData'
import type { GeocodingResult } from '../services/geocodingService'
import type { MapComponentRef } from './MapComponent'
import { ArrowLeft, X } from 'lucide-react'

interface BottomSectionProps {
  cityName?: string
  userLocation?: {
    latitude: number
    longitude: number
    accuracy?: number
  }
  isLabActive?: boolean
  mapRef?: React.RefObject<MapComponentRef>
  onSearchExpanded?: (expanded: boolean) => void
}

export default function BottomSection({ cityName = "Uberlândia", userLocation, isLabActive = false, mapRef, onSearchExpanded }: BottomSectionProps) {
  // Debug: verificar se mapRef está sendo passado
  console.log('🔍 BottomSection - mapRef recebido:', mapRef);
  console.log('🔍 BottomSection - mapRef.current:', mapRef?.current);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [zoomValue, setZoomValue] = useState(16);
  const [isDragging1, setIsDragging1] = useState(false);
  const [isDragging2, setIsDragging2] = useState(false);
  
  // Estados para busca expansível
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  
  // Estados para alerta de alagamento
  const [showFloodAlertCard, setShowFloodAlertCard] = useState(false);
  const [floodAlertLocation, setFloodAlertLocation] = useState<string>('');
  
  // Referência para o AddressSearch
  const addressSearchRef = useRef<AddressSearchRef>(null);
  const { 
    neighborhoods, 
    cityNeighborhoods, 
    isLoading, 
    getCurrentNeighborhood, 
    getRandomNeighborhood, 
    updateLocation, 
    loadCityNeighborhoods 
  } = useLocationData();

  // Atualiza a localização quando recebe uma nova
  useEffect(() => {
    if (userLocation) {
      updateLocation(userLocation);
    }
  }, [userLocation, updateLocation]);

  // Carrega os bairros da cidade quando o componente monta
  useEffect(() => {
    loadCityNeighborhoods(cityName);
  }, [cityName, loadCityNeighborhoods]);

  // Debug: monitorar mudanças no mapRef
  useEffect(() => {
    console.log('🔍 BottomSection - mapRef mudou:', mapRef);
    console.log('🔍 BottomSection - mapRef.current mudou:', mapRef?.current);
  }, [mapRef]);

  // Debug: monitorar mudanças no isSearchExpanded
  useEffect(() => {
    console.log('🔍 BottomSection - isSearchExpanded mudou para:', isSearchExpanded);
  }, [isSearchExpanded]);

  // Reset do estado de busca quando o componente é montado e desmontado
  useEffect(() => {
    // Reset ao montar o componente
    setIsSearchExpanded(false);
    setSearchResults([]);
    setIsSearchLoading(false);
    setShowFloodAlertCard(false);
    setFloodAlertLocation('');
    
    return () => {
      // Reset ao desmontar o componente
      setIsSearchExpanded(false);
      setSearchResults([]);
      setIsSearchLoading(false);
      setShowFloodAlertCard(false);
      setFloodAlertLocation('');
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Buscando por:', query);
    
    // Se a busca for limpa, fecha o card de alerta
    if (!query.trim()) {
      setShowFloodAlertCard(false);
      setFloodAlertLocation('');
    }
  };


  // Função para remover alerta de alagamento
  const removeFloodAlert = () => {
    if (mapRef?.current) {
      console.log('🧪 Removendo alerta de alagamento...');
      mapRef.current.hideFloodAlert();
      
      // Esconde o card de alerta
      setShowFloodAlertCard(false);
      setFloodAlertLocation('');
    }
  };

  // Função para lidar com a seleção de endereços
  const handleAddressSelect = (result: GeocodingResult) => {
    console.log('🔴 BOTTOMSECTION: handleAddressSelect chamado!');
    console.log('🏠 Endereço selecionado na busca:', result.place_name);
    console.log('🔍 mapRef?.current existe?', !!mapRef?.current);
    
    // Navega para o endereço no mapa
    if (mapRef?.current) {
      console.log('🔴 Chamando mapRef.current.navigateToAddress...');
      try {
        mapRef.current.navigateToAddress(result);
        console.log('✅ navigateToAddress chamado com sucesso');
      } catch (error) {
        console.error('❌ Erro ao chamar navigateToAddress:', error);
        // Fallback: navega diretamente
        console.log('🔄 Usando fallback flyTo...');
        mapRef.current.flyTo({
          center: result.center,
          zoom: 16,
          pitch: 60,
          bearing: 0,
          duration: 1500,
          essential: true
        });
      }
    } else {
      console.error('❌ mapRef.current não está disponível!');
    }
    
    // Fecha a busca expansível IMEDIATAMENTE
    setIsSearchExpanded(false);
    setSearchResults([]);
    onSearchExpanded?.(false);
    
    // Mostra o card de alerta de alagamento APENAS para "Rua da conquista"
    const isRuaDaConquista = result.place_name.toLowerCase().includes('rua da conquista');
    if (isRuaDaConquista) {
      console.log('🚨 Mostrando card de alerta para Rua da conquista (teste mockado)');
      setShowFloodAlertCard(true);
      setFloodAlertLocation(result.place_name);
    } else {
      console.log('ℹ️ Endereço normal - não mostrando card de alerta');
      // FORÇA o fechamento do card para qualquer outro endereço
      setShowFloodAlertCard(false);
      setFloodAlertLocation('');
    }
    
    // FORÇA O FECHAMENTO AGRESSIVO DO TECLADO
    const forceCloseKeyboard = () => {
      // Estratégia 1: Limpa o input de busca
      addressSearchRef.current?.clearSearch();
      
      // Estratégia 2: Blur de qualquer elemento ativo
      if (document.activeElement && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      
      // Estratégia 3: Remover foco de todos os inputs
      const allInputs = document.querySelectorAll('input, textarea, [contenteditable]');
      allInputs.forEach(input => {
        if (input instanceof HTMLElement) {
          input.blur();
        }
      });
      
      // Estratégia 4: Forçar blur em intervalos
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
      
      // Estratégia 5: Simular clique fora da tela
      const body = document.body;
      if (body) {
        body.click();
      }
      
      // Estratégia 6: Forçar scroll para remover foco
      window.scrollTo(0, 0);
    };
    
    forceCloseKeyboard();
    
    // Atualiza o estado da busca
    setSearchQuery(result.place_name);
  };

  // Função para lidar com navegação direta do mapa (chamada pelo AddressSearch)
  const handleMapNavigate = (coordinates: [number, number], zoom?: number) => {
    console.log('🗺️ Navegação direta para:', coordinates, 'zoom:', zoom);
    console.log('🔍 mapRef para navegação direta:', mapRef);
    console.log('🔍 mapRef.current para navegação direta:', mapRef?.current);
    
    if (mapRef?.current) {
      try {
        // Usa a função flyTo diretamente do mapa
        mapRef.current.flyTo({
          center: coordinates,
          zoom: zoom || 16,
          pitch: 60,
          bearing: 0,
          duration: 1500,
          essential: true
        });
        console.log('✅ flyTo chamado com sucesso');
      } catch (error) {
        console.error('❌ Erro ao chamar flyTo:', error);
      }
    } else {
      console.error('❌ mapRef.current não está disponível para navegação direta');
    }
  };

  // Função para expandir a busca
  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
    onSearchExpanded?.(true);
  };

  // Função para fechar a busca expansível
  const handleSearchBlur = () => {
    // Delay para permitir cliques nos resultados
    setTimeout(() => {
      // Só fecha se não há resultados
      if (searchResults.length === 0) {
        setIsSearchExpanded(false);
        setSearchResults([]);
        onSearchExpanded?.(false);
        // Limpa o input e fecha o teclado
        addressSearchRef.current?.clearSearch();
      }
    }, 300);
  };

  // Função para buscar endereços (chamada pelo AddressSearch)
  const handleSearchResults = (results: GeocodingResult[]) => {
    setSearchResults(results);
  };

  // Função para atualizar o loading da busca
  const handleSearchLoading = (loading: boolean) => {
    setIsSearchLoading(loading);
  };

  // Componente para lista de endereços
  const AddressList = () => {
    if (isSearchLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 20px',
          color: '#9CA3AF',
          fontSize: '16px',
          fontFamily: 'Poppins, ui-sans-serif, sans-serif',
        }}>
          <div style={{ marginRight: '12px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #374151',
              borderTop: '2px solid #3B82F6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
          </div>
          Buscando endereços...
        </div>
      );
    }

    if (searchResults.length === 0) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 20px',
          color: '#9CA3AF',
          fontSize: '16px',
          fontFamily: 'Poppins, ui-sans-serif, sans-serif',
          textAlign: 'center',
        }}>
          Digite para buscar endereços
        </div>
      );
    }

    return (
      <div style={{
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px 0',
        maxHeight: '60vh',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 10,
      }}>
        {searchResults.map((result, index) => {
          const { place_name, context = [] } = result;
          const city = context.find(c => c.id.includes('place'))?.text || '';
          const state = context.find(c => c.id.includes('region'))?.text || '';
          const title = place_name.split(',')[0] || place_name;
          const subtitle = [city, state].filter(Boolean).join(', ');

          return (
            <button
              key={result.id}
              onMouseDown={(e) => {
                e.preventDefault(); // Previne o blur do input
                e.stopPropagation(); // Previne que o overlay feche a busca
              }}
              onClick={() => handleAddressSelect(result)}
              style={{
                width: '100%',
                padding: '16px 18px',
                textAlign: 'left',
                backgroundColor: 'transparent',
                border: '1px solid #374151',
                borderRadius: '12px',
                marginBottom: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#374151';
                e.currentTarget.style.borderColor = '#4B5563';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#374151';
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                color: '#3B82F6',
                marginTop: '2px',
                flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '500',
                  fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {title}
                </div>
                {subtitle && (
                  <div style={{
                    color: '#9CA3AF',
                    fontSize: '14px',
                    fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {subtitle}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  // Componente de slider customizado
  const CustomSlider = ({ value, onChange, min = 0, max = 100, step = 1, showTooltip, onValueChange, isDragging, setIsDragging }: {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    showTooltip: boolean;
    onValueChange: () => void;
    isDragging: boolean;
    setIsDragging: (value: boolean) => void;
  }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const sliderRef = React.useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      const rect = sliderRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newValue = Math.round((x / rect.width) * (max - min) + min);
      const clampedValue = Math.max(min, Math.min(max, newValue));
      onChange(clampedValue);
      onValueChange();
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newValue = Math.round((x / rect.width) * (max - min) + min);
      const clampedValue = Math.max(min, Math.min(max, newValue));
      onChange(clampedValue);
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    React.useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleGlobalMouseMove);
        document.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
          document.removeEventListener('mousemove', handleGlobalMouseMove);
          document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
      }
    }, [isDragging]);

    return (
      <div
        ref={sliderRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Track de fundo */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '2px',
            transform: 'translateY(-50%)'
          }}
        />
        
        {/* Track preenchido */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            width: `${percentage}%`,
            height: '4px',
            backgroundColor: 'white',
            borderRadius: '2px',
            transform: 'translateY(-50%)',
            transition: isDragging ? 'none' : 'width 0.2s ease'
          }}
        />
        
        {/* Thumb */}
        <div
          style={{
            position: 'absolute',
            left: `${percentage}%`,
            top: '50%',
            width: '20px',
            height: '20px',
            backgroundColor: 'white',
            border: '2px solid white',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: 'grab',
            transition: isDragging ? 'none' : 'left 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}
        />
        
        {/* Tooltip temporário */}
        {showTooltip && (
          <div
            style={{
              position: 'absolute',
              left: `${percentage}%`,
              bottom: '30px',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(13, 13, 13, 0.9)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              fontFamily: 'Poppins, ui-sans-serif, sans-serif',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              pointerEvents: 'none',
              opacity: 1,
              transition: 'opacity 0.3s ease'
            }}
          >
            {value}
            {/* Seta do tooltip */}
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '4px solid rgba(13, 13, 13, 0.9)'
              }}
            />
          </div>
        )}
      </div>
    );
  };

  // Cria cards para cada bairro da cidade
  const neighborhoodCards = cityNeighborhoods.map((neighborhood, index) => ({
    id: `neighborhood-${index}`,
    component: (
      <NeighborhoodCard
        neighborhood={neighborhood}
        onClick={() => console.log(`Clicked on ${neighborhood.name}`)}
        isActive={index === 0}
      />
    )
  }));

  // Se não há bairros carregados, mostra cards de exemplo
  const fallbackCards = [
    {
      id: 'fallback-1',
      component: (
        <NeighborhoodCard
          neighborhood={{
            name: 'Centro',
            distance: 0,
            coordinates: [0, 0]
          }}
          onClick={() => console.log("Clicked on Centro")}
          isActive={true}
        />
      )
    },
    {
      id: 'fallback-2',
      component: (
        <NeighborhoodCard
          neighborhood={{
            name: 'Jardim das Américas',
            distance: 0,
            coordinates: [0, 0]
          }}
          onClick={() => console.log("Clicked on Jardim das Américas")}
        />
      )
    },
    {
      id: 'fallback-3',
      component: (
        <NeighborhoodCard
          neighborhood={{
            name: 'Santa Mônica',
            distance: 0,
            coordinates: [0, 0]
          }}
          onClick={() => console.log("Clicked on Santa Mônica")}
        />
      )
    }
  ];

  const carouselItems = neighborhoodCards.length > 0 ? neighborhoodCards : fallbackCards;

  // Sliders do Lab
  const [slider1Value, setSlider1Value] = useState(20);
  const [slider2Value, setSlider2Value] = useState(100);
  const [showTooltip1, setShowTooltip1] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);

  // Funções para controlar tooltip temporário
  const handleSlider1Change = () => {
    setShowTooltip1(true);
    setTimeout(() => setShowTooltip1(false), 2000);
  };

  const handleSlider2Change = () => {
    setShowTooltip2(true);
    setTimeout(() => setShowTooltip2(false), 2000);
  };

  // Conteúdo do Lab quando ativado
  const labContent = <LabForm userLocation={userLocation} mapRef={mapRef} />;

  return (
    <div
        className="bottom-section"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#01081A',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          padding: '24px',
          fontFamily: 'Poppins, ui-sans-serif, sans-serif, system-ui',
          overflowY: 'auto',
          overflowX: 'hidden',
          flexShrink: 0
        }}
      >
      {isLabActive ? (
        labContent
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            width: '100%'
          }}
        >
          {/* Input de busca */}
          <div style={{ 
            width: '100%', 
            marginBottom: '24px'
          }}>
            <AddressSearch
              ref={addressSearchRef}
              placeholder="Buscar local"
              onLocationSelect={handleAddressSelect}
              onMapNavigate={handleMapNavigate}
              onSearchResults={handleSearchResults}
              onSearchLoading={handleSearchLoading}
              onSearchFocus={handleSearchFocus}
              onSearchBlur={handleSearchBlur}
              userLocation={userLocation ? [userLocation.longitude, userLocation.latitude] : undefined}
              className="w-full"
            />
          </div>

          {/* Carrossel de bairros ou Lista de endereços */}
          {isSearchExpanded ? (
            <AddressList />
          ) : (
            <Carousel 
              items={carouselItems}
            />
          )}

          {/* Card de Alerta de Alagamento */}
          {showFloodAlertCard && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444',
                  fontSize: '16px'
                }}>
                  ⚠️
                </div>
                <h3 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  fontFamily: 'Poppins, ui-sans-serif, sans-serif'
                }}>
                  ▲ Alerta de Alagamento (Teste)
                </h3>
              </div>
              
              <div style={{
                marginBottom: '16px'
              }}>
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '14px',
                  color: '#d1d5db',
                  lineHeight: '1.5',
                  fontFamily: 'Poppins, ui-sans-serif, sans-serif'
                }}>
                  <strong style={{ color: 'white' }}>Local:</strong> {floodAlertLocation}
                </p>
                
                <p style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  color: '#d1d5db',
                  lineHeight: '1.5',
                  fontFamily: 'Poppins, ui-sans-serif, sans-serif'
                }}>
                  <strong style={{ color: 'white' }}>Área de Risco:</strong> 1 km ao redor deste ponto
                </p>
              </div>
              
              <div style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '13px',
                  color: '#d1d5db',
                  fontWeight: '500',
                  fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                  lineHeight: '1.4'
                }}>
                  ✓ <strong style={{ color: '#22c55e' }}>Teste Mockado:</strong> Este é um teste da funcionalidade de alerta de alagamento. 
                  Em produção, esta área seria marcada com base em dados reais de risco.
                </p>
              </div>
              
              <button
                onClick={removeFloodAlert}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                }}
              >
                Entendi - Fechar Alerta
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
