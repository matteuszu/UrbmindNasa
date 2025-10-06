# Separação de Layouts Mobile e Desktop

## Visão Geral

O projeto agora possui layouts completamente separados para mobile e desktop, permitindo ajustes independentes em cada plataforma sem afetar a outra.

## Estrutura

### Hook de Detecção de Dispositivo
- **Arquivo**: `src/hooks/useDevice.ts`
- **Funcionalidade**: Detecta automaticamente o tipo de dispositivo (mobile, tablet, desktop)
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1023px
  - Desktop: ≥ 1024px

### Layouts Separados

#### MobileLayout
- **Arquivo**: `src/components/layouts/MobileLayout.tsx`
- **Características**:
  - Layout vertical (coluna)
  - Header compacto com ícones menores
  - Mapa com altura dinâmica (60vh ou 0 quando busca expandida)
  - Bottom section ocupa tela inteira quando busca ativa
  - Controles do mapa ocultos durante busca

#### DesktopLayout
- **Arquivo**: `src/components/layouts/DesktopLayout.tsx`
- **Características**:
  - Layout horizontal (linha)
  - Header espaçoso com ícones maiores
  - Mapa ocupa maior parte da tela (flex: 1)
  - Sidebar fixa de 400px à direita
  - Controles sempre visíveis

### HomePage Atualizada
- **Arquivo**: `src/components/HomePage.tsx`
- **Funcionalidade**: Renderiza o layout apropriado baseado no dispositivo detectado
- **Lógica**: Usa `useDevice()` para determinar qual layout renderizar

## Vantagens

1. **Desenvolvimento Independente**: Ajustes no mobile não afetam o desktop e vice-versa
2. **Código Mais Limpo**: Cada layout tem sua própria lógica e estilos
3. **Manutenção Facilitada**: Mudanças específicas de plataforma são isoladas
4. **Performance**: Apenas o layout necessário é renderizado
5. **Flexibilidade**: Fácil adicionar novos breakpoints ou layouts

## Como Usar

### Para Ajustes no Mobile
1. Edite `src/components/layouts/MobileLayout.tsx`
2. Modifique estilos, comportamentos ou estrutura específicos do mobile
3. As mudanças não afetarão o desktop

### Para Ajustes no Desktop
1. Edite `src/components/layouts/DesktopLayout.tsx`
2. Modifique estilos, comportamentos ou estrutura específicos do desktop
3. As mudanças não afetarão o mobile

### Para Ajustes Globais
1. Edite `src/components/HomePage.tsx` para lógica compartilhada
2. Ou modifique os hooks e serviços compartilhados

## Exemplo de Uso

```tsx
// No HomePage.tsx
const device = useDevice();

if (device.isMobile) {
  return <MobileLayout {...props} />;
}

return <DesktopLayout {...props} />;
```

## Breakpoints Customizáveis

Para alterar os breakpoints, modifique as constantes em `useDevice.ts`:

```tsx
const MOBILE_BREAKPOINT = 768;  // < 768px = mobile
const TABLET_BREAKPOINT = 1024; // 768px - 1023px = tablet
// ≥ 1024px = desktop
```

## Próximos Passos

- Adicionar suporte para tablet como layout separado se necessário
- Implementar animações específicas para cada plataforma
- Otimizar performance com lazy loading dos layouts
- Adicionar testes específicos para cada layout
