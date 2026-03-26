# Modelos de Datos — Portfolio ChrisBP

> Generado: 2026-03-26 | Modo: Re-escaneo Exhaustivo | v3.0.0

## Resumen

- **Base de datos:** Cloud Firestore (NoSQL)
- **Validacion:** Zod ^4.3.6
- **Colecciones:** 4 (Projects, Technologies, Experiences, BlogPosts)
- **Esquemas compartidos:** locale, localizedString, localizedStringArray, storedImage, imageSlot
- **Patron de esquemas:** Cada entidad tiene 3 variantes: entity (completo), firestore (sin id), form (campos editables)

## Esquemas Compartidos (src/lib/schemas/shared-schemas.ts)

### localeSchema
```typescript
z.enum(['es', 'en'])
```
Tipo: `Locale = 'es' | 'en'`

### localizedString
```typescript
z.object({
  es: z.string().min(1),
  en: z.string().min(1)
})
```
Usado en: titulos, descripciones, nombres de cargo

### localizedStringArray
```typescript
z.object({
  es: z.array(z.string().min(1)),
  en: z.array(z.string().min(1))
})
```
Usado en: features de proyectos, responsabilidades de experiencias

### storedImageSchema
```typescript
z.object({
  url: z.url(),
  storagePath: z.string().min(1)
})
```
Tipo: `StoredImage = { url: string; storagePath: string }`
Usado en: todas las imagenes almacenadas en Firebase Storage

### ImageSlot (src/lib/schemas/image-slot.ts)
```typescript
type ImageSlot =
  | { type: 'empty' }
  | { type: 'existing'; image: StoredImage }
  | { type: 'new'; file: File; preview: string }
  | { type: 'replaced'; old: StoredImage; file: File; preview: string }
  | { type: 'removed'; old: StoredImage }
```
Discriminated union para gestion type-safe del estado de upload de imagenes.

---

## Coleccion: Projects

**Ruta Firestore:** `Projects`
**Archivo esquema:** src/lib/schemas/project-schema.ts

### Esquema Completo (projectSchema)

| Campo | Tipo Zod | Requerido | Descripcion |
|-------|----------|-----------|-------------|
| id | z.string() | Si | ID del documento Firestore |
| companyName | localizedString | Si | Nombre de empresa/proyecto bilingue |
| shortDescription | localizedString | Si | Descripcion corta bilingue |
| features | localizedStringArray | Si | Lista de caracteristicas bilingue |
| mainImage | storedImageSchema | Si | Imagen principal del proyecto |
| screenshots | z.array(storedImageSchema) | Si | Galeria de capturas de pantalla |
| websiteUrl | z.url().optional() | No | URL del sitio web en produccion |
| sourceCodeUrl | z.url().optional() | No | URL del repositorio de codigo |
| technologies | z.array(z.string().min(1)) | Si | Nombres de tecnologias usadas |
| slug | z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) | Si | Slug URL-safe (generado del campo EN) |
| order | z.number().int().nonnegative().default(0) | Si | Orden de visualizacion |
| featured | z.boolean().default(false) | Si | Proyecto destacado en home |

### Variantes
- **projectFirestoreSchema**: Omite `id`, hace `mainImage` y `screenshots` opcionales
- **projectFormSchema**: Omite `id`, `mainImage`, `screenshots`, `order`, `featured`

### Queries
- `getAllProjects(db)`: Ordena por `order` ASC, luego `slug` ASC
- `parseProject(data, id)`: Valida con projectSchema

---

## Coleccion: Technologies

**Ruta Firestore:** `Technologies`
**Archivo esquema:** src/lib/schemas/technology-schema.ts

### Esquema Completo (technologySchema)

| Campo | Tipo Zod | Requerido | Descripcion |
|-------|----------|-----------|-------------|
| id | z.string() | Si | ID del documento Firestore |
| name | z.string().min(1) | Si | Nombre de la tecnologia |
| image | storedImageSchema | Si | Logo/icono de la tecnologia |
| experienceYears | z.number().int().nonnegative() | Si | Anios de experiencia |
| order | z.number().int().nonnegative().default(0) | Si | Orden de visualizacion |

### Variantes
- **technologyFirestoreSchema**: Omite `id`
- **technologyFormSchema**: Omite `id`, `image`, `order`

