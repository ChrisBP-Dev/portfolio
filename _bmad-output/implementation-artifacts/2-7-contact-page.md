# Story 2.7: Contact Page

Status: review

## Story

As a visitor,
I want to send a message to Christopher choosing my preferred channel,
So that I can reach out about opportunities.

## Acceptance Criteria (AC)

1. **Page Load** — Navegar a `/contact` muestra título "Contacto", descripción, y formulario en tarjeta surface elevada.
2. **Form Fields** — Formulario con: name (text), email (text), phone (country picker + code), message (textarea), channel dropdown (WhatsApp/Email), botón "Enviar Mensaje".
3. **WhatsApp Integration** — Seleccionar WhatsApp y enviar abre URL de WhatsApp con mensaje pre-llenado.
4. **Email Integration** — Seleccionar Email y enviar abre `mailto:` con subject y body pre-llenados.
5. **Validation** — Campos requeridos vacíos al submit muestran errores inline debajo de cada campo inválido.
6. **Svelte Island** — `ContactForm` es un componente Svelte 5 con `client:load`.
7. **Localization** — `/en/contact` muestra versión en inglés con labels, placeholders, validación y botón traducidos.
8. **Footer Social Links** — Links sociales (TikTok, GitHub, LinkedIn) en footer navegan a perfiles correctos en nueva pestaña.

## BDD Scenarios

### Scenario 1: Envío vía WhatsApp (Happy Path)
```gherkin
Given visito /contact
When lleno Name: "Juan Perez", Email: "juan@example.com", Phone: "+34 123456789" (ES), Message: "Me interesa tu portfolio", Channel: "WhatsApp"
And hago click en "Enviar Mensaje"
Then se abre nueva pestaña/ventana de WhatsApp con mensaje pre-llenado conteniendo los datos del formulario
```

### Scenario 2: Envío vía Email
```gherkin
Given visito /contact
When lleno Name: "Sarah Chen", Email: "sarah@example.com", Phone: "+1 5551234567" (US), Message: "Colaboremos", Channel: "Email"
And hago click en "Enviar Mensaje"
Then se dispara mailto: con To: email de Christopher, Subject: "Nuevo mensaje de Sarah Chen", Body: datos de contacto + mensaje
```

### Scenario 3: Validación — Campos requeridos vacíos
```gherkin
Given visito /contact
When dejo vacíos Name, Email, Message
And hago click en "Enviar Mensaje"
Then NO se envía el formulario
And aparecen errores inline: "Nombre es obligatorio", "Email es obligatorio", "Mensaje es obligatorio"
```

### Scenario 4: Validación — Email inválido
```gherkin
Given visito /contact
When escribo Email: "not-an-email" y salgo del campo (blur)
Then aparece error inline: "Email inválido"
```

### Scenario 5: Cambio de idioma
```gherkin
Given visito /contact (español)
When cambio idioma a inglés vía LocaleToggle
Then navego a /en/contact
And labels cambian: "Nombre"→"Name", "Mensaje"→"Message", "Enviar Mensaje"→"Send Message"
```

### Scenario 6: Social Links en Footer
```gherkin
Given visito /contact (o cualquier página pública)
When hago scroll al footer
Then veo 3 iconos sociales: TikTok, GitHub, LinkedIn
And cada link abre en nueva pestaña (target="_blank", rel="noopener noreferrer")
```

### Scenario 7: Country Code Picker
```gherkin
Given visito /contact
When hago click en el picker de país del campo teléfono
Then aparece dropdown con opciones de país (bandera + nombre)
And seleccionar un país actualiza el prefijo de código (ej: +34 → +1)
```

### Scenario 8: Responsive en móvil
```gherkin
Given visito /contact en viewport <450px
Then formulario es full-width, single-column
And touch targets son mínimo 44x44px
And botón ocupa ancho completo
```

## Tasks / Subtasks

- [x] Task 1: i18n — Agregar keys de traducción (AC: 2, 5, 7)
  - [x] 1.1 Agregar keys en `src/lib/i18n/translations.ts`: contact.heading, contact.description, contact.form.name, contact.form.email, contact.form.phone, contact.form.message, contact.form.channel, contact.form.channel.whatsapp, contact.form.channel.email, contact.form.submit, contact.form.cancel, contact.form.countryCode, contact.validation.nameRequired, contact.validation.emailRequired, contact.validation.emailInvalid, contact.validation.messageRequired, contact.validation.channelRequired, contact.validation.nameMin, contact.validation.messageMin, contact.meta.title, contact.meta.description
