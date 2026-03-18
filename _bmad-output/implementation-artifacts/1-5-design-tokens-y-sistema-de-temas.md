# Story 1.5: Design Tokens y Sistema de Temas

Status: ready-for-dev

## Story

As a visitor,
I want a visually consistent site with professional dark and light themes,
So that the portfolio looks polished and my theme preference is respected.

## Acceptance Criteria

1. **Given** Tailwind CSS 4 config with `@theme` in `src/styles/global.css` **When** I inspect CSS custom properties **Then** all semantic color tokens exist (primary, primary-dark, background, surface, surface-elevated, text-primary, text-secondary, text-muted, border, success, warning, error) with correct values for both themes
2. **And** brand gradient renders `linear-gradient(135deg, #48A1CD, #108385)`
3. **And** 8 typography tokens exist (display, heading-1, heading-2, heading-3, body, body-sm, caption, code) with Poppins, correct clamp() sizes, weights 400-700, line-heights 1.1-1.6
4. **And** Poppins loaded from Google Fonts with `font-display: swap` and preload
5. **And** JetBrains Mono configured for code blocks
6. **And** spacing tokens use 4px base scale (space-1=4px through space-24=96px)
7. **And** breakpoints: `sm:` = >=450px, `lg:` = >=900px, `xl:` = >=1200px
8. **And** dark mode is default theme
9. **And** text/background contrast meets WCAG AA (>4.5:1 normal, >3:1 large)

## Tasks / Subtasks

