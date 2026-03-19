# Story 2.7: Contact Page

Status: ready-for-dev

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

- [ ] Task 1: i18n — Agregar keys de traducción (AC: 2, 5, 7)
  - [ ] 1.1 Agregar keys en `src/lib/i18n/translations.ts`: contact.heading, contact.description, contact.form.name, contact.form.email, contact.form.phone, contact.form.message, contact.form.channel, contact.form.channel.whatsapp, contact.form.channel.email, contact.form.submit, contact.form.cancel, contact.form.countryCode, contact.validation.nameRequired, contact.validation.emailRequired, contact.validation.emailInvalid, contact.validation.messageRequired, contact.validation.channelRequired, contact.validation.nameMin, contact.validation.messageMin, contact.meta.title, contact.meta.description
- [ ] Task 2: ContactForm.svelte — Componente interactivo (AC: 2, 3, 4, 5, 6)
  - [ ] 2.1 Crear `src/components/contact/ContactForm.svelte` como Svelte 5 island
  - [ ] 2.2 Props interface: `{ locale: 'es' | 'en' }`
  - [ ] 2.3 Estado del formulario con `$state()`: name, email, phone, countryCode, message, channel, errors record, submitted
  - [ ] 2.4 Country picker con dropdown (código de país + bandera emoji o label)
  - [ ] 2.5 Channel selector dropdown: WhatsApp | Email
  - [ ] 2.6 Validación inline on blur + on submit (Zod schema)
  - [ ] 2.7 `handleSubmit()`: genera URL según channel seleccionado y abre en nueva pestaña
  - [ ] 2.8 WhatsApp URL: `https://wa.me/{phone}?text={encodedMessage}`
  - [ ] 2.9 mailto URL: `mailto:{christopherEmail}?subject={encodedSubject}&body={encodedBody}`
  - [ ] 2.10 Accesibilidad: labels con `for`, `aria-required`, `aria-invalid`, `aria-describedby` para errores, `aria-live="polite"` en zona de errores
- [ ] Task 3: Páginas Astro — Crear rutas ES/EN (AC: 1, 6, 7)
  - [ ] 3.1 Crear `src/pages/contact.astro` con BaseLayout, currentPage="contact"
  - [ ] 3.2 Crear `src/pages/en/contact.astro` con locale="en"
  - [ ] 3.3 Ambas: Section + Container + heading + descripción + `<ContactForm client:load locale={locale} />`
- [ ] Task 4: Verificar footer social links (AC: 8)
  - [ ] 4.1 Verificar que Footer.astro tiene links sociales correctos con `target="_blank"` y `rel="noopener noreferrer"`
  - [ ] 4.2 Verificar aria-labels descriptivos en cada link social
- [ ] Task 5: Pipeline — Verificar build (AC: all)
  - [ ] 5.1 Ejecutar `pnpm lint && pnpm type-check && pnpm build` — 0 errores
- [ ] Task 6: E2E Tests (AC: all)
  - [ ] 6.1 Crear `tests/e2e/contact-page.spec.ts`
  - [ ] 6.2 Tests ES: page load, form fields visibles, validación campos vacíos, validación email inválido, envío WhatsApp (verificar window.open URL), envío Email (verificar mailto href), country picker, responsive
  - [ ] 6.3 Tests EN: page load /en/contact, labels en inglés, validación en inglés
  - [ ] 6.4 Ejecutar `pnpm test:e2e` — 0 fallos, 0 regresiones

## Dev Notes

### Patrón Crítico: NO hay backend
El formulario de contacto NO almacena datos en Firestore ni llama APIs. Es 100% client-side:
- **WhatsApp**: Genera URL `https://wa.me/{phone}?text={message}` y abre con `window.open()`
- **Email**: Genera link `mailto:` y abre con `window.open()` o `window.location.href`

### Componentes Existentes a Reutilizar
- **NO reutilizar `Input.astro`** en el formulario. Input.astro es un componente Astro (server-side). ContactForm es un Svelte island (client-side). Crear inputs nativos HTML dentro del .svelte con los mismos patrones de accesibilidad y estilos Tailwind.
- **NO reutilizar `Button.astro`** por la misma razón. Crear botones nativos `<button>` con clases Tailwind del mismo estilo.
- Copiar los **estilos y patrones de accesibilidad** de Input.astro y Button.astro, pero implementarlos como HTML nativo dentro de Svelte.

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
Definir schema inline en el componente (no en archivo separado — el formulario no persiste datos):
```typescript
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  channel: z.enum(['whatsapp', 'email']),
});
```

Mensajes de error deben ser dinámicos según `locale` usando `t()`.

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

// Email — usar email de Christopher desde variable de entorno o hardcoded
function buildMailtoUrl(name: string, email: string, phone: string, message: string): string {
  const to = 'christopher@example.com'; // Definir email real
  const subject = `Nuevo mensaje de ${name}`;
  const body = `De: ${name}\nEmail: ${email}\nTeléfono: ${phone}\n\n${message}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
```

### Estilos de Formulario (Tailwind tokens del proyecto)
```
// Card contenedora
bg-(--theme-surface) rounded-lg p-6 shadow-md

// Input fields
w-full rounded-md border border-(--theme-border) bg-(--theme-bg) px-4 py-3
text-(--theme-text-primary) placeholder-(--theme-text-muted)
focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30

// Error state
border-(--color-error) focus:border-(--color-error) focus:ring-(--color-error)/30

// Error text
text-sm text-(--color-error) mt-1

// Label
text-sm font-medium text-(--theme-text-secondary) mb-1

// Required asterisk
text-(--color-error) ml-0.5

// Primary button (gradient)
bg-gradient-to-r from-(--color-primary) to-(--color-primary-dark) text-white font-medium
px-6 py-3 rounded-lg min-h-11 min-w-11
hover:shadow-lg hover:shadow-(--color-primary)/20 transition-all duration-200

// Secondary button (cancel/outline)
border border-(--theme-border) text-(--theme-text-secondary) px-6 py-3 rounded-lg
hover:bg-(--theme-surface) transition-all duration-200
```

### Responsive Layout
- **Mobile (<450px)**: Form full-width, single column, botón full-width, padding 16px
- **Tablet (450-900px)**: Form con max-width ~600px centrado, padding 24px
- **Desktop (>900px)**: Form max-width 600px centrado en contenedor

### Accesibilidad Obligatoria
- Cada `<input>` tiene `<label>` asociado (no solo placeholder)
- Campos requeridos: asterisco visual + `aria-required="true"`
- Errores: `aria-describedby` vinculando input con su mensaje de error, `role="alert"` en mensajes
- `aria-invalid="true"` en campos con error
- Focus indicators visibles (no eliminar outline sin reemplazo)
- Touch targets mínimo 44x44px (`min-h-11 min-w-11`)
- Country picker `<select>` nativo (no custom dropdown — mejor accesibilidad)

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

### Debug Log References

### Completion Notes List

### File List
