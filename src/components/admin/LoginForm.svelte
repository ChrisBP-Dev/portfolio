<script lang="ts">
  import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
  import { auth } from '../../lib/firebase/client';
  import { getErrorMessage } from '../../lib/firebase/auth-errors';
  import { t } from '../../lib/i18n/translations';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  const locale = 'es';

  $effect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) window.location.href = '/admin';
    });
    return () => unsubscribe();
  });

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    loading = true;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/admin';
    } catch (err) {
      error = getErrorMessage(err, locale);
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex items-center justify-center min-h-screen px-4">
  <div class="w-full max-w-sm bg-surface border border-border rounded-lg shadow-lg p-8">
    <h1 class="text-2xl font-bold text-text-primary text-center mb-2">
      Portfolio ChrisBP
    </h1>
    <p class="text-text-secondary text-center mb-6 text-sm">Admin</p>

    <form
      aria-label={t('admin.login.title', locale)}
      onsubmit={handleSubmit}
    >
      <div class="mb-4">
        <label for="login-email" class="block text-sm font-medium text-text-secondary mb-1">
          {t('admin.login.email', locale)}
        </label>
        <input
          id="login-email"
          type="email"
          autocomplete="email"
          aria-required="true"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'login-error' : undefined}
          bind:value={email}
          class="w-full px-3 py-2 bg-background border border-border rounded-md text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>

      <div class="mb-6">
        <label for="login-password" class="block text-sm font-medium text-text-secondary mb-1">
          {t('admin.login.password', locale)}
        </label>
        <input
          id="login-password"
          type="password"
          autocomplete="current-password"
          aria-required="true"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'login-error' : undefined}
          bind:value={password}
          class="w-full px-3 py-2 bg-background border border-border rounded-md text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>

      {#if error}
        <div id="login-error" class="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-sm" role="alert">
          {error}
        </div>
      {/if}

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading ? 'true' : undefined}
        class="w-full py-2.5 px-4 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-md transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      >
        {#if loading}
          <span class="flex items-center justify-center gap-2">
            <span class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            {t('admin.login.loading', locale)}
          </span>
        {:else}
          {t('admin.login.submit', locale)}
        {/if}
      </button>
    </form>
  </div>
</div>