- [x] Task 2: ContactForm.svelte — Componente interactivo (AC: 2, 3, 4, 5, 6)
  - [x] 2.1 Crear `src/components/contact/ContactForm.svelte` como Svelte 5 island
  - [x] 2.2 Props interface: `{ locale: 'es' | 'en' }`
  - [x] 2.3 Estado del formulario con `$state()`: name, email, phone, countryCode, message, channel, errors record, submitted
  - [x] 2.4 Country picker con dropdown (código de país + bandera emoji o label)
  - [x] 2.5 Channel selector dropdown: WhatsApp | Email
  - [x] 2.6 Validación inline on blur + on submit (Zod schema)
  - [x] 2.7 `handleSubmit()`: genera URL según channel seleccionado y abre en nueva pestaña
  - [x] 2.8 WhatsApp URL: `https://wa.me/{phone}?text={encodedMessage}`
  - [x] 2.9 mailto URL: `mailto:{christopherEmail}?subject={encodedSubject}&body={encodedBody}`
  - [x] 2.10 Accesibilidad: labels con `for`, `aria-required`, `aria-invalid`, `aria-describedby` para errores, `aria-live="polite"` en zona de errores
- [x] Task 3: Páginas Astro — Crear rutas ES/EN (AC: 1, 6, 7)
  - [x] 3.1 Crear `src/pages/contact.astro` con BaseLayout, currentPage="contact"
  - [x] 3.2 Crear `src/pages/en/contact.astro` con locale="en"
  - [x] 3.3 Ambas: `Section variant="default"` + `Container variant="narrow"` + heading + descripción + `<ContactForm client:load locale={locale} />`
  - [x] 3.4 Agregar `PUBLIC_CONTACT_EMAIL` en `.env`, `.env.example` y `src/env.d.ts`
- [x] Task 4: Verificar footer social links (AC: 8)
  - [x] 4.1 Verificar que Footer.astro tiene links sociales correctos con `target="_blank"` y `rel="noopener noreferrer"`
  - [x] 4.2 Verificar aria-labels descriptivos en cada link social
- [x] Task 5: Pipeline — Verificar build (AC: all)
  - [x] 5.1 Ejecutar `pnpm lint && pnpm type-check && pnpm build` — 0 errores
- [x] Task 6: E2E Tests (AC: all)
  - [x] 6.1 Crear `tests/e2e/contact-page.spec.ts`
  - [x] 6.2 Tests ES: page load, verificar hidratación del Svelte island, form fields visibles, validación campos vacíos, validación email inválido, envío WhatsApp (verificar window.open URL), envío Email (verificar mailto href), country picker, responsive
  - [x] 6.3 Tests EN: page load /en/contact, labels en inglés, validación en inglés
  - [x] 6.4 Usar selectores semánticos: `page.getByRole()`, `page.getByLabel()` — NO selectores CSS frágiles
  - [x] 6.5 Ejecutar `pnpm test:e2e` — 0 fallos, 0 regresiones

## Dev Notes

### Patrón Crítico: NO hay backend
El formulario de contacto NO almacena datos en Firestore ni llama APIs. Es 100% client-side:
- **WhatsApp**: Genera URL `https://wa.me/{phone}?text={message}` y abre con `window.open()` (nueva pestaña)
- **Email**: Genera link `mailto:` y abre con `window.location.href` (NO usar `window.open()` para mailto — algunos navegadores lo bloquean como popup)

### Componentes Existentes a Reutilizar
- **NO reutilizar `Input.astro`** en el formulario. Input.astro es un componente Astro (server-side). ContactForm es un Svelte island (client-side). Crear inputs nativos HTML dentro del .svelte con los mismos patrones de accesibilidad y estilos Tailwind.
- **NO reutilizar `Button.astro`** por la misma razón. Crear botones nativos `<button>` con clases Tailwind del mismo estilo.
- Copiar los **estilos y patrones de accesibilidad** de Input.astro y Button.astro, pero implementarlos como HTML nativo dentro de Svelte.

### Patrón de Página Astro (replicar de páginas existentes)
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Section from '../../components/common/Section.astro';
import Container from '../../components/common/Container.astro';
import ContactForm from '../../components/contact/ContactForm.svelte';
import { getLocaleFromUrl } from '../../lib/i18n/config';
import { t } from '../../lib/i18n/translations';

