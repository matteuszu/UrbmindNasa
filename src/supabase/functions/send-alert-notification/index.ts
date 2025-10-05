import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertNotificationRequest {
  alertId: string;
  message: string;
  alertType?: 'weather' | 'activity' | 'general';
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { alertId, message, alertType = 'general' }: AlertNotificationRequest = await req.json();

    if (!alertId || !message) {
      return new Response(
        JSON.stringify({ error: 'alertId e message são obrigatórios' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Buscar dados do alerta e do usuário
    const { data: alert, error: alertError } = await supabase
      .from('alerts')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('id', alertId)
      .eq('is_active', true)
      .single();

    if (alertError || !alert) {
      return new Response(
        JSON.stringify({ error: 'Alerta não encontrado ou inativo' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Buscar dados do usuário
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(alert.user_id);

    if (userError || !user.user) {
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const userEmail = user.user.email;
    const userName = user.user.user_metadata?.name || 'Usuário';

    // Preparar conteúdo do email
    const emailSubject = `🚨 UrbMind - Alerta de Atividade`;
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Alerta UrbMind</title>
        <style>
          body {
            font-family: 'Poppins', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #0d52ff;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #0d52ff;
            margin-bottom: 10px;
          }
          .alert-type {
            display: inline-block;
            background-color: #0d52ff;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 20px;
          }
          .message {
            background-color: #f8f9fa;
            border-left: 4px solid #0d52ff;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
          }
          .location {
            background-color: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .location-icon {
            color: #0d52ff;
            margin-right: 8px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            background-color: #0d52ff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">UrbMind</div>
            <div class="alert-type">${alertType === 'weather' ? '🌤️ Clima' : alertType === 'activity' ? '📍 Atividade' : '🔔 Alerta'}</div>
          </div>
          
          <h2>Olá, ${userName}!</h2>
          
          <p>Recebemos uma nova atividade na região que você está monitorando:</p>
          
          <div class="message">
            <strong>Mensagem:</strong><br>
            ${message}
          </div>
          
          <div class="location">
            <strong>📍 Localização:</strong><br>
            ${alert.address}
            ${alert.city ? `<br>${alert.city}, ${alert.state || ''}` : ''}
          </div>
          
          <p>Este alerta foi criado em ${new Date(alert.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}.</p>
          
          <div style="text-align: center;">
            <a href="https://urbmind.com/alerts" class="button">Ver Meus Alertas</a>
          </div>
          
          <div class="footer">
            <p>Este é um email automático do sistema UrbMind.</p>
            <p>Se você não deseja mais receber estes alertas, pode desativá-los em suas configurações.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Enviar email usando o serviço de email do Supabase
    const { data: emailData, error: emailError } = await supabase.functions.invoke('send-email', {
      body: {
        to: userEmail,
        subject: emailSubject,
        html: emailContent,
        from: 'noreply@urbmind.com'
      }
    });

    if (emailError) {
      console.error('Erro ao enviar email:', emailError);
      return new Response(
        JSON.stringify({ error: 'Erro ao enviar notificação por email' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log da notificação enviada
    console.log(`Notificação enviada para ${userEmail} sobre alerta ${alertId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notificação enviada com sucesso',
        emailSent: true,
        recipient: userEmail
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro na função send-alert-notification:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
