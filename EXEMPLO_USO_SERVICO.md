# Exemplo de Uso do Serviço - Body Completo

## Como Obter o Body com Array de Coordenadas e Dados do Banco

### 1. Console.log Automático na Inicialização

Quando a aplicação inicializar, você verá no console do navegador:

```
🚀 Iniciando aplicação UrbMind...
=== INICIALIZANDO SERVIÇO DE DADOS METEOROLÓGICOS ===
📊 Total de coordenadas a processar: 2478
🔄 Processando em 50 lotes de 50 pontos cada
...
🎉 Processamento concluído! Total de pontos: 2478
📈 Estatísticas: X pontos com chuva, Y pontos sem chuva
================================================================================
📋 BODY COMPLETO - ARRAY DE COORDENADAS COM DADOS DO BANCO:
================================================================================
{
  "pontos": [
    {
      "lon": -48.401806,
      "lat": -19.02125,
      "chuva_mm": 0,
      "freq_min": 60,
      "modo": "geo"
    },
    {
      "lon": -48.397057,
      "lat": -19.02125,
      "chuva_mm": 5,
      "freq_min": 45,
      "modo": "geo"
    }
    // ... 2476 pontos adicionais
  ]
}
================================================================================
🎯 BODY FINAL PARA OUTROS SERVIÇOS:
{
  "pontos": [
    // Array completo com todos os dados
  ]
}
```

### 2. Teste Manual no Console do Navegador

Abra o console do navegador (F12) e execute:

```javascript
// Testar o serviço manualmente
testWeatherService();
```

Isso executará o serviço e mostrará o resultado completo no console.

### 3. Uso Programático

```typescript
import { fetchWeatherDataForUberlandia } from './services/weatherDataService';

// Obter dados meteorológicos
const weatherData = await fetchWeatherDataForUberlandia();

// O body completo estará em weatherData
console.log('Body completo:', JSON.stringify(weatherData, null, 2));

// Usar para outros serviços
const bodyParaOutroServico = {
  pontos: weatherData.pontos.map(ponto => ({
    lon: ponto.lon,
    lat: ponto.lat,
    chuva_mm: ponto.chuva_mm,
    freq_min: ponto.freq_min,
    modo: ponto.modo
  }))
};

// Enviar para outro serviço
fetch('/api/outro-servico', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(bodyParaOutroServico)
});
```

### 4. Estrutura do Body

O body retornado segue exatamente o formato solicitado:

```json
{
  "pontos": [
    {
      "lon": -48.401806,        // Longitude
      "lat": -19.02125,         // Latitude  
      "chuva_mm": 0,            // Chuva em milímetros (do banco)
      "freq_min": 60,           // Frequência em minutos (do banco)
      "modo": "geo"             // Modo fixo
    }
    // ... 2477 pontos adicionais
  ]
}
```

### 5. Dados do Banco

Os dados `chuva_mm` e `freq_min` vêm da tabela `rain_forecast` do Supabase:
- **chuva_mm**: Campo `rainfall_mm` da tabela
- **freq_min**: Campo `rainfall_time` convertido para minutos
- Se não houver dados no banco, usa valores padrão (0mm, 60min)

### 6. Monitoramento

Para acompanhar o processamento em tempo real, observe os logs:
- Progresso por lotes
- Estatísticas de pontos com/sem chuva
- Body completo ao final
- Erros específicos se houver

### 7. Performance

- **Tempo estimado**: 2-3 minutos para 2478 pontos
- **Processamento**: 50 pontos por lote
- **Logs detalhados**: Acompanhamento em tempo real
- **Tratamento de erros**: Continua mesmo com falhas
