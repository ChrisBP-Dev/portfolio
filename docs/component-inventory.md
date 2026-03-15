# Inventario de Componentes UI

> Generado: 2026-03-15 | Escaneo Exhaustivo

## Resumen

- **Widgets reutilizables (common_widgets)**: 22
- **Componentes de layout (common_components)**: 11
- **Componentes de features**: ~40+
- **Total estimado**: ~73 widgets/componentes

---

## Widgets Reutilizables (`core/common_widgets/`)

### Layout y Responsive

| Widget | Archivo | Descripción |
|---|---|---|
| `ResponsiveCenter` | responsive_center.dart | Centra contenido con max-width (default: 900px) |
| `ResponsiveSliverCenter` | responsive_center.dart | Versión Sliver de ResponsiveCenter |
| `ResponsiveWidget` | responsive_widget.dart | Renderiza widget diferente por breakpoint (mobile/tablet/desktop) |
| `WrapperScroll` | wrapper_scroll.dart | Layout principal: Banner + Header + Slivers + Footer |

### Botones

| Widget | Archivo | Descripción |
|---|---|---|
| `PrimaryButton` | primary_button.dart | ElevatedButton responsive con color primario |
| `SecondaryButton` | secondary_button.dart | OutlinedButton responsive |
| `SocialButton` | social_button.dart | InkWell con icono para redes sociales |

### Texto y Títulos

| Widget | Archivo | Descripción |
|---|---|---|
| `ShaderTextEffect` | shader_text_effect.dart | Texto con efecto gradiente |
| `ShaderTextSpan` | shader_text_effect.dart | TextSpan con gradiente inline |
| `CustomTitleOnComponent` | custom_title_on_component.dart | Título de sección con gradiente temático |
| `TitleFormField` | title_form_field.dart | Título de sección en formularios |

### Datos y Estado

| Widget | Archivo | Descripción |
|---|---|---|
| `AsyncValueWidget<T>` | async_value_widget.dart | Wrapper para AsyncValue (loading/error/data) |
| `AsyncValueSliverWidget<T>` | async_value_widget.dart | Versión Sliver del AsyncValueWidget |
| `ErrorMessageWidget` | error_message_widget.dart | Mensaje de error estilizado |
| `EmptyPlaceholderWidget` | empty_placeholder_widget.dart | Placeholder vacío con botón "Go Home" |
| `CustomPlaceholder` | custom_placeholder.dart | Placeholder de desarrollo |

### Negocio y Marca

| Widget | Archivo | Descripción |
|---|---|---|
| `BusinessLogo` | business_logo.dart | Logo clickeable con navegación a home |
| `BusinessChipText` | business_chip_text.dart | Chip con borde gradiente (tags de tecnología) |
| `TechnologyIcon` | technology_icon.dart | Icono de tecnología con imagen de red |
| `InitialBanner` | initial_banner.dart | Banner sliver de bienvenida con gradiente |

### Formularios

| Widget | Archivo | Descripción |
|---|---|---|
| `CustomTextFormField` | custom_text_form_field.dart | TextFormField estilizado con borde gradiente en focus |

### Imágenes

| Widget | Archivo | Descripción |
|---|---|---|
| `WrapNetworkImage` | wrap_network_image.dart | CachedNetworkImage con loading/error handling |
| `ImageMemoryPicked` | image_memory_picked.dart | Selector de imagen local/red con delete |

### Diálogos

| Widget | Archivo | Descripción |
|---|---|---|
| `showAlertDialog()` | alert_dialogs.dart | Diálogo multiplataforma (Material/Cupertino) |
| `showExceptionAlertDialog()` | alert_dialogs.dart | Diálogo de error/excepción |
| `showNotImplementedAlertDialog()` | alert_dialogs.dart | Diálogo "no implementado" |
| `AdminDialog` | admin_dialog.dart | Diálogo CRUD admin con formulario scrollable |

---

## Componentes de Layout (`core/common_components/`)

### Contenedor Principal

| Componente | Archivo | Descripción |
|---|---|---|
| `FullPageContainer` | full_page_container.dart | Wrapper de todas las páginas: AdminDrawer (si auth) + FABs (tema, locale, admin) |

### Header (Navegación)

| Componente | Archivo | Descripción |
|---|---|---|
| `HeaderComponent` | header/header_component.dart | PinnedHeaderSliver: logo + menú desktop/mobile |
| `ResponsiveHeader` | header/header_component.dart | Helper responsive para header |
| `HeaderLogo` | header/header_logo.dart | Logo responsive en header |
| `CustomMenuItem` | header/custom_menu_item.dart | Item menú desktop con hover y gradiente |
| `MobileMenuItem` | header/mobile_menu_item.dart | Item menú mobile con gradiente |
| `AnimatedMenuContainer` | header/animated_menu_container.dart | Menú mobile con animación slide (400ms) |

### Footer

| Componente | Archivo | Descripción |
|---|---|---|
| `FooterComponent` | footer/footer_component.dart | Footer: título "Contact", redes sociales, copyright, SignIn oculto |

