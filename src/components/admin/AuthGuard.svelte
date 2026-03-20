<script lang="ts">
  import { onAuthStateChanged, type User } from 'firebase/auth';
  import { auth } from '../../lib/firebase/client';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  let user = $state<User | null>(null);
  let checking = $state(true);

  $effect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      user = u;
      checking = false;
      if (!u) window.location.href = '/admin/login';
    });
    return () => unsubscribe();
  });
</script>

{#if checking}
  <div class="flex items-center justify-center min-h-screen">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
{:else if user}
  {@render children()}
{/if}
