import React, { useEffect } from 'react'
import Carousel from './Carousel'
import weatherIcon from '../assets/weather-icon.png'
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
  const { neighborhoods, getCurrentNeighborhood, getRandomNeighborhood, updateLocation } = useLocationData();

  // Atualiza a localização quando recebe uma nova
  useEffect(() => {
    if (userLocation) {
      updateLocation(userLocation);
    }
  }, [userLocation, updateLocation]);

  // Dados de exemplo para o carrossel com bairros dinâmicos
  const carouselItems = [
    {
      id: 1,
      title: "12º",
      subtitle: "Severe storm",
      timeRange: "7:30 PM to 9:40 PM",
      image: weatherIcon,
      neighborhood: getCurrentNeighborhood(),
      onClick: () => console.log("Clicked on 12º")
    },
    {
      id: 2,
      title: "8º",
      subtitle: "Light rain",
      timeRange: "10:15 AM to 12:30 PM",
      image: weatherIcon,
      neighborhood: getRandomNeighborhood(),
      onClick: () => console.log("Clicked on 8º")
    },
    {
      id: 3,
      title: "15º",
      subtitle: "Heavy rain",
      timeRange: "2:45 PM to 4:20 PM",
      image: weatherIcon,
      neighborhood: getRandomNeighborhood(),
      onClick: () => console.log("Clicked on 15º")
    },
    {
      id: 4,
      title: "5º",
      subtitle: "Clear sky",
      timeRange: "6:00 PM to 8:15 PM",
      image: weatherIcon,
      neighborhood: getRandomNeighborhood(),
      onClick: () => console.log("Clicked on 5º")
    }
  ]

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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div
            style={{
              fontSize: '24px',
              lineHeight: '100%',
              fontWeight: '400 !important',
              color: 'white',
              margin: '0',
              fontFamily: 'Poppins, ui-sans-serif, sans-serif, system-ui',
              fontStyle: 'normal'
            }}
          >
            Hello, how are you?
          </div>
          
          <div
            style={{
              fontSize: '16px',
              lineHeight: '100%',
              fontWeight: '400 !important',
              color: '#F6F6F6',
              margin: '0',
              fontFamily: 'Poppins, ui-sans-serif, sans-serif, system-ui',
              fontStyle: 'normal'
            }}
          >
            you are in {cityName}
          </div>
        </div>

        {/* Carrossel de lugares próximos */}
        <Carousel 
          items={carouselItems}
        />
      </div>
    </div>
  )
}
