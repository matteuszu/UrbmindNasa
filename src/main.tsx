
  import React from "react";
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import 'mapbox-gl/dist/mapbox-gl.css';
  import "./index.css";

  createRoot(document.getElementById("root")!).render(<App />);
  