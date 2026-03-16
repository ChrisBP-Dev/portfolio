# Sprint Change Proposal — Fidelidad Visual del Sitio Público

**Fecha:** 2026-03-16
**Autor:** Scrum Master (BMAD Correct Course)
**Solicitante:** Christopher
**Estado:** Aprobado

---

## Sección 1: Resumen del Issue

### Problema

El documento UX Design Specification no distingue entre "replicar diseño visual existente" (sitio público) y "diseñar desde cero" (admin + blog). Las secciones de Design Direction, UX Patterns e Inspiración se aplican uniformemente a todo el proyecto, guiando a un developer a implementar un estilo "Technical Craft inspirado en Stripe/Linear" en el sitio público en vez de replicar fielmente el diseño Flutter actual que Christopher quiere conservar.

### Contexto

- Descubierto durante revisión post-planificación, después de completar el archivo de epics
- No hay implementación iniciada — corrección preventiva antes de que el problema afecte código
- Christopher confirmó: el sitio público debe verse visualmente igual al actual; el admin se rediseña; el blog es feature nueva

### Evidencia

1. **UX doc, sección "Design Direction Decision"** — Elegía "Technical Craft" como dirección para todo el proyecto sin distinguir público vs admin/blog
2. **UX doc, sección "Transferable UX Patterns"** — Proponía "Sticky header scroll-aware (Stripe)" para el sitio público, cuando el actual usa PinnedHeaderSliver con FABs flotantes
3. **UX-DRs específicos** — UX-DR65 describía Technologies como "grid visual con categorías" cuando el actual es lista horizontal scrollable; UX-DR69 describía "Experience timeline con línea visual" cuando el actual es lista de cards; UX-DR63 describía Hero genérico diferente a la composición actual (InitialBanner + AboutMe)
4. **Ausencia total** — No existía ninguna sección documentando cómo se ve el sitio Flutter actual

---

## Sección 2: Análisis de Impacto

### Impacto en Epics

| Epic | Nivel de Impacto | Detalle |
|---|---|---|
| Epic 1 (Fundación) | Ninguno | Design tokens ya capturan la identidad visual existente |
| **Epic 2 (Sitio Público)** | **Alto** | Stories 2.1-2.6 referenciaban UX-DRs que describían diseño nuevo en vez del actual |
| Epic 3 (Admin) | Ninguno | Rediseño intencionado, sin cambios |
| Epic 4 (Blog) | Bajo | Stories públicas (4.1-4.2) necesitan nota de consistencia visual con sitio existente |
| Epic 5 (Quality/CI) | Ninguno | Sin impacto visual |

### Impacto en Artefactos

| Artefacto | Cambios Necesarios |
|---|---|
| **UX Design Specification** | 3 cambios: nueva sección de referencia visual, acotación de Design Direction, corrección de UX-DRs |
| **PRD** | 1 cambio: declaración de fidelidad visual |
| **Epics** | 2 cambios: notas en encabezados de Epic 2 y Epic 4 + corrección de UX-DRs en requirements |
| Architecture | Sin cambios |

### Impacto Técnico

- Sin impacto en código — no hay implementación iniciada
- Sin impacto en timeline — es corrección de documentación
- Sin impacto en arquitectura — las decisiones técnicas (SSG, Firebase, Svelte islands) son independientes del diseño visual

---

## Sección 3: Enfoque Recomendado

### Camino Elegido: Ajuste Directo

Modificar los documentos existentes para clarificar el alcance del diseño visual. No requiere rollback ni cambio de MVP.

### Rationale

1. El problema es de **claridad documental**, no de alcance ni arquitectura
2. Estamos **antes de cualquier implementación** — momento ideal para corregir
3. Los cambios son **aditivos** (agregar referencia visual, agregar notas de scope) no destructivos
4. **Esfuerzo bajo** — solo edición de 3 documentos, sin cascada de cambios técnicos
5. **Riesgo bajo** — previene un problema grande (developer construyendo diseño incorrecto) con esfuerzo mínimo

