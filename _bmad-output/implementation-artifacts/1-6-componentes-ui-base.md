# Story 1.6: Componentes UI Base

Status: review

## Story

As a developer,
I want a set of reusable UI components following the design system,
So that all features are built with visual consistency from the start.

## Acceptance Criteria

1. **Given** Container component **When** used with default props **Then** centered max-width 1200px with responsive padding (16px mobile, 24px tablet >=450px, 32px desktop >=900px) **And** `narrow` variant sets max-width 720px
2. **Given** Section component **When** used with default props **Then** applies consistent vertical spacing (48px mobile / 96px desktop) **And** `hero` variant uses 64px/128px **And** `compact` variant uses 24px/48px
3. **Given** Button component **When** rendered with variant prop **Then** 4 variants work: `primary` (brand gradient bg, white text, subtle shadow), `secondary` (outline border-primary, text-primary-dark for WCAG AA), `danger` (error bg, white text), `ghost` (no bg, text-text-primary, hover bg sutil) — all min 44x44px touch target
4. **Given** Card component **When** used with default props **Then** shows `surface` background with `border` border **And** hover class option enables `surface-elevated` background transition
5. **Given** Badge component **When** rendered with variant prop **Then** 3 variants work: `technology` (gradient border), `status` with `published` (success bg) / `draft` (warning bg), `language` with `ES` (primary bg) / `EN` (success bg)
6. **Given** Input component **When** rendered with type prop **Then** supports `text`, `textarea`, `select`, `file` variants **And** label always visible above field **And** required fields show asterisk **And** error prop shows red message below field **And** `aria-describedby` links input to error message
7. **Given** any component **When** focused via keyboard **Then** 2px solid primary focus ring visible in both dark and light themes
8. **Given** all components **When** inspected **Then** use Astro (.astro) format with zero JS shipped to browser

## Tasks / Subtasks