const locale = getLocaleFromUrl(Astro.url);
---

<BaseLayout
  title={t('contact.meta.title', locale)}
  description={t('contact.meta.description', locale)}
  currentPage="contact"
>
  <Section variant="default">
    <Container variant="narrow">
      <h1 class="text-heading-2 font-bold text-text-primary mb-2">
        {t('contact.heading', locale)}
      </h1>
      <p class="text-body text-text-secondary mb-8">
        {t('contact.description', locale)}
      </p>
      <ContactForm client:load locale={locale} />
    </Container>
  </Section>
</BaseLayout>
```

### Svelte 5 Patterns (seguir codebase existente)
```typescript
// Props
interface Props { locale: 'es' | 'en'; }
let { locale }: Props = $props();

// State
let name = $state('');
let errors = $state<Record<string, string>>({});

// Derived
let isValid = $derived(Object.keys(errors).length === 0);

// Event handlers
onclick={handler}  // Svelte 5 syntax, NOT on:click
```

### Validación con Zod
Definir schema inline en el componente (no en archivo separado — el formulario no persiste datos).
NO hardcodear mensajes de error en el schema — usar `t()` con locale para mensajes dinámicos:
```typescript
import { z } from 'zod';

// Schema sin mensajes (mensajes vienen de i18n)
const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  channel: z.enum(['whatsapp', 'email']),
});