### Esfuerzo, Riesgo y Timeline

- **Esfuerzo:** Bajo — ~30 minutos de edición documental
- **Riesgo:** Bajo — cambios puramente documentales, sin efecto en código o arquitectura
- **Timeline:** Sin impacto — no agrega ni retrasa trabajo

---

## Sección 4: Propuestas de Cambio Detalladas

### Cambio 1: UX Design Specification — Nueva Sección "Referencia Visual del Sitio Público Actual"

**Ubicación:** Después de "Visual Design Foundation", antes de "Design Direction Decision"
**Acción:** AGREGAR sección completa

Contenido: Sección que documenta la estructura visual actual del sitio Flutter sección por sección (Header, Hero/Banner, About Me, Technologies, Projects, Experience, Footer, Projects Page, Contact Page), elementos visuales clave a preservar (ShaderText gradiente, BusinessChipText, Avatar con gradiente, cards de proyecto, FABs flotantes, tecnologías horizontal, dark mode default, Poppins, max-width 900px), y mejoras permitidas (animaciones CSS, transiciones, lazy loading, micro-interacciones hover).

**Principio rector:** "La migración a Astro debe replicar fielmente la estructura visual, el layout de secciones, la composición de componentes y la estética general del sitio público actual."

**Alcance:** Aplica a sitio público. NO aplica a admin (rediseño) ni blog (feature nueva).

---

### Cambio 2: UX Design Specification — Acotar "Design Direction Decision"

**Ubicación:** Sección "Design Direction Decision"
**Acción:** MODIFICAR

- Agregar nota de alcance: dirección "Technical Craft" aplica solo a admin y blog
- Separar Implementation Approach en 3 bloques: sitio público (replicar actual), blog público (feature nueva consistente con sitio), admin (rediseño Technical Craft)
- Sitio público referencia la nueva sección de Referencia Visual como fuente de verdad

---

### Cambio 3: UX Design Specification — Acotar "UX Pattern Analysis & Inspiration"

**Ubicación:** Secciones "Transferable UX Patterns" y "Design Inspiration Strategy"
**Acción:** MODIFICAR

- Separar patrones por ámbito: Admin (Linear, Notion), Sitio público (mantener patrones actuales)
- Reemplazar "Adoptar: Sticky header scroll-aware (Stripe)" por "Mantener: Header pinned con FABs flotantes"
- Agregar sección "Mantener del sitio actual" con elementos específicos
- Agregar "Evitar: Cambiar la estructura visual del sitio público por patrones de Stripe, Linear u otros"

---

### Cambio 4: Epics — Corregir UX-DRs del Sitio Público

**Ubicación:** UX Design Requirements en epics.md (líneas 274-285)
**Acción:** MODIFICAR 4 UX-DRs específicos

| UX-DR | Conflicto | Corrección |
|---|---|---|
| UX-DR25, UX-DR49 | Describían header sticky scroll-aware tipo Stripe | Corregir a: header pinned + FABs flotantes separados (patrón actual) |
| UX-DR63 | Describía hero genérico | Corregir a: InitialBanner con gradiente + AboutMe (avatar izquierda, texto derecha) |
| UX-DR65 | Describía Technologies como "grid visual con categorías" | Corregir a: lista horizontal scrollable (TechnologiesList) sin categorización |
| UX-DR69 | Describía "Experience timeline con línea visual" | Corregir a: lista vertical de ExperienceCards sin línea de timeline |

---

### Cambio 5: PRD — Declaración de Fidelidad Visual

**Ubicación:** Después de "Executive Summary", antes de "Project Classification"
**Acción:** AGREGAR sección "Visual Design Fidelity"

3 párrafos que declaran:
- Sitio público: replicar diseño actual, referencia al UX doc
- Admin: rediseño completo justificado
- Blog: feature nueva consistente con estética existente