- [ ] Task 1: Configurar carga de fuentes (AC: #4, #5)
  - [ ] 1.1 **PRIMARY:** Configurar Astro Fonts API en `astro.config.mjs` — Poppins (400,500,600,700) y JetBrains Mono (400) via `fontProviders.google()` con `display: 'swap'`. **Verificacion rapida:** agregar el import `import { defineConfig, fontProviders } from 'astro/config'` y ejecutar `pnpm build`. Si el build falla con error de import (ej: `fontProviders is not exported`) → la API no esta disponible en esta version, ir directo a 1.2
  - [ ] 1.2 **FALLBACK (si 1.1 falla):** `pnpm add @fontsource/poppins @fontsource/jetbrains-mono`. Importar CSS de pesos específicos en `src/pages/index.astro` (mover a BaseLayout en Story 1.7). Si se usa este path, cambiar fonts en `@theme inline` a `@theme` (sin inline) con strings directos (ver seccion "Si se usa @fontsource" en Dev Notes)
  - [ ] 1.3 Verificar que `pnpm build` genera CSS con `@font-face` declarations para Poppins y JetBrains Mono

- [ ] Task 2: Implementar tokens de color semánticos (AC: #1, #2)
  - [ ] 2.1 En `src/styles/global.css`: definir CSS variables en `:root` (light mode) y `.dark` (dark mode) con valores exactos del UX spec (ver tabla en Dev Notes)
  - [ ] 2.2 Agregar bloque `@theme inline` que bridge las CSS variables a utilidades Tailwind (`bg-background`, `text-text-primary`, etc.)
  - [ ] 2.3 Agregar CSS custom property `--brand-gradient: linear-gradient(135deg, #48A1CD, #108385);` en `:root` (no cambia con tema)

- [ ] Task 3: Configurar dark mode como default (AC: #8)
  - [ ] 3.1 Agregar `@custom-variant dark (&:where(.dark, .dark *));` en `global.css` (class-based dark mode en Tailwind v4)
  - [ ] 3.2 En `src/pages/index.astro`: agregar `class="dark"` al elemento `<html>` — dark mode es default. Story 1.9 agregará el toggle y la persistencia

- [ ] Task 4: Definir tokens de tipografia (AC: #3)
  - [ ] 4.1 En bloque `@theme` de `global.css`: definir 8 compound typography tokens con namespace `--text-*`, incluyendo sub-propiedades `--line-height`, `--font-weight` (ver tabla exacta en Dev Notes)
  - [ ] 4.2 Configurar font families en `@theme inline` (si Astro Fonts API): `--font-sans: var(--font-poppins), ...` y `--font-mono: var(--font-jetbrains-mono), ...`. Si @fontsource: usar `@theme` (sin inline) con strings directos

- [ ] Task 5: Definir spacing y breakpoints (AC: #6, #7)
  - [ ] 5.1 En `@theme`: `--spacing: 0.25rem;` — esto genera automáticamente la escala 4px base (p-1=4px, p-2=8px, ..., p-24=96px)
  - [ ] 5.2 En `@theme`: limpiar breakpoints default y definir custom: `--breakpoint-*: initial;` seguido de `--breakpoint-sm: 28.125rem; --breakpoint-lg: 56.25rem; --breakpoint-xl: 75rem;`

- [ ] Task 6: Test de contraste WCAG AA (AC: #9)
  - [ ] 6.1 Crear `src/styles/__tests__/contrast.test.ts` con función `contrastRatio(hex1, hex2)` que calcula WCAG contrast ratio
  - [ ] 6.2 Tests para los 6 pares críticos con thresholds diferenciados segun UX spec:
    - text-primary/background en ambos temas: **>7:1** (UX spec requiere >7:1 para texto principal)
    - text-secondary/background en ambos temas: **>4.5:1** (WCAG AA normal text)
    - primary-dark/surface en ambos temas: **>3:1** (acento/link — texto grande). Usar `primary-dark` (#108385) en vez de `primary` (#48A1CD) porque primary sobre blanco es ~2.97:1 y NO pasa. Primary se usa como color de acento visual (gradientes, bordes, iconos), NO como texto sobre fondo blanco

- [ ] Task 7: Validaciones finales
  - [ ] 7.1 `pnpm lint` — 0 errores
  - [ ] 7.2 `pnpm type-check` — 0 errores
  - [ ] 7.3 `pnpm build` — 0 errores, CSS generado contiene los custom properties
  - [ ] 7.4 `pnpm test` — **47 tests** pasan (41 existentes + 6 contrast nuevos)

## Dev Notes

### Contexto Critico

Esta story define el **design system foundation** del portfolio. Todos los componentes (Stories 1.6+), layouts (Story 1.7), y toggles (Story 1.9) dependen de los tokens definidos aqui. Despues de esta story, NUNCA se usan colores hex hardcodeados en componentes — todo via utilidades Tailwind semanticas (`bg-background`, `text-text-primary`, `text-primary`).

**Dependencia directa de esta story:**
- Story 1.6 (componentes UI base) usa estos tokens para estilos
- Story 1.7 (layouts) usa los tokens + font families
- Story 1.9 (ThemeToggle) alterna entre `.dark`/sin-clase que activa las CSS variables

### Tailwind CSS v4 — Patrones Clave

**@theme vs @theme inline:**
- `@theme { ... }` — valores estaticos, resueltos en build time. Usar para spacing, breakpoints, tipografia
- `@theme inline { ... }` — preserva `var()` references. REQUERIDO para colores semanticos que cambian con dark/light via CSS variables en `:root`/`.dark`

**@custom-variant dark:**
```css
@custom-variant dark (&:where(.dark, .dark *));
```
Esto convierte el prefijo `dark:` de media-query a class-based. Con class="dark" en `<html>`, las utilidades `dark:` se activan.

**Spacing base:**
```css
@theme {
  --spacing: 0.25rem;  /* 4px — multiplier automatico: p-1=4px, p-6=24px, p-24=96px */
}
```
NO definir tokens individuales — Tailwind v4 multiplica automaticamente: `spacing-N = N x base`.

**Breakpoints — clearing defaults obligatorio:**
```css
@theme {
  --breakpoint-*: initial;  /* Elimina sm=640px, md=768px, lg=1024px, xl=1280px defaults */
  --breakpoint-sm: 28.125rem;  /* 450px */
  --breakpoint-lg: 56.25rem;   /* 900px */
  --breakpoint-xl: 75rem;      /* 1200px */
}
```
Sin `--breakpoint-*: initial`, Tailwind mantiene los defaults Y los custom, causando conflicto en `sm:`.

### Tabla de Colores — Valores Exactos

| Token Tailwind | CSS Variable | Light Mode | Dark Mode |
|---|---|---|---|
| `primary` | (estatico) | #48A1CD | #48A1CD |
| `primary-dark` | (estatico) | #108385 | #108385 |
| `background` | `--theme-bg` | #FAFBFC | #0F1419 |
| `surface` | `--theme-surface` | #FFFFFF | #1A1F2E |
| `surface-elevated` | `--theme-surface-elevated` | #F5F7FA | #242938 |
| `text-primary` | `--theme-text-primary` | #1A1F2E | #E8ECF1 |
| `text-secondary` | `--theme-text-secondary` | #5A6270 | #8B95A5 |
| `text-muted` | `--theme-text-muted` | #8B95A5 | #5A6270 |
| `border` | `--theme-border` | #E2E6EB | #2D3344 |
| `success` | `--theme-success` | #10B981 | #34D399 |
| `warning` | `--theme-warning` | #F59E0B | #FBBF24 |
| `error` | `--theme-error` | #EF4444 | #F87171 |

**Uso en Tailwind:** `bg-background`, `bg-surface`, `text-text-primary`, `text-primary`, `border-border`, `text-success`, etc.

**Brand gradient:** `--brand-gradient: linear-gradient(135deg, #48A1CD, #108385);` — no cambia con tema. Aplicar via CSS custom property, no como utilidad Tailwind.

### Tipografia — 8 Tokens Compound

| Token (`text-*`) | Tamano | Weight | Line Height | Uso |
|---|---|---|---|---|
| `display` | clamp(2rem, 5vw, 3.5rem) | 700 | 1.1 | Nombre hero, titulos de pagina |
| `heading-1` | clamp(1.5rem, 3vw, 2.25rem) | 600 | 1.2 | Titulos de seccion |
| `heading-2` | clamp(1.25rem, 2.5vw, 1.75rem) | 600 | 1.3 | Subtitulos, nombres de proyecto |
| `heading-3` | clamp(1.1rem, 2vw, 1.375rem) | 500 | 1.4 | Titulos de card |
| `body` | 1rem (16px) | 400 | 1.6 | Texto de parrafo |
| `body-sm` | 0.875rem (14px) | 400 | 1.5 | Metadata, fechas, tags (UX spec lo llama "body-small", CSS token es `body-sm`) |
| `caption` | 0.75rem (12px) | 400 | 1.4 | Labels, helpers |
| `code` | 0.875rem (14px) | 400 | 1.5 | Code blocks (JetBrains Mono) |

**Formato compound en Tailwind v4:**
```css
@theme {
  --text-display: clamp(2rem, 5vw, 3.5rem);
  --text-display--line-height: 1.1;
  --text-display--font-weight: 700;
}
```
**Uso:** `<h1 class="text-display">` aplica font-size, line-height Y font-weight automaticamente.

### Implementacion Exacta — global.css (REFERENCIA CANONICA)

**Este bloque es el resultado final esperado de `src/styles/global.css`.** Las Tasks 2-5 describen el orden de ejecucion, pero este bloque es la fuente de verdad para el contenido completo del archivo. Copiar este bloque y ajustar solo la seccion de fonts segun si se usa Astro Fonts API (Task 1.1) o @fontsource (Task 1.2).

```css
@import 'tailwindcss';

/* ============================================
 * Dark mode: class-based strategy
 * ============================================ */
@custom-variant dark (&:where(.dark, .dark *));

/* ============================================
 * Theme-variant CSS variables
 * :root = light mode, .dark = dark mode
 * <html class="dark"> hace dark el default
 * ============================================ */
:root {
  --theme-bg: #FAFBFC;
  --theme-surface: #FFFFFF;
  --theme-surface-elevated: #F5F7FA;
  --theme-text-primary: #1A1F2E;
  --theme-text-secondary: #5A6270;
  --theme-text-muted: #8B95A5;
  --theme-border: #E2E6EB;
  --theme-success: #10B981;
  --theme-warning: #F59E0B;
  --theme-error: #EF4444;
  --brand-gradient: linear-gradient(135deg, #48A1CD, #108385);
}

.dark {
  --theme-bg: #0F1419;
  --theme-surface: #1A1F2E;
  --theme-surface-elevated: #242938;
  --theme-text-primary: #E8ECF1;
  --theme-text-secondary: #8B95A5;
  --theme-text-muted: #5A6270;
  --theme-border: #2D3344;
  --theme-success: #34D399;
  --theme-warning: #FBBF24;
  --theme-error: #F87171;
}

/* ============================================
 * Tailwind bridge: dynamic tokens
 * @theme inline preserva var() references
 * ============================================ */
@theme inline {
  --color-primary: #48A1CD;
  --color-primary-dark: #108385;
  --color-background: var(--theme-bg);
  --color-surface: var(--theme-surface);
  --color-surface-elevated: var(--theme-surface-elevated);
  --color-text-primary: var(--theme-text-primary);
  --color-text-secondary: var(--theme-text-secondary);
  --color-text-muted: var(--theme-text-muted);
  --color-border: var(--theme-border);
  --color-success: var(--theme-success);
  --color-warning: var(--theme-warning);
  --color-error: var(--theme-error);

  /* Fonts — si Astro Fonts API: usar var() */
  --font-sans: var(--font-poppins), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
}

/* ============================================
 * Static tokens (no cambian con tema)
 * ============================================ */
@theme {
  /* Spacing: 4px base */
  --spacing: 0.25rem;

  /* Breakpoints: custom (defaults cleared) */
  --breakpoint-*: initial;
  --breakpoint-sm: 28.125rem;
  --breakpoint-lg: 56.25rem;
  --breakpoint-xl: 75rem;

  /* Typography: 8 compound tokens */
  --text-display: clamp(2rem, 5vw, 3.5rem);
  --text-display--line-height: 1.1;
  --text-display--font-weight: 700;

  --text-heading-1: clamp(1.5rem, 3vw, 2.25rem);
  --text-heading-1--line-height: 1.2;
  --text-heading-1--font-weight: 600;

  --text-heading-2: clamp(1.25rem, 2.5vw, 1.75rem);
  --text-heading-2--line-height: 1.3;
  --text-heading-2--font-weight: 600;

  --text-heading-3: clamp(1.1rem, 2vw, 1.375rem);
  --text-heading-3--line-height: 1.4;
  --text-heading-3--font-weight: 500;

  --text-body: 1rem;
  --text-body--line-height: 1.6;
  --text-body--font-weight: 400;

  --text-body-sm: 0.875rem;
  --text-body-sm--line-height: 1.5;
  --text-body-sm--font-weight: 400;

  --text-caption: 0.75rem;
  --text-caption--line-height: 1.4;
  --text-caption--font-weight: 400;

  --text-code: 0.875rem;
  --text-code--line-height: 1.5;
  --text-code--font-weight: 400;
}
```

**Si se usa @fontsource (fallback)**, cambiar el bloque de fonts de `@theme inline` a `@theme`:
```css
@theme {
  --font-sans: 'Poppins', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

### Carga de Fuentes — Dos Opciones

**Opcion A: Astro Fonts API (preferida)** — Zero dependencias, auto-preload, auto-self-hosting:
```javascript
// astro.config.mjs
import { defineConfig, fontProviders } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  integrations: [svelte()],
  vite: { plugins: [tailwindcss()] },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Poppins',
      cssVariable: '--font-poppins',
      weights: [400, 500, 600, 700],
      display: 'swap',
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: [400],
      display: 'swap',
    },
  ],
});
```
**Verificacion:** Si `fontProviders` no se puede importar de `'astro/config'`, la API no esta disponible en esta version. Usar Opcion B.

**Opcion B: @fontsource (fallback fiable):**
```bash
pnpm add @fontsource/poppins @fontsource/jetbrains-mono
```
```astro
---
// src/pages/index.astro — mover a BaseLayout en Story 1.7
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/jetbrains-mono/400.css';
---
```
@fontsource auto-aplica `font-display: swap` y self-hostea las fuentes. Preload se maneja via optimizacion de Vite.

### Test de Contraste WCAG — Implementacion

```typescript
// src/styles/__tests__/contrast.test.ts
import { describe, test, expect } from 'vitest';

/**
 * Calcula relative luminance segun WCAG 2.1
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const linearize = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Colores del design system
const colors = {
  dark: { bg: '#0F1419', surface: '#1A1F2E', textPrimary: '#E8ECF1', textSecondary: '#8B95A5' },
  light: { bg: '#FAFBFC', surface: '#FFFFFF', textPrimary: '#1A1F2E', textSecondary: '#5A6270' },
  brand: { primary: '#48A1CD', primaryDark: '#108385' },
};

describe('WCAG AA Contrast Ratios', () => {
  // text-primary sobre background: UX spec requiere >7:1
  test('dark: text-primary on background > 7:1', () => {
    expect(contrastRatio(colors.dark.textPrimary, colors.dark.bg)).toBeGreaterThan(7);
  });

  test('light: text-primary on background > 7:1', () => {
    expect(contrastRatio(colors.light.textPrimary, colors.light.bg)).toBeGreaterThan(7);
  });

  // text-secondary sobre background: WCAG AA >4.5:1
  test('dark: text-secondary on background > 4.5:1', () => {
    expect(contrastRatio(colors.dark.textSecondary, colors.dark.bg)).toBeGreaterThan(4.5);
  });

  test('light: text-secondary on background > 4.5:1', () => {
    expect(contrastRatio(colors.light.textSecondary, colors.light.bg)).toBeGreaterThan(4.5);
  });

  // primary-dark sobre surface: >3:1 (usado como color de texto/link accesible)
  // Nota: primary (#48A1CD) sobre blanco es ~2.97:1 y NO pasa — primary se usa
  // como acento visual (gradientes, bordes, iconos), NO como texto sobre fondo blanco.
  // Para texto accesible en light mode, usar primary-dark (#108385) que tiene ~5.5:1.
  test('dark: primary-dark on surface > 3:1', () => {
    expect(contrastRatio(colors.brand.primaryDark, colors.dark.surface)).toBeGreaterThan(3);
  });

  test('light: primary-dark on surface > 3:1', () => {
    expect(contrastRatio(colors.brand.primaryDark, colors.light.surface)).toBeGreaterThan(3);
  });
});
```

**Regla de uso de primary vs primary-dark:** `primary` (#48A1CD) tiene ratio ~2.97:1 sobre blanco — usarlo SOLO como acento visual (gradientes, bordes, iconos, backgrounds). Para texto accesible sobre surface (links, labels), usar `primary-dark` (#108385) que tiene ~5.5:1 sobre blanco. Los tests validan `primary-dark` sobre surface, NO `primary`.

### Inteligencia de Story 1-4

Estado actual post Story 1-4:
- **Tailwind CSS 4.2.1** via `@tailwindcss/vite` — CSS-first config, NO `tailwind.config.js`
- **`src/styles/global.css`** tiene placeholder `@theme {}` con comentario "Se configuraran en Story 1.5"
- **Astro 6.0.5** con output static, Svelte integration
- **Vitest 4.1.0** — 41 tests pasan (35 schema + 6 factory). Despues de esta story deben ser **47** (41 + 6 contrast). Test pattern en vitest.config.ts: `src/**/*.{test,spec}.{js,ts}`
- **TypeScript strictest** — `extends: "astro/tsconfigs/strictest"`
- **ESLint** con plugins astro y svelte
- **CI pipeline** en push a main: lint -> type-check -> test -> build -> Lighthouse
- **Zod 4.3.6** schemas operativos en `src/lib/schemas/`
- **Node 22.12.0** con ESM (`"type": "module"`)
- **`src/pages/index.astro`** es minimal template — no tiene layout aun (Story 1.7)
- **`src/components/`** solo contiene `.gitkeep` placeholders

### Que NO Hacer en Esta Story

- **NO crear componentes** — solo definir tokens CSS. Los componentes que usan estos tokens son Story 1.6+
- **NO crear layouts (BaseLayout, AdminLayout)** — eso es Story 1.7. Si se necesita importar fuentes, hacerlo en index.astro temporalmente
- **NO implementar ThemeToggle ni persistencia de tema** — eso es Story 1.9. Solo asegurar que dark mode es default via `class="dark"`
- **NO definir `tailwind.config.js`** — Tailwind v4 usa CSS-first config con `@theme`
- **NO limpiar el namespace `--color-*` con `initial`** — mantener los colores default de Tailwind como fallback utilities. Los tokens semanticos se agregan junto a los defaults
- **NO limpiar `--text-*` defaults** — mantener text-sm, text-lg etc. de Tailwind. Tokens custom (text-display, text-heading-1) se agregan sin conflicto
- **NO agregar `@fontsource` si Astro Fonts API funciona** — preferir la solucion built-in
- **NO agregar script de FOUC prevention** — innecesario porque Astro SSG genera HTML estatico con class="dark" ya incluido. El script sera relevante en Story 1.9 con localStorage
- **NO definir shadow o border-radius tokens** — el UX spec los menciona como tokens futuros, pero no son parte de los ACs de esta story. Se definiran cuando los componentes los necesiten (Story 1.6+)
- **NO crear contenido en `design-artifacts/D-Design-System/`** — ese directorio existe vacio como placeholder del WDS module, no se usa en el BMM workflow

### Project Structure Notes

Archivos modificados y nuevos:

```
portfolio/
├── astro.config.mjs              # MODIFICADO — fonts config (si Astro Fonts API)
├── package.json                   # POSIBLEMENTE MODIFICADO (si @fontsource fallback)
├── src/
│   ├── pages/
│   │   └── index.astro            # MODIFICADO — class="dark" en <html>, imports de fuentes si @fontsource
│   └── styles/
│       ├── global.css             # MODIFICADO — tokens de color, tipografia, spacing, breakpoints, dark mode
│       └── __tests__/
│           └── contrast.test.ts   # NUEVO — tests WCAG AA de ratios de contraste
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.5 Acceptance Criteria]
- [Source: _bmad-output/planning-artifacts/architecture.md — Styling Solution (Tailwind CSS v4.1, CSS-first, @theme)]
- [Source: _bmad-output/planning-artifacts/architecture.md — Structure Patterns (src/styles/global.css)]
- [Source: _bmad-output/planning-artifacts/architecture.md — Naming Patterns (PascalCase components, kebab-case files)]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Color System (tabla completa light/dark)]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Typography System (8 tokens, Poppins, clamp())]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Spacing & Layout (4px base, breakpoints)]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Accessibility (WCAG AA contrast >4.5:1/>3:1)]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Theme Switching (dark default, class strategy)]
- [Source: _bmad-output/implementation-artifacts/1-4-zod-schemas-y-modelos-de-datos.md — CI pipeline, TypeScript strictest, Vitest 4.1.0]
- [Source: Web research — Tailwind CSS v4 @theme/@theme inline syntax, @custom-variant dark, compound --text-* tokens]
- [Source: Web research — Astro 6.0 Fonts API (fontProviders.google(), auto-preload, self-hosting)]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

### Completion Notes List

### Change Log

### File List
