import { supabase } from '../utils/supabase/client';

export interface Alert {
  id: string;
  user_id: string;
  address: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  country?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAlertData {
  address: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  country?: string;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  formatted_address: string;
}

class AlertService {
  // Buscar alertas do usuário logado
  async getUserAlerts(): Promise<Alert[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar alertas: ${error.message}`);
    }

    return data || [];
  }

  // Criar novo alerta
  async createAlert(alertData: CreateAlertData): Promise<Alert> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Se não tiver coordenadas, tentar geocodificar o endereço
    let finalAlertData = { ...alertData };
    
    if (!alertData.latitude || !alertData.longitude) {
      try {
        const geocodeResult = await this.geocodeAddress(alertData.address);
        finalAlertData = {
          ...alertData,
          latitude: geocodeResult.latitude,
          longitude: geocodeResult.longitude,
          city: geocodeResult.city,
          state: geocodeResult.state,
          country: geocodeResult.country,
        };
      } catch (error) {
        console.warn('Erro ao geocodificar endereço:', error);
        // Continua sem coordenadas se geocodificação falhar
      }
    }

    const { data, error } = await supabase
      .from('alerts')
      .insert({
        user_id: user.id,
        address: finalAlertData.address,
        latitude: finalAlertData.latitude,
        longitude: finalAlertData.longitude,
        city: finalAlertData.city,
        state: finalAlertData.state,
        country: finalAlertData.country || 'Brasil',
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar alerta: ${error.message}`);
    }

    return data;
  }

  // Atualizar alerta
  async updateAlert(alertId: string, updates: Partial<CreateAlertData>): Promise<Alert> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('alerts')
      .update(updates)
      .eq('id', alertId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar alerta: ${error.message}`);
    }

    return data;
  }

  // Desativar alerta (soft delete)
  async deactivateAlert(alertId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { error } = await supabase
      .from('alerts')
      .update({ is_active: false })
      .eq('id', alertId)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Erro ao desativar alerta: ${error.message}`);
    }
  }

  // Deletar alerta permanentemente
  async deleteAlert(alertId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', alertId)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Erro ao deletar alerta: ${error.message}`);
    }
  }

  // Geocodificar endereço usando API do Mapbox
  async geocodeAddress(address: string): Promise<GeocodeResult> {
    const mapboxToken = 'pk.eyJ1IjoidXJibWluZCIsImEiOiJjbWdjZThmcXgwbXdiMmlwbWsxc2d2czcxIn0.zy2SVmAiQREsG2TeosmyUA';
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}&country=BR&limit=1`
      );

      if (!response.ok) {
        throw new Error('Erro na geocodificação');
      }

      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        throw new Error('Endereço não encontrado');
      }

      const feature = data.features[0];
      const [longitude, latitude] = feature.center;

      // Extrair informações do contexto
      const context = feature.context || [];
      let city = '';
      let state = '';
      let country = 'Brasil';

      context.forEach((item: any) => {
        if (item.id.startsWith('place')) {
          city = item.text;
        } else if (item.id.startsWith('region')) {
          state = item.text;
        } else if (item.id.startsWith('country')) {
          country = item.text;
        }
      });

      return {
        latitude,
        longitude,
        city,
        state,
        country,
        formatted_address: feature.place_name,
      };
    } catch (error) {
      throw new Error(`Erro ao geocodificar endereço: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  // Enviar notificação por email (será implementado com Edge Function)
  async sendAlertNotification(alertId: string, message: string): Promise<void> {
    try {
      const response = await fetch('/api/send-alert-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alertId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar notificação');
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      throw error;
    }
  }
}

export const alertService = new AlertService();
