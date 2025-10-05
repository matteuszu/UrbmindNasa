import React from 'react';
import { WeatherDataDisplay } from '../components/WeatherDataDisplay';
import { ApiResponseDisplay } from '../components/ApiResponseDisplay';
import { Header } from '../components/Header';

export default function WeatherPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dados Meteorológicos
          </h1>
          <p className="text-gray-600">
            Monitoramento em tempo real das condições climáticas em Uberlândia
          </p>
        </div>
        
        <WeatherDataDisplay />
        
        <div className="mt-8">
          <ApiResponseDisplay />
        </div>
      </main>
    </div>
  );
}
