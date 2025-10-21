<script lang="ts">
  import { selectedProject } from '$lib/utils/state';

  import Lander from '$lib/components/Lander.svelte';
  import ProjectCard from './ProjectCard.svelte';
  import AddProject from './AddProject.svelte';
  import EditProject from './EditProject.svelte';
	import AddProjectCard from './AddProjectCard.svelte';
	import DeleteProject from './DeleteProject.svelte';
  
  let showAddModal = $state(false);
  let showEditModal = $state(false);
  let showDeleteModal = $state(false);

  let { data }: { data: { projects: any[]; isLoggedIn: boolean } } = $props();

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
</script>

<Lander header="3D Sound FX" subheader="Recent Projects" image="" position="center" updated={new Date()} />

<section class="projects-wrapper">
  <div class="project-grid">
    {#if data.isLoggedIn}
      <AddProjectCard onclick={openAddModal} />
    {/if}
    {#each data.projects as project (project.projectId)}
      <ProjectCard
        title={project.title}
        description={project.description}
        imageUrl={project.featuredImageUrl}
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
  <EditProject
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
