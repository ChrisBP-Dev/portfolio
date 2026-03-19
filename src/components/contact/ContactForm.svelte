<script lang="ts">
  import type { Locale } from '../../lib/i18n/config';
  import { t } from '../../lib/i18n/translations';
  import { z } from 'zod';

  let { locale }: { locale: Locale } = $props();

  // Form state
  let name = $state('');
  let email = $state('');
  let phone = $state('');
  let countryCode = $state('+1');
  let message = $state('');
  let channel = $state('');
  let errors = $state<Record<string, string>>({});
  let fallbackUrl = $state('');

  const countries = [
    { iso: 'US', code: '+1', flag: '\u{1F1FA}\u{1F1F8}', name: 'United States' },
    { iso: 'ES', code: '+34', flag: '\u{1F1EA}\u{1F1F8}', name: 'Espa\u00f1a' },
    { iso: 'MX', code: '+52', flag: '\u{1F1F2}\u{1F1FD}', name: 'M\u00e9xico' },
    { iso: 'CO', code: '+57', flag: '\u{1F1E8}\u{1F1F4}', name: 'Colombia' },
    { iso: 'PE', code: '+51', flag: '\u{1F1F5}\u{1F1EA}', name: 'Per\u00fa' },
    { iso: 'CL', code: '+56', flag: '\u{1F1E8}\u{1F1F1}', name: 'Chile' },
    { iso: 'AR', code: '+54', flag: '\u{1F1E6}\u{1F1F7}', name: 'Argentina' },
    { iso: 'GB', code: '+44', flag: '\u{1F1EC}\u{1F1E7}', name: 'United Kingdom' },
    { iso: 'DE', code: '+49', flag: '\u{1F1E9}\u{1F1EA}', name: 'Deutschland' },
    { iso: 'FR', code: '+33', flag: '\u{1F1EB}\u{1F1F7}', name: 'France' },
  ];

  function validateField(field: string, value: string): string | undefined {
    if (field === 'name') {
      if (!value.trim()) return t('contact.validation.nameRequired', locale);
      if (value.trim().length < 2) return t('contact.validation.nameMin', locale);
      if (value.trim().length > 100) return t('contact.validation.nameMax', locale);
    }
    if (field === 'email') {
      if (!value.trim()) return t('contact.validation.emailRequired', locale);
      const emailResult = z.string().email().safeParse(value.trim());
      if (!emailResult.success) return t('contact.validation.emailInvalid', locale);
    }
    if (field === 'message') {
      if (!value.trim()) return t('contact.validation.messageRequired', locale);
      if (value.trim().length < 10) return t('contact.validation.messageMin', locale);
      if (value.trim().length > 2000) return t('contact.validation.messageMax', locale);
    }
    if (field === 'channel') {
      if (!value) return t('contact.validation.channelRequired', locale);
    }
    return undefined;
  }

  function handleBlur(field: string, value: string) {
    const error = validateField(field, value);
    if (error) {
      errors = { ...errors, [field]: error };
    } else {
      const newErrors = { ...errors };
      delete newErrors[field];
      errors = newErrors;
    }
  }

  function buildWhatsAppUrl(n: string, em: string, ph: string, msg: string): string {
    const whatsappNumber = (import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '').replace(/[\s\-+()]/g, '');
    const phoneInfo = ph ? `\n${locale === 'es' ? 'Tel\u00e9fono' : 'Phone'}: ${ph}` : '';
    const text = locale === 'es'
      ? `Hola, soy ${n} (${em}).${phoneInfo}\n\n${msg}`
      : `Hi, I'm ${n} (${em}).${phoneInfo}\n\n${msg}`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  }

  function buildMailtoUrl(n: string, em: string, ph: string, msg: string): string {
    const to = import.meta.env.PUBLIC_CONTACT_EMAIL ?? '';
    const subject = locale === 'es'
      ? `Nuevo mensaje de ${n}`
      : `New message from ${n}`;
    const phoneLabel = locale === 'es' ? 'Tel\u00e9fono' : 'Phone';
    const phoneInfo = ph ? `\n${phoneLabel}: ${ph}` : '';
    const body = `${locale === 'es' ? 'De' : 'From'}: ${n}\nEmail: ${em}${phoneInfo}\n\n${msg}`;
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function handleSubmit() {
    fallbackUrl = '';

    // Validate all fields
    const newErrors: Record<string, string> = {};
    const nameErr = validateField('name', name);
    if (nameErr) newErrors.name = nameErr;
    const emailErr = validateField('email', email);
    if (emailErr) newErrors.email = emailErr;
    const msgErr = validateField('message', message);
    if (msgErr) newErrors.message = msgErr;
    const channelErr = validateField('channel', channel);
    if (channelErr) newErrors.channel = channelErr;

    errors = newErrors;

    if (Object.keys(errors).length > 0) return;

    // Trim values for URL construction
    const trimName = name.trim();
    const trimEmail = email.trim();
    const trimPhone = phone.trim() ? `${countryCode}${phone.trim()}`.replace(/[\s\-()]/g, '') : '';
    const trimMessage = message.trim();

    if (channel === 'whatsapp') {
      const url = buildWhatsAppUrl(trimName, trimEmail, trimPhone, trimMessage);
      const opened = window.open(url, '_blank', 'noopener,noreferrer');
      if (!opened) {
        fallbackUrl = url;
      }
    } else if (channel === 'email') {
      const url = buildMailtoUrl(trimName, trimEmail, trimPhone, trimMessage);
      window.location.href = url;
    }
  }
</script>

<form
  onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}
  class="bg-surface border border-border rounded-xl p-6 flex flex-col gap-5"
  novalidate
