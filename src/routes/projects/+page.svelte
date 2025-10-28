<script lang="ts">
  import { selectedProject } from '$lib/utils/state';

  import Lander from '$lib/components/Lander.svelte';
  import ProjectCard from './ProjectCard.svelte';
  import AddProject from './AddProject.svelte';
	import DeleteProject from './DeleteProject.svelte';
  
  let showAddModal = $state(false);
  let showEditModal = $state(false);
  let showDeleteModal = $state(false);

  let { data }: { data: { projects: any[]; isLoggedIn: boolean } } = $props();

  let projects = $state(data.projects || []);

  // When data.projects updates (after invalidation), sync it
  $effect(() => {
    projects = data.projects;
  });

  function openAddModal() {
    selectedProject.set(null);
    showAddModal = true;
  }

  function openEditModal(project: Project) {
    selectedProject.set(project);
    showEditModal = true;
  }

  function openDeleteModal(project: Project) {
    selectedProject.set(project);
    showDeleteModal = true;
  }
  $inspect(data);
</script>

<Lander header="3D Sound FX" subheader="Recent Projects" image="" position="center" updated={new Date()} short={true} />

<section class="projects-wrapper">
  <div class="project-grid">
    {#if data.isLoggedIn}
      <ProjectCard onclick={openAddModal} isAddCard={true} />
    {/if}
    {#each projects as project (project.projectId)}
      <ProjectCard
        title={project.title}
        description={project.description}
        mediaUrl={project.mediaUrl}
        isLoggedIn={data.isLoggedIn}
        onclickEdit={() => openEditModal(project)}
        onclickDelete={() => openDeleteModal(project)}
      />
    {/each}
  </div>
</section>

{#if showAddModal}
  <AddProject
    onclickClose={() => (showAddModal = false)}
  />
{/if}

{#if showEditModal}
  <AddProject
    onclickClose={() => (showEditModal = false)}
  />
{/if}

{#if showDeleteModal}
  <DeleteProject
    onclickClose={() => (showDeleteModal = false)}
  />
{/if}

<style>
  .projects-wrapper {
    padding: 4rem 1rem;
    max-width: 1000px;
    margin: 0 auto;
    font-family: 'Inter', sans-serif;
    color: oklch(0.97 0 260);
  }
  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }
</style>
