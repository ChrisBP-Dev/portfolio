<script lang="ts">
  import type { Project } from '../../lib/schemas/project-schema';
  import type { Technology } from '../../lib/schemas/technology-schema';
  import type { Locale } from '../../lib/i18n/config';
  import { localizeHref } from '../../data/navigation';

  let {
    projects,
    technologies,
    locale,
    filterLabel,
    allProjectsLabel,
    technologiesLabel,
    websiteLabel,
    sourceCodeLabel,
    screenshotsLabel,
    noResultsLabel,
  }: {
    projects: Project[];
    technologies: Technology[];
    locale: Locale;
    filterLabel: string;
    allProjectsLabel: string;
    technologiesLabel: string;
    websiteLabel: string;
    sourceCodeLabel: string;
    screenshotsLabel: string;
    noResultsLabel: string;
  } = $props();

  let selectedTech = $state<string>('');

  let filteredProjects = $derived(
    selectedTech === ''
      ? projects
      : projects.filter((p) => p.technologies.includes(selectedTech))
  );

  function getTechByIds(techIds: string[]): Technology[] {
    return techIds
      .map((id) => technologies.find((t) => t.id === id))
      .filter((t): t is Technology => t !== undefined);
  }
</script>

<!-- Filter dropdown -->
<div class="flex items-center justify-end gap-2 mb-6">
  <label for="tech-filter" class="text-body-sm text-text-secondary">{filterLabel}</label>
  <select
    id="tech-filter"
    bind:value={selectedTech}
    class="bg-surface border border-border rounded-lg px-3 py-2 text-body-sm text-text-primary"
  >
    <option value="">{allProjectsLabel}</option>
    {#each technologies as tech (tech.id)}
      <option value={tech.id}>{tech.name}</option>
    {/each}
  </select>
</div>

<!-- Project cards grid -->
{#if filteredProjects.length === 0}
  <p class="text-body text-text-secondary text-center py-12">{noResultsLabel}</p>
{:else}
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {#each filteredProjects as project (project.id)}
      <article class="relative bg-surface border border-border rounded-xl overflow-hidden hover:bg-surface-elevated hover:border-primary transition-colors duration-200 cursor-pointer">
        <!-- Project name with stretched link (covers entire card) -->
        <h2 class="text-heading-3 font-bold p-4 pb-0">
          <a href={localizeHref('/projects/' + project.slug, locale)} class="hover:underline after:absolute after:inset-0">
            {project.companyName[locale]}
          </a>
        </h2>

        <!-- Description -->
        <p class="text-body-sm text-text-secondary px-4 py-2">
          {project.shortDescription[locale]}
        </p>

        <!-- Website link -->
        {#if project.websiteUrl}
          <a
            href={project.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="relative z-10 text-primary text-body-sm px-4 py-2 hover:underline block"
          >
            {websiteLabel}: {project.websiteUrl}
          </a>
        {/if}

        <!-- Source code link -->
        {#if project.sourceCodeUrl}
          <a
            href={project.sourceCodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="relative z-10 text-primary text-body-sm px-4 py-2 hover:underline block"
          >
            {sourceCodeLabel}: {project.sourceCodeUrl}
          </a>
        {/if}

        <!-- Technologies section -->
        {#if project.technologies.length > 0}
          <div class="px-4 py-2">
            <h3 class="text-body-sm font-semibold mb-2">{technologiesLabel}</h3>
            <div class="flex flex-wrap gap-2">
              {#each getTechByIds(project.technologies) as tech (tech.id)}
                <span class="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/30 rounded-full px-2 py-1 text-caption">
                  <img src={tech.image.url} alt={tech.name} loading="lazy" class="w-4 h-4" />
                  {tech.name}
                </span>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Screenshots section -->
        {#if project.screenshots.length > 0}
          <div class="px-4 py-2">
            <h3 class="text-body-sm font-semibold mb-2">{screenshotsLabel}</h3>
            <div class="flex gap-2 overflow-x-auto pb-4">
              {#each project.screenshots as ss (ss.url)}
                <img
                  src={ss.url}
                  alt={project.companyName[locale] + ' screenshot'}
                  loading="lazy"
                  class="h-24 rounded-lg object-cover"
                />
              {/each}
            </div>
          </div>
        {/if}
      </article>
    {/each}
  </div>
{/if}
