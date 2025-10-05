
  import React from "react";
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import 'mapbox-gl/dist/mapbox-gl.css';
  import "./index.css";
  import { initializeWeatherDataService } from "./services/weatherDataService";
  import { setWeatherData, setWeatherDataProcessing } from "./services/weatherDataStore";

  // Renderizar a aplicação imediatamente
  console.log('🚀 Iniciando aplicação UrbMind...');
  createRoot(document.getElementById("root")!).render(<App />);

  // Executar processamento de dados meteorológicos em background
  // Não bloqueia a renderização da aplicação
  (async () => {
    try {
      console.log('🔄 Iniciando processamento de dados meteorológicos em background...');
      setWeatherDataProcessing(true);
      
      // Executar serviço de dados meteorológicos em background
      const weatherData = await initializeWeatherDataService();
      console.log('📊 Dados meteorológicos carregados:', weatherData);
      
      // Armazenar dados no store global
      setWeatherData(weatherData);
      setWeatherDataProcessing(false);
      
      // Console.log adicional para mostrar o body completo
      console.log('🎯 BODY FINAL PARA OUTROS SERVIÇOS:');
      console.log(JSON.stringify(weatherData, null, 2));
      
    } catch (error) {
      console.error('❌ Erro no processamento de dados meteorológicos:', error);
      setWeatherDataProcessing(false);
    }
  })();
  