- [x] Task 1: Container component (AC: #1)
  - [x] 1.1 Crear `src/components/common/Container.astro` con Props: `variant?: 'default' | 'narrow'`, `class?: string`
  - [x] 1.2 Implementar: `max-w-[75rem]` (1200px) default, `max-w-[45rem]` (720px) narrow, `mx-auto`, padding responsive `px-4 sm:px-6 lg:px-8`

- [x] Task 2: Section component (AC: #2)
  - [x] 2.1 Crear `src/components/common/Section.astro` con Props: `variant?: 'default' | 'hero' | 'compact'`, `id?: string`, `class?: string`
  - [x] 2.2 Implementar: `<section>` semantico con `py-12 lg:py-24` default, `py-16 lg:py-32` hero, `py-6 lg:py-12` compact

- [x] Task 3: Button component (AC: #3, #7)
  - [x] 3.1 Crear `src/components/common/Button.astro` con Props: `variant?: 'primary' | 'secondary' | 'danger' | 'ghost'`, `href?: string`, `type?: 'button' | 'submit' | 'reset'`, `disabled?: boolean`, `class?: string`
  - [x] 3.2 Renderizar `<a>` si `href` esta presente, `<button>` si no — ambos con mismos estilos
  - [x] 3.3 Implementar 4 variantes con estilos Tailwind (ver Dev Notes para clases exactas)
  - [x] 3.4 Base: `min-h-11 min-w-11 px-6 py-3 rounded-lg font-semibold text-body-sm inline-flex items-center justify-center gap-2 transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-primary`
  - [x] 3.5 Disabled: `opacity-50 pointer-events-none`

- [x] Task 4: Card component (AC: #4, #7)
  - [x] 4.1 Crear `src/components/common/Card.astro` con Props: `as?: 'article' | 'div'`, `hoverable?: boolean`, `class?: string`
  - [x] 4.2 Implementar: `bg-surface border border-border rounded-xl p-4`, hover opcional con `hover:bg-surface-elevated transition-colors`

- [x] Task 5: Badge component (AC: #5)
  - [x] 5.1 Crear `src/components/common/Badge.astro` con Props: `variant: 'technology' | 'status' | 'language'`, `value?: 'published' | 'draft' | 'ES' | 'EN'`, `class?: string`
  - [x] 5.2 Implementar 3 variantes (ver Dev Notes para estilos exactos)

- [x] Task 6: Input component (AC: #6, #7)
  - [x] 6.1 Crear `src/components/common/Input.astro` con Props: `type?: 'text' | 'textarea' | 'select' | 'file'`, `name: string`, `label: string`, `required?: boolean`, `error?: string`, `placeholder?: string`, `value?: string`, `class?: string`
  - [x] 6.2 Implementar: `<label>` siempre visible con asterisco condicional, campo segun `type`, error message con `aria-describedby` + `aria-invalid`
  - [x] 6.3 Para `select`: usar `<slot>` para opciones. Para `file`: styled file input

- [x] Task 7: Tests unitarios (AC: #1-#8)
  - [x] 7.1 Crear `src/components/common/__tests__/component-props.test.ts` — tests de tipo que verifican que las interfaces de Props son correctas importando los tipos
  - [x] 7.2 Verificar que los tests existentes (47) siguen pasando

- [x] Task 8: Validaciones finales
  - [x] 8.1 `pnpm lint` — 0 errores
  - [x] 8.2 `pnpm type-check` — 0 errores
  - [x] 8.3 `pnpm build` — 0 errores, HTML generado contiene los componentes
  - [x] 8.4 `pnpm test` — todos los tests pasan

## Dev Notes

### Contexto Critico

Esta story crea la **biblioteca de componentes UI base** del portfolio. Todos los componentes usan los design tokens de Story 1.5 (colores semanticos, tipografia compound, spacing 4px base, breakpoints custom). Despues de esta story, NINGUN componente futuro debe reimplementar estos patterns — debe reusar o extender estos componentes base.

**Dependencia directa de esta story:**
- Story 1.7 (Layouts, Header, Footer) usa Container, Section, Button
- Story 1.8 (i18n) potencialmente usa Badge (language variant)
- Story 1.9 (ThemeToggle) usa Button (ghost variant)
- Epic 2 (sitio publico) usa todos estos componentes
- Epic 3 (admin CRUD) usa Card, Button, Badge, Input
- Epic 4 (blog) usa Card, Badge, Button

### Patron Astro para Props Tipadas

```astro
---
import type { HTMLAttributes } from 'astro/types';

interface Props {
  variant?: 'primary' | 'secondary';
  class?: string;
}

const { variant = 'primary', class: className, ...attrs } = Astro.props;
---

<div class:list={[baseClasses, variantClasses[variant], className]} {...attrs}>
  <slot />
</div>
```

**Reglas clave:**
- `interface Props` en el frontmatter — Astro la detecta automaticamente para type-checking
- `class` es palabra reservada en JS — destructurar como `class: className`
- `class:list` acepta arrays/objetos para clases condicionales
- `<slot />` es el equivalente a `children` — contenido pasado entre tags del componente
- `{...attrs}` permite pasar atributos HTML nativos adicionales (id, data-*, aria-*)

### Estilos Exactos por Componente

#### Container.astro
```
default:  mx-auto w-full max-w-[75rem] px-4 sm:px-6 lg:px-8
narrow:   mx-auto w-full max-w-[45rem] px-4 sm:px-6 lg:px-8
```
Nota: `75rem` = 1200px, `45rem` = 720px. Usar valores arbitrarios de Tailwind `max-w-[75rem]` porque los breakpoints default de Tailwind estan limpiados.

#### Section.astro
```
default:  py-12 lg:py-24    (48px mobile / 96px desktop)
hero:     py-16 lg:py-32    (64px mobile / 128px desktop)
compact:  py-6 lg:py-12     (24px mobile / 48px desktop)
```
Semantica: renderizar como `<section>`, aceptar `id` para anchor links.

#### Button.astro
**Base (compartida):**
```
min-h-11 min-w-11 px-6 py-3 rounded-lg font-semibold text-body-sm
inline-flex items-center justify-center gap-2
transition-colors duration-200
focus:outline-2 focus:outline-offset-2 focus:outline-primary
```
Nota: `min-h-11` = 44px, `min-w-11` = 44px (touch target WCAG).

**Variantes:**
```
primary:    text-white [background:var(--brand-gradient)] shadow-md hover:shadow-lg hover:brightness-110
secondary:  border-2 border-primary text-primary-dark hover:bg-primary/10
danger:     bg-error text-white hover:brightness-110
ghost:      text-text-primary hover:bg-surface-elevated
```

**Nota sobre gradiente:** Tailwind v4 no tiene utilidad nativa para `background: linear-gradient(...)`. Usar CSS inline via `[background:var(--brand-gradient)]` que referencia el custom property definido en Story 1.5 (`:root { --brand-gradient: linear-gradient(135deg, #48A1CD, #108385); }`).

**`<a>` vs `<button>`:** Si `href` esta definido, renderizar `<a>` con los mismos estilos. Si no, renderizar `<button>`. Logica en frontmatter:
```astro
---
const Tag = href ? 'a' : 'button';
---
<Tag ...>
```
Astro soporta tags dinamicos con esta sintaxis.

**Disabled:** agregar `opacity-50 pointer-events-none` y `aria-disabled="true"`. En `<button>` tambien agregar atributo `disabled`.

#### Card.astro
```
base:      bg-surface border border-border rounded-xl p-4
hoverable: hover:bg-surface-elevated transition-colors duration-200
```
Semantica: renderizar como `<article>` por default (correcto para cards de proyecto/blog). Prop `as` permite cambiar a `<div>` cuando el contenido no es un articulo independiente. Badge.astro reemplaza el TechnologyBadge.astro original de la arquitectura, ampliando a 3 variantes (technology, status, language). Stories futuras deben importar `Badge.astro` con el variant correspondiente.

#### Badge.astro
**Base:** `inline-flex items-center px-2 py-1 rounded-full text-caption font-medium`

**Variantes:**
```
technology:  border border-transparent [border-image:var(--brand-gradient)_1] rounded-none
             (ALTERNATIVA PREFERIDA: bg-primary/10 text-primary border border-primary/30 rounded-full)
status:
  published: bg-success/15 text-success
  draft:     bg-warning/15 text-warning
language:
  ES:        bg-primary/15 text-primary
  EN:        bg-success/15 text-success
```

**Nota sobre technology badge:** `border-image` con `linear-gradient` fuerza esquinas cuadradas (limitation de CSS). La alternativa preferida usa `bg-primary/10` con `border-primary/30` para mantener `rounded-full`. El UX spec dice "gradient border" pero la realidad CSS hace que `bg-primary/10 + border border-primary/30` sea visualmente superior y mas limpio. Documentar esta decision en el componente.

#### Input.astro
**Estructura HTML:**
```html
<div class="flex flex-col gap-1">
  <label for={id} class="text-caption text-text-secondary font-medium">
    {label}{required && <span class="text-error ml-0.5">*</span>}
  </label>
  <!-- Campo segun type -->
  <input/textarea/select class="..." />
  <!-- Error message (condicional) -->
  {error && <p id={errorId} class="text-caption text-error" role="alert">{error}</p>}
</div>
```

**Estilos del campo:**
```
bg-surface border border-border rounded-lg px-3 py-3 text-body text-text-primary
placeholder:text-text-muted
focus:outline-2 focus:outline-offset-2 focus:outline-primary focus:border-primary
```

**Con error:**
```
border-error focus:outline-error
```

**Accesibilidad obligatoria:**
- `id` generado automaticamente: `input-${name}`
- `aria-describedby={errorId}` cuando `error` existe — vincula input al mensaje
- `aria-invalid="true"` cuando `error` existe
- `aria-required="true"` cuando `required` es true
- Error message con `role="alert"` para screen readers

**Nota sobre validacion on-blur:** Este componente .astro renderiza la estructura visual completa (label, campo, error). La validacion on-blur (mostrar/ocultar error dinamicamente) la manejan los componentes Svelte de formulario en Epic 3 — ellos pasan la prop `error` condicionalmente. Este componente solo MUESTRA el error si se le pasa, no ejecuta logica de validacion.

**Nota sobre `select`:** Usar `<slot />` para que el padre pase las opciones `<option>`:
```astro
<InputField type="select" name="country" label="Pais">
  <option value="mx">Mexico</option>
  <option value="us">Estados Unidos</option>
</InputField>
```

**Nota sobre `file`:** Aplicar estilos al `<input type="file">` con `file:` prefix de Tailwind:
```
file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-body-sm file:text-primary file:font-medium hover:file:bg-primary/20 file:cursor-pointer
```

### Focus Ring — Patron Universal

Todos los componentes interactivos (Button, Input, links dentro de Card) usan:
```
focus:outline-2 focus:outline-offset-2 focus:outline-primary
```
Esto genera un anillo de 2px solido en color `primary` (#48A1CD) con offset de 2px, visible en ambos temas porque `primary` es estatico (no cambia con dark/light).

**Para componentes no-interactivos** (Card, Badge, Container, Section): no aplica focus ring directamente. Los elementos interactivos DENTRO de ellos (links, buttons) ya tienen sus propios focus rings.

### Tailwind CSS v4 — Recordatorios Clave

- **Colores semanticos:** `bg-background`, `bg-surface`, `bg-surface-elevated`, `text-text-primary`, `text-text-secondary`, `text-primary`, `border-border`, `text-success`, `text-warning`, `text-error` — definidos en Story 1.5 via `@theme inline`
- **Tipografia compound:** `text-display`, `text-heading-1`, `text-heading-2`, `text-heading-3`, `text-body`, `text-body-sm`, `text-caption`, `text-code` — aplican font-size + line-height + font-weight automaticamente
- **Spacing:** base 4px — `p-1`=4px, `p-2`=8px, `p-3`=12px, `p-4`=16px, `p-6`=24px, `p-8`=32px, `p-12`=48px
- **Breakpoints:** `sm:` >=450px, `lg:` >=900px, `xl:` >=1200px — mobile-first
- **Opacidad en colores:** Tailwind v4 soporta `bg-primary/10` para 10% de opacidad — util para hover states y badges
- **Dark mode:** `dark:` prefix activo via `@custom-variant dark (&:where(.dark, .dark *))` — NO necesario para colores semanticos porque ya cambian con CSS variables. Solo usar `dark:` si un valor hardcodeado necesita variante oscura (raro con tokens semanticos)
- **Gradiente via CSS custom property:** `[background:var(--brand-gradient)]` — brackets para CSS arbitrary values

### Testing — Estrategia para Componentes Astro Estaticos

Los componentes .astro son templates HTML puros sin runtime JS. La estrategia de testing:

1. **Type-checking (compile-time):** `pnpm type-check` valida que las Props interfaces son correctas y que los componentes se usan con props validas. Esto es el test principal.
2. **Build validation:** `pnpm build` verifica que los componentes se renderizan sin error en el HTML estatico generado.
3. **Unit test de tipos:** Un test en `src/components/common/__tests__/component-props.test.ts` que importa y verifica las interfaces de Props de los componentes usando `satisfies` de TypeScript. Esto previene regresiones de la API de props.
4. **Los 47 tests existentes** (35 schema + 6 factory + 6 contrast) deben seguir pasando sin cambios.
5. **E2E visual testing** vendra con Story 1.7+ cuando los componentes se rendericen en paginas reales.

**Patron de test de props:**
```typescript
import { describe, test, expect } from 'vitest';

// Verificar que los tipos existen y son validos
// Esto falla en build si los Props cambian incompatiblemente
describe('Component Props Types', () => {
  test('Button variants are constrained', async () => {
    // Dynamic import para verificar que el modulo existe y exporta tipos
    const mod = await import('../Button.astro');
    expect(mod).toBeDefined();
  });
});
```

Nota: Astro components se pueden importar en tests via `getViteConfig` que incluye el compilador Astro. Si los imports .astro fallan en Vitest, el fallback es validar con `pnpm type-check` + `pnpm build` como prueba principal de compilacion.

### Inteligencia de Story 1-5

Estado actual del proyecto post Story 1.5:
- **Tailwind CSS 4.2.1** via `@tailwindcss/vite` — CSS-first config, NO `tailwind.config.js`
- **`src/styles/global.css`** tiene TODOS los tokens (colores, tipografia, spacing, breakpoints — ver seccion "Tailwind CSS v4" arriba para lista completa)
- **Astro Fonts API** — Poppins (400/500/600/700) y JetBrains Mono (400) self-hosteados
- **Dark mode default** via `class="dark"` en `<html>` de `src/pages/index.astro`
- **Vitest 4.1.0** — 47 tests pasan. Pattern: `src/**/*.{test,spec}.{js,ts}`
- **TypeScript strictest** — `extends: "astro/tsconfigs/strictest"`
- **CI pipeline:** lint -> type-check -> test -> build -> Lighthouse (en push a main)
- **Contraste critico — `text-primary` (#48A1CD) vs `text-primary-dark` (#108385):** `text-primary` tiene ~2.97:1 sobre blanco — SOLO para acentos no-textuales (gradientes, bordes, iconos, bg con opacidad). Para texto accesible sobre surface, usar `text-primary-dark` (~5.5:1 sobre blanco). `text-text-primary` es el color semantico de texto general (cambia con tema).

### Que NO Hacer en Esta Story

- **NO crear componentes Svelte** — todos son .astro (zero JS). La interactividad (formularios, toggles) vendra en Epic 3 y Stories 1.8/1.9
- **NO crear layouts (BaseLayout, AdminLayout)** — eso es Story 1.7
- **NO implementar Header, Footer, Nav, SkipNav** — eso es Story 1.7
- **NO crear paginas nuevas ni modificar index.astro** — los componentes se consumen desde paginas en stories futuras
- **NO implementar logica de validacion on-blur en Input** — solo la estructura visual. La logica JS viene con los Svelte forms (Epic 3)
- **NO agregar imports de componentes en index.astro** — no hay pagina donde montarlos todavia (Story 1.7 crea los layouts)
- **NO crear ErrorMessage.astro ni EmptyState.astro** — son componentes de feedback que dependen de contextos mas complejos (Epic 3)
- **NO agregar sombras o border-radius tokens al global.css** — usar las utilidades de Tailwind directamente (`rounded-xl`, `shadow-md`)
- **NO crear un barrel export (index.ts)** — Astro importa componentes directamente por path
- **NO limpiar los .gitkeep** de los subdirectorios que NO se tocan (home, projects, blog, contact, admin, layout)
- **NO replicar patrones del proyecto Flutter** — los breakpoints, naming y arquitectura del nuevo proyecto son diferentes

### Project Structure Notes

Archivos nuevos (TODOS en `src/components/common/`):

```
src/components/common/
├── Container.astro          # NUEVO — wrapper de contenido centrado
├── Section.astro            # NUEVO — separador vertical de secciones
├── Button.astro             # NUEVO — 4 variantes de boton
├── Card.astro               # NUEVO — card con surface bg y border
├── Badge.astro              # NUEVO — 3 variantes (technology, status, language)
├── Input.astro              # NUEVO — campos de formulario con label y error
└── __tests__/
    └── component-props.test.ts  # NUEVO — tests de tipos de componentes
```

Archivos NO modificados:
- `src/styles/global.css` — no requiere cambios, tokens ya definidos
- `src/pages/index.astro` — no modificar, los componentes no se montan aqui todavia
- `astro.config.mjs` — no requiere cambios
- `package.json` — no se necesitan dependencias nuevas

### Alineacion con Arquitectura

- Components en `src/components/common/` — [Source: architecture.md, lineas 545-580, 899-907]
- Naming PascalCase para componentes .astro — [Source: architecture.md, lineas 508-520]
- Zero JS al browser para componentes estaticos — [Source: architecture.md, lineas 582-591]
- Tests co-locados en `__tests__/` — [Source: architecture.md, lineas 593-606]

### References

- epics.md — Epic 1, Story 1.6 AC | architecture.md — Component boundaries, file organization, naming, testing
- ux-design-specification.md — Button/Card/Badge/Input specs, Container/Section layout, accessibility (WCAG AA), responsive strategy, color system, spacing
- 1-5-design-tokens-y-sistema-de-temas.md — tokens implementados, Astro Fonts API, primary vs primary-dark
- Web — Astro 6 TypeScript Props interface pattern (HTMLAttributes from 'astro/types')

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Badge.astro: `noUncheckedIndexedAccess` requería non-null assertion en lookup de variantes anidadas
- Card.astro: `as` prop causaba falso positivo `Props unused` — resuelto con type annotation explícita en destructuring

### Completion Notes List

- 6 componentes Astro creados en `src/components/common/`: Container, Section, Button, Card, Badge, Input
- Container: `default` (1200px) y `narrow` (720px) con padding responsive 16/24/32px
- Section: 3 variantes de spacing vertical (default, hero, compact) con `<section>` semántico
- Button: 4 variantes (primary gradient, secondary outline, danger, ghost), tag dinámico `<a>`/`<button>`, focus ring 2px, disabled con opacity+pointer-events
- Card: `<article>` por defecto con prop `as` para `<div>`, hover opcional con surface-elevated
- Badge: 3 variantes (technology, status, language) — technology usa bg-primary/10 en vez de border-image gradient (decisión documentada en comentario del componente)
- Input: 4 tipos (text, textarea, select, file) con label visible, asterisco required, error con aria-describedby + aria-invalid + role=alert
- Todos usan focus ring universal: `focus:outline-2 focus:outline-offset-2 focus:outline-primary`
- Zero JS shipped al browser — todos son templates .astro puros
- 6 tests nuevos (importabilidad de módulos), 47 existentes sin regresiones → 53 total
- Lint: 0 errores | Type-check: 0 errores | Build: exitoso

### Change Log

- 2026-03-17: Implementación completa de 6 componentes UI base y tests de props

### File List

- `src/components/common/Container.astro` — NUEVO
- `src/components/common/Section.astro` — NUEVO
- `src/components/common/Button.astro` — NUEVO
- `src/components/common/Card.astro` — NUEVO
- `src/components/common/Badge.astro` — NUEVO
- `src/components/common/Input.astro` — NUEVO
- `src/components/common/__tests__/component-props.test.ts` — NUEVO