### Admin

| Componente | Archivo | Descripción |
|---|---|---|
| `AdminDrawer` | admin/admin_drawer.dart | Sidebar admin (230px): menú + sign out |
| `AdminWrapList` | admin/admin_wrap_list.dart | Layout lista admin: AppBar gradiente + botón crear + lista |
| `AdminMenuItem` | admin/widgets/admin_menu_item.dart | Item de menú del drawer admin |

---

## Componentes por Feature

### Home

| Componente | Archivo | Descripción |
|---|---|---|
| `AboutMeComponent` | about_me/about_me_component.dart | Sección "About Me": avatar, texto, detalles, botones |
| `Avatar` | about_me/avatar.dart | Avatar circular con gradiente |
| `AboutText` | about_me/about_text.dart | Headline "about" con shader |
| `AboutDetails` | about_me/about_details.dart | Descripción personal |
| `AboutButtons` | about_me/about_buttons.dart | "Get in Touch" + "Download Resume" |
| `TechnologiesComponent` | technologies/technologies_component.dart | Sección tecnologías |
| `TechnologiesList` | technologies/technologies_list.dart | Lista horizontal de tecnologías |
| `TechnologyIconText` | technologies/technology_icon_text.dart | Icono + nombre de tecnología |
| `ExperienceComponent` | experience/experience_component.dart | Sección experiencia |
| `ExperiencesList` | experience/experiences_list.dart | Lista de experiencias |
| `ExperienceCard` | experience/experience_card.dart | Card de experiencia individual |
| `ProjectsComponent` | projects/projects_component.dart | Sección proyectos + "See All" |
| `HomeProjectsList` | projects/home_projects_list.dart | Primeros 3 proyectos |
| `HomeProjectCard` | projects/home_project_card.dart | Card de proyecto en home |
| `HomeProjectImageCard` | projects/home_project_image_card.dart | Imagen de proyecto en home |

### Projects

| Componente | Archivo | Descripción |
|---|---|---|
| `ProjectsPage` | projects_page.dart | Página con filtros y lista de proyectos |
| `ProjectCard` | project_card.dart | Card de proyecto individual |
| `ProjectContent` | project_content.dart | Contenido: nombre, descripción, URLs, tecnologías |
| `ProjectDescription` | project_description.dart | Descripción de sección |
| `ProjectsList` | projects_list.dart | Layout wrap responsive de projects |
| `ProjectImagesList` | project_images_list.dart | Scroll horizontal de screenshots |
| `FilterDropdown` | filter_dropdown.dart | Filtro por tipo (all, website, source code) |
| `ImageViewer` | image_viewer.dart | Visor fullscreen de imágenes con navegación |

### Contact

| Componente | Archivo | Descripción |
|---|---|---|
| `ContactPage` | contact_page.dart | Página de contacto |
| `ContactForm` | contact_form.dart | Formulario: nombre, email, teléfono, mensaje, canal |
| `ContactDescription` | contact_description.dart | Descripción de sección contacto |
| `CountryPicker` | country_picker.dart | Selector de código de país |
| `SendThroughDropDownButton` | send_through_dropdown_button.dart | Selector WhatsApp/Email |
| `ContactTextformField` | contact_textform_field.dart | Campo de formulario con validación |

### Auth

| Componente | Archivo | Descripción |
|---|---|---|
| `SignInAlert` | sign_in_alert.dart | Diálogo de login (email + password) |
| `SignOutAlert` | sign_out_alert.dart | Diálogo de confirmación de logout |
| `SignInFormField` | sign_in_form_field.dart | Campo de formulario para login |
| `SignOutButton` | sign_out_button.dart | Botón de cerrar sesión |

### Settings

| Componente | Archivo | Descripción |
|---|---|---|
| `SwitchThemeWidget` | switch_theme_widget.dart | FAB toggle dark/light (sol/luna) |
| `SwitchLocaleWidget` | switch_locale_widget.dart | FAB toggle EN/ES (bandera) |

### Social Launcher

| Componente | Archivo | Descripción |
|---|---|---|
| `SocialButtons` | social_buttons.dart | Fila de 3 botones: TikTok, GitHub, LinkedIn |

### Technologies (Admin)

| Componente | Archivo | Descripción |
|---|---|---|
| `AdminTechnologiesListPage` | admin_technologies_list_page.dart | Página admin lista tecnologías |
| `AdminTechnologiesList` | admin_technologies_list.dart | ListView de tecnologías admin |
| `AdminTechnologyPage` | admin_technology_page.dart | Diálogo CRUD tecnología |

### Projects (Admin)

| Componente | Archivo | Descripción |
|---|---|---|
| `AdminProjectsListPage` | admin_projects_list_page.dart | Página admin lista proyectos |
| `AdminProjectList` | admin_project_list.dart | ListView de proyectos admin |
| `AdminProjectPage` | admin_project_page.dart | Diálogo CRUD proyecto (complejo) |
