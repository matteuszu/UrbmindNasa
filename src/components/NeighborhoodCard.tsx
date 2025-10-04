import React from 'react';
import { Neighborhood } from '../services/mapboxService';

interface NeighborhoodCardProps {
  neighborhood: Neighborhood;
  onClick?: () => void;
  isActive?: boolean;
}

export default function NeighborhoodCard({ 
  neighborhood, 
  onClick, 
  isActive = false 
}: NeighborhoodCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        minWidth: '200px',
        height: '120px',
        backgroundColor: isActive ? '#1E3A8A' : '#1F2937',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: isActive ? '2px solid #3B82F6' : '2px solid transparent',
        boxShadow: isActive 
          ? '0 8px 25px rgba(59, 130, 246, 0.3)' 
          : '0 4px 12px rgba(0, 0, 0, 0.15)',
        transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = '#374151';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = '#1F2937';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {/* Header com ícone de localização */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '24px',
            height: '24px',
            backgroundColor: isActive ? '#3B82F6' : '#6B7280',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: 'white',
          }}
        >
          📍
        </div>
        <span
          style={{
            fontSize: '12px',
            color: isActive ? '#93C5FD' : '#9CA3AF',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Bairro
        </span>
      </div>

      {/* Nome do bairro */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'white',
            margin: 0,
            lineHeight: '1.3',
            fontFamily: 'Poppins, ui-sans-serif, sans-serif',
          }}
        >
          {neighborhood.name.split(',')[0]}
        </h3>
      </div>

      {/* Footer com informações adicionais */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '11px',
            color: isActive ? '#93C5FD' : '#9CA3AF',
            fontFamily: 'Poppins, ui-sans-serif, sans-serif',
          }}
        >
          {neighborhood.distance > 0 
            ? `${neighborhood.distance.toFixed(1)} km` 
            : 'Cidade'
          }
        </span>
        
        <div
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: isActive ? '#10B981' : '#6B7280',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}
