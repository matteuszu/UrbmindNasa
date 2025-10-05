import React from 'react';
import { useWeatherData } from '../hooks/useWeatherData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { RefreshCw, CloudRain, MapPin } from 'lucide-react';

/**
 * Componente para exibir os dados meteorológicos de Uberlândia
 */
export function WeatherDataDisplay() {
  const { weatherData, loading, error, refetch } = useWeatherData();

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5" />
            Dados Meteorológicos - Uberlândia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Carregando dados meteorológicos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5" />
            Dados Meteorológicos - Uberlândia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Erro ao carregar dados: {error}</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData || !weatherData.pontos.length) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5" />
            Dados Meteorológicos - Uberlândia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Nenhum dado meteorológico disponível</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Recarregar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5" />
            Dados Meteorológicos - Uberlândia
          </CardTitle>
          <Button onClick={refetch} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Carregando...' : 'Atualizar'}
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Total de pontos monitorados: {weatherData.pontos.length}
        </p>
      </CardHeader>
      <CardContent>
        {/* Estatísticas gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{weatherData.pontos.length}</div>
              <div className="text-sm text-gray-600">Total de Pontos</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {weatherData.pontos.filter(p => p.chuva_mm > 0).length}
              </div>
              <div className="text-sm text-gray-600">Pontos com Chuva</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {weatherData.pontos.filter(p => p.chuva_mm === 0).length}
              </div>
              <div className="text-sm text-gray-600">Pontos sem Chuva</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.max(...weatherData.pontos.map(p => p.chuva_mm))}mm
              </div>
              <div className="text-sm text-gray-600">Chuva Máxima</div>
            </div>
          </Card>
        </div>

        {/* Amostra dos primeiros 20 pontos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Amostra dos Dados (Primeiros 20 pontos)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weatherData.pontos.slice(0, 20).map((ponto, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Ponto {index + 1}</span>
                  </div>
                  <Badge variant={ponto.chuva_mm > 0 ? "destructive" : "secondary"}>
                    {ponto.chuva_mm}mm
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Latitude:</span>
                    <span className="font-mono">{ponto.lat.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Longitude:</span>
                    <span className="font-mono">{ponto.lon.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frequência:</span>
                    <span>{ponto.freq_min} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Modo:</span>
                    <Badge variant="outline">{ponto.modo}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {weatherData.pontos.length > 20 && (
            <div className="text-center mt-4">
              <p className="text-gray-600">
                Mostrando 20 de {weatherData.pontos.length} pontos. 
                Use o JSON completo abaixo para acessar todos os dados.
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">JSON de Saída:</h4>
          <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
            {JSON.stringify(weatherData, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
