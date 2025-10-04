import React from 'react'

interface CardProps {
  title?: string
  subtitle?: string
  timeRange?: string
  image?: string
  neighborhood?: string
  onClick?: () => void
  className?: string
}

export default function Card({ 
  title = "12º", 
  subtitle = "Severe storm", 
  timeRange = "7:30 PM to 9:40 PM",
  image,
  neighborhood = "Bairro do usuario",
  onClick,
  className = ""
}: CardProps) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        width: '240px',
        height: '206px',
        backgroundColor: '#1A1F2E',
        background: 'linear-gradient(135deg, #151C2C 0%, #070E20 100%)',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        flexShrink: 0,
        fontFamily: 'Poppins, ui-sans-serif, sans-serif, system-ui'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)'
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {/* Main container with space-between */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%'
        }}
      >
        {/* Top section with icon and time */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* Icon - 48px x 48px, left aligned */}
          <div
            style={{
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              overflow: 'hidden'
            }}
          >
            {image ? (
              <img
                src={image}
                alt={title}
                style={{
                  width: '48px',
                  height: '48px',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <div
                style={{
                  color: '#6B7280',
                  fontSize: '12px',
                  textAlign: 'center'
                }}
              >
                No Image
              </div>
            )}
          </div>

          {/* Temperature - centered with icon */}
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#FFFFFF',
              margin: '0',
              lineHeight: '100%',
              fontFamily: 'Poppins, ui-sans-serif, sans-serif, system-ui',
              textAlign: 'right'
            }}
          >
            {title}
          </h3>
        </div>

        {/* Content section - grouped with 10px spacing */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
        {/* Location/Subtitle */}
        <p
          style={{
            fontSize: '16px',
            fontWeight: '400',
            color: '#FFFFFF',
            margin: '0',
            lineHeight: '100%',
            fontFamily: 'Poppins, ui-sans-serif, sans-serif, system-ui'
          }}
        >
          {neighborhood}
        </p>
        
        {/* Weather condition */}
        <h3
          style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#FFFFFF',
            margin: '0',
            lineHeight: '100%',
            fontFamily: 'Poppins, ui-sans-serif, sans-serif, system-ui'
          }}
        >
          {subtitle}
        </h3>

        {/* Time range */}
        <p
          style={{
            fontSize: '14px',
            fontWeight: '400',
            color: '#FFFFFF',
            margin: '0',
            lineHeight: '100%',
            fontFamily: 'Poppins, ui-sans-serif, sans-serif, system-ui'
          }}
        >
          {timeRange}
        </p>
        </div>
      </div>
    </div>
  )
}
