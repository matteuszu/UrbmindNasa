# 🗺️ Configuração do Mapbox Background

## 📋 Visão Geral

Implementação completa do Mapbox GL JS como background full-screen com todas as funcionalidades solicitadas:

- ✅ **Full-screen background** (100vw x 100vh)
- ✅ **Pointer-events: none** (UI clicável por cima)
- ✅ **Geolocalização automática** com fallback
- ✅ **Marker pulsante** + círculo de precisão
- ✅ **Auto-center** + watchPosition em tempo real
- ✅ **Proteção SSR** com dynamic import
- ✅ **Dark mode automático**
- ✅ **Cleanup completo**
- ✅ **Acessibilidade** com toasts
- ✅ **TypeScript** completo

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Mapbox Token
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoidXJibWluZCIsImEiOiJjbWdjZThmcXgwbXdiMmlwbWsxc2d2czcxIn0.zy2SVmAiQREsG2TeosmyUA
```

### 2. Instalação de Dependências

```bash
npm install mapbox-gl @types/mapbox-gl sonner
```

## 🚀 Uso

### Componente Principal

```tsx
import { DashboardWithMap } from './components/DashboardWithMap';

function App() {
  return (
    <DashboardWithMap userName="Usuário">
      {/* Sua UI aqui - totalmente clicável */}
    </DashboardWithMap>
  );
}
```

### Apenas o Background

```tsx
import { MapboxBackground } from './components/MapboxBackgroundWrapper';

function MyComponent() {
  return (
    <div className="relative w-full h-screen">
      <MapboxBackground />
      {/* Sua UI aqui */}
    </div>
  );
}
```

## 🎯 Funcionalidades

### Geolocalização
- **Auto-detecta** localização do usuário
- **Fallback** para Uberlândia, MG se negado/erro
- **WatchPosition** com throttle (5s)
- **Círculo de precisão** quando disponível

### Marker Animado
- **Pulsação dupla** (outer + inner)
- **Ícone personalizado** (📍)
- **Cores consistentes** (#3b82f6)

### Responsividade
- **Dark mode automático** baseado em `prefers-color-scheme`
- **Estilos dinâmicos**: streets-v12 / dark-v11
- **Loading states** elegantes

### Acessibilidade
- **Toasts informativos** para erros
- **Console warnings** para debug
- **Fallbacks visuais** para todos os estados

## 🔒 Proteção SSR

O componente usa `dynamic import` com `ssr: false`:

```tsx
const MapboxBackground = dynamic(
  () => import('./MapboxBackground'),
  { ssr: false }
);
```

## 🎨 Customização

### Cores do Marker
```css
.marker-pin {
  background: #3b82f6; /* Azul principal */
  border: 3px solid white;
}
```

### Fallback Location
```typescript
const FALLBACK_CENTER: [number, number] = [-48.2772, -18.9186]; // Uberlândia
const FALLBACK_ZOOM = 12;
```

### Throttle de Atualização
```typescript
const throttledUpdateLocation = throttle(updateUserLocation, 5000); // 5s
```

## 🐛 Debug

### Console Logs
- `Mapbox carregado com sucesso`
- `Imagem faltante: [id]`
- `Erro ao obter localização: [message]`

### Toasts
- ✅ Localização obtida
- ❌ Permissão negada
- ❌ Geolocalização não suportada
- ❌ Erro ao carregar mapa

## 📱 Compatibilidade

- ✅ **Desktop**: Chrome, Firefox, Safari, Edge
- ✅ **Mobile**: iOS Safari, Chrome Mobile
- ✅ **Tablet**: iPad, Android tablets
- ✅ **SSR**: Next.js, Vite, Create React App

## 🔧 Troubleshooting

### Mapa não carrega
1. Verifique `NEXT_PUBLIC_MAPBOX_TOKEN`
2. Confirme conexão com internet
3. Verifique console para erros

### Geolocalização não funciona
1. Teste em HTTPS (obrigatório)
2. Verifique permissões do navegador
3. Confirme suporte do dispositivo

### UI não clicável
1. Verifique `pointer-events: none` no mapa
2. Confirme `pointer-events: auto` na UI
3. Verifique z-index dos elementos

## 📦 Estrutura de Arquivos

```
src/components/
├── MapboxBackground.tsx          # Componente principal
├── MapboxBackgroundWrapper.tsx   # Wrapper com SSR protection
└── DashboardWithMap.tsx          # Dashboard completo
```

## 🎯 Próximos Passos

1. **Configure** `NEXT_PUBLIC_MAPBOX_TOKEN`
2. **Teste** a geolocalização
3. **Customize** cores e estilos
4. **Adicione** sua UI por cima

---

**Implementação completa e pronta para produção!** 🚀

