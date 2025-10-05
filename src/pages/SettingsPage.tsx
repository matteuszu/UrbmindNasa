import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bell, BellOff, FileText, LogOut, Settings, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleAlerts = () => {
    setAlertsEnabled(!alertsEnabled);
    // Aqui você salvaria a preferência no banco de dados
    console.log('Alerts toggled:', !alertsEnabled);
  };

  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #01081A 0%, #0D1B2A 100%)',
        padding: '16px',
        fontFamily: 'Poppins, ui-sans-serif, sans-serif',
        paddingBottom: '80px', // Espaço extra para evitar que o conteúdo fique escondido atrás da barra do navegador
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '100%',
          margin: '0 auto',
          padding: '0',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          {/* Botão Voltar */}
          <button
            onClick={handleBack}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '16px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <ArrowLeft size={20} />
          </button>

          {/* User Profile */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#0D52FF',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: '600',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif',
              }}
            >
              {user ? getUserInitial(user.name) : 'U'}
            </div>
            <div>
              <h1
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: 'white',
                  margin: '0 0 4px 0',
                  fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                }}
              >
                {user?.name || 'Usuário'}
              </h1>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0,
                  fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                }}
              >
                {user?.email || 'email@exemplo.com'}
              </p>
            </div>
          </div>

          {/* Page Title */}
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'white',
              margin: '0 0 8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Settings size={24} />
            Configurações
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0,
              lineHeight: '1.5',
            }}
          >
            Gerencie suas preferências e configurações
          </p>
        </div>

        {/* Settings Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Alertas Section */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {alertsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
              Notificações
            </h3>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: 'white',
                    margin: '0 0 4px 0',
                  }}
                >
                  Envio de Alertas
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: 0,
                  }}
                >
                  Receber notificações sobre mudanças no clima
                </p>
              </div>
              <button
                onClick={toggleAlerts}
                style={{
                  width: '52px',
                  height: '28px',
                  backgroundColor: alertsEnabled ? '#0D52FF' : 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '14px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '2px',
                    left: alertsEnabled ? '26px' : '2px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  }}
                />
              </button>
            </div>
          </div>

          {/* Meus Alertas Section */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertTriangle size={20} />
              Meus Alertas
            </h3>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: 'white',
                    margin: '0 0 4px 0',
                  }}
                >
                  Histórico de Alertas
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: 0,
                  }}
                >
                  Visualizar alertas recebidos
                </p>
              </div>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#10B981',
                  borderRadius: '50%',
                }}
              />
            </div>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: 'white',
                    margin: '0 0 4px 0',
                  }}
                >
                  Alertas Ativos
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: 0,
                  }}
                >
                  3 alertas configurados
                </p>
              </div>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#F59E0B',
                  borderRadius: '50%',
                }}
              />
            </div>
          </div>

          {/* Documentação Section */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FileText size={20} />
              Ajuda e Suporte
            </h3>
            
            <Link
              to="/docs"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                textDecoration: 'none',
                color: 'white',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#0D52FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'white';
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: '0 0 4px 0',
                  }}
                >
                  Documentação
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: 0,
                  }}
                >
                  Guias e tutoriais do sistema
                </p>
              </div>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                →
              </div>
            </Link>
          </div>

          {/* Logout Section */}
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#EF4444',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <LogOut size={20} />
              Conta
            </h3>
            
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: isLoggingOut ? 'rgba(239, 68, 68, 0.7)' : '#EF4444',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif',
              }}
              onMouseEnter={(e) => {
                if (!isLoggingOut) {
                  e.currentTarget.style.backgroundColor = '#DC2626';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoggingOut) {
                  e.currentTarget.style.backgroundColor = '#EF4444';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {isLoggingOut ? (
                <>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  Saindo...
                </>
              ) : (
                <>
                  <LogOut size={20} />
                  Sair da Conta
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

