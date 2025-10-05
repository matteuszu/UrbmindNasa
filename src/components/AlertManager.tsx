import React, { useState, useEffect } from 'react';
import { alertService, Alert, CreateAlertData } from '../services/alertService';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../hooks/useAuth';
import { Trash2, MapPin, Plus, AlertCircle, TestTube, Bell } from 'lucide-react';
import { toast } from 'sonner';

export function AlertManager() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newAlert, setNewAlert] = useState({
    address: '',
  });

  // Carregar alertas do usuário
  useEffect(() => {
    if (user) {
      loadAlerts();
    }
  }, [user]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const userAlerts = await alertService.getUserAlerts();
      setAlerts(userAlerts);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
      toast.error('Erro ao carregar alertas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAlert.address.trim()) {
      toast.error('Por favor, insira um endereço');
      return;
    }

    try {
      setCreating(true);
      const alertData: CreateAlertData = {
        address: newAlert.address.trim(),
      };

      const createdAlert = await alertService.createAlert(alertData);
      setAlerts(prev => [createdAlert, ...prev]);
      setNewAlert({ address: '' });
      toast.success('Alerta criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao criar alerta');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await alertService.deleteAlert(alertId);
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast.success('Alerta removido com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar alerta:', error);
      toast.error('Erro ao remover alerta');
    }
  };

  const handleTestNotification = async (alertId: string) => {
    try {
      await notificationService.testNotification(alertId);
      toast.success('Notificação de teste enviada! Verifique o console.');
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
      toast.error('Erro ao enviar notificação de teste');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#1F2937',
          borderRadius: '16px',
          padding: '48px 32px',
          textAlign: 'center',
          border: '2px solid #374151',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        <AlertCircle 
          style={{ 
            width: '48px', 
            height: '48px', 
            color: '#9CA3AF', 
            margin: '0 auto 24px auto',
            display: 'block'
          }} 
        />
        <p 
          style={{
            color: '#9CA3AF',
            fontSize: '16px',
            fontFamily: 'Poppins, ui-sans-serif, sans-serif',
            margin: 0
          }}
        >
          Você precisa estar logado para gerenciar alertas
        </p>
      </div>
    );
  }

  return (
    <div 
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}
    >
      {/* Cabeçalho */}
      <div 
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <h2 
          style={{
            fontSize: '32px',
            fontWeight: '700',
            color: 'white',
            margin: 0,
            fontFamily: 'Poppins, ui-sans-serif, sans-serif',
            letterSpacing: '-0.5px'
          }}
        >
          Meus Alertas
        </h2>
        <p 
          style={{
            color: '#9CA3AF',
            fontSize: '16px',
            margin: 0,
            fontFamily: 'Poppins, ui-sans-serif, sans-serif'
          }}
        >
          Crie alertas para receber notificações sobre atividades em endereços específicos
        </p>
      </div>

      {/* Formulário de criação */}
      <div
        style={{
          backgroundColor: '#1F2937',
          borderRadius: '16px',
          padding: '24px',
          border: '2px solid #374151',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}
        >
          <Plus 
            style={{ 
              width: '24px', 
              height: '24px', 
              color: '#3B82F6' 
            }} 
          />
          <h3 
            style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'white',
              margin: 0,
              fontFamily: 'Poppins, ui-sans-serif, sans-serif'
            }}
          >
            Criar Novo Alerta
          </h3>
        </div>
        
        <p 
          style={{
            color: '#9CA3AF',
            fontSize: '14px',
            margin: '0 0 24px 0',
            fontFamily: 'Poppins, ui-sans-serif, sans-serif'
          }}
        >
          Digite um endereço para receber notificações sobre atividades na região
        </p>

        <form onSubmit={handleCreateAlert}>
          <div 
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-end'
            }}
          >
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Ex: Rua das Flores, 123, Centro, Uberlândia - MG"
                value={newAlert.address}
                onChange={(e) => setNewAlert({ address: e.target.value })}
                disabled={creating}
                style={{
                  width: '100%',
                  height: '56px',
                  padding: '0 18px',
                  backgroundColor: '#374151',
                  border: '2px solid #4B5563',
                  borderRadius: '12px',
                  fontSize: '16px',
                  color: 'white',
                  fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3B82F6';
                  e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#4B5563';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={creating || !newAlert.address.trim()}
              style={{
                height: '56px',
                padding: '0 24px',
                backgroundColor: creating || !newAlert.address.trim() ? '#374151' : '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                cursor: creating || !newAlert.address.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: creating || !newAlert.address.trim() ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!creating && newAlert.address.trim()) {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                }
              }}
              onMouseLeave={(e) => {
                if (!creating && newAlert.address.trim()) {
                  e.currentTarget.style.backgroundColor = '#3B82F6';
                }
              }}
            >
              {creating ? 'Criando...' : 'Criar'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de alertas */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {loading ? (
          <div
            style={{
              backgroundColor: '#1F2937',
              borderRadius: '16px',
              padding: '48px 32px',
              textAlign: 'center',
              border: '2px solid #374151',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            <div 
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderTop: '3px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px auto'
              }}
            />
            <p 
              style={{
                color: '#9CA3AF',
                fontSize: '16px',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                margin: 0
              }}
            >
              Carregando alertas...
            </p>
          </div>
        ) : alerts.length === 0 ? (
          <div
            style={{
              backgroundColor: '#1F2937',
              borderRadius: '16px',
              padding: '48px 32px',
              textAlign: 'center',
              border: '2px solid #374151',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            <MapPin 
              style={{ 
                width: '48px', 
                height: '48px', 
                color: '#9CA3AF', 
                margin: '0 auto 24px auto',
                display: 'block'
              }} 
            />
            <p 
              style={{
                color: '#9CA3AF',
                fontSize: '16px',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                margin: '0 0 8px 0'
              }}
            >
              Você ainda não tem alertas criados
            </p>
            <p 
              style={{
                color: '#6B7280',
                fontSize: '14px',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                margin: 0
              }}
            >
              Crie seu primeiro alerta usando o formulário acima
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                backgroundColor: '#1F2937',
                borderRadius: '16px',
                padding: '20px',
                border: '2px solid #374151',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#374151';
                e.currentTarget.style.borderColor = '#4B5563';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1F2937';
                e.currentTarget.style.borderColor = '#374151';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div 
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <MapPin 
                      style={{ 
                        width: '16px', 
                        height: '16px', 
                        color: '#3B82F6',
                        flexShrink: 0
                      }} 
                    />
                    <h3 
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'white',
                        margin: 0,
                        fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                        lineHeight: '1.4'
                      }}
                    >
                      {alert.address}
                    </h3>
                  </div>
                  
                  <div 
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    {alert.city && (
                      <span
                        style={{
                          backgroundColor: '#374151',
                          color: '#D1D5DB',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          fontFamily: 'Poppins, ui-sans-serif, sans-serif'
                        }}
                      >
                        {alert.city}
                      </span>
                    )}
                    {alert.state && (
                      <span
                        style={{
                          backgroundColor: '#374151',
                          color: '#D1D5DB',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          fontFamily: 'Poppins, ui-sans-serif, sans-serif'
                        }}
                      >
                        {alert.state}
                      </span>
                    )}
                    {alert.country && (
                      <span
                        style={{
                          backgroundColor: '#374151',
                          color: '#D1D5DB',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          fontFamily: 'Poppins, ui-sans-serif, sans-serif'
                        }}
                      >
                        {alert.country}
                      </span>
                    )}
                  </div>

                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '12px',
                      color: '#9CA3AF',
                      fontFamily: 'Poppins, ui-sans-serif, sans-serif'
                    }}
                  >
                    <span>Criado em: {formatDate(alert.created_at)}</span>
                    {alert.latitude && alert.longitude && (
                      <span>
                        📍 {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                      </span>
                    )}
                  </div>
                </div>

                <div 
                  style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'flex-start'
                  }}
                >
                  <button
                    onClick={() => handleTestNotification(alert.id)}
                    style={{
                      width: '36px',
                      height: '36px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      color: '#3B82F6'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                      e.currentTarget.style.color = '#60A5FA';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#3B82F6';
                    }}
                    title="Testar notificação"
                  >
                    <TestTube style={{ width: '16px', height: '16px' }} />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    style={{
                      width: '36px',
                      height: '36px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      color: '#EF4444'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.color = '#F87171';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#EF4444';
                    }}
                    title="Remover alerta"
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Informações sobre alertas */}
      <div
        style={{
          backgroundColor: '#1F2937',
          borderRadius: '16px',
          padding: '20px',
          border: '2px solid #374151',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div 
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          <AlertCircle 
            style={{ 
              width: '20px', 
              height: '20px', 
              color: '#3B82F6',
              marginTop: '2px',
              flexShrink: 0
            }} 
          />
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <h4 
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                margin: 0,
                fontFamily: 'Poppins, ui-sans-serif, sans-serif'
              }}
            >
              Como funcionam os alertas?
            </h4>
            <p 
              style={{
                fontSize: '14px',
                color: '#9CA3AF',
                margin: 0,
                lineHeight: '1.5',
                fontFamily: 'Poppins, ui-sans-serif, sans-serif'
              }}
            >
              Quando você cria um alerta, nosso sistema monitora a região especificada. 
              Se houver alguma atividade importante (como mudanças climáticas significativas, 
              eventos especiais, ou atualizações de dados), você receberá uma notificação por email.
            </p>
          </div>
        </div>
      </div>

      {/* Adicionar animação CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
