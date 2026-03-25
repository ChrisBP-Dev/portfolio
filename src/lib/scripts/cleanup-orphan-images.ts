/**
 * Cleanup Orphan Images from Firebase Storage
 *
 * Compares ALL files in Storage against ALL image references in Firestore.
 * Files that exist in Storage but are not referenced by any Firestore document
 * are considered orphans and can be deleted.
 *
 * SAFETY:
 *   - DRY RUN by default — only shows what would be deleted
 *   - Requires explicit --execute flag to actually delete
 *   - Logs every action for auditability
 *
 * Usage:
 *   pnpm cleanup:images              # dry-run (safe preview)
 *   pnpm cleanup:images -- --execute # actually delete orphans
 *
 * Requires Node 22+ for --env-file=.env support.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// --- Firebase init ---

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim().replace(/\\n/g, '\n');
const storageBucket = process.env.PUBLIC_FIREBASE_STORAGE_BUCKET;

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing Firebase Admin env vars. Check .env file.');
  process.exit(1);
}

if (!storageBucket) {
  console.error('Missing PUBLIC_FIREBASE_STORAGE_BUCKET env var. Check .env file.');
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket,
  });
}

const db = getFirestore();
const bucket = getStorage().bucket();
const execute = process.argv.includes('--execute');

// --- Collect all referenced storagePaths from Firestore ---

async function collectReferencedPaths(): Promise<Set<string>> {
  const paths = new Set<string>();

  // Projects: mainImage + screenshots[]
  console.log('  Reading Projects...');
  const projectsSnap = await db.collection('Projects').get();
  for (const doc of projectsSnap.docs) {
    const data = doc.data();
    if (data.mainImage?.storagePath) paths.add(data.mainImage.storagePath);
    if (Array.isArray(data.screenshots)) {
      for (const ss of data.screenshots) {
        if (ss?.storagePath) paths.add(ss.storagePath);
      }
    }
  }

  // Technologies: image
  console.log('  Reading Technologies...');
  const techSnap = await db.collection('Technologies').get();
  for (const doc of techSnap.docs) {
    const data = doc.data();
    if (data.image?.storagePath) paths.add(data.image.storagePath);
  }

  // BlogPosts: coverImage + images[]
  console.log('  Reading BlogPosts...');
  const blogSnap = await db.collection('BlogPosts').get();
  for (const doc of blogSnap.docs) {
    const data = doc.data();
    if (data.coverImage?.storagePath) paths.add(data.coverImage.storagePath);
    if (Array.isArray(data.images)) {
      for (const img of data.images) {
        if (img?.storagePath) paths.add(img.storagePath);
      }
    }
  }

  return paths;
}

// --- List all files in Storage ---

async function listAllStorageFiles(): Promise<string[]> {
  const [files] = await bucket.getFiles();
  return files.map(f => f.name);
}

// --- Main ---

async function main() {
  console.log(`\n🖼️  Orphan Image Cleanup ${execute ? '(EXECUTE MODE)' : '(DRY RUN — pass --execute to delete)'}\n`);

  if (execute) {
    console.log('⚠️  EXECUTE MODE: Orphan files WILL be permanently deleted.\n');
  }

  // Step 1: Collect all image references from Firestore
  console.log('Step 1: Collecting image references from Firestore...');
  const referencedPaths = await collectReferencedPaths();
  console.log(`  Found ${referencedPaths.size} referenced image paths.\n`);

  // Step 2: List all files in Storage
  console.log('Step 2: Listing all files in Storage...');
  const storageFiles = await listAllStorageFiles();
  console.log(`  Found ${storageFiles.length} files in Storage.\n`);

  // Step 3: Find orphans (in Storage but not in Firestore)
  console.log('Step 3: Identifying orphan files...\n');
  const orphans = storageFiles.filter(f => !referencedPaths.has(f));

  if (orphans.length === 0) {
    console.log('✅ No orphan images found. Storage is clean.\n');
    return;
  }

  // Group orphans by prefix for readability
  const grouped: Record<string, string[]> = {};
  for (const orphan of orphans) {
    const prefix = orphan.split('/').slice(0, -1).join('/') || '(root)';
    if (!grouped[prefix]) grouped[prefix] = [];
    grouped[prefix].push(orphan);
  }

  console.log(`Found ${orphans.length} orphan file(s):\n`);
  for (const [prefix, files] of Object.entries(grouped)) {
    console.log(`  📁 ${prefix}/`);
    for (const file of files) {
      const fileName = file.split('/').pop();
      console.log(`     ${execute ? '🗑️ ' : '  '} ${fileName}`);
    }
  }

  // Step 4: Delete orphans (only in execute mode)
  if (!execute) {
    console.log(`\n📋 Summary: ${orphans.length} orphan file(s) would be deleted.`);
    console.log('   Run with --execute to permanently delete these files.\n');
    return;
  }

  console.log(`\nDeleting ${orphans.length} orphan file(s)...`);
  let deleted = 0;
  let failed = 0;

  for (const orphan of orphans) {
    try {
      await bucket.file(orphan).delete();
      deleted++;
    } catch (err) {
      console.error(`  ❌ Failed to delete: ${orphan}`, err instanceof Error ? err.message : err);
      failed++;
    }
  }

  console.log(`\n✅ Cleanup complete: ${deleted} deleted, ${failed} failed.\n`);
}

main().catch((err) => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
