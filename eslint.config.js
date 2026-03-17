import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import svelte from 'eslint-plugin-svelte';

/** @type {import('typescript-eslint').ConfigArray} */
export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...svelte.configs['flat/recommended'],
  {
    ignores: ['dist/', 'node_modules/', '_flutter-archive/', '_bmad/', '_bmad-output/', '.astro/', '*.cjs'],
  },
];
