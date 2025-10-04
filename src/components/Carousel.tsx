import React, { useState, useRef, useEffect } from 'react'
import Card from './Card'

interface CarouselProps {
  items: Array<{
    id: string | number
    title: string
    subtitle: string
    timeRange?: string
    image?: string
    neighborhood?: string
    onClick?: () => void
  }>
}

export default function Carousel({ items }: CarouselProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [initialTranslate, setInitialTranslate] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const cardWidth = 240
  const gap = 16
  const cardTotalWidth = cardWidth + gap

  // Calcula o translate baseado no índice atual
  const getTranslateForIndex = (index: number) => {
    return -index * cardTotalWidth
  }

  // Calcula o índice baseado na posição
  const getIndexFromTranslate = (translate: number) => {
    return Math.round(-translate / cardTotalWidth)
  }

  // Limita o índice dentro dos bounds
  const clampIndex = (index: number) => {
    return Math.max(0, Math.min(index, items.length - 1))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX)
    setInitialTranslate(getTranslateForIndex(currentIndex))
    setDragOffset(0)
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grabbing'
      carouselRef.current.style.transition = 'none'
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const currentX = e.pageX
    const diffX = currentX - startX
    setDragOffset(diffX)
    
    const newTranslate = initialTranslate + diffX
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(${newTranslate}px)`
    }
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab'
      carouselRef.current.style.transition = 'transform 0.3s ease-out'
    }

    // Determina se deve mudar de slide baseado no drag
    const threshold = cardTotalWidth * 0.3 // 30% do card para trigger
    let newIndex = currentIndex

    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        // Drag para direita - slide anterior
        newIndex = Math.max(0, currentIndex - 1)
      } else {
        // Drag para esquerda - próximo slide
        newIndex = Math.min(items.length - 1, currentIndex + 1)
      }
    }

    setCurrentIndex(newIndex)
    setDragOffset(0)
    
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(${getTranslateForIndex(newIndex)}px)`
    }
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp()
    }
  }

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].pageX)
    setInitialTranslate(getTranslateForIndex(currentIndex))
    setDragOffset(0)
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'none'
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const currentX = e.touches[0].pageX
    const diffX = currentX - startX
    setDragOffset(diffX)
    
    const newTranslate = initialTranslate + diffX
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(${newTranslate}px)`
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'transform 0.3s ease-out'
    }

    // Determina se deve mudar de slide baseado no drag
    const threshold = cardTotalWidth * 0.3
    let newIndex = currentIndex

    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        newIndex = Math.max(0, currentIndex - 1)
      } else {
        newIndex = Math.min(items.length - 1, currentIndex + 1)
      }
    }

    setCurrentIndex(newIndex)
    setDragOffset(0)
    
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(${getTranslateForIndex(newIndex)}px)`
    }
  }

  return (
    <div
      className="carousel-container"
      style={{
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        ref={carouselRef}
        className="carousel-content"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          display: 'flex',
          gap: '16px',
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          cursor: 'grab',
          userSelect: 'none',
          transform: `translateX(${getTranslateForIndex(currentIndex) + (isDragging ? dragOffset : 0)}px)`
        }}
      >
        {items.map((item) => (
          <Card
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            timeRange={item.timeRange}
            image={item.image}
            neighborhood={item.neighborhood}
            onClick={item.onClick}
          />
        ))}
      </div>
    </div>
  )
}
