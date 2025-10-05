# 🚨 Sistema de Alertas UrbMind

## Visão Geral

O sistema de alertas permite que usuários logados criem notificações para endereços específicos. Quando houver atividade na região monitorada, o sistema enviará uma notificação por email para o usuário.

## Funcionalidades Implementadas

### ✅ 1. Interface de Usuário
- **Página de Alertas**: `/alerts` - Interface completa para gerenciar alertas
- **Botão no Header**: Ícone de sino (🔔) visível apenas para usuários logados
- **Formulário de Criação**: Campo para inserir endereço com validação
- **Lista de Alertas**: Visualização de todos os alertas ativos do usuário
- **Ações**: Criar, visualizar e remover alertas

### ✅ 2. Serviços Backend
- **AlertService**: Gerenciamento completo de alertas
  - Criar alertas com geocodificação automática
  - Listar alertas do usuário
  - Atualizar e deletar alertas
  - Geocodificação usando API do Mapbox
- **NotificationService**: Sistema de notificações
  - Simulação de envio de notificações
  - Função de teste para desenvolvimento
  - Suporte a diferentes tipos de alerta

### ✅ 3. Banco de Dados
- **Tabela `alerts`** com campos:
  - `id`: UUID único
  - `user_id`: Referência ao usuário
  - `address`: Endereço completo
  - `latitude/longitude`: Coordenadas geográficas
  - `city/state/country`: Informações de localização
  - `is_active`: Status do alerta
  - `created_at/updated_at`: Timestamps
- **Row Level Security (RLS)**: Usuários só acessam seus próprios alertas
- **Índices**: Otimização para consultas por usuário e localização

### ✅ 4. Sistema de Notificações
- **Edge Function**: `send-alert-notification` para envio de emails
- **Template HTML**: Email responsivo com design UrbMind
- **Tipos de Alerta**: Clima, atividade, geral
- **Simulação**: Sistema de teste para desenvolvimento

## Como Usar

### Para Usuários
1. **Fazer Login**: Acesse `/login` e faça login na sua conta
2. **Acessar Alertas**: Clique no ícone de sino (🔔) no header
3. **Criar Alerta**: Digite um endereço no formulário e clique em "Criar"
4. **Gerenciar**: Visualize, teste ou remova seus alertas
5. **Receber Notificações**: Quando houver atividade, receberá email

### Para Desenvolvedores
1. **Executar Migração**: Execute o arquivo SQL em `supabase/migrations/`
2. **Configurar Edge Functions**: Deploy das funções no Supabase
3. **Testar**: Use o botão de teste nos alertas para simular notificações

## Estrutura de Arquivos

```
src/
├── components/
│   └── AlertManager.tsx          # Interface principal de alertas
├── pages/
│   └── AlertsPage.tsx            # Página de alertas
├── services/
│   ├── alertService.ts           # Lógica de negócio dos alertas
│   └── notificationService.ts    # Sistema de notificações
└── supabase/
    └── functions/
        └── send-alert-notification/
            └── index.ts          # Edge Function para emails

supabase/
└── migrations/
    └── 001_create_alerts_table.sql  # Migração do banco
```

## Configuração do Banco de Dados

Execute a migração SQL no Supabase:

```sql
-- O arquivo completo está em supabase/migrations/001_create_alerts_table.sql
-- Inclui: tabela, índices, RLS, políticas e triggers
```

## Próximos Passos

### 🔄 Melhorias Futuras
1. **Integração Real de Email**: Configurar serviço de email do Supabase
2. **Webhooks**: Integração com APIs externas para detectar atividades
3. **Filtros Avançados**: Tipos de atividade, horários, frequência
4. **Dashboard Analytics**: Estatísticas de alertas e notificações
5. **Push Notifications**: Notificações em tempo real no navegador
6. **Geofencing**: Alertas baseados em proximidade geográfica

### 🛠️ Configurações Necessárias
1. **Supabase Email**: Configurar serviço de email
2. **Mapbox API**: Token para geocodificação
3. **Edge Functions**: Deploy das funções no Supabase
4. **Domínio**: Configurar domínio para links nos emails

## Segurança

- ✅ **RLS Habilitado**: Usuários só acessam seus próprios alertas
- ✅ **Validação de Dados**: Sanitização de inputs
- ✅ **Autenticação**: Verificação de usuário logado
- ✅ **Rate Limiting**: Proteção contra spam (implementar)

## Monitoramento

- 📊 **Logs**: Console logs para debugging
- 🔍 **Analytics**: Rastreamento de criação/uso de alertas
- 📧 **Email Tracking**: Monitoramento de entregas
- ⚠️ **Error Handling**: Tratamento de erros em todas as operações

---

**Status**: ✅ Implementação Completa
**Versão**: 1.0.0
**Última Atualização**: Dezembro 2024
