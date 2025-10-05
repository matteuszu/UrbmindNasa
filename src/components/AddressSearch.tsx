import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
import { Search, MapPin, Loader2, X } from 'lucide-react'
import { geocodingService, type GeocodingResult } from '../services/geocodingService'
import { useMapViewportFix } from '../hooks/useMapViewportFix'

interface AddressSearchProps {
  onLocationSelect?: (result: GeocodingResult) => void;
  onMapNavigate?: (coordinates: [number, number], zoom?: number) => void;
  onSearchResults?: (results: GeocodingResult[]) => void;
  onSearchLoading?: (loading: boolean) => void;
  onSearchFocus?: () => void;
  onSearchBlur?: () => void;
  onClearSearch?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  userLocation?: [number, number]; // Para busca por proximidade
}

export interface AddressSearchRef {
  clearSearch: () => void;
}

export const AddressSearch = forwardRef<AddressSearchRef, AddressSearchProps>(({
  onLocationSelect,
  onMapNavigate,
  onSearchResults,
  onSearchLoading,
  onSearchFocus,
  onSearchBlur,
  onClearSearch,
  placeholder = "Buscar local",
  className = "",
  disabled = false,
  userLocation
}, ref) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [error, setError] = useState<string | null>(null)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Função agressiva para fechar o teclado
  const forceCloseKeyboard = () => {
    // Estratégia 1: Blur do input principal
    if (inputRef.current) {
      inputRef.current.blur()
    }
    
    // Estratégia 2: Blur de qualquer elemento ativo
    if (document.activeElement && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    
    // Estratégia 3: Remover foco de todos os inputs
    const allInputs = document.querySelectorAll('input, textarea, [contenteditable]')
    allInputs.forEach(input => {
      if (input instanceof HTMLElement) {
        input.blur()
      }
    })
    
    // Estratégia 4: Forçar blur em intervalos
    setTimeout(() => {
      if (document.activeElement && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    }, 50)
    
    setTimeout(() => {
      if (document.activeElement && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    }, 100)
    
    setTimeout(() => {
      if (document.activeElement && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    }, 200)
    
    // Estratégia 5: Simular clique fora da tela
    const body = document.body
    if (body) {
      body.click()
    }
  }

  // Debounce para evitar muitas requisições
  const debouncedSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    onSearchLoading?.(true)

    try {
      const searchResults = await geocodingService.searchAddresses(searchQuery, {
        limit: 8,
        proximity: userLocation,
        types: ['address', 'poi', 'place', 'locality', 'neighborhood']
      })

      setResults(searchResults)
      setSelectedIndex(-1)
      
      // Notifica o componente pai sobre os resultados
      onSearchResults?.(searchResults)
    } catch (err) {
      console.error('Erro na busca:', err)
      setError(err instanceof Error ? err.message : 'Erro ao buscar endereços')
      setResults([])
      onSearchResults?.([])
    } finally {
      setIsLoading(false)
      onSearchLoading?.(false)
    }
  }, [userLocation])

  // Função de busca com debounce
  const handleSearch = useCallback((searchQuery: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      debouncedSearch(searchQuery)
    }, 300) // 300ms de delay
  }, [debouncedSearch])

  // Manipula mudanças no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(true)
    
    if (value.trim()) {
      handleSearch(value)
    } else {
      setResults([])
      setIsLoading(false)
      onSearchResults?.([])
      onSearchLoading?.(false)
    }
  }

  // Manipula seleção de resultado
  const handleResultSelect = (result: GeocodingResult) => {
    setQuery(result.place_name)
    setResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
    
    // FORÇA O FECHAMENTO DO TECLADO IMEDIATAMENTE
    forceCloseKeyboard()
    
    // Chama callbacks - prioriza onLocationSelect se disponível
    if (onLocationSelect) {
      onLocationSelect(result)
    } else if (onMapNavigate) {
      onMapNavigate(result.center, 16)
    }
  }

  // Manipula teclas do teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Limpa a busca
  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
    setError(null)
    onSearchResults?.([])
    onSearchLoading?.(false)
    
    // FORÇA O FECHAMENTO DO TECLADO
    forceCloseKeyboard()
  }

  // Expõe a função clearSearch para o componente pai
  useImperativeHandle(ref, () => ({
    clearSearch
  }), [])

  // Remove o auto-focus para não abrir o teclado automaticamente
  // useEffect(() => {
  //   if (inputRef.current && !disabled) {
  //     inputRef.current.focus()
  //   }
  // }, [disabled])

  // Reset do estado quando o componente é desmontado
  useEffect(() => {
    return () => {
      // Limpa o estado quando o componente é desmontado
      setQuery('')
      setResults([])
      setIsOpen(false)
      setSelectedIndex(-1)
      setError(null)
    }
  }, [])

  // Cleanup do debounce
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  // Formata o resultado para exibição
  const formatResult = (result: GeocodingResult) => {
    const { place_name, context = [] } = result
    
    // Extrai informações do contexto
    const city = context.find(c => c.id.includes('place'))?.text || ''
    const state = context.find(c => c.id.includes('region'))?.text || ''
    
    const title = place_name.split(',')[0] || place_name
    const subtitle = [city, state].filter(Boolean).join(', ')
    
    return { title, subtitle }
  }

  return (
    <div className={`search-input-container ${className}`}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >
        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsOpen(true)
            onSearchFocus?.()
          }}
          onBlur={() => {
            onSearchBlur?.()
          }}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%',
            height: '56px',
            padding: '0 18px',
            textIndent: '30px',
            backgroundColor: '#1F2937',
            border: isOpen ? '2px solid #3B82F6' : '2px solid #374151',
            borderRadius: '16px',
            fontSize: '16px',
            color: 'white',
            fontFamily: 'Poppins, ui-sans-serif, sans-serif',
            outline: 'none',
            transition: 'all 0.3s ease',
            boxShadow: isOpen 
              ? '0 0 0 4px rgba(59, 130, 246, 0.1)' 
              : '0 2px 8px rgba(0, 0, 0, 0.1)',
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
          }}
        />

        {/* Search Icon */}
        <div
          style={{
            position: 'absolute',
            left: '18px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isOpen ? '#3B82F6' : '#9CA3AF',
            transition: 'color 0.3s ease',
            pointerEvents: 'none',
          }}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>

            {/* Clear Button - aparece quando há texto ou quando está focado */}
            {(query || isOpen) && (
              <button
                onClick={clearSearch}
                style={{
                  position: 'absolute',
                  right: '18px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#374151';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#9CA3AF';
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
      </div>

      {/* Lista de resultados - DESABILITADA para usar a lista do BottomSection */}
      {false && isOpen && (results.length > 0 || error) && (
        <div
          ref={resultsRef}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '400px',
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          {error ? (
            <div
              style={{
                padding: '12px 20px',
                color: '#EF4444',
                fontSize: '14px',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif',
              }}
            >
              {error}
            </div>
          ) : (
            results.map((result, index) => {
              const { title, subtitle } = formatResult(result)
              const isSelected = index === selectedIndex
              
              return (
                    <button
                      key={result.id}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Previne o blur do input
                        handleResultSelect(result);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 20px',
                        textAlign: 'left',
                        backgroundColor: isSelected ? '#374151' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = '#374151'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }
                      }}
                    >
                  <MapPin 
                    style={{
                      width: '16px',
                      height: '16px',
                      color: '#9CA3AF',
                      marginTop: '2px',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '500',
                        fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {title}
                    </div>
                    {subtitle && (
                      <div
                        style={{
                          color: '#9CA3AF',
                          fontSize: '12px',
                          fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginTop: '2px',
                        }}
                      >
                        {subtitle}
                      </div>
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>
      )}

      {/* Overlay removido - a lista de resultados é renderizada no BottomSection */}
    </div>
  )
})

AddressSearch.displayName = 'AddressSearch'

export default AddressSearch
