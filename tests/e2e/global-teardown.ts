import { execSync } from 'node:child_process';

export default function globalTeardown() {
  try {
    execSync('pnpm cleanup:e2e', { stdio: 'inherit', cwd: process.cwd() });
  } catch {
    console.warn('[global-teardown] cleanup:e2e failed — orphan data may remain');
  }

  try {
    execSync('pnpm cleanup:images -- --execute', { stdio: 'inherit', cwd: process.cwd() });
  } catch {
    console.warn('[global-teardown] cleanup:images failed — orphan images may remain');
  }
}
