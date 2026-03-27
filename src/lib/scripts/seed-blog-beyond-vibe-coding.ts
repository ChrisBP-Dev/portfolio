/**
 * Seed Blog Post: "Beyond Vibe Coding"
 *
 * Creates a bilingual (EN/ES) blog post about AI-augmented engineering
 * methodology applied to two real brownfield modernization projects.
 *
 * Usage:
 *   pnpm seed:blog              # write to Firestore
 *   pnpm seed:blog -- --dry-run # preview without writing
 *
 * Requires Node 22+ for --env-file=.env support.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// ─── Firebase Admin init ───

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim().replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing Firebase Admin env vars. Check .env file.');
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const db = getFirestore();

// ─── TipTap JSON Builder Helpers ───

interface TipTapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface TipTapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  marks?: TipTapMark[];
  text?: string;
}

// Core node builders
const doc = (...content: TipTapNode[]): TipTapNode => ({ type: 'doc', content });

const heading = (level: number, ...content: TipTapNode[]): TipTapNode => ({
  type: 'heading',
  attrs: { level },
  content,
});

const paragraph = (...content: TipTapNode[]): TipTapNode =>
  content.length > 0 ? { type: 'paragraph', content } : { type: 'paragraph' };

const bulletList = (...items: TipTapNode[]): TipTapNode => ({
  type: 'bulletList',
  content: items,
});

const listItem = (...content: TipTapNode[]): TipTapNode => ({
  type: 'listItem',
  content,
});

const horizontalRule = (): TipTapNode => ({ type: 'horizontalRule' });

// Text node builders
const text = (t: string, marks?: TipTapMark[]): TipTapNode => {
  const node: TipTapNode = { type: 'text', text: t };
  if (marks && marks.length > 0) node.marks = marks;
  return node;
};

// Shorthand text formatters
const t = (s: string) => text(s);
const b = (s: string) => text(s, [{ type: 'bold' }]);
const i = (s: string) => text(s, [{ type: 'italic' }]);
const c = (s: string) => text(s, [{ type: 'code' }]);
const a = (s: string, href: string) => text(s, [{ type: 'link', attrs: { href } }]);
// Shorthand node builders
const h2 = (...content: TipTapNode[]) => heading(2, ...content);
const p = (...content: TipTapNode[]) => paragraph(...content);
const ul = (...items: TipTapNode[]) => bulletList(...items);
const hr = () => horizontalRule();

// List item with inline text content (wraps in paragraph)
const li = (...textNodes: TipTapNode[]) => listItem(p(...textNodes));

// ─── English Content ───

const enContent = doc(
  // Opening
  p(
    t(
      'The AI coding revolution has a credibility problem. "Vibe coding" \u2014 the practice of generating code through AI prompts with minimal engineering oversight \u2014 has become the default perception of what AI-assisted development looks like. The results are predictable: fragile prototypes, absent test suites, and architectural decisions made by autocomplete.',
    ),
  ),
  p(
    t(
      'But there is a fundamentally different approach. One that uses AI within a structured engineering methodology \u2014 planning before building, testing alongside implementing, reviewing before shipping.',
    ),
  ),
  p(
    t(
      'This article documents how two real-world brownfield projects were rebuilt from the ground up using the ',
    ),
    a('BMad Method', 'https://github.com/bmadcode/BMAD-METHOD'),
    t(' and '),
    a('Claude Code CLI', 'https://docs.anthropic.com/en/docs/claude-code'),
    t(
      ' \u2014 not as vibe coding experiments, but as engineering projects with professional standards. The combined result: ',
    ),
    b('62 stories, 11 epics, 1,779 tests, and zero production incidents'),
    t('.'),
  ),

  hr(),

  // The Vibe Coding Problem
  h2(t('The Problem with Vibe Coding')),
  p(
    t(
      'Vibe coding is seductive. You describe what you want, AI generates code, and something appears on screen within minutes. For prototypes and throwaway experiments, this works fine. For production software, it is a recipe for disaster:',
    ),
  ),
  ul(
    li(
      b('No architecture: '),
      t(
        'Code grows organically without structure, making changes increasingly expensive',
      ),
    ),
    li(
      b('No tests: '),
      t(
        'The first refactor breaks everything, and nobody knows what broke or why',
      ),
    ),
    li(
      b('No quality gates: '),
      t(
        'Security vulnerabilities, accessibility failures, and performance issues ship silently',
      ),
    ),
    li(
      b('No learning loop: '),
      t(
        'The same mistakes repeat because there is no process to capture and prevent them',
      ),
    ),
  ),
  p(
    t(
      'The fundamental problem is not AI \u2014 it is the absence of engineering discipline around it. AI amplifies whatever process you feed it: feed it chaos, you get faster chaos.',
    ),
  ),

  hr(),

  // The Approach
  h2(t('A Different Approach: BMad Method + Claude Code')),
  p(
    t('The '),
    a('BMad Method', 'https://github.com/bmadcode/BMAD-METHOD'),
    t(
      ' is an AI-assisted development framework that treats AI as a team of specialized engineering agents, not a general-purpose code generator. Think of it as a virtual engineering team:',
    ),
  ),
  ul(
    li(
      t('A '),
      b('Product Manager'),
      t(' writes the PRD with measurable requirements'),
    ),
    li(
      t('An '),
      b('Architect'),
      t(' designs the technical solution with documented trade-offs'),
    ),
    li(
      t('A '),
      b('UX Designer'),
      t(' defines interface specifications and accessibility criteria'),
    ),
    li(
      t('A '),
      b('Scrum Master'),
      t(' breaks work into epics and traceable stories'),
    ),
    li(
      t('A '),
      b('Developer'),
      t(' implements each story following strict acceptance criteria'),
    ),
    li(
      t('A '),
      b('QA Engineer'),
      t(' designs the test strategy'),
    ),
    li(
      t('A '),
      b('Code Reviewer'),
      t(' performs adversarial multi-layer reviews'),
    ),
  ),
  p(
    t(
      'Each agent has deep domain expertise. Each artifact feeds into the next. Quality gates prevent moving forward with incomplete work. Retrospectives at every epic close the learning loop.',
    ),
  ),
  p(
    t('Combined with '),
    a('Claude Code CLI', 'https://docs.anthropic.com/en/docs/claude-code'),
    t(
      ' (powered by Claude Opus), this creates an engineering pipeline where AI operates under the same discipline you would expect from a professional team. Every line of code traces to a requirement. Every requirement traces to a business need. Nothing ships without tests, review, and validation.',
    ),
  ),
  p(
    t('The critical insight: '),
    b('the methodology is stack-agnostic'),
    t(
      '. The same workflow applies whether you are building a web application or a mobile app. To demonstrate this, I applied it to two completely different projects.',
    ),
  ),

  hr(),

  // Case Study 1: Portfolio
  h2(t('Case Study: Portfolio \u2014 Flutter Web \u2192 Modern Stack')),
  p(
    t(
      'My previous portfolio was built with Flutter Web three years ago. Flutter Web renders to an HTML canvas \u2014 search engines see nothing, screen readers cannot navigate it, and the technology had stagnated. For a developer portfolio, these were disqualifying problems.',
    ),
  ),
  p(
    t(
      'The BMad agents produced a complete engineering specification before any code was written: a ',
    ),
    b('Product Brief'),
    t(' defining vision and personas, a '),
    b('PRD'),
    t(' with 49 functional and 29 non-functional requirements, an '),
    b('Architecture Decision Document'),
    t(
      ' selecting Astro 6 SSG + Svelte 5 + Firebase + TypeScript strictest + Tailwind CSS 4, and a ',
    ),
    b('UX Specification'),
    t(' with 46 design requirements and WCAG 2.1 AA compliance criteria.'),
  ),
  p(t('Implementation followed in 5 epics across 11 days:')),
  ul(
    li(
      b('Epic 1 \u2014 Foundation'),
      t(
        ' (10 stories): Testing infrastructure, CI/CD pipeline, Zod schemas, design system, i18n, theming. ',
      ),
      i('146 tests, 54 code review patches caught.'),
    ),
    li(
      b('Epic 2 \u2014 Public Site'),
      t(
        ' (8 stories): All public pages, data migration from Flutter schema, View Transitions API, responsive design. ',
      ),
      i('388 tests total.'),
    ),
    li(
      b('Epic 3 \u2014 Admin Panel'),
      t(
        ' (8 stories): Firebase Auth, full CRUD, ImageService with retry logic and orphan cleanup. ',
      ),
      i('879 tests.'),
    ),
    li(
      b('Epic 4 \u2014 Blog System'),
      t(
        ' (5 stories): TipTap rich text editor, bilingual content, OpenGraph cards, drag-drop ordering. ',
      ),
      i('~1,279 tests. First story to pass code review with zero patches.'),
    ),
    li(
      b('Epic 5 \u2014 SEO & Accessibility'),
      t(
        ' (6 stories): Structured data, sitemap, WCAG 2.1 AA audit with axe-core, performance optimization. ',
      ),
      i('1,406 total tests, zero production incidents.'),
    ),
  ),
  p(
    t(
      'The architecture delivered measurable results: public pages ship zero JavaScript by default, with the home page at just ',
    ),
    b('25.8 KB of total JS'),
    t(' \u2014 half the 50 KB budget. TypeScript '),
    c('strictest'),
    t(
      ' mode catches type errors before runtime. Zod schemas validate every Firestore document at boundaries. Lighthouse CI enforces 95+ scores on every deployment.',
    ),
  ),

  hr(),

  // Case Study 2: TimeMoney
  h2(t('Case Study: TimeMoney \u2014 Legacy Dart \u2192 Modern Flutter')),
  p(
    a('TimeMoney', 'https://github.com/ChrisBP-Dev/TimeMoney'),
    t(
      ' is a cross-platform Flutter app for hourly workers to track hours and calculate payments, running on iOS, Android, Web, and Windows. It was built three years ago with Dart 2.x, using outdated patterns and no formal architecture.',
    ),
  ),
  p(
    t(
      'The same BMad Method workflow produced: a PRD with 24 functional and 11 non-functional requirements, an architecture document specifying ',
    ),
    b('feature-first Clean Architecture'),
    t(' with a '),
    b('dual datasource strategy'),
    t(
      ' (ObjectBox for native platforms, Drift with WASM + OPFS for web), and a complete epic breakdown mapping all 53 detailed requirements to 25 stories across 6 epics.',
    ),
  ),
  p(t('Implementation followed across 6 epics:')),
  ul(
    li(
      b('Epic 1 \u2014 SDK Foundation'),
      t(' (4 stories): Dart 2.19 \u2192 3.11+, Flutter 3.7.5 \u2192 3.41+, dependency resolution.'),
    ),
    li(
      b('Epic 2 \u2014 Architecture'),
      t(
        ' (5 stories): Feature-first restructure with domain/data/presentation layers, shared components.',
      ),
    ),
    li(
      b('Epic 3 \u2014 State Management'),
      t(
        ' (6 stories): Dart 3 sealed classes for BLoC states, ActionState generic pattern, test infrastructure.',
      ),
    ),
    li(
      b('Epic 4 \u2014 Multi-Platform'),
      t(
        ' (5 stories): Drift database for web, platform-aware dependency injection via conditional imports, bilingual i18n.',
      ),
    ),
    li(
      b('Epic 5 \u2014 Testing'),
      t(
        ' (3 stories): 200 new tests (121% growth), widget tests, golden visual regression tests. ',
      ),
      i('92.3% coverage achieved.'),
    ),
    li(
      b('Epic 6 \u2014 Polish'),
      t(
        ' (2 stories): 8-job CI/CD pipeline, Maestro E2E with auto-generated screenshots and demo video.',
      ),
    ),
  ),
  p(
    t('The result: '),
    b('373 tests at 92.3% coverage'),
    t(
      ', zero deferred technical debt, 100% of use cases and BLoCs at full coverage, running on four platforms from a single codebase. The Either monad (fpdart) ensures railway-oriented error handling throughout. Sealed classes replace legacy patterns with compile-time exhaustive matching.',
    ),
  ),

  hr(),

  // The Quality Compounding Effect
  h2(t('The Quality Compounding Effect')),
  p(
    t(
      'The most powerful pattern across both projects was the compounding quality effect \u2014 each epic improved on the previous one because retrospectives closed the learning loop.',
    ),
  ),
  p(
    t('In the portfolio project, code review patches dropped from '),
    b('54 (Epic 1) to 26 (Epic 5)'),
    t(' \u2014 a 52% reduction. Deferred items fell from 12 to 1. In TimeMoney, code review patches within Epic 5 alone dropped from '),
    b('14 to 2'),
    t(' across three stories.'),
  ),
  p(
    t(
      'This was not because the AI model improved. It was because the process improved. Each retrospective captured what failed and what to change:',
    ),
  ),
  ul(
    li(
      t(
        'Specs based on outdated framework versions \u2192 research validation became mandatory before story creation',
      ),
    ),
    li(
      t(
        'Zero admin E2E tests despite having test designs \u2192 the Scrum Master now verifies test tasks exist in every story',
      ),
    ),
    li(
      t(
        'Tautological tests (verifying mocks instead of behavior) caught in review \u2192 substantive testing became an explicit review criterion',
      ),
    ),
  ),
  p(
    t('The lesson: '),
    b(
      'AI does not self-improve within a project. Process does.',
    ),
    t(
      ' The methodology creates a feedback loop that makes every subsequent epic more efficient and more correct than the last.',
    ),
  ),
  p(
    t('Combined across both projects: '),
    b('62 stories'),
    t(' completed, '),
    b('1,779 tests'),
    t(' written, '),
    b('zero production incidents'),
    t(', '),
    b('10 epic retrospectives'),
    t(
      ', and a measurable improvement trend in quality metrics from first epic to last.',
    ),
  ),

  hr(),

  // Why This Isn't Vibe Coding
  h2(t('Why This Is Not Vibe Coding')),
  p(t('Let me be direct about the contrast:')),
  p(
    b('Vibe coding'),
    t(
      ' generates code from prompts and ships whatever compiles. There is no PRD, no architecture document, no test strategy. When bugs appear, the answer is "ask the AI to fix it" \u2014 creating a cycle of patches on patches with no traceability and no learning.',
    ),
  ),
  p(
    b('Engineering-augmented development'),
    t(
      ' uses AI within a methodology. Every line of code traces to a requirement. Every requirement traces to a business need. Tests are written alongside implementation, not after. Code review catches what tests miss. Retrospectives prevent the same mistakes from recurring.',
    ),
  ),
  p(
    t('The difference is not the AI model. '),
    b('It is the process around it.'),
  ),
  p(
    t('This portfolio has 1,406 tests not because AI generated them automatically, but because the '),
    b('methodology required them at every step'),
    t('. It passes WCAG 2.1 AA not because AI knows accessibility, but because the UX specification defined it as a non-negotiable requirement, the architecture planned for it, and code review enforced it.'),
  ),

  hr(),

  // The Direction for Developers
  h2(t('The Direction the Industry Is Moving')),
  p(
    t(
      'Companies do not need developers who write better prompts. They need developers who can direct AI to produce production-quality software \u2014 with architecture, tests, accessibility, and maintainability. The demand is not for more code; it is for more reliable code.',
    ),
  ),
  p(
    t(
      'The developers who thrive in this era will be the ones who bring engineering discipline to AI. Who understand that a PRD prevents scope creep, that code review catches what tests miss, that retrospectives prevent repeated mistakes, and that quality gates are not overhead \u2014 they are what makes AI-generated code production-worthy.',
    ),
  ),
  p(
    t(
      'These are small projects \u2014 a personal portfolio and a utility app. But the methodology scales. The same BMad Method workflow that produced 62 stories and 1,779 tests across these projects can produce hundreds of stories for enterprise applications. The quality gates, the retrospectives, the adversarial reviews \u2014 these are engineering fundamentals that become ',
    ),
    i('more'),
    t(' valuable, not less, when AI accelerates the pace.'),
  ),

  hr(),

  // CTA
  h2(t('Explore It Yourself')),
  p(
    t(
      'Both projects are fully open source. Every planning artifact, story file, and epic retrospective is available in the repositories:',
    ),
  ),
  ul(
    li(
      b('Portfolio (Web): '),
      a('github.com/ChrisBP-Dev/portfolio', 'https://github.com/ChrisBP-Dev/portfolio'),
    ),
    li(
      b('TimeMoney (Flutter): '),
      a(
        'github.com/ChrisBP-Dev/TimeMoney',
        'https://github.com/ChrisBP-Dev/TimeMoney',
      ),
    ),
    li(
      b('Methodology: '),
      a('BMad Method', 'https://github.com/bmadcode/BMAD-METHOD'),
    ),
    li(
      b('AI Tool: '),
      a('Claude Code CLI', 'https://docs.anthropic.com/en/docs/claude-code'),
      t(' by Anthropic (Claude Opus)'),
    ),
  ),
  p(
    t(
      'The commit histories tell the complete stories \u2014 from product briefs to production deployments. Study them, fork them, and apply the methodology to your own brownfield projects.',
    ),
  ),
  p(
    b(
      'The future of software development is not AI replacing engineers. It is engineers wielding AI with the discipline the craft demands.',
    ),
  ),
);

// ─── Spanish Content ───

const esContent = doc(
  // Opening
  p(
    t(
      'La revoluci\u00f3n de la IA en el desarrollo de software tiene un problema de credibilidad. El "vibe coding" \u2014 la pr\u00e1ctica de generar c\u00f3digo a trav\u00e9s de prompts con supervisi\u00f3n m\u00ednima \u2014 se ha convertido en la percepci\u00f3n por defecto de lo que es el desarrollo asistido por IA. Los resultados son predecibles: prototipos fr\u00e1giles, cero tests, y decisiones de arquitectura tomadas por autocomplete.',
    ),
  ),
  p(
    t(
      'Pero existe un enfoque fundamentalmente diferente. Uno que usa IA dentro de una metodolog\u00eda de ingenier\u00eda estructurada \u2014 planificando antes de construir, testeando junto con la implementaci\u00f3n, revisando antes de desplegar.',
    ),
  ),
  p(
    t(
      'Este art\u00edculo documenta c\u00f3mo dos proyectos brownfield reales fueron reconstruidos desde cero usando el ',
    ),
    a('BMad Method', 'https://github.com/bmadcode/BMAD-METHOD'),
    t(' y '),
    a('Claude Code CLI', 'https://docs.anthropic.com/en/docs/claude-code'),
    t(
      ' \u2014 no como experimentos de vibe coding, sino como proyectos de ingenier\u00eda con est\u00e1ndares profesionales. El resultado combinado: ',
    ),
    b('62 historias, 11 \u00e9picas, 1,779 tests, y cero incidentes en producci\u00f3n'),
    t('.'),
  ),

  hr(),

  // El Problema del Vibe Coding
  h2(t('El Problema del Vibe Coding')),
  p(
    t(
      'El vibe coding es seductor. Describes lo que quieres, la IA genera c\u00f3digo, y algo aparece en pantalla en minutos. Para prototipos desechables, esto funciona. Para software de producci\u00f3n, es una receta para el desastre:',
    ),
  ),
  ul(
    li(
      b('Sin arquitectura: '),
      t(
        'El c\u00f3digo crece org\u00e1nicamente sin estructura, haciendo que los cambios sean cada vez m\u00e1s costosos',
      ),
    ),
    li(
      b('Sin tests: '),
      t(
        'El primer refactor rompe todo, y nadie sabe qu\u00e9 se rompi\u00f3 ni por qu\u00e9',
      ),
    ),
    li(
      b('Sin quality gates: '),
      t(
        'Vulnerabilidades de seguridad, fallos de accesibilidad y problemas de rendimiento se despliegan en silencio',
      ),
    ),
    li(
      b('Sin ciclo de aprendizaje: '),
      t(
        'Los mismos errores se repiten porque no hay un proceso para capturarlos y prevenirlos',
      ),
    ),
  ),
  p(
    t(
      'El problema fundamental no es la IA \u2014 es la ausencia de disciplina de ingenier\u00eda alrededor de ella. La IA amplifica cualquier proceso que le alimentes: si le das caos, obtienes caos m\u00e1s r\u00e1pido.',
    ),
  ),

  hr(),

  // El Enfoque
  h2(t('Un Enfoque Diferente: BMad Method + Claude Code')),
  p(
    t('El '),
    a('BMad Method', 'https://github.com/bmadcode/BMAD-METHOD'),
    t(
      ' es un framework de desarrollo asistido por IA que trata a la IA como un equipo de agentes de ingenier\u00eda especializados, no como un generador de c\u00f3digo gen\u00e9rico. Piensa en ello como un equipo virtual de ingenier\u00eda:',
    ),
  ),
  ul(
    li(
      t('Un '),
      b('Product Manager'),
      t(' escribe el PRD con requerimientos medibles'),
    ),
    li(
      t('Un '),
      b('Arquitecto'),
      t(' dise\u00f1a la soluci\u00f3n t\u00e9cnica con trade-offs documentados'),
    ),
    li(
      t('Un '),
      b('Dise\u00f1ador UX'),
      t(' define especificaciones de interfaz y criterios de accesibilidad'),
    ),
    li(
      t('Un '),
      b('Scrum Master'),
      t(' divide el trabajo en \u00e9picas e historias trazables'),
    ),
    li(
      t('Un '),
      b('Developer'),
      t(' implementa cada historia siguiendo criterios de aceptaci\u00f3n estrictos'),
    ),
    li(
      t('Un '),
      b('QA Engineer'),
      t(' dise\u00f1a la estrategia de testing'),
    ),
    li(
      t('Un '),
      b('Code Reviewer'),
      t(' realiza revisiones adversariales multi-capa'),
    ),
  ),
  p(
    t(
      'Cada agente tiene experiencia profunda en su dominio. Cada artefacto alimenta al siguiente. Los quality gates previenen avanzar con trabajo incompleto. Las retrospectivas al cierre de cada \u00e9pica cierran el ciclo de aprendizaje.',
    ),
  ),
  p(
    t('Combinado con '),
    a('Claude Code CLI', 'https://docs.anthropic.com/en/docs/claude-code'),
    t(
      ' (impulsado por Claude Opus), esto crea un pipeline de ingenier\u00eda donde la IA opera bajo la misma disciplina que esperar\u00edas de un equipo profesional. Cada l\u00ednea de c\u00f3digo se traza a un requerimiento. Cada requerimiento se traza a una necesidad de negocio. Nada se despliega sin tests, revisi\u00f3n y validaci\u00f3n.',
    ),
  ),
  p(
    t('El insight clave: '),
    b('la metodolog\u00eda es agn\u00f3stica del stack'),
    t(
      '. El mismo workflow aplica tanto si est\u00e1s construyendo una aplicaci\u00f3n web como una app m\u00f3vil. Para demostrarlo, la apliqu\u00e9 a dos proyectos completamente diferentes.',
    ),
  ),

  hr(),

  // Caso de Estudio 1: Portfolio
  h2(t('Caso de Estudio: Portfolio \u2014 Flutter Web \u2192 Stack Moderno')),
  p(
    t(
      'Mi portfolio anterior fue construido con Flutter Web hace tres a\u00f1os. Flutter Web renderiza en un canvas HTML \u2014 los motores de b\u00fasqueda no ven nada, los lectores de pantalla no pueden navegar el contenido, y la tecnolog\u00eda se hab\u00eda estancado. Para un portfolio de desarrollador, estos eran problemas descalificantes.',
    ),
  ),
  p(
    t(
      'Los agentes BMad produjeron una especificaci\u00f3n de ingenier\u00eda completa antes de escribir una sola l\u00ednea de c\u00f3digo: un ',
    ),
    b('Product Brief'),
    t(' definiendo visi\u00f3n y personas, un '),
    b('PRD'),
    t(' con 49 requerimientos funcionales y 29 no funcionales, un '),
    b('Documento de Arquitectura'),
    t(
      ' seleccionando Astro 6 SSG + Svelte 5 + Firebase + TypeScript strictest + Tailwind CSS 4, y una ',
    ),
    b('Especificaci\u00f3n UX'),
    t(' con 46 requerimientos de dise\u00f1o y criterios de compliance WCAG 2.1 AA.'),
  ),
  p(t('La implementaci\u00f3n se ejecut\u00f3 en 5 \u00e9picas a lo largo de 11 d\u00edas:')),
  ul(
    li(
      b('\u00c9pica 1 \u2014 Fundaci\u00f3n'),
      t(
        ' (10 historias): Infraestructura de testing, pipeline CI/CD, Zod schemas, design system, i18n, theming. ',
      ),
      i('146 tests, 54 patches de code review.'),
    ),
    li(
      b('\u00c9pica 2 \u2014 Sitio P\u00fablico'),
      t(
        ' (8 historias): Todas las p\u00e1ginas p\u00fablicas, migraci\u00f3n de datos del schema Flutter, View Transitions API, dise\u00f1o responsive. ',
      ),
      i('388 tests totales.'),
    ),
    li(
      b('\u00c9pica 3 \u2014 Panel Admin'),
      t(
        ' (8 historias): Firebase Auth, CRUD completo, ImageService con retry logic y orphan cleanup. ',
      ),
      i('879 tests.'),
    ),
    li(
      b('\u00c9pica 4 \u2014 Sistema Blog'),
      t(
        ' (5 historias): Editor rico TipTap, contenido biling\u00fce, OpenGraph cards, drag-drop ordering. ',
      ),
      i('~1,279 tests. Primera historia en pasar code review con cero patches.'),
    ),
    li(
      b('\u00c9pica 5 \u2014 SEO y Accesibilidad'),
      t(
        ' (6 historias): Datos estructurados, sitemap, auditor\u00eda WCAG 2.1 AA con axe-core, optimizaci\u00f3n de performance. ',
      ),
      i('1,406 tests totales, cero incidentes en producci\u00f3n.'),
    ),
  ),
  p(
    t(
      'La arquitectura entreg\u00f3 resultados medibles: las p\u00e1ginas p\u00fablicas no env\u00edan JavaScript por defecto, con la p\u00e1gina de inicio en solo ',
    ),
    b('25.8 KB de JS total'),
    t(' \u2014 la mitad del presupuesto de 50 KB. TypeScript en modo '),
    c('strictest'),
    t(
      ' atrapa errores de tipo antes del runtime. Los schemas Zod validan cada documento de Firestore en los boundaries. Lighthouse CI exige scores de 95+ en cada despliegue.',
    ),
  ),

  hr(),

  // Caso de Estudio 2: TimeMoney
  h2(t('Caso de Estudio: TimeMoney \u2014 Legacy Dart \u2192 Flutter Moderno')),
  p(
    a('TimeMoney', 'https://github.com/ChrisBP-Dev/TimeMoney'),
    t(
      ' es una app Flutter multiplataforma para que trabajadores por hora registren sus horas y calculen pagos, corriendo en iOS, Android, Web y Windows. Fue construida hace tres a\u00f1os con Dart 2.x, usando patrones obsoletos y sin arquitectura formal.',
    ),
  ),
  p(
    t(
      'El mismo workflow del BMad Method produjo: un PRD con 24 requerimientos funcionales y 11 no funcionales, un documento de arquitectura especificando ',
    ),
    b('Clean Architecture feature-first'),
    t(' con una '),
    b('estrategia de dual datasource'),
    t(
      ' (ObjectBox para plataformas nativas, Drift con WASM + OPFS para web), y una descomposici\u00f3n completa mapeando los 53 requerimientos detallados a 25 historias en 6 \u00e9picas.',
    ),
  ),
  p(t('La implementaci\u00f3n se ejecut\u00f3 en 6 \u00e9picas:')),
  ul(
    li(
      b('\u00c9pica 1 \u2014 SDK Foundation'),
      t(' (4 historias): Dart 2.19 \u2192 3.11+, Flutter 3.7.5 \u2192 3.41+, resoluci\u00f3n de dependencias.'),
    ),
    li(
      b('\u00c9pica 2 \u2014 Arquitectura'),
      t(
        ' (5 historias): Reestructuraci\u00f3n feature-first con capas domain/data/presentation, componentes compartidos.',
      ),
    ),
    li(
      b('\u00c9pica 3 \u2014 State Management'),
      t(
        ' (6 historias): Sealed classes de Dart 3 para estados BLoC, patr\u00f3n ActionState gen\u00e9rico, infraestructura de tests.',
      ),
    ),
    li(
      b('\u00c9pica 4 \u2014 Multi-Plataforma'),
      t(
        ' (5 historias): Base de datos Drift para web, inyecci\u00f3n de dependencias platform-aware via conditional imports, i18n biling\u00fce.',
      ),
    ),
    li(
      b('\u00c9pica 5 \u2014 Testing'),
      t(
        ' (3 historias): 200 nuevos tests (121% de crecimiento), widget tests, golden tests de regresi\u00f3n visual. ',
      ),
      i('92.3% de cobertura alcanzada.'),
    ),
    li(
      b('\u00c9pica 6 \u2014 Polish'),
      t(
        ' (2 historias): Pipeline CI/CD de 8 jobs, Maestro E2E con screenshots y video demo auto-generados.',
      ),
    ),
  ),
  p(
    t('El resultado: '),
    b('373 tests con 92.3% de cobertura'),
    t(
      ', cero deuda t\u00e9cnica diferida, 100% de use cases y BLoCs con cobertura completa, corriendo en cuatro plataformas desde un solo codebase. El monad Either (fpdart) asegura manejo de errores railway-oriented en todo el proyecto. Las sealed classes reemplazan patrones legacy con exhaustive matching en tiempo de compilaci\u00f3n.',
    ),
  ),

  hr(),

  // El Efecto de Calidad Acumulativa
  h2(t('El Efecto de Calidad Acumulativa')),
  p(
    t(
      'El patr\u00f3n m\u00e1s poderoso en ambos proyectos fue el efecto de calidad acumulativa \u2014 cada \u00e9pica mejor\u00f3 respecto a la anterior porque las retrospectivas cerraron el ciclo de aprendizaje.',
    ),
  ),
  p(
    t('En el portfolio, los patches de code review bajaron de '),
    b('54 (\u00c9pica 1) a 26 (\u00c9pica 5)'),
    t(' \u2014 una reducci\u00f3n del 52%. Los items diferidos cayeron de 12 a 1. En TimeMoney, los patches dentro de la \u00c9pica 5 sola bajaron de '),
    b('14 a 2'),
    t(' en tres historias.'),
  ),
  p(
    t(
      'Esto no fue porque el modelo de IA mejor\u00f3. Fue porque el proceso mejor\u00f3. Cada retrospectiva captur\u00f3 qu\u00e9 fall\u00f3 y qu\u00e9 cambiar:',
    ),
  ),
  ul(
    li(
      t(
        'Specs basadas en versiones obsoletas del framework \u2192 la validaci\u00f3n de investigaci\u00f3n se volvi\u00f3 obligatoria antes de crear historias',
      ),
    ),
    li(
      t(
        'Cero tests E2E admin a pesar de tener dise\u00f1os de tests \u2192 el Scrum Master ahora verifica que existan tareas de tests en cada historia',
      ),
    ),
    li(
      t(
        'Tests tautol\u00f3gicos (verificando mocks en vez de comportamiento) detectados en review \u2192 el testing substantivo se volvi\u00f3 un criterio expl\u00edcito de revisi\u00f3n',
      ),
    ),
  ),
  p(
    t('La lecci\u00f3n: '),
    b(
      'la IA no se auto-mejora dentro de un proyecto. El proceso s\u00ed.',
    ),
    t(
      ' La metodolog\u00eda crea un ciclo de retroalimentaci\u00f3n que hace cada \u00e9pica subsecuente m\u00e1s eficiente y m\u00e1s correcta que la anterior.',
    ),
  ),
  p(
    t('Combinado entre ambos proyectos: '),
    b('62 historias'),
    t(' completadas, '),
    b('1,779 tests'),
    t(' escritos, '),
    b('cero incidentes en producci\u00f3n'),
    t(', '),
    b('10 retrospectivas de \u00e9pica'),
    t(
      ', y una tendencia de mejora medible en m\u00e9tricas de calidad desde la primera \u00e9pica hasta la \u00faltima.',
    ),
  ),

  hr(),

  // Por Qu\u00e9 Esto No Es Vibe Coding
  h2(t('Por Qu\u00e9 Esto No Es Vibe Coding')),
  p(t('Seamos directos con el contraste:')),
  p(
    t('El '),
    b('vibe coding'),
    t(
      ' genera c\u00f3digo desde prompts y despliega lo que compile. No hay PRD, ni documento de arquitectura, ni estrategia de testing. Cuando aparecen bugs, la respuesta es "pedirle a la IA que lo arregle" \u2014 creando un ciclo de parches sobre parches sin trazabilidad ni aprendizaje.',
    ),
  ),
  p(
    t('El '),
    b('desarrollo aumentado con ingenier\u00eda'),
    t(
      ' usa IA dentro de una metodolog\u00eda. Cada l\u00ednea de c\u00f3digo se traza a un requerimiento. Cada requerimiento se traza a una necesidad de negocio. Los tests se escriben junto con la implementaci\u00f3n, no despu\u00e9s. El code review atrapa lo que los tests no detectan. Las retrospectivas previenen que los mismos errores se repitan.',
    ),
  ),
  p(
    t('La diferencia no es el modelo de IA. '),
    b('Es el proceso alrededor de ella.'),
  ),
  p(
    t('Este portfolio tiene 1,406 tests no porque la IA los gener\u00f3 autom\u00e1ticamente, sino porque la '),
    b('metodolog\u00eda los requiri\u00f3 en cada paso'),
    t('. Cumple WCAG 2.1 AA no porque la IA sepa de accesibilidad, sino porque la especificaci\u00f3n UX lo defini\u00f3 como requerimiento no negociable, la arquitectura lo planific\u00f3, y el code review lo valid\u00f3.'),
  ),

  hr(),

  // La Direcci\u00f3n para Developers
  h2(t('La Direcci\u00f3n en la Que Se Mueve la Industria')),
  p(
    t(
      'Las empresas no necesitan desarrolladores que escriban mejores prompts. Necesitan desarrolladores que puedan dirigir a la IA para producir software de calidad profesional \u2014 con arquitectura, tests, accesibilidad y mantenibilidad. La demanda no es por m\u00e1s c\u00f3digo; es por c\u00f3digo m\u00e1s confiable.',
    ),
  ),
  p(
    t(
      'Los desarrolladores que prosperar\u00e1n en esta era son los que traigan disciplina de ingenier\u00eda a la IA. Los que entiendan que un PRD previene scope creep, que el code review atrapa lo que los tests no detectan, que las retrospectivas previenen errores repetidos, y que los quality gates no son overhead \u2014 son lo que hace que el c\u00f3digo generado por IA sea digno de producci\u00f3n.',
    ),
  ),
  p(
    t(
      'Estos son proyectos peque\u00f1os \u2014 un portfolio personal y una app de utilidad. Pero la metodolog\u00eda escala. El mismo workflow del BMad Method que produjo 62 historias y 1,779 tests en estos proyectos puede producir cientos de historias para aplicaciones enterprise. Los quality gates, las retrospectivas, las revisiones adversariales \u2014 son fundamentos de ingenier\u00eda que se vuelven ',
    ),
    i('m\u00e1s'),
    t(' valiosos, no menos, cuando la IA acelera el ritmo.'),
  ),

  hr(),

  // CTA
  h2(t('Expl\u00f3ralo T\u00fa Mismo')),
  p(
    t(
      'Ambos proyectos son completamente open source. Cada artefacto de planificaci\u00f3n, archivo de historia y retrospectiva est\u00e1 disponible en los repositorios:',
    ),
  ),
  ul(
    li(
      b('Portfolio (Web): '),
      a('github.com/ChrisBP-Dev/portfolio', 'https://github.com/ChrisBP-Dev/portfolio'),
    ),
    li(
      b('TimeMoney (Flutter): '),
      a(
        'github.com/ChrisBP-Dev/TimeMoney',
        'https://github.com/ChrisBP-Dev/TimeMoney',
      ),
    ),
    li(
      b('Metodolog\u00eda: '),
      a('BMad Method', 'https://github.com/bmadcode/BMAD-METHOD'),
    ),
    li(
      b('Herramienta IA: '),
      a('Claude Code CLI', 'https://docs.anthropic.com/en/docs/claude-code'),
      t(' de Anthropic (Claude Opus)'),
    ),
  ),
  p(
    t(
      'Los historiales de commits cuentan las historias completas \u2014 desde los product briefs hasta los deployments a producci\u00f3n. Estudi\u00e1los, haz fork, y aplica la metodolog\u00eda a tus propios proyectos brownfield.',
    ),
  ),
  p(
    b(
      'El futuro del desarrollo de software no es la IA reemplazando ingenieros. Son ingenieros usando IA con la disciplina que el oficio demanda.',
    ),
  ),
);

// ─── Blog Post Data ───

const slug = 'beyond-vibe-coding';

const blogPost = {
  title: {
    en: 'Beyond Vibe Coding: Building Production Software with AI and Engineering Methodology',
    es: 'M\u00e1s All\u00e1 del Vibe Coding: Construyendo Software Profesional con IA y Metodolog\u00eda de Ingenier\u00eda',
  },
  content: {
    en: JSON.stringify(enContent),
    es: JSON.stringify(esContent),
  },
  slug,
  status: 'published',
  // coverImage omitted — Zod schema expects absent (not null) for optional fields
  images: [],
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};

// ─── Write to Firestore ───

const isDryRun = process.argv.includes('--dry-run');

async function main() {
  console.log(`\n📝 Blog Post: "${blogPost.title.en}"`);
  console.log(`   Slug: ${blogPost.slug}`);
  console.log(`   Status: ${blogPost.status}`);
  console.log(`   EN content: ${blogPost.content.en.length} chars`);
  console.log(`   ES content: ${blogPost.content.es.length} chars`);

  // Check for duplicate slug
  const existing = await db
    .collection('BlogPosts')
    .where('slug', '==', slug)
    .limit(2)
    .get();

  if (!existing.empty) {
    console.error(`\n❌ A blog post with slug "${slug}" already exists (${existing.size} doc(s)). Aborting.`);
    process.exit(1);
  }

  if (isDryRun) {
    console.log('\n🔍 Dry run — no data written.');
    console.log('\n   EN title:', blogPost.title.en);
    console.log('   ES title:', blogPost.title.es);
    console.log('\n   Preview EN (first 300 chars of JSON):');
    console.log('  ', blogPost.content.en.slice(0, 300), '...');
    process.exit(0);
  }

  const docRef = await db.collection('BlogPosts').add(blogPost);
  console.log(`\n✅ Blog post created: ${docRef.id}`);
  console.log(`   View at: /blog/${slug}`);
  console.log(`   Edit at: /admin/blog (find in list)`);
  console.log('\n⚠️  Remember to:');
  console.log('   1. Add a cover image via the admin panel');
  console.log('   2. Run `pnpm build` to regenerate static pages');
}

main().catch((err) => {
  console.error('Failed to seed blog post:', err);
  process.exit(1);
});
