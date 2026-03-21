import { describe, it, expect, vi, beforeEach } from 'vitest';

// The toast-store uses Svelte 5 $state rune which requires Svelte compilation.
// We test the core logic by importing the module in a Svelte-compatible vitest setup.

let toastStore: typeof import('../toast-store.svelte').toastStore;

beforeEach(async () => {
  vi.useFakeTimers();
  // Re-import to reset module state
  vi.resetModules();
  const mod = await import('../toast-store.svelte');
  toastStore = mod.toastStore;
  toastStore.clear();
});

describe('toast-store', () => {
  it('[P0] 3.4-TEST-011: adds a success toast', () => {
    const id = toastStore.success('Guardado');
    expect(id).toBeTruthy();
    expect(toastStore.toasts).toHaveLength(1);
    expect(toastStore.toasts[0]?.type).toBe('success');
    expect(toastStore.toasts[0]?.message).toBe('Guardado');
  });

  it('[P0] 3.4-TEST-012: adds an error toast', () => {
    toastStore.error('Error al guardar');
    expect(toastStore.toasts).toHaveLength(1);
    expect(toastStore.toasts[0]?.type).toBe('error');
    expect(toastStore.toasts[0]?.dismissible).toBe(true);
  });

  it('[P0] 3.4-TEST-013: removes a toast by id', () => {
    const id = toastStore.success('Test');
    toastStore.remove(id);
    expect(toastStore.toasts).toHaveLength(0);
  });

  it('[P0] 3.4-TEST-014: auto-dismisses success toast after 4s', () => {
    toastStore.success('Auto dismiss');
    expect(toastStore.toasts).toHaveLength(1);
    vi.advanceTimersByTime(4000);
    expect(toastStore.toasts).toHaveLength(0);
  });

  it('[P0] 3.4-TEST-015: error toast does NOT auto-dismiss', () => {
    toastStore.error('Persistent');
    vi.advanceTimersByTime(10000);
    expect(toastStore.toasts).toHaveLength(1);
  });

  it('[P0] 3.4-TEST-016: limits to max 3 visible toasts', () => {
    toastStore.error('A');
    toastStore.error('B');
    toastStore.error('C');
    toastStore.error('D');
    expect(toastStore.toasts).toHaveLength(3);
    // Newest on top
    expect(toastStore.toasts[0]?.message).toBe('D');
  });

  it('[P0] 3.4-TEST-017: newest toast appears first (on top)', () => {
    toastStore.error('First');
    toastStore.error('Second');
    expect(toastStore.toasts[0]?.message).toBe('Second');
    expect(toastStore.toasts[1]?.message).toBe('First');
  });

  it('[P0] 3.4-TEST-018: clear removes all toasts', () => {
    toastStore.success('A');
    toastStore.error('B');
    toastStore.clear();
    expect(toastStore.toasts).toHaveLength(0);
  });

  it('[P0] 3.8-TEST-006: warning auto-dismisses after 6s', () => {
    toastStore.warning('Cuidado');
    expect(toastStore.toasts).toHaveLength(1);
    vi.advanceTimersByTime(6000);
    expect(toastStore.toasts).toHaveLength(0);
  });

  it('[P0] 3.8-TEST-007: warning is dismissible', () => {
    toastStore.warning('Cuidado');
    expect(toastStore.toasts[0]?.dismissible).toBe(true);
  });

  it('[P0] 3.8-TEST-008: warning does NOT dismiss at 4s', () => {
    toastStore.warning('Cuidado');
    vi.advanceTimersByTime(4000);
    expect(toastStore.toasts).toHaveLength(1);
  });
});
