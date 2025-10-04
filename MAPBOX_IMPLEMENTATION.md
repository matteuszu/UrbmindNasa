# Implementação do Mapbox - Dashboard UrbMind

## 📍 Visão Geral

Este documento descreve a implementação do Mapbox como background da tela principal do Dashboard UrbMind, conforme o design fornecido.

## 🗺️ Configuração do Mapbox

### Token de Acesso
- **Token**: `pk.eyJ1IjoidXJibWluZCIsImEiOiJjbWdjZThmcXgwbXdiMmlwbWsxc2d2czcxIn0.zy2SVmAiQREsG2TeosmyUA`
- **Estilo Personalizado**: `mapbox://styles/urbmind/cmgcff8ne00eb01qwgcvbgyqu`

### Arquivos de Configuração
- **Configuração**: `src/config/mapbox.ts`
- **Componente Principal**: `src/components/Dashboard.tsx`

## 🎨 Características do Design

### Layout
- **Mapa como Background**: O mapa ocupa toda a tela como fundo
- **Header Flutuante**: Barra superior com blur e transparência
- **Painel Inferior**: Cards de clima e informações do usuário
- **Marcador de Localização**: Indicador animado da posição do usuário

### Elementos Visuais
1. **Header UrbMind**
   - Fundo com blur e transparência
   - Logo centralizado
   - Posicionamento absoluto no topo

2. **Cards de Clima**
   - Dois cards lado a lado
   - Fundo semi-transparente com blur
   - Informações de temperatura e condições
   - Horários de previsão

3. **Marcador de Localização**
   - Design personalizado com "CP"
   - Animação de pulsação
   - Círculos concêntricos animados
   - Cor azul (#0d52ff)

## 🚀 Funcionalidades

### Geolocalização
- Detecção automática da localização do usuário
- Fallback para Uberlândia, MG se a geolocalização falhar
- Animação suave para a localização do usuário

### Interatividade do Mapa
- Zoom e navegação padrão do Mapbox
- Estilo personalizado aplicado
- Controles de navegação desabilitados (conforme design)

### Responsividade
- Layout adaptável para diferentes tamanhos de tela
- Cards de clima responsivos
- Header centralizado

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   ├── Dashboard.tsx          # Componente principal do dashboard
│   └── UrbMindDashboard.tsx   # Componente antigo (mantido para referência)
├── config/
│   └── mapbox.ts             # Configuração do Mapbox
└── mapa/                     # Arquivos do estilo personalizado
    ├── style.json            # Configuração do estilo
    ├── license.txt           # Licenças
    └── sprite_images/        # Ícones do mapa
```

## 🛠️ Como Usar

### 1. Instalação
```bash
npm install
```

### 2. Executar o Projeto
```bash
npm run dev
```

### 3. Acessar o Dashboard
- Faça login ou cadastro
- O dashboard será exibido automaticamente após autenticação

## 🎯 Personalização

### Alterar Localização Padrão
Edite o arquivo `src/config/mapbox.ts`:
```typescript
export const MAPBOX_CONFIG = {
  // ... outras configurações
  defaultCenter: [-48.2772, -18.9186], // [longitude, latitude]
  defaultZoom: 12,
};
```

### Modificar Estilo do Mapa
- Acesse o Mapbox Studio
- Edite o estilo `cmgcff8ne00eb01qwgcvbgyqu`
- As alterações serão refletidas automaticamente

### Personalizar Cards de Clima
Edite o componente `Dashboard.tsx` na seção dos cards de clima:
```tsx
{/* Weather Cards */}
<div className="flex gap-4">
  {/* Seus cards personalizados aqui */}
</div>
```

## 🔧 Dependências

- `mapbox-gl`: ^3.15.0
- `@types/mapbox-gl`: ^3.4.1
- `react`: ^18.3.1
- `tailwindcss`: Para estilização

## 📱 Compatibilidade

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Mobile (iOS Safari, Chrome Mobile)
- ✅ Tablet (iPad, Android tablets)

## 🐛 Solução de Problemas

### Mapa não carrega
1. Verifique se o token do Mapbox está correto
2. Confirme se o estilo personalizado existe
3. Verifique a conexão com a internet

### Geolocalização não funciona
1. Verifique as permissões do navegador
2. Teste em HTTPS (geolocalização requer conexão segura)
3. Verifique se o dispositivo suporta geolocalização

### Estilo não aplica
1. Confirme se o ID do estilo está correto
2. Verifique se o estilo está público ou acessível
3. Aguarde alguns segundos para o cache atualizar

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console do navegador
2. Confirme se todas as dependências estão instaladas
3. Teste em um ambiente limpo

---

**Desenvolvido para UrbMind** 🚀