>
  <!-- Name -->
  <div class="flex flex-col gap-1">
    <label for="input-name" class="text-caption text-text-secondary font-medium">
      {t('contact.form.name', locale)}<span class="text-error ml-0.5">*</span>
    </label>
    <input
      type="text"
      id="input-name"
      bind:value={name}
      onblur={() => handleBlur('name', name)}
      placeholder={t('contact.form.namePlaceholder', locale)}
      maxlength={100}
      aria-required="true"
      aria-invalid={errors.name ? 'true' : undefined}
      aria-describedby={errors.name ? 'input-name-error' : undefined}
      class="bg-surface border rounded-lg px-3 py-3 text-body text-text-primary w-full placeholder:text-text-muted focus:outline-2 focus:outline-offset-2 {errors.name ? 'border-error focus:outline-error' : 'border-border focus:outline-primary focus:border-primary'}"
    />
    {#if errors.name}
      <p id="input-name-error" class="text-body-sm text-error mt-1" role="alert">{errors.name}</p>
    {/if}
  </div>

  <!-- Email -->
  <div class="flex flex-col gap-1">
    <label for="input-email" class="text-caption text-text-secondary font-medium">
      {t('contact.form.email', locale)}<span class="text-error ml-0.5">*</span>
    </label>
    <input
      type="email"
      id="input-email"
      bind:value={email}
      onblur={() => handleBlur('email', email)}
      placeholder={t('contact.form.emailPlaceholder', locale)}
      aria-required="true"
      aria-invalid={errors.email ? 'true' : undefined}
      aria-describedby={errors.email ? 'input-email-error' : undefined}
      class="bg-surface border rounded-lg px-3 py-3 text-body text-text-primary w-full placeholder:text-text-muted focus:outline-2 focus:outline-offset-2 {errors.email ? 'border-error focus:outline-error' : 'border-border focus:outline-primary focus:border-primary'}"
    />
    {#if errors.email}
      <p id="input-email-error" class="text-body-sm text-error mt-1" role="alert">{errors.email}</p>
    {/if}
  </div>

  <!-- Phone (country picker + number) -->
  <div class="flex flex-col gap-1">
    <label for="input-phone" class="text-caption text-text-secondary font-medium">
      {t('contact.form.phone', locale)}
    </label>
    <div class="flex gap-2">
      <select
        id="input-country-code"
        bind:value={countryCode}
        aria-label={t('contact.form.countryCode', locale)}
        class="bg-surface border border-border rounded-lg px-2 py-3 text-body text-text-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary focus:border-primary min-h-11 min-w-11"
      >
        {#each countries as country (country.iso)}
          <option value={country.code}>{country.flag} {country.name}</option>
        {/each}
      </select>
      <input
        type="tel"
        id="input-phone"
        bind:value={phone}
        placeholder={t('contact.form.phonePlaceholder', locale)}
        class="bg-surface border border-border rounded-lg px-3 py-3 text-body text-text-primary w-full placeholder:text-text-muted focus:outline-2 focus:outline-offset-2 focus:outline-primary focus:border-primary"
      />
    </div>
  </div>

  <!-- Message -->
  <div class="flex flex-col gap-1">
    <label for="input-message" class="text-caption text-text-secondary font-medium">
      {t('contact.form.message', locale)}<span class="text-error ml-0.5">*</span>
    </label>
    <textarea
      id="input-message"
      bind:value={message}
      onblur={() => handleBlur('message', message)}
      placeholder={t('contact.form.messagePlaceholder', locale)}
      rows="4"
      maxlength={2000}
      aria-required="true"
      aria-invalid={errors.message ? 'true' : undefined}
      aria-describedby={errors.message ? 'input-message-error' : undefined}
      class="bg-surface border rounded-lg px-3 py-3 text-body text-text-primary w-full placeholder:text-text-muted focus:outline-2 focus:outline-offset-2 resize-y {errors.message ? 'border-error focus:outline-error' : 'border-border focus:outline-primary focus:border-primary'}"
    ></textarea>
    {#if errors.message}
      <p id="input-message-error" class="text-body-sm text-error mt-1" role="alert">{errors.message}</p>
    {/if}
  </div>

  <!-- Channel -->
  <div class="flex flex-col gap-1">
    <label for="input-channel" class="text-caption text-text-secondary font-medium">
      {t('contact.form.channel', locale)}<span class="text-error ml-0.5">*</span>
    </label>
    <select
      id="input-channel"
      bind:value={channel}
      onblur={() => handleBlur('channel', channel)}
      aria-required="true"
      aria-invalid={errors.channel ? 'true' : undefined}
      aria-describedby={errors.channel ? 'input-channel-error' : undefined}
      class="bg-surface border rounded-lg px-3 py-3 text-body text-text-primary w-full focus:outline-2 focus:outline-offset-2 {errors.channel ? 'border-error focus:outline-error' : 'border-border focus:outline-primary focus:border-primary'}"
    >
      <option value="" disabled selected>{locale === 'es' ? 'Selecciona un canal' : 'Select a channel'}</option>
      <option value="whatsapp">{t('contact.form.channel.whatsapp', locale)}</option>
      <option value="email">{t('contact.form.channel.email', locale)}</option>
    </select>
    {#if errors.channel}
      <p id="input-channel-error" class="text-body-sm text-error mt-1" role="alert">{errors.channel}</p>
    {/if}
  </div>

  <!-- Popup blocked fallback -->
  {#if fallbackUrl}
    <div role="alert" class="bg-surface border border-primary rounded-lg p-4 text-body-sm">
      <p class="text-text-secondary mb-2">{t('contact.form.popupBlocked', locale)}</p>
      <a
        href={fallbackUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary font-semibold underline hover:brightness-110"
      >
        {t('contact.form.openManually', locale)}
      </a>
    </div>
  {/if}

  <!-- Submit button -->
  <button
    type="submit"
    class="min-h-11 min-w-11 px-6 py-3 rounded-lg font-semibold text-body-sm inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-2 focus:outline-offset-2 focus:outline-primary text-white [background:var(--brand-gradient)] shadow-md hover:shadow-lg hover:brightness-110 w-full sm:w-auto sm:self-end"
  >
    {t('contact.form.submit', locale)}
  </button>
</form>