### Queries
- `getAllTechnologies(db)`: Ordena por `order` ASC, luego `name` ASC
- `parseTechnology(data, id)`: Valida con technologySchema

---

## Coleccion: Experiences

**Ruta Firestore:** `Experiences`
**Archivo esquema:** src/lib/schemas/experience-schema.ts

### Esquema Completo (experienceSchema)

| Campo | Tipo Zod | Requerido | Descripcion |
|-------|----------|-----------|-------------|
| id | z.string() | Si | ID del documento Firestore |
| companyName | z.string().min(1) | Si | Nombre de la empresa |
| jobName | localizedString | Si | Cargo bilingue |
| responsibilities | localizedStringArray | Si | Responsabilidades bilingue |
| startDate | z.date() | Si | Fecha de inicio |
| endDate | z.date().nullable() | Si | Fecha fin (null = actual) |

### Refinamiento
```typescript
.refine(
  (data) => data.endDate === null || data.endDate >= data.startDate,
  { message: 'endDate must be >= startDate', path: ['endDate'] }
)
```

### Variantes
- **experienceFirestoreSchema**: Omite `id`
- **experienceFormSchema**: Omite `id`, incluye mismo refinamiento

### Queries
- `getAllExperiences(db)`: Ordena por `startDate` DESC
- `parseExperience(data, id)`: Convierte Firestore Timestamps a Date, valida y refine

---

## Coleccion: BlogPosts

**Ruta Firestore:** `BlogPosts`
**Archivo esquema:** src/lib/schemas/blog-post-schema.ts

### Esquema Completo (blogPostSchema)

| Campo | Tipo Zod | Requerido | Descripcion |
|-------|----------|-----------|-------------|
| id | z.string() | Si | ID del documento Firestore |
| title | localizedString | Si | Titulo bilingue |
| content | localizedString | Si | Contenido bilingue (TipTap JSON como string) |
| slug | z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) | Si | Slug URL-safe (generado del campo EN) |
| coverImage | storedImageSchema.optional() | No | Imagen de portada |
| images | z.array(storedImageSchema) | Si | Imagenes embebidas en contenido |
| status | z.enum(['published', 'draft']) | Si | Estado de publicacion |
| createdAt | z.date() | Si | Fecha de creacion |
| updatedAt | z.date() | Si | Ultima actualizacion |

### Refinamiento
```typescript
.refine(
  (data) => data.updatedAt >= data.createdAt,
  { message: 'updatedAt must be >= createdAt' }
)
```

### Variantes
- **blogPostFirestoreSchema**: Omite `id`, `images` tiene default `[]`
- **blogPostFormSchema**: Solo `title`, `content`, `slug`, `status`

### Queries
- `getPublishedBlogPosts(db)`: WHERE `status == 'published'`, ordena por `createdAt` DESC
- `parseBlogPost(data, id)`: Convierte Timestamps, valida y refine

---

## Relaciones entre Entidades

```
Projects ──technologies[]──> Technologies (referencia por nombre, no ID)
Projects ──mainImage──> Firebase Storage (StoredImage)
Projects ──screenshots[]──> Firebase Storage (StoredImage[])
Technologies ──image──> Firebase Storage (StoredImage)
BlogPosts ──coverImage?──> Firebase Storage (StoredImage)
BlogPosts ──images[]──> Firebase Storage (StoredImage[])
```

**Nota:** No hay foreign keys en Firestore. La referencia `Project.technologies` es un array de strings que coinciden con `Technology.name`. Esto permite rendering sin joins pero requiere consistencia manual.

---

## Conversion de Timestamps

La funcion `toDate()` en collections.ts maneja la conversion de tipos Firestore:
- `Firestore.Timestamp` -> `.toDate()`
- `string` (ISO 8601) -> `new Date(string)`
- `number` (millis) -> `new Date(number)`
- `Date` -> pass-through
- `null/undefined` -> throws

---

## Reglas de Seguridad

### Firestore (firestore.rules)
```
allow read: if true;
allow write: if request.auth != null && request.auth.uid == 'G26dKlezR6cghnfv7NrBmQiXdUG3';
```

### Storage (storage.rules)
```
allow read: if true;
allow write: if request.auth != null && request.auth.uid == 'G26dKlezR6cghnfv7NrBmQiXdUG3';
```

Lectura publica, escritura restringida a un unico UID de admin.
