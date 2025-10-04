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
}

export default function BottomSection({ cityName = "Uberlândia", userLocation }: BottomSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
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
          margin: '0 auto 24px auto' 
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
    </div>
  )
}
