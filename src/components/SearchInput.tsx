import React, { useState } from 'react';

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchInput({ 
  placeholder = "Buscar...", 
  onSearch,
  className = ""
}: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchQuery);
    }
  };

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
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: '56px',
            padding: '0 18px',
            textIndent: '30px',
            backgroundColor: '#1F2937',
            border: isFocused ? '2px solid #3B82F6' : '2px solid #374151',
            borderRadius: '16px',
            fontSize: '16px',
            color: 'white',
            fontFamily: 'Poppins, ui-sans-serif, sans-serif',
            outline: 'none',
            transition: 'all 0.3s ease',
            boxShadow: isFocused 
              ? '0 0 0 4px rgba(59, 130, 246, 0.1)' 
              : '0 2px 8px rgba(0, 0, 0, 0.1)',
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
            color: isFocused ? '#3B82F6' : '#9CA3AF',
            transition: 'color 0.3s ease',
            pointerEvents: 'none',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>

        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              if (onSearch) onSearch('');
            }}
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Search Suggestions (placeholder for future implementation) */}
      {isFocused && searchQuery && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            marginTop: '8px',
            padding: '8px 0',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              padding: '12px 20px',
              color: '#9CA3AF',
              fontSize: '14px',
              fontFamily: 'Poppins, ui-sans-serif, sans-serif',
            }}
          >
            Buscando por "{searchQuery}"...
          </div>
        </div>
      )}
    </div>
  );
}
