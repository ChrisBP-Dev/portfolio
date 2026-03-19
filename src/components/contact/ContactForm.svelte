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

  const countries = [
    { code: '+34', flag: '\u{1F1EA}\u{1F1F8}', name: 'España' },
    { code: '+1', flag: '\u{1F1FA}\u{1F1F8}', name: 'United States' },
    { code: '+52', flag: '\u{1F1F2}\u{1F1FD}', name: 'México' },
    { code: '+57', flag: '\u{1F1E8}\u{1F1F4}', name: 'Colombia' },
    { code: '+51', flag: '\u{1F1F5}\u{1F1EA}', name: 'Perú' },
    { code: '+56', flag: '\u{1F1E8}\u{1F1F1}', name: 'Chile' },
    { code: '+54', flag: '\u{1F1E6}\u{1F1F7}', name: 'Argentina' },
    { code: '+44', flag: '\u{1F1EC}\u{1F1E7}', name: 'United Kingdom' },
    { code: '+49', flag: '\u{1F1E9}\u{1F1EA}', name: 'Deutschland' },
    { code: '+33', flag: '\u{1F1EB}\u{1F1F7}', name: 'France' },
  ];

  function validateField(field: string, value: string): string | undefined {
    if (field === 'name') {
      if (!value.trim()) return t('contact.validation.nameRequired', locale);
      if (value.trim().length < 2) return t('contact.validation.nameMin', locale);
    }
    if (field === 'email') {
      if (!value.trim()) return t('contact.validation.emailRequired', locale);
      const emailResult = z.string().email().safeParse(value);
      if (!emailResult.success) return t('contact.validation.emailInvalid', locale);
    }
    if (field === 'message') {
      if (!value.trim()) return t('contact.validation.messageRequired', locale);
      if (value.trim().length < 10) return t('contact.validation.messageMin', locale);
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

  function buildWhatsAppUrl(ph: string, cc: string, n: string, em: string, msg: string): string {
    const fullPhone = `${cc}${ph}`.replace(/[\s\-()]/g, '');
    const text = locale === 'es'
      ? `Hola, soy ${n} (${em}). ${msg}`
      : `Hi, I'm ${n} (${em}). ${msg}`;
    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`;
  }

  function buildMailtoUrl(n: string, em: string, ph: string, msg: string): string {
    const to = import.meta.env.PUBLIC_CONTACT_EMAIL;
    const subject = locale === 'es'
      ? `Nuevo mensaje de ${n}`
      : `New message from ${n}`;
    const phoneLabel = locale === 'es' ? 'Teléfono' : 'Phone';
    const body = `${locale === 'es' ? 'De' : 'From'}: ${n}\nEmail: ${em}\n${phoneLabel}: ${ph}\n\n${msg}`;
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function handleSubmit() {
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

    const fullPhone = phone ? `${countryCode}${phone}` : '';

    if (channel === 'whatsapp') {
      const url = buildWhatsAppUrl(phone, countryCode, name, email, message);
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (channel === 'email') {
      const url = buildMailtoUrl(name, email, fullPhone, message);
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
        {#each countries as country (country.code)}
          <option value={country.code}>{country.flag} {country.code}</option>
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

  <!-- Submit button -->
  <button
    type="submit"
    class="min-h-11 min-w-11 px-6 py-3 rounded-lg font-semibold text-body-sm inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-2 focus:outline-offset-2 focus:outline-primary text-white [background:var(--brand-gradient)] shadow-md hover:shadow-lg hover:brightness-110 w-full sm:w-auto sm:self-end"
  >
    {t('contact.form.submit', locale)}
  </button>
</form>
