import React, { useState, useEffect } from 'react'
import SearchInput from './SearchInput'
import Carousel from './Carousel'
import NeighborhoodCard from './NeighborhoodCard'
import { useLocationData } from '../hooks/useLocationData'

interface BottomSectionProps {
  cityName?: string
  userLocation?: {
    latitude: number
    longitude: number
    accuracy?: number
  }
  isLabActive?: boolean
}

export default function BottomSection({ cityName = "Uberlândia", userLocation, isLabActive = false }: BottomSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [zoomValue, setZoomValue] = useState(16);
  const [isDragging1, setIsDragging1] = useState(false);
  const [isDragging2, setIsDragging2] = useState(false);
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Buscando por:', query);
    // Aqui você pode implementar a lógica de busca
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
        key={neighborhood.name}
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
  const labContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      }}
    >
      <div
        style={{
          fontSize: '24px',
          fontWeight: '600',
          color: 'white',
          textAlign: 'center',
          fontFamily: 'Poppins, ui-sans-serif, sans-serif'
        }}
      >
        Lab Mode Ativado
      </div>
      
      {/* Sliders simples */}
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Slider 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ 
            color: 'white', 
            fontSize: '14px', 
            fontWeight: '500',
            fontFamily: 'Poppins, ui-sans-serif, sans-serif'
          }}>
            Configuração 1
          </label>
        <CustomSlider 
          value={slider1Value}
          onChange={setSlider1Value}
          min={0}
          max={100}
          showTooltip={showTooltip1}
          onValueChange={handleSlider1Change}
          isDragging={isDragging1}
          setIsDragging={setIsDragging1}
        />
        </div>

        {/* Slider 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ 
            color: 'white', 
            fontSize: '14px', 
            fontWeight: '500',
            fontFamily: 'Poppins, ui-sans-serif, sans-serif'
          }}>
            Configuração 2
          </label>
        <CustomSlider 
          value={slider2Value}
          onChange={setSlider2Value}
          min={0}
          max={100}
          showTooltip={showTooltip2}
          onValueChange={handleSlider2Change}
          isDragging={isDragging2}
          setIsDragging={setIsDragging2}
        />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="bottom-section"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#01081A',
        position: 'relative',
        zIndex: 2,
        marginTop: '-30px',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: '32px 16px 40px 16px',
        fontFamily: 'Poppins, ui-sans-serif, sans-serif, system-ui',
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
            maxWidth: '400px', 
            margin: '0 auto 0px auto' 
          }}>
            <SearchInput
              placeholder="Buscar local"
              onSearch={handleSearch}
            />
          </div>

          {/* Carrossel de bairros */}
          <Carousel 
            items={carouselItems}
          />
        </div>
      )}
    </div>
  )
}
