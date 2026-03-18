/**
 * Firestore Data Migration Script: Flutter Schema → Professional Nested Schema
 *
 * Reads from Flutter-era lowercase collections (projects, technologies) and writes
 * transformed documents to PascalCase target collections (Projects, Technologies).
 * Then cleans up obsolete collections and old-format documents.
 *
 * PRE-MIGRATION BACKUP (required):
 *   firebase firestore:export gs://<your-bucket>/backups/pre-migration-$(date +%Y%m%d)
 *
 * Usage:
 *   pnpm migrate              # execute migration (writes to Firestore)
 *   pnpm migrate -- --dry-run # preview changes without writing
 *
 * Requires Node 22+ for --env-file=.env support.
 */

// ─── Pure transform helpers (exported for testing — no side effects) ───

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseToDate(str: string): Date {
  const trimmed = str.trim();
  if (/^\d{4}$/.test(trimmed)) {
    return new Date(parseInt(trimmed, 10), 0, 1);
  }
  const monthYear = trimmed.match(/^(\w+)\s+(\d{4})$/);
  if (monthYear) {
    const d = new Date(`${monthYear[1]} 1, ${monthYear[2]}`);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date(trimmed);
}

export function parseDateRange(dateStr: string): { startDate: Date; endDate: Date | null } {
  const normalized = dateStr.replace(/[\u2013\u2014]/g, '-');
  const parts = normalized.split(/\s*-\s*/);

  const startDate = parseToDate(parts[0] ?? '');
  if (isNaN(startDate.getTime())) {
    console.warn(`  Warning: Cannot parse start date from "${dateStr}" — using epoch as fallback`);
    return { startDate: new Date(0), endDate: null };
  }

  const endPart = parts.slice(1).join('-').trim();
  if (!endPart || endPart.toLowerCase() === 'present') {
    return { startDate, endDate: null };
  }

  const endDate = parseToDate(endPart);
  if (isNaN(endDate.getTime())) {
    console.warn(`  Warning: Cannot parse end date from "${dateStr}" — setting endDate to null`);
    return { startDate, endDate: null };
  }

  return { startDate, endDate };
}

export function parseExperienceYears(timeStr: string): number {
  const match = timeStr.match(/(\d+)/);
  return match ? parseInt(match[1]!, 10) : 0;
}

export function transformImageAndPath(
  image: Record<string, unknown>,
): { url: string; storagePath: string } {
  return {
    url: image.url as string,
    storagePath: image.refPath as string,
  };
}

function isValidUrl(value: unknown): boolean {
  if (typeof value !== 'string' || !value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/** Strip undefined values — Firestore rejects undefined */
export function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

// ─── Collection-specific migration functions ───

export function migrateProject(data: Record<string, unknown>) {
  const companyNameEn = data.companyNameEn as string;

  return {
    companyName: { es: data.companyNameEs as string, en: companyNameEn },
    shortDescription: { es: data.shortDescriptionEs as string, en: data.shortDescriptionEn as string },
    features: {
      es: data.featuresES as string[],
      en: data.featuresEN as string[],
    },
    mainImage: transformImageAndPath(data.mainImage as Record<string, unknown>),
    screenshots: ((data.screenshots as Record<string, unknown>[]) || []).map(transformImageAndPath),
    slug: slugify(companyNameEn),
    technologies: data.technologies as string[],
    websiteUrl: isValidUrl(data.websiteUrl) ? (data.websiteUrl as string) : undefined,
    sourceCodeUrl: isValidUrl(data.sourceCodeUrl) ? (data.sourceCodeUrl as string) : undefined,
  };
}

export function migrateTechnology(data: Record<string, unknown>) {
  return {
    name: data.name as string,
    image: transformImageAndPath(data.image as Record<string, unknown>),
    experienceYears: parseExperienceYears(data.experienceTime as string),
  };
}

export function migrateExperience(data: Record<string, unknown>) {
  const { startDate, endDate } = parseDateRange(data.date as string);

  return {
    companyName: data.companyName as string,
    jobName: { es: data.jobNameEs as string, en: data.jobNameEn as string },
    responsibilities: {
      es: (data.responsabilitiesEs as string[]).filter((s) => s.length > 0),
      en: (data.responsabilitiesEn as string[]).filter((s) => s.length > 0),
    },
    startDate,
    endDate,
  };
}

// ─── Idempotency detection ───

export function isAlreadyMigrated(data: Record<string, unknown>, collection: string): boolean {
  switch (collection) {
    case 'Projects':
      return typeof data.companyName === 'object' && data.companyName !== null;
    case 'Technologies':
      return typeof data.experienceYears === 'number';
    case 'Experiences':
      return typeof data.jobName === 'object' && data.jobName !== null;
    default:
      return false;
  }
}

// ─── Main migration logic (only runs when script is executed directly) ───

const isDirectExecution = process.argv[1]?.includes('migrate-firestore-data');

if (isDirectExecution) {
  runMigration();
}

async function runMigration() {
  const { initializeApp, cert, getApps } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  const { parseProject, parseTechnology } = await import('../firebase/collections.js');

  // ─── Firebase Admin SDK init ───

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim().replace(/\\n/g, '\n');

  const missingVars = [
    !projectId && 'FIREBASE_ADMIN_PROJECT_ID',
    !clientEmail && 'FIREBASE_ADMIN_CLIENT_EMAIL',
    !privateKey && 'FIREBASE_ADMIN_PRIVATE_KEY',
  ].filter(Boolean);

  if (missingVars.length > 0) {
    throw new Error(
      `Firebase Admin SDK config incomplete. Missing env vars: ${missingVars.join(', ')}. ` +
      `Ensure .env file exists and script is run with: node --env-file=.env`,
    );
  }

  if (getApps().length === 0) {
    initializeApp({ credential: cert({ projectId: projectId!, clientEmail: clientEmail!, privateKey: privateKey! }) });
  }

  const db = getFirestore();
  const dryRun = process.argv.includes('--dry-run');

  // ─── Source (Flutter lowercase) → Target (PascalCase for Astro) ───

  const MIGRATIONS = [
    { source: 'projects', target: 'Projects', migrate: migrateProject, validate: parseProject },
    { source: 'technologies', target: 'Technologies', migrate: migrateTechnology, validate: parseTechnology },
  ] as const;

  const OBSOLETE_COLLECTIONS = ['Projects', 'projectss'];

  console.log('===================================================');
  console.log('  Firestore Migration: Flutter -> Professional Schema');
  console.log(`  Mode: ${dryRun ? 'DRY RUN (no writes)' : 'LIVE MIGRATION'}`);
  console.log('===================================================');

  // ─── Phase 1: Migrate source → target ───

  console.log('\n--- Phase 1: Migrate data ---');

  const results: Record<string, { migrated: number; skipped: number; failed: number }> = {};

  for (const { source, target, migrate, validate } of MIGRATIONS) {
    const stats = { migrated: 0, skipped: 0, failed: 0 };
    const snapshot = await db.collection(source).get();

    console.log(`\n  ${source} (${snapshot.size} docs) -> ${target}`);

    let batch = db.batch();
    let opCount = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Check if target doc already exists (idempotency for re-runs)
      const targetDoc = await db.collection(target).doc(doc.id).get();
      if (targetDoc.exists && isAlreadyMigrated(targetDoc.data()!, target)) {
        console.log(`    SKIP ${doc.id} — already in ${target}`);
        stats.skipped++;
        continue;
      }

      try {
        const transformed = migrate(data);
        const clean = stripUndefined(transformed as Record<string, unknown>);

        // Validate against Zod schema
        validate(clean as Record<string, unknown>, doc.id);

        if (dryRun) {
          console.log(`    DRY-RUN ${doc.id} — would write to ${target}`);
          stats.migrated++;
          continue;
        }

        batch.set(db.collection(target).doc(doc.id), clean);
        opCount++;

        if (opCount >= 499) {
          await batch.commit();
          batch = db.batch();
          opCount = 0;
        }

        console.log(`    OK ${doc.id} -> ${target}`);
        stats.migrated++;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(`    FAIL ${doc.id} — ${msg}`);
        stats.failed++;
      }
    }

    if (!dryRun && opCount > 0) {
      await batch.commit();
    }

    results[`${source} -> ${target}`] = stats;
  }

  // ─── Compute Phase 1 totals before cleanup ───

  let totalMigrated = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const stats of Object.values(results)) {
    totalMigrated += stats.migrated;
    totalSkipped += stats.skipped;
    totalFailed += stats.failed;
  }

  // ─── Phase 2: Clean up obsolete collections ───

  console.log('\n--- Phase 2: Cleanup obsolete data ---');

  let totalDeleted = 0;

  if (totalFailed > 0) {
    console.warn('  SKIPPED — some documents failed in Phase 1. Source data preserved for re-run.');
  } else {

  // Delete old-format docs in PascalCase target collections (pre-existing obsolete data)
  // and obsolete collections entirely
  const collectionsToClean = [
    ...OBSOLETE_COLLECTIONS,
    ...MIGRATIONS.map((m) => m.source), // delete source collections after migration
  ];

  for (const colName of collectionsToClean) {
    const snap = await db.collection(colName).get();
    if (snap.empty) continue;

    // For target collections that also received migrated data, only delete non-migrated docs
    const isTargetCollection = MIGRATIONS.some((m) => m.target === colName);

    let batch = db.batch();
    let opCount = 0;
    let deleteCount = 0;

    for (const doc of snap.docs) {
      if (isTargetCollection) {
        // Only delete docs that are NOT in the new migrated format
        const data = doc.data();
        if (isAlreadyMigrated(data, colName)) continue;
      }

      if (dryRun) {
        console.log(`    DRY-RUN delete ${colName}/${doc.id}`);
        deleteCount++;
        continue;
      }

      batch.delete(doc.ref);
      opCount++;
      deleteCount++;

      if (opCount >= 499) {
        await batch.commit();
        batch = db.batch();
        opCount = 0;
      }
    }

    if (!dryRun && opCount > 0) {
      await batch.commit();
    }

    if (deleteCount > 0) {
      console.log(`    ${colName}: ${deleteCount} docs ${dryRun ? 'would be deleted' : 'deleted'}`);
      totalDeleted += deleteCount;
    }
  }

  } // end Phase 2 else block

  // ─── Summary ───

  console.log('\n===================================================');
  console.log('  Migration Summary');
  console.log('===================================================');

  for (const [name, stats] of Object.entries(results)) {
    console.log(`  ${name}: ${stats.migrated} migrated | ${stats.skipped} skipped | ${stats.failed} failed`);
  }

  console.log(`  Cleanup: ${totalDeleted} obsolete docs ${dryRun ? 'would be' : ''} deleted`);
  console.log('---------------------------------------------------');
  console.log(`  TOTAL: ${totalMigrated} migrated | ${totalSkipped} skipped | ${totalFailed} failed`);
  console.log('===================================================');

  if (totalFailed > 0) {
    console.error('\nSome documents failed migration. Review errors above.');
    process.exit(1);
  }
}
