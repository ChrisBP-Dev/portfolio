/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  resolve: {
    // Required for @testing-library/svelte — ensures Svelte 5 uses
    // client-side bundle (mount) instead of server-side (SSR)
    conditions: ['browser'],
  },
  test: {
    passWithNoTests: true,
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: [
      'node_modules',
      'dist',
      '_flutter-archive',
      '_bmad',
      '_bmad-output',
      '.claude',
      'tests/e2e',
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,svelte}'],
      exclude: ['src/test/**', 'src/**/*.d.ts'],
    },
  },
});
