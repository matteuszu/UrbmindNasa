import { supabase } from '../utils/supabase/client';

export interface NotificationData {
  alertId: string;
  message: string;
  alertType?: 'weather' | 'activity' | 'general';
}

class NotificationService {
  // Simular envio de notificação (para demonstração)
  async sendAlertNotification(data: NotificationData): Promise<void> {
    try {
      // Em um ambiente real, isso chamaria a Edge Function do Supabase
      // Por enquanto, vamos simular o envio
      console.log('📧 Simulando envio de notificação:', {
        alertId: data.alertId,
        message: data.message,
        alertType: data.alertType,
        timestamp: new Date().toISOString()
      });

      // Aqui você pode implementar a chamada real para a Edge Function:
      /*
      const response = await fetch('/api/send-alert-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar notificação');
      }
      */

      // Para demonstração, vamos simular um delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      throw error;
    }
  }

  // Função para simular atividade e disparar alertas
  async simulateActivity(alertId: string, activityType: 'weather' | 'activity' | 'general' = 'activity'): Promise<void> {
    const messages = {
      weather: [
        '🌧️ Tempestade intensa detectada na região',
        '⛅ Mudança significativa no clima prevista',
        '🌡️ Temperatura extrema registrada',
        '💨 Ventos fortes detectados na área'
      ],
      activity: [
        '🚧 Obras iniciadas na região',
        '🚨 Incidente reportado na área',
        '🎉 Evento especial acontecendo próximo',
        '📊 Dados atualizados para esta localização'
      ],
      general: [
        '🔔 Nova atividade detectada na região',
        '📢 Atualização importante disponível',
        '⚠️ Alerta geral para a área monitorada'
      ]
    };

    const messageList = messages[activityType];
    const randomMessage = messageList[Math.floor(Math.random() * messageList.length)];

    await this.sendAlertNotification({
      alertId,
      message: randomMessage,
      alertType: activityType
    });
  }

  // Função para testar notificações (apenas para desenvolvimento)
  async testNotification(alertId: string): Promise<void> {
    console.log('🧪 Testando notificação para alerta:', alertId);
    
    await this.sendAlertNotification({
      alertId,
      message: '🧪 Esta é uma notificação de teste do sistema UrbMind',
      alertType: 'general'
    });
  }
}

export const notificationService = new NotificationService();
