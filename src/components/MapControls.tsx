import React from 'react'

interface MapControlsProps {
  onLocationClick: () => void
  onLabToggle: (isActive: boolean) => void
  isLabActive?: boolean
  showLocationButton?: boolean
  isRecenterLoading?: boolean
}

export default function MapControls({ 
  onLocationClick, 
  onLabToggle, 
  isLabActive = false,
  showLocationButton = true,
  isRecenterLoading = false
}: MapControlsProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '40px', // 40px de distância da bottom section (32px + 8px)
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px',
        zIndex: 10000, // Z-index alto para ficar visível sobre o mapa
        pointerEvents: 'none' // Permite cliques nos botões mas não interfere com o mapa
      }}
    >
      {/* Botão de Localização */}
      {showLocationButton && (
        <button
          onClick={onLocationClick}
          disabled={isRecenterLoading}
          style={{
            backgroundColor: isRecenterLoading ? 'rgba(13, 82, 255, 0.9)' : '#01081A',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isRecenterLoading ? 'wait' : 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.3s ease',
            pointerEvents: 'auto',
            opacity: isRecenterLoading ? 0.8 : 0.95
          }}
          onMouseEnter={(e) => {
            if (!isRecenterLoading) {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.backgroundColor = '#01081A'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.5)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isRecenterLoading) {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.backgroundColor = '#01081A'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)'
            }
          }}
        >
          {isRecenterLoading ? (
            <div
              style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}
            />
          ) : (
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM20.94 11C20.48 6.83 17.17 3.52 13 3.06V1H11V3.06C6.83 3.52 3.52 6.83 3.06 11H1V13H3.06C3.52 17.17 6.83 20.48 11 20.94V23H13V20.94C17.17 20.48 20.48 17.17 20.94 13H23V11H20.94ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z" 
                fill="white"
              />
            </svg>
          )}
        </button>
      )}

      {/* Switch Lab */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'auto',
          backgroundColor: '#01081A',
          padding: '8px 12px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          opacity: 0.95
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'Poppins, ui-sans-serif, sans-serif'
          }}
        >
          Lab
        </span>
        <button
          onClick={() => onLabToggle(!isLabActive)}
          style={{
            backgroundColor: isLabActive ? '#0D52FF' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '20px',
            width: '40px',
            height: '24px',
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            padding: '0'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
            if (isLabActive) {
              e.currentTarget.style.backgroundColor = '#0D52FF'
            } else {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            if (isLabActive) {
              e.currentTarget.style.backgroundColor = '#0D52FF'
            } else {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '2px',
              left: isLabActive ? '18px' : '2px',
              width: '18px',
              height: '18px',
              backgroundColor: 'white',
              borderRadius: '50%',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          />
        </button>
      </div>
    </div>
  )
}
