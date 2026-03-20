<script lang="ts">
  import ProjectList from './ProjectList.svelte';
  import ProjectForm from './ProjectForm.svelte';
  import Toast from './Toast.svelte';

  let viewMode = $state<'list' | 'create'>('list');
  let listRef = $state<ProjectList | null>(null);

  function handleSaved(): void {
    viewMode = 'list';
    listRef?.loadProjects();
  }
</script>

<div class="p-6 lg:p-8">
  {#if viewMode === 'list'}
    <ProjectList
      bind:this={listRef}
      onCreateNew={() => (viewMode = 'create')}
    />
  {:else}
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-text-primary">
        Crear proyecto
      </h1>
    </div>
    <ProjectForm
      onCancel={() => (viewMode = 'list')}
      onSaved={handleSaved}
    />
  {/if}
</div>

<Toast />
