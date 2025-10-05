# Serviço de Dados Meteorológicos - UrbMind

## Visão Geral

Este serviço foi implementado para buscar dados meteorológicos de Uberlândia no banco de dados Supabase e formatá-los no padrão JSON especificado para execução de outros serviços.

## Estrutura do Projeto

### Arquivos Criados

1. **`src/data/uberlandia-coordinates.json`** - Arquivo com coordenadas de pontos de Uberlândia
2. **`src/services/weatherDataService.ts`** - Serviço principal para busca de dados
3. **`src/hooks/useWeatherData.ts`** - Hook React para gerenciar dados meteorológicos
4. **`src/components/WeatherDataDisplay.tsx`** - Componente para exibir os dados
5. **`src/main.tsx`** - Modificado para executar o serviço na inicialização

## Funcionamento

### 1. Inicialização Automática

O serviço é executado automaticamente na inicialização da aplicação através do `main.tsx`:

```typescript
// Executar serviço de dados meteorológicos na inicialização
const weatherData = await initializeWeatherDataService();
```

### 2. Busca de Dados

O serviço:
- Carrega as coordenadas do arquivo `uberlandia-coordinates.json`
- Para cada coordenada, consulta a tabela `rain_forecast` no Supabase
- Busca o registro mais recente para cada ponto
- Formata os dados no padrão JSON especificado

### 3. Formato de Saída

O JSON gerado segue exatamente o formato solicitado:

```json
{
  "pontos": [
    {
      "lon": -48.254538,
      "lat": -18.8956335,
      "chuva_mm": 50,
      "freq_min": 60,
      "modo": "geo"
    }
  ]
}
```

## Uso do Serviço

### 1. Uso Direto

```typescript
import { fetchWeatherDataForUberlandia } from './services/weatherDataService';

const weatherData = await fetchWeatherDataForUberlandia();
console.log(weatherData);
```

### 2. Uso com Hook React

```typescript
import { useWeatherData } from './hooks/useWeatherData';

function MyComponent() {
  const { weatherData, loading, error, refetch } = useWeatherData();
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <div>
      {weatherData?.pontos.map((ponto, index) => (
        <div key={index}>
          Lat: {ponto.lat}, Lon: {ponto.lon}, Chuva: {ponto.chuva_mm}mm
        </div>
      ))}
    </div>
  );
}
```

### 3. Uso do Componente

```typescript
import { WeatherDataDisplay } from './components/WeatherDataDisplay';

function App() {
  return (
    <div>
      <WeatherDataDisplay />
    </div>
  );
}
```

## Estrutura do Banco de Dados

O serviço consulta a tabela `rain_forecast` com os seguintes campos:

- `latitude` - Latitude do ponto
- `longitude` - Longitude do ponto  
- `precipitation` - Dados de precipitação
- `rainfall_mm` - Chuva em milímetros
- `rainfall_time` - Tempo de chuva
- `forecast_date` - Data da previsão
- `forecast_hour` - Hora da previsão

## Tratamento de Erros

O serviço possui tratamento robusto de erros:

1. **Erro de conexão com Supabase**: Retorna dados padrão
2. **Erro em coordenada específica**: Continua processamento com dados padrão
3. **Erro geral**: Retorna dados padrão para todas as coordenadas

## Logs e Monitoramento

O serviço gera logs detalhados no console:

- ✅ Sucesso na busca de dados
- ❌ Erros específicos
- 📊 Resumo do processamento
- 🔄 Status de carregamento

## Configuração

### Coordenadas

Para adicionar/remover pontos, edite o arquivo `src/data/uberlandia-coordinates.json`:

```json
{
  "coordenadas": [
    {
      "lon": -48.254538,
      "lat": -18.8956335,
      "nome": "Centro de Uberlândia"
    }
  ]
}
```

### Supabase

O serviço usa a configuração existente em `src/utils/supabase/client.tsx`.

## Exemplo de Uso Completo

```typescript
// Na inicialização da aplicação
import { initializeWeatherDataService } from './services/weatherDataService';

async function startApp() {
  try {
    const weatherData = await initializeWeatherDataService();
    console.log('Dados carregados:', weatherData);
    
    // Usar os dados para outros serviços
    await callOtherService(weatherData);
    
  } catch (error) {
    console.error('Erro na inicialização:', error);
  }
}
```

## Atualizações - Grade 500m

### Nova Cobertura de Dados

O serviço foi atualizado para usar a **grade de 500m** que cobre toda a área metropolitana de Uberlândia:

- **Total de pontos**: 2478 pontos (anteriormente 10)
- **Cobertura**: Área metropolitana completa de Uberlândia
- **Resolução**: Grade uniforme de 500 metros
- **Sistema de coordenadas**: WGS84 (EPSG:4326)

### Otimizações Implementadas

1. **Processamento em lotes**: 50 pontos por lote para otimizar performance
2. **Processamento paralelo**: Consultas simultâneas dentro de cada lote
3. **Tratamento robusto de erros**: Continua processamento mesmo com falhas
4. **Logs detalhados**: Acompanhamento do progresso em tempo real
5. **Processamento silencioso**: Execução em background sem interface visual

### Arquivo de Coordenadas Atualizado

O arquivo `src/data/uberlandia-coordinates.json` agora contém:
- 2478 coordenadas da grade 500m
- Formato mantido para compatibilidade
- Nomenclatura: "Ponto X - Grade 500m"

### Campo de Dados Atualizado

- **Antes**: Usava `rainfall_mm` do banco
- **Agora**: Usa `precipitation` do banco como `chuva_mm`
- **Motivo**: Campo mais preciso para dados de precipitação

### Performance

- **Tempo de processamento**: ~2-3 minutos para 2478 pontos
- **Uso de memória**: Otimizado com processamento em lotes
- **Conexão com banco**: Pausas entre lotes para não sobrecarregar
- **Execução**: Silenciosa em background

## Próximos Passos

1. **Integração com outros serviços**: Use o JSON gerado para chamar outros serviços
2. **Cache**: Implementar cache para evitar consultas desnecessárias
3. **Atualização automática**: Implementar atualização periódica dos dados
4. **Filtros**: Adicionar filtros por data, intensidade de chuva, etc.
5. **Visualização no mapa**: Integrar dados com componente de mapa
