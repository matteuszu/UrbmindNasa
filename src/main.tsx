
  import React from "react";
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import 'mapbox-gl/dist/mapbox-gl.css';
  import "./index.css";
  import { initializeWeatherDataService } from "./services/weatherDataService";

  // Renderizar a aplicação imediatamente
  createRoot(document.getElementById("root")!).render(<App />);

  // Executar processamento de dados meteorológicos em background
  (async () => {
    try {
      await initializeWeatherDataService();
    } catch (error) {
      console.error('❌ Erro no processamento de dados meteorológicos:', error);
    }
  })();
  