// Mapear errores de Zod a mensajes i18n en handleSubmit:
// result.error.flatten().fieldErrors → para cada campo con error,
// asignar errors[field] = t('contact.validation.fieldRequired', locale)
```
Validar al submit y opcionalmente on blur. NUNCA en cada keystroke (patrón de arquitectura).

### Country Picker — Implementación Ligera
NO instalar librerías externas para el country picker. Implementar un `<select>` nativo con las opciones más comunes:
```typescript
const countries = [
  { code: '+34', flag: '🇪🇸', name: 'España' },
  { code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: '+52', flag: '🇲🇽', name: 'México' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: '+51', flag: '🇵🇪', name: 'Perú' },
  { code: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+49', flag: '🇩🇪', name: 'Deutschland' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
];
```
Default: España (+34). Usar emojis de bandera como indicadores visuales.

### URL Generation
```typescript
// WhatsApp
function buildWhatsAppUrl(phone: string, countryCode: string, name: string, email: string, message: string): string {
  const fullPhone = `${countryCode}${phone}`.replace(/[\s\-()]/g, '');
  const text = `Hola, soy ${name} (${email}). ${message}`;
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`;
}

// Email — usar variable de entorno PUBLIC_CONTACT_EMAIL
function buildMailtoUrl(name: string, email: string, phone: string, message: string): string {
  const to = import.meta.env.PUBLIC_CONTACT_EMAIL;
  const subject = `Nuevo mensaje de ${name}`;
  const body = `De: ${name}\nEmail: ${email}\nTeléfono: ${phone}\n\n${message}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
// IMPORTANTE: Agregar PUBLIC_CONTACT_EMAIL en .env, .env.example y src/env.d.ts
```

### Estilos de Formulario (clases EXACTAS del codebase — replicar de Input.astro y Button.astro)
```
// Card contenedora (replicar Card.astro: bg-surface border border-border rounded-xl p-4)
bg-surface border border-border rounded-xl p-6

// Label (de Input.astro)
text-caption text-text-secondary font-medium

// Required asterisk (de Input.astro)
text-error ml-0.5

// Input fields (de Input.astro — EXACTAS)
bg-surface border rounded-lg px-3 py-3 text-body text-text-primary w-full
placeholder:text-text-muted
focus:outline-2 focus:outline-offset-2 focus:outline-primary focus:border-primary

// Error state input (de Input.astro)
border-error focus:outline-error

// Error text (de Input.astro — usa role="alert")
text-body-sm text-error mt-1

// Primary button (de Button.astro — variant="primary")
min-h-11 min-w-11 px-6 py-3 rounded-lg font-semibold text-body-sm
inline-flex items-center justify-center gap-2 transition-all duration-200
focus:outline-2 focus:outline-offset-2 focus:outline-primary
text-white [background:var(--brand-gradient)] shadow-md hover:shadow-lg hover:brightness-110

// Secondary button (de Button.astro — variant="secondary")
min-h-11 min-w-11 px-6 py-3 rounded-lg font-semibold text-body-sm
inline-flex items-center justify-center gap-2 transition-all duration-200
focus:outline-2 focus:outline-offset-2 focus:outline-primary
border-2 border-primary text-primary-dark hover:bg-primary/10

// Disabled state (de Button.astro)
opacity-50 pointer-events-none (+ aria-disabled="true")
```

### Responsive Layout
- Usar `Section variant="default"` + `Container variant="narrow"` (max-w-[45rem] ≈ 720px, coincide con UX spec)
- **Mobile (<450px)**: Form full-width, single column, botón full-width
- **Tablet (450-900px)**: Container centrado con padding responsive (px-4 sm:px-6)
- **Desktop (>900px)**: Container narrow (720px) centrado automáticamente

### Accesibilidad Obligatoria
- Cada `<input>` tiene `<label for="id">` asociado (no solo placeholder)
- Campos requeridos: asterisco visual `<span class="text-error ml-0.5">*</span>` + `aria-required="true"`
- Errores: `aria-describedby="fieldId-error"` vinculando input con su `<p id="fieldId-error" role="alert">`, `aria-live="polite"` en contenedor de errores
- `aria-invalid="true"` en campos con error
- Focus indicators: `focus:outline-2 focus:outline-offset-2 focus:outline-primary` (patrón del codebase — NO usar focus:ring)
- Touch targets mínimo 44x44px (`min-h-11 min-w-11`)
- Country picker `<select>` nativo (no custom dropdown — mejor accesibilidad)
- IDs de inputs: `input-name`, `input-email`, `input-phone`, `input-message`, `input-channel` (patrón de Input.astro: `input-${name}`)

### Project Structure Notes

**Archivos a crear:**
```
src/components/contact/ContactForm.svelte    # Island interactivo
src/pages/contact.astro                       # Página ES
src/pages/en/contact.astro                    # Página EN
tests/e2e/contact-page.spec.ts               # E2E tests
```

**Archivos a modificar:**
```
src/lib/i18n/translations.ts                  # Agregar keys contact.*
```

**Archivos a verificar (no modificar si correcto):**
```
src/components/layout/Footer.astro            # Social links ya implementados
```

**Alineación con estructura del proyecto:**
- `src/components/contact/` ya existe (vacío con .gitkeep) — listo para el componente
- `currentPage="contact"` ya soportado en BaseLayout
- `nav.contact` key ya existe en i18n — navegación funciona
- `localizeHref('/contact', locale)` ya genera `/en/contact` correctamente

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Story 2.7 Contact Page]
- [Source: _bmad-output/planning-artifacts/architecture.md — Contact form client-side pattern, Zod validation, SSG output]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — UX-DR20 ContactForm, UX-DR38/39/40/42 Accessibility]
- [Source: src/components/common/Input.astro — Input styling and a11y patterns to replicate]
- [Source: src/components/common/Button.astro — Button gradient/variant patterns]
- [Source: src/lib/i18n/translations.ts — Translation key structure]
- [Source: src/styles/global.css — Tailwind theme tokens available]
- [Source: src/layouts/BaseLayout.astro — Layout with currentPage="contact" support]

### Previous Story Intelligence (Story 2.6)

**Patterns establecidos a seguir:**
- Svelte 5 runes: `$props()`, `$state()`, `$derived()`, `$effect()`
- Event syntax: `onclick={handler}` (no `on:click`)
- Touch targets: `min-h-11 min-w-11` para 44px
- `prefers-reduced-motion`: Respetar con media query check
- E2E: Navegar a página, interactuar, verificar resultado. Tests separados ES/EN

**Lecciones aprendidas en 2.6:**
- Focus restoration en modales (WCAG 2.4.3) — aplicable si se usa algún dropdown custom
- `aria-live="polite"` para cambios dinámicos de contenido (errores de validación)
- Backdrop click handler: usar `e.target === e.currentTarget` para detección correcta
- E2E: No depender de datos específicos — tests deben ser robustos ante contenido variable
- Pipeline: Siempre verificar `pnpm lint && pnpm type-check && pnpm build` antes de dar por terminado

**Commits recientes (patrón a seguir):**
```
feat: implement story 2.7 — Contact Page
```

### Git Intelligence

Últimos commits muestran patrón consistente:
- `feat:` para implementación de story
- `fix:` para code review patches
- `docs:` para creación de story files
- Pipeline verificado en cada story: lint + type-check + unit tests + build + E2E

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Debug Log References
- Hydration issue diagnosed: stale Vite dev server on port 4321 caused 504 errors during E2E, resolved by killing process and using fresh `pnpm preview`
- ESLint fixes: removed unused `submitted` state, unused `contactSchema` variable, fixed destructuring pattern, added `{#each}` key

### Completion Notes List
- Implemented ContactForm.svelte as Svelte 5 island with `$props()`, `$state()`, Zod email validation, i18n via `t()` function
- Form supports WhatsApp (window.open) and Email (window.location.href = mailto:) channels
- Country picker with 10 common countries, native `<select>` for accessibility, default USA (+1)
- Validation on blur + on submit, inline error messages with `role="alert"` and `aria-describedby`
- Created ES/EN Astro pages following existing page patterns (BaseLayout, Section, Container)
- Added `PUBLIC_CONTACT_EMAIL` env var to `.env`, `.env.example`, `src/env.d.ts`
- Footer social links verified: TikTok, GitHub, LinkedIn with correct `target="_blank"` and `rel="noopener noreferrer"`
- 12 E2E tests covering: page load, form fields, validation (empty/invalid), WhatsApp URL generation, email submission, country picker, responsive, ES translations, footer social links
- Full pipeline: 0 lint errors, 0 type errors, 303 unit tests pass, 54 E2E tests pass (0 regressions)

#### Post-implementation: Default locale flip (EN as default)
- Cambio solicitado por el usuario: el portfolio apunta primero al público americano (EN), con soporte ES
- `defaultLocale` cambiado de `'es'` a `'en'` en `astro.config.mjs` y `src/lib/i18n/config.ts`
- Directorio de páginas renombrado: `src/pages/en/` → `src/pages/es/` (Astro mapea el directorio al locale no-default)
- URLs ahora: `/` = English (default), `/es/` = Spanish
- Lógica de prefijo URL invertida en `navigation.ts` y `LocaleToggle.svelte`
- Fallbacks actualizados en `BaseLayout.astro` y `AdminLayout.astro`
- Country code default cambiado de España (+34) a USA (+1) en `ContactForm.svelte`
- Todos los E2E tests (5 archivos) y unit tests (2 archivos) actualizados para reflejar las nuevas URLs
- Pipeline completa: 0 lint, 0 type errors, 303 unit tests, 54 E2E tests (0 regressions)

### File List

**Story 2.7 — Contact Page:**
- `src/components/contact/ContactForm.svelte` (new) — Svelte 5 contact form island
- `src/pages/contact.astro` (new) — Contact page (EN at root)
- `src/pages/es/contact.astro` (new) — Contact page (ES prefixed)
- `src/lib/i18n/translations.ts` (modified) — Added 20+ contact.* translation keys
- `src/env.d.ts` (modified) — Added PUBLIC_CONTACT_EMAIL type
- `.env` (modified) — Added PUBLIC_CONTACT_EMAIL value
- `.env.example` (modified) — Added PUBLIC_CONTACT_EMAIL placeholder
- `tests/e2e/contact-page.spec.ts` (new) — 12 E2E tests for contact page

**Default locale flip (EN as default):**
- `astro.config.mjs` (modified) — defaultLocale: 'es' → 'en'
- `src/lib/i18n/config.ts` (modified) — defaultLocale: 'es' → 'en'
- `src/data/navigation.ts` (modified) — Prefix logic inverted (es gets /es/ prefix)
- `src/components/layout/LocaleToggle.svelte` (modified) — URL generation inverted
- `src/layouts/BaseLayout.astro` (modified) — Fallback locale + routePath logic
- `src/layouts/AdminLayout.astro` (modified) — lang="es" → lang="en"
- `src/pages/en/` → `src/pages/es/` (renamed) — 4 page files moved
- `src/lib/i18n/__tests__/config.test.ts` (modified) — Assertions flipped
- `src/data/__tests__/navigation.test.ts` (modified) — Assertions flipped
- `tests/e2e/home-page.spec.ts` (modified) — URLs flipped EN↔ES
- `tests/e2e/projects-page.spec.ts` (modified) — URLs flipped EN↔ES
- `tests/e2e/project-detail.spec.ts` (modified) — URLs flipped EN↔ES
- `tests/e2e/image-viewer.spec.ts` (modified) — URLs flipped EN↔ES
- `tests/e2e/contact-page.spec.ts` (modified) — URLs flipped EN↔ES
