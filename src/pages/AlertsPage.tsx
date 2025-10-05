import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AlertManager } from '../components/AlertManager';
import { ArrowLeft } from 'lucide-react';

export default function AlertsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Set dark mode as default
    document.documentElement.classList.add('dark');
  }, []);

  if (loading) {
    return (
      <div 
        style={{
          height: '100vh',
          backgroundColor: '#01081A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Poppins, ui-sans-serif, sans-serif'
        }}
      >
        <div 
          style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: '#01081A',
        fontFamily: 'Poppins, ui-sans-serif, sans-serif'
      }}
    >
      {/* Header com mesmo estilo da HomePage */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          pointerEvents: 'none'
        }}
      >
        {/* Seção da Logo - Esquerda */}
        <div
          style={{
            backgroundColor: 'rgba(29, 29, 29, 0.4)',
            borderRadius: '999px',
            height: '68px',
            minWidth: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            overflow: 'hidden'
          }}
        >
          <img 
            src="/logo urbmind.svg" 
            alt="UrbMind Logo"
            style={{
              height: '20px',
              width: 'auto',
              display: 'block'
            }}
            onError={(e) => {
              console.error('Erro ao carregar logo:', e);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Seção dos Ícones - Direita */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}
        >
          {/* Botão Voltar */}
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: 'rgba(29, 29, 29, 0.4)',
              borderRadius: '999px',
              height: '48px',
              width: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              pointerEvents: 'auto',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(29, 29, 29, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(29, 29, 29, 0.4)';
            }}
            title="Voltar"
          >
            <ArrowLeft style={{ width: '20px', height: '20px' }} />
          </button>

          {/* Botão de Usuário */}
          {user && (
            <button
              onClick={() => navigate('/settings')}
              style={{
                backgroundColor: 'rgba(29, 29, 29, 0.4)',
                borderRadius: '999px',
                height: '48px',
                width: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                pointerEvents: 'auto',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(29, 29, 29, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(29, 29, 29, 0.4)';
              }}
              title={`Olá, ${user.name}`}
            >
              {user.name.charAt(0).toUpperCase()}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div 
        style={{
          paddingTop: '100px',
          paddingBottom: '40px',
          paddingLeft: '16px',
          paddingRight: '16px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <AlertManager />
      </div>
    </div>
  );
}
