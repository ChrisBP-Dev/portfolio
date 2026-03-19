import type { Locale } from '../i18n/config';

export function formatExperienceDateRange(
  startDate: Date,
  endDate: Date | null,
  locale: Locale,
  presentLabel: string
): string {
  const intlLocale = locale === 'es' ? 'es-ES' : 'en-US';
  const fmt = new Intl.DateTimeFormat(intlLocale, { year: 'numeric' });
  const start = fmt.format(startDate);
  const end = endDate ? fmt.format(endDate) : presentLabel;
  return `${start} – ${end}`;
}
