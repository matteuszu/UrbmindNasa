# 📊 Store Global da Resposta da API

## 🎯 **Visão Geral**

O `apiResponseStore` é um sistema global que armazena a resposta da API `analisar-batch` e permite acesso a esses dados em qualquer parte do projeto através de imports simples.

## 🚀 **Como Usar**

### **1. Importação Simples**

```typescript
// Importar apenas os dados
import { getApiResponse, hasApiResponse } from '../services/apiResponseStore';

// Usar em qualquer função
function minhaFuncao() {
  const response = getApiResponse();
  if (hasApiResponse()) {
    console.log('Dados da API:', response);
  }
}
```

### **2. Hook React**

```typescript
// Em qualquer componente React
import { useApiResponse } from '../hooks/useApiResponse';

function MeuComponente() {
  const { apiResponse, hasData, timestamp, isLoading } = useApiResponse();
  
  if (isLoading) return <div>Carregando...</div>;
  if (!hasData) return <div>Sem dados</div>;
  
  return (
    <div>
      <h3>Resposta da API</h3>
      <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
      <p>Recebido em: {new Date(timestamp).toLocaleString()}</p>
    </div>
  );
}
```

### **3. Hook Simples (Apenas Dados)**

```typescript
// Para casos onde você só precisa dos dados
import { useApiResponseData } from '../hooks/useApiResponse';

function MeuComponente() {
  const apiResponse = useApiResponseData();
  
  return (
    <div>
      {apiResponse && (
        <div>Dados: {JSON.stringify(apiResponse)}</div>
      )}
    </div>
  );
}
```

### **4. Store Direto**

```typescript
// Acesso direto ao store
import { apiResponseStore } from '../services/apiResponseStore';

function minhaFuncao() {
  const data = apiResponseStore.getData();
  const timestamp = apiResponseStore.getTimestamp();
  const hasData = apiResponseStore.hasData();
  
  // Inscrever-se para atualizações
  const unsubscribe = apiResponseStore.subscribe((newData) => {
    console.log('Nova resposta:', newData);
  });
  
  // Cleanup
  unsubscribe();
}
```

## 📋 **Estrutura da Resposta**

A resposta da API é armazenada exatamente como recebida do endpoint `analisar-batch`:

```typescript
interface ApiResponse {
  // Estrutura exata da resposta da API
  // Varia conforme o endpoint
}
```

## 🔧 **Funções Disponíveis**

### **Store Global**
- `apiResponseStore.getData()` - Obter dados da resposta
- `apiResponseStore.getTimestamp()` - Obter timestamp da última resposta
- `apiResponseStore.hasData()` - Verificar se há dados disponíveis
- `apiResponseStore.subscribe(callback)` - Inscrever-se para atualizações

### **Funções de Conveniência**
- `getApiResponse()` - Obter dados da resposta
- `hasApiResponse()` - Verificar se há dados disponíveis
- `setApiResponse(data)` - Definir dados da resposta (usado internamente)
- `clearApiResponse()` - Limpar dados da resposta

### **Hooks React**
- `useApiResponse()` - Hook completo com estado de loading
- `useApiResponseData()` - Hook simples apenas com dados

## 🎯 **Exemplos de Uso**

### **1. Em um Serviço**

```typescript
// src/services/meuServico.ts
import { getApiResponse } from '../services/apiResponseStore';

export function processarDados() {
  const apiResponse = getApiResponse();
  
  if (apiResponse) {
    // Processar dados da API
    return apiResponse.dados;
  }
  
  return null;
}
```

### **2. Em um Componente**

```typescript
// src/components/MeuComponente.tsx
import React from 'react';
import { useApiResponse } from '../hooks/useApiResponse';

export function MeuComponente() {
  const { apiResponse, hasData } = useApiResponse();
  
  return (
    <div>
      {hasData ? (
        <div>
          <h3>Dados da API Disponíveis</h3>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      ) : (
        <div>Nenhum dado disponível</div>
      )}
    </div>
  );
}
```

### **3. Em uma Função Utilitária**

```typescript
// src/utils/processarResposta.ts
import { getApiResponse } from '../services/apiResponseStore';

export function extrairDadosImportantes() {
  const response = getApiResponse();
  
  if (!response) return null;
  
  return {
    status: response.status,
    dados: response.data,
    timestamp: response.timestamp
  };
}
```

## 🔄 **Fluxo de Dados**

1. **Processamento**: Dados meteorológicos são processados
2. **Envio**: Dados são enviados para API `analisar-batch`
3. **Armazenamento**: Resposta é automaticamente armazenada no store
4. **Acesso**: Qualquer parte do projeto pode acessar via import
5. **Atualização**: Componentes React são automaticamente atualizados

## 🎨 **Componentes Prontos**

### **ApiResponseDisplay**
Componente completo para exibir a resposta da API com formatação.

### **ApiResponseStatus**
Componente simples para mostrar apenas o status (disponível/não disponível).

## 📝 **Notas Importantes**

- ✅ **Automático**: A resposta é armazenada automaticamente quando recebida
- ✅ **Global**: Acessível em qualquer parte do projeto
- ✅ **Reativo**: Componentes React são atualizados automaticamente
- ✅ **TypeScript**: Totalmente tipado
- ✅ **Performance**: Armazenamento em memória, acesso instantâneo
- ✅ **Flexível**: Múltiplas formas de acesso (hooks, funções, store direto)

## 🚀 **Próximos Passos**

1. **Importar** a resposta onde precisar
2. **Usar** os hooks ou funções de conveniência
3. **Processar** os dados conforme necessário
4. **Exibir** em componentes React

A resposta da API está sempre disponível e atualizada em tempo real! 🎯
