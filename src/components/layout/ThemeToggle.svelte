<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '../../lib/i18n/translations';

  interface Props {
    currentLocale: 'es' | 'en';
  }

  let { currentLocale }: Props = $props();

  let isDark = $state(true);
  let domLocale = $state<'es' | 'en' | null>(null);

  onMount(() => {
    isDark = document.documentElement.classList.contains('dark');
  });

  // Sync locale from <html lang> after View Transition swap (transition:persist keeps stale props)
  $effect(() => {
    const syncLocale = () => {
      domLocale = (document.documentElement.lang || 'en') as 'es' | 'en';
    };
    document.addEventListener('astro:after-swap', syncLocale);
    return () => document.removeEventListener('astro:after-swap', syncLocale);
  });

  const locale = $derived(domLocale ?? currentLocale);

  const ariaLabel = $derived(
    isDark ? t('theme.toLight', locale) : t('theme.toDark', locale)
  );

  const icon = $derived(isDark ? '☀️' : '🌙');

  let transitionTimer: ReturnType<typeof window.setTimeout>;

  function toggleTheme() {
    window.clearTimeout(transitionTimer);
    document.documentElement.classList.add('theme-transitioning');

    isDark = !isDark;
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light');

    transitionTimer = window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 200);
  }
</script>

<button
  class="fixed bottom-20 right-6 z-[55] min-h-11 min-w-11 flex items-center justify-center bg-surface border border-border rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all focus:outline-2 focus:outline-offset-2 focus:outline-primary"
  aria-label={ariaLabel}
  onclick={toggleTheme}
>
  <span class="text-xl leading-none">{icon}</span>
</button>
