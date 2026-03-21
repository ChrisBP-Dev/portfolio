const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 4000;
const WARNING_DISMISS_MS = 6000;

export type ToastType = 'success' | 'error' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  dismissible: boolean;
}

let toasts = $state<Toast[]>([]);
// eslint-disable-next-line svelte/prefer-svelte-reactivity -- internal timer tracking, not reactive state
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function add(message: string, type: ToastType): string {
  const id = crypto.randomUUID();
  const toast: Toast = { id, message, type, dismissible: type !== 'success' };

  toasts = [toast, ...toasts].slice(0, MAX_TOASTS);

  if (type === 'success') {
    const timer = setTimeout(() => remove(id), AUTO_DISMISS_MS);
    timers.set(id, timer);
  } else if (type === 'warning') {
    const timer = setTimeout(() => remove(id), WARNING_DISMISS_MS);
    timers.set(id, timer);
  }

  return id;
}

function remove(id: string): void {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
  toasts = toasts.filter((t) => t.id !== id);
}

function clear(): void {
  for (const timer of timers.values()) {
    clearTimeout(timer);
  }
  timers.clear();
  toasts = [];
}

export const toastStore = {
  get toasts() {
    return toasts;
  },
  success: (message: string) => add(message, 'success'),
  error: (message: string) => add(message, 'error'),
  warning: (message: string) => add(message, 'warning'),
  remove,
  clear,
};
