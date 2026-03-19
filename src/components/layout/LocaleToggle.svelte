<script lang="ts">
  import { t } from '../../lib/i18n/translations';

  interface Props {
    currentLocale: 'es' | 'en';
    currentPath: string;
  }

  let { currentLocale, currentPath }: Props = $props();

  const ariaLabel = $derived(t('locale.switch', currentLocale));

  const flag = $derived(currentLocale === 'es' ? '🇪🇸' : '🇺🇸');

  const targetUrl = $derived.by(() => {
    if (currentLocale === 'en') {
      return `/es${currentPath === '/' ? '/' : currentPath}`;
    }
    const withoutPrefix = currentPath.replace(/^\/es(\/|$)/, '$1');
    return withoutPrefix || '/';
  });
</script>

<a
  href={targetUrl}
  class="fixed bottom-6 right-6 z-[55] min-h-11 min-w-11 flex items-center justify-center bg-surface border border-border rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all focus:outline-2 focus:outline-offset-2 focus:outline-primary"
  aria-label={ariaLabel}
>
  <span class="text-xl leading-none">{flag}</span>
</a>
