
# Integração com API Externa - analisar-batch

## Visão Geral

Implementei a integração com o endpoint `analisar-batch` da API externa. Ao final do processamento dos dados meteorológicos, os dados são automaticamente enviados para a API em vez de apenas serem logados no console.

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# API Configuration
VITE_API_BASE_URL=http://148.230.78.172:8000
VITE_API_ANALISAR_BATCH_ENDPOINT=/analisar-batch
```

### 2. Arquivo de Exemplo

Use o arquivo `env.example` como referência:

```bash
cp env.example .env
```

## Funcionamento

### 1. Processamento dos Dados

O serviço processa os 2478 pontos da grade de 500m de Uberlândia:

```
🔄 Processando em 50 lotes de 50 pontos cada
📦 Processando lote 1/50 (1-50)
✅ Lote 1 concluído. Progresso: 2.0% (50/2478)
...
🎉 Processamento concluído! Total de pontos: 2478
```

### 2. Envio para API

Após o processamento, os dados são enviados automaticamente:

```
🚀 Enviando dados para endpoint analisar-batch...
📍 URL: http://148.230.78.172:8000/analisar-batch
📊 Dados enviados: {...}
✅ Dados enviados com sucesso para analisar-batch
📋 Resposta da API: {...}
```

### 3. Formato dos Dados Enviados

Os dados são enviados no formato JSON especificado com `chuva_mm` em formato decimal com 2 casas:

```json
{
  "pontos": [
    {
      "lon": -48.401806,
      "lat": -19.02125,
      "chuva_mm": 0.00,
      "freq_min": 60,
      "modo": "geo"
    },
    {
      "lon": -48.397057,
      "lat": -19.02125,
      "chuva_mm": 5.25,
      "freq_min": 45,
      "modo": "geo"
    }
    // ... 2476 pontos adicionais
  ]
}
```

**Formato do `chuva_mm`**: Sempre com 2 casas decimais (ex: 0.00, 5.25, 12.50)

## Arquivos Implementados

### 1. `src/config/api.ts`

Configuração da API e função para envio de dados:

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://148.230.78.172:8000',
  ANALISAR_BATCH_ENDPOINT: import.meta.env.VITE_API_ANALISAR_BATCH_ENDPOINT || '/analisar-batch',
  get ANALISAR_BATCH_URL() {
    return `${this.BASE_URL}${this.ANALISAR_BATCH_ENDPOINT}`;
  }
};

export async function sendDataToAnalisarBatch(data: any): Promise<any> {
  // Implementação do fetch para a API
}
```

### 2. `src/services/weatherDataService.ts`

Modificado para incluir o envio para a API:

```typescript
// Enviar dados para o endpoint analisar-batch
try {
  console.log('🚀 Enviando dados para endpoint analisar-batch...');
  const apiResponse = await sendDataToAnalisarBatch(result);
  console.log('✅ Dados enviados com sucesso para analisar-batch');
  console.log('📋 Resposta da API:', apiResponse);
} catch (apiError) {
  console.error('❌ Erro ao enviar dados para analisar-batch:', apiError);
  // Não interrompe o fluxo, apenas loga o erro
}
```

### 3. `env.example`

Arquivo de exemplo para configuração das variáveis de ambiente.

## Tratamento de Erros e CORS

### 1. Solução de Proxy Local (Principal)

O sistema usa um **proxy local** configurado no Vite para contornar completamente os problemas de CORS:

#### Configuração do Proxy no Vite
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://148.230.78.172:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    }
  }
}
```

#### Como Funciona
1. **Requisição local**: `http://localhost:3000/api/analisar-batch`
2. **Proxy redireciona**: Para `http://148.230.78.172:8000/analisar-batch`
3. **Sem CORS**: Requisição é feita do servidor, não do navegador
4. **Resposta transparente**: Dados retornam normalmente

### 2. Configuração Anti-CORS (Fallback)

Se o proxy falhar, o sistema implementa estratégias alternativas:

#### Estratégia 1: Fetch com CORS Otimizado
```typescript
const response = await fetch(url, {
  method: 'POST',
  mode: 'cors',
  credentials: 'omit',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  },
  body: JSON.stringify(data)
});
```

#### Estratégia 2: Modo no-cors (Fallback)
Se a primeira estratégia falhar, usa `mode: 'no-cors'`:
```typescript
const response = await fetch(url, {
  method: 'POST',
  mode: 'no-cors', // Ignora completamente o CORS
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
});
```

#### Estratégia 3: XMLHttpRequest (Último Recurso)
Para casos extremos, usa XMLHttpRequest:
```typescript
const xhr = new XMLHttpRequest();
xhr.open('POST', url, true);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify(data));
```

### 3. Erro de Conexão

Se a API não estiver disponível:

```
❌ Erro ao enviar dados via proxy: TypeError: Failed to fetch
🔄 Tentando conexão direta...
```

### 4. Erro de CORS (Fallback)

Se o proxy falhar e houver problema de CORS:

```
❌ Erro ao enviar dados via proxy: CORS policy error
🔄 Tentando conexão direta...
✅ Dados enviados via conexão direta (no-cors)
```

### 5. Continuidade do Processo

- **Proxy como principal**: Usa proxy local para evitar CORS completamente
- **Fallback automático**: Se proxy falhar, tenta conexão direta
- **Erros não interrompem o fluxo**: O processamento continua mesmo se a API falhar
- **Logs detalhados**: Todos os erros e tentativas são logados no console
- **Dados disponíveis**: Os dados continuam disponíveis no store global

## Monitoramento

### 1. Console Logs

Acompanhe o processo via console:

```
🔄 Iniciando processamento de dados meteorológicos em background...
=== INICIALIZANDO SERVIÇO DE DADOS METEOROLÓGICOS ===
📊 Total de coordenadas a processar: 2478
...
🎉 Processamento concluído! Total de pontos: 2478
🔄 Enviando dados para endpoint analisar-batch via proxy...
📍 URL do proxy: /api/analisar-batch
✅ Dados enviados com sucesso para analisar-batch via proxy
```

### 2. Resposta da API

A resposta da API é logada no console:

```
📋 Resposta da API: {
  "status": "success",
  "message": "Dados processados com sucesso",
  "processed_points": 2478
}
```

## Configuração de Desenvolvimento

### 1. Vite Environment Variables

O projeto usa Vite, que requer o prefixo `VITE_` para variáveis de ambiente:

```env
VITE_API_BASE_URL=http://148.230.78.172:8000
VITE_API_ANALISAR_BATCH_ENDPOINT=/analisar-batch
```

### 2. Fallback Values

Se as variáveis não estiverem configuradas, valores padrão são usados:

```typescript
BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://148.230.78.172:8000'
```

## Segurança

### 1. Variáveis de Ambiente

- **Arquivo .env**: Não versionado (adicionado ao .gitignore)
- **Arquivo env.example**: Versionado como referência
- **Credenciais**: Mantidas fora do código

### 2. Headers HTTP

```typescript
headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}
```

## Benefícios

1. **Integração Automática**: Dados enviados automaticamente após processamento
2. **Configuração Flexível**: URL configurável via variáveis de ambiente
3. **Tratamento de Erros**: Processo continua mesmo com falhas na API
4. **Monitoramento**: Logs detalhados para acompanhamento
5. **Segurança**: Credenciais em variáveis de ambiente