---

### Cambio 6: Epics — Notas de Fidelidad en Epic 2 y Epic 4

**Ubicación:** Encabezados de Epic 2 y Epic 4
**Acción:** AGREGAR notas blockquote

- Epic 2: nota de fidelidad visual — seguir "Referencia Visual del Sitio Público Actual" como fuente de verdad
- Epic 4: nota de consistencia — blog público consistente con estética existente, admin del blog sigue diseño de Epic 3

---

### Cambio 7: Screenshots de Referencia Visual

**Ubicación:** `_bmad-output/planning-artifacts/visual-reference/`
**Acción:** AGREGAR 13 screenshots del sitio actual

Christopher tomó 13 screenshots del sitio Flutter actual (desktop, mobile, light mode, image viewer) que sirven como referencia visual para agentes de IA. Los screenshots están referenciados por nombre en la sección "Referencia Visual del Sitio Público Actual" del UX doc.

Esto resuelve la limitación de que Flutter Web renderiza en canvas y los agentes no pueden acceder al sitio vía URL para verlo.

### Correcciones adicionales descubiertas durante los screenshots

Durante la revisión visual se descubrieron discrepancias entre la descripción textual y el sitio real:

| Corrección | Detalle |
|---|---|
| Menú tiene 3 items, no 5 | Home, Projects, Contact — no hay Experience ni Blog como páginas separadas |
| Sección se llama "KNOWLEDGE OF" | No "Technologies" |
| Avatar es la mascota/logo ChrisBP | No una foto personal |
| Heading hero: "I code and create content" | "content" en gradiente — no es "nombre + rol" genérico |
| FAB de tema: sol/luna | No es un engranaje/gear |
| No existe página de detalle de proyecto | Cards expandibles en /projects — la página `/projects/[slug]` es una MEJORA intencional para la migración |
| Filtro de proyectos es dropdown select | No botones/chips |
| Technologies: 4 items en fila horizontal | No grid categorizado |
| Experience: lista de cards con badge teal | No timeline con línea visual |

Todas estas correcciones fueron incorporadas en los cambios aplicados.

---

## Sección 5: Handoff de Implementación

### Clasificación del Cambio: Minor

Los cambios son puramente documentales y pueden implementarse directamente sin reorganización de backlog ni aprobación adicional.

### Estado: COMPLETADO

Todos los cambios han sido aplicados a los archivos. No requiere acción adicional.

### Cambios Aplicados

| # | Artefacto | Estado |
|---|---|---|
| 1 | UX doc: Sección "Referencia Visual del Sitio Público Actual" con screenshots | Aplicado |
| 2 | UX doc: "Design Direction Decision" acotada a admin y blog | Aplicado |
| 3 | UX doc: "Transferable UX Patterns" y "Design Inspiration Strategy" acotados | Aplicado |
| 4 | Epics: UX-DRs 25, 49, 63, 65, 69 corregidos | Aplicado |
| 5 | PRD: Sección "Visual Design Fidelity" | Aplicado |
| 6 | Epics: Notas de fidelidad en Epic 2 y Epic 4 | Aplicado |
| 7 | Screenshots de referencia visual (13 archivos) | Aplicado |

### Criterios de Éxito

1. [x] UX Design Specification contiene sección "Referencia Visual del Sitio Público Actual" con screenshots y descripciones corregidas basadas en revisión visual real
2. [x] Sección "Design Direction Decision" acotada explícitamente a admin y blog
3. [x] UX-DRs 25, 49, 63, 65, 69 corregidos para reflejar el diseño actual verificado con screenshots
4. [x] PRD contiene declaración "Visual Design Fidelity"
5. [x] Epic 2 y Epic 4 contienen notas de fidelidad/consistencia visual
6. [x] 13 screenshots del sitio actual disponibles en `visual-reference/`
7. [x] Un developer o agente leyendo cualquier combinación de documentos entiende que el sitio público replica el diseño actual
