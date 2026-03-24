# Modelos de Datos — Portfolio ChrisBP

> Generado: 2026-03-24 | Escaneo Exhaustivo | Zod 4 + Firebase Firestore

## Resumen

| Entidad | Colección Firestore | Esquemas Zod | Campos L10n |
|---------|-------------------|-------------|-------------|
| Project | `Projects` | project, projectFirestore, projectForm | companyName, shortDescription, features |
| Technology | `Technologies` | technology, technologyFirestore, technologyForm | — |
| Experience | `Experiences` | experience, experienceFirestore, experienceForm | jobName, responsibilities |
| BlogPost | `BlogPosts` | blogPost, blogPostFirestore, blogPostForm | title, content |

## Esquemas Compartidos (`shared-schemas.ts`)

### Locale
```typescript
type Locale = 'es' | 'en'
```

### LocalizedString
```typescript
type LocalizedString = { es: string; en: string }
// Validación: min 1 char cada campo
```

### LocalizedStringArray
```typescript
type LocalizedStringArray = { es: string[]; en: string[] }
// Validación: min 1 item en cada array, strings no vacíos
```

### StoredImage
```typescript
type StoredImage = { url: string; storagePath: string }
// url: URL válida, storagePath: ruta en Firebase Storage
```

## Project

### Esquema Completo
```typescript
type Project = {
  id: string
  companyName: LocalizedString        // Nombre del proyecto
  shortDescription: LocalizedString   // Descripción corta
  features: LocalizedStringArray      // Lista de características
  mainImage: StoredImage              // Imagen principal
  screenshots: StoredImage[]          // Galería de screenshots
  websiteUrl?: string                 // URL del sitio web (opcional)
  sourceCodeUrl?: string              // URL del código fuente (opcional)
  technologies: string[]              // IDs de tecnologías (min 1)
  slug: string                        // URL slug (/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  order: number                       // Orden de display (≥0)
  featured: boolean                   // Proyecto destacado
}
```

### Esquema Firestore (`projectFirestoreSchema`)
- Omite `id` (es el document ID)
- `mainImage` y `screenshots` opcionales (para parsing robusto)

### Esquema Form (`projectFormSchema`)
- Omite `id`, `mainImage`, `screenshots`, `order`, `featured`
- Solo campos editables por el usuario en formularios

### Colección Firestore: `Projects`
- **Queries:** Todos los documentos, ordenados por `order` ASC
- **Storage paths:** `projects/{slug}/main.*`, `projects/{slug}/screenshots/*`

## Technology

### Esquema Completo
```typescript
type Technology = {
  id: string
  name: string                        // Nombre de la tecnología
  image: StoredImage                  // Logo/ícono
  experienceYears: number             // Años de experiencia (0-50)
  order: number                       // Orden de display (≥0)
}
```

### Esquema Firestore (`technologyFirestoreSchema`)
- Omite `id`

### Esquema Form (`technologyFormSchema`)
- Omite `id`, `image`, `order`

### Colección Firestore: `Technologies`
- **Queries:** Todos los documentos, ordenados por `order` ASC
- **Storage paths:** `technologies/{id}/image.*`

## Experience

### Esquema Completo
```typescript
type Experience = {
  id: string
  companyName: string                 // Nombre de la empresa
  jobName: LocalizedString            // Puesto de trabajo (bilingüe)
  responsibilities: LocalizedStringArray  // Responsabilidades (bilingüe)
  startDate: Date                     // Fecha de inicio
  endDate?: Date | null               // Fecha de fin (null = actualmente)
}
```

### Validación
- **Refinement:** Si `endDate` existe, debe ser ≥ `startDate`

### Esquema Firestore (`experienceFirestoreSchema`)
- Omite `id`

### Esquema Form (`experienceFormSchema`)
- Omite `id`, misma validación de fechas

### Colección Firestore: `Experiences`
- **Queries:** Todos los documentos
- **Fechas:** Firestore Timestamps → JavaScript Dates

## BlogPost

### Esquema Completo
```typescript
type BlogPost = {
  id: string
  title: LocalizedString              // Título del artículo (bilingüe)
  content: LocalizedString            // Contenido TipTap JSON (bilingüe)
  slug: string                        // URL slug (/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  coverImage?: StoredImage | null     // Imagen de portada (opcional)
  images: StoredImage[]               // Imágenes inline del contenido
  status: 'published' | 'draft'       // Estado de publicación
  createdAt: Date                     // Fecha de creación
  updatedAt: Date                     // Fecha de última actualización
}
```

### Validación
- **Refinement:** `updatedAt` ≥ `createdAt`

### Esquema Firestore (`blogPostFirestoreSchema`)
- Omite `id`
- `images` default a `[]`

### Esquema Form (`blogPostFormSchema`)
- Solo: `title`, `content`, `slug`, `status`

### Colección Firestore: `BlogPosts`
- **Queries:** Status = 'published', ordenados por `createdAt` DESC
- **Storage paths:** `blog-posts/{id}/cover.*`, `blog-posts/{id}/images/*`
- **Contenido:** TipTap JSON almacenado como string en campo bilingüe

## ImageSlot (Discriminated Union)

No es un esquema Zod — es un tipo TypeScript para gestión de estados de imagen en formularios:

```typescript
type ImageSlot =
  | { type: 'empty' }
  | { type: 'existing'; image: StoredImage }
  | { type: 'new'; file: File; preview: string }
  | { type: 'replaced'; old: StoredImage; file: File; preview: string }
  | { type: 'removed'; old: StoredImage }
```

## Triple Schema Pattern

Cada entidad sigue el patrón de 3 esquemas Zod:

```
Full Schema (Project)
├── Incluye id, todos los campos, campos computados
├── Usado como tipo principal en la app
│
Firestore Schema (ProjectFirestoreData)
├── Sin id (viene del document ID)
├── Campos opcionales para parsing robusto
├── Usado para parsear documentos de Firestore
│
Form Schema (ProjectFormSchema)
├── Solo campos editables por el usuario
├── Sin id, sin imágenes (manejo separado), sin order/featured
├── Usado para validación de formularios
```

## Relaciones entre Entidades

```
Projects ──→ Technologies (references: technologies[] = Technology IDs)
Projects ──→ StoredImage (embedded: mainImage, screenshots[])
Technologies ──→ StoredImage (embedded: image)
BlogPosts ──→ StoredImage (embedded: coverImage?, images[])
Experiences ──→ (sin imágenes ni referencias)
```

## Reglas de Seguridad

### Firestore
```
read: público (cualquier usuario puede leer)
write: solo request.auth.uid == 'G26dKlezR6cghnfv7NrBmQiXdUG3'
```

### Storage
```
read: público
write: solo request.auth.uid == 'G26dKlezR6cghnfv7NrBmQiXdUG3'
```
