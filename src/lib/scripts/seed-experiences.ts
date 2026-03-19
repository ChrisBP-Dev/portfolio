/**
 * Seed Experiences Collection
 *
 * Populates the Firestore Experiences collection with data from the
 * original Flutter app (hardcoded in experiences.dart, never stored in Firestore).
 *
 * Usage:
 *   pnpm seed:experiences              # write to Firestore
 *   pnpm seed:experiences -- --dry-run # preview without writing
 *
 * Requires Node 22+ for --env-file=.env support.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// ─── Firebase Admin init (same pattern as admin.ts) ───

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
const dryRun = process.argv.includes('--dry-run');

// ─── Experience data from Flutter archive (experiences.dart) ───

const experiences = [
  {
    companyName: 'GuardOwl',
    jobName: { es: 'Desarrollador Flutter', en: 'Flutter Developer' },
    responsibilities: {
      es: [
        'Desarrollé GuardOwl, una aplicación que ayuda a los viajeros a mantenerse informados y seguros a través de alertas de seguridad en tiempo real, acceso a contactos importantes e informes de incidentes.',
        'Completé un MVP en poco más de un mes, demostrando adaptabilidad a cambios rápidos y un fuerte trabajo en equipo.',
        'Integré la API de Gemini AI para mejorar la interfaz de usuario con inteligencia artificial.',
      ],
      en: [
        'Developed GuardOwl, an app that helps travelers stay informed and safe through real-time security alerts, access to important contacts, and incident reporting.',
        'Completed an MVP in just over a month, demonstrating adaptability to rapid changes and strong teamwork.',
        'Integrated Gemini AI API to enhance the user interface with artificial intelligence.',
      ],
    },
    startDate: Timestamp.fromDate(new Date(2024, 0, 1)),
    endDate: Timestamp.fromDate(new Date(2024, 11, 31)),
  },
  {
    companyName: 'QETO, START UP',
    jobName: { es: 'Desarrollador Flutter', en: 'Flutter Developer' },
    responsibilities: {
      es: [
        'Desarrollé una aplicación móvil que permite a los consumidores comparar precios y reseñas en mercados locales, promoviendo la transparencia y reduciendo la inflación de precios.',
        'Implementé Flutter_Bloc para mejorar la escalabilidad y el rendimiento de la aplicación.',
        'Traduje los diseños de Figma en código eficiente, adhiriéndome a las reglas del negocio y mejorando la experiencia del usuario.',
      ],
      en: [
        'Developed a mobile application that allows consumers to compare prices and reviews in local markets, promoting transparency and reducing price inflation.',
        'Implemented Flutter_Bloc to improve scalability and performance of the application.',
        'Translated Figma designs into efficient code, adhering to business rules and enhancing user experience.',
      ],
    },
    startDate: Timestamp.fromDate(new Date(2022, 6, 1)),
    endDate: Timestamp.fromDate(new Date(2022, 11, 31)),
  },
  {
    companyName: 'LA CABANITA - STORE',
    jobName: { es: 'Desarrollador Flutter', en: 'Flutter Developer' },
    responsibilities: {
      es: [
        'Desarrollé tres aplicaciones: Local (Android), Manager (Android) y Cliente (aplicación web - PWA), mejorando la gestión de pedidos en un 30%.',
        'Implementé un sistema de recompensas que aumentó la fidelidad de los clientes.',
        'Usé Firebase Firestore, Storage y una arquitectura orientada a funciones para garantizar la escalabilidad y el mantenimiento.',
      ],
      en: [
        'Developed three applications: Local (Android), Manager (Android), and Client (web app - PWA), improving order management by 30%.',
        'Implemented a rewards system that increased customer loyalty.',
        'Used Firebase Firestore, Storage, and a feature-first architecture to ensure scalability and maintenance.',
      ],
    },
    startDate: Timestamp.fromDate(new Date(2022, 0, 1)),
    endDate: Timestamp.fromDate(new Date(2022, 5, 30)),
  },
];

// ─── Seed runner ───

async function seed() {
  console.log(dryRun ? '🔍 DRY RUN — no writes\n' : '🚀 Seeding Experiences...\n');

  const collection = db.collection('Experiences');

  // Check if collection already has data
  const existing = await collection.get();
  if (existing.size > 0) {
    console.log(`⚠️  Experiences collection already has ${existing.size} document(s).`);
    console.log('   To re-seed, delete existing documents first.');
    process.exit(0);
  }

  for (const exp of experiences) {
    console.log(`  → ${exp.companyName} (${exp.jobName.en})`);
    console.log(`    ${exp.startDate.toDate().getFullYear()} — ${exp.endDate ? exp.endDate.toDate().getFullYear() : 'Present'}`);

    if (!dryRun) {
      await collection.add(exp);
    }
  }

  console.log(`\n✅ ${dryRun ? 'Would seed' : 'Seeded'} ${experiences.length} experience(s).`);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
