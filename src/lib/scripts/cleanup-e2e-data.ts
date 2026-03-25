/**
 * Cleanup E2E Test Orphan Data from Firestore
 *
 * Deletes documents with slug matching e2e-* patterns left behind by failed E2E tests.
 * Also cleans associated Storage images.
 *
 * Usage:
 *   pnpm cleanup:e2e              # execute cleanup
 *   pnpm cleanup:e2e -- --dry-run # preview without deleting
 *
 * Requires Node 22+ for --env-file=.env support.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

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
const storage = getStorage();
const dryRun = process.argv.includes('--dry-run');
const E2E_SLUG_PATTERN = /^e2e-/;

const COLLECTIONS = ['Projects', 'Technologies', 'Experiences', 'BlogPosts'] as const;

interface CleanupResult {
  collection: string;
  docId: string;
  slug: string;
  imagesDeleted: number;
}

async function deleteStorageFile(storagePath: string): Promise<boolean> {
  try {
    await storage.bucket().file(storagePath).delete();
    return true;
  } catch {
    return false;
  }
}

async function extractImagePaths(doc: FirebaseFirestore.DocumentData): Promise<string[]> {
  const paths: string[] = [];

  // mainImage
  if (doc.mainImage?.storagePath) paths.push(doc.mainImage.storagePath);
  // coverImage
  if (doc.coverImage?.storagePath) paths.push(doc.coverImage.storagePath);
  // image (technologies)
  if (doc.image?.storagePath) paths.push(doc.image.storagePath);
  // screenshots array
  if (Array.isArray(doc.screenshots)) {
    for (const ss of doc.screenshots) {
      if (ss?.storagePath) paths.push(ss.storagePath);
    }
  }

  return paths;
}

async function cleanupCollection(collectionName: string): Promise<CleanupResult[]> {
  const results: CleanupResult[] = [];
  const snapshot = await db.collection(collectionName).get();

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    // Technologies use `name` instead of `slug`; check both fields
    const identifier = (data.slug ?? data.name) as string | undefined;

    if (!identifier || !E2E_SLUG_PATTERN.test(identifier)) continue;

    const imagePaths = await extractImagePaths(data);

    if (dryRun) {
      console.log(`  [DRY RUN] Would delete ${collectionName}/${docSnap.id} (${identifier}, images: ${imagePaths.length})`);
    } else {
      // Delete images first
      let imagesDeleted = 0;
      for (const path of imagePaths) {
        if (await deleteStorageFile(path)) imagesDeleted++;
      }

      // Delete document
      await db.collection(collectionName).doc(docSnap.id).delete();
      console.log(`  Deleted ${collectionName}/${docSnap.id} (${identifier}, images: ${imagesDeleted}/${imagePaths.length})`);
    }

    results.push({
      collection: collectionName,
      docId: docSnap.id,
      slug: identifier,
      imagesDeleted: dryRun ? 0 : imagePaths.length,
    });
  }

  return results;
}

async function main() {
  console.log(`\n🧹 E2E Test Data Cleanup ${dryRun ? '(DRY RUN)' : ''}\n`);

  let totalDeleted = 0;

  for (const collection of COLLECTIONS) {
    console.log(`Scanning ${collection}...`);
    const results = await cleanupCollection(collection);
    totalDeleted += results.length;

    if (results.length === 0) {
      console.log('  No orphan E2E data found.\n');
    } else {
      console.log(`  ${results.length} orphan(s) ${dryRun ? 'found' : 'deleted'}.\n`);
    }
  }

  console.log(`\nTotal: ${totalDeleted} orphan document(s) ${dryRun ? 'would be deleted' : 'deleted'}.`);

  if (dryRun) {
    console.log('\nRun without --dry-run to execute the cleanup.\n');
  }
}

main().catch((err) => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
