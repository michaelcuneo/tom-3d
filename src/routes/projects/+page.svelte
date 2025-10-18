<script lang="ts">
  import Lander from '$lib/components/Lander.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import AddProject from './AddProject.svelte';

  let showModal = $state(false);
  let time = new Date();

  let title: string = $state('');
  let description: string = $state('');
  let image: string = $state("");
  let form: HTMLFormElement | null = $state(null);

  const submitProject = (e: any) => {
    if (form) {
      form.requestSubmit();
    }
  };

  let { data }: { data: { projects: any[]; isLoggedIn: boolean } } = $props();

  function openEditModal(project: Project) {
    showModal = true;
    title = project.title;
    description = project.description;
    image = project.image;
  }
</script>

<Lander header="3D Sound FX" subheader="Recent Projects" image="" position="center" updated={time} />

<section class="projects-wrapper">
  <div class="project-grid">
    {#if data.isLoggedIn}
      <ProjectCard
        isAddCard
        onAdd={() => {
          title = '';
          description = '';
          image = '';
          showModal = true;
        }}
      />
    {/if}
    {#each data.projects as project (project.projectId)}
      <ProjectCard
        title={project.title}
        description={project.description}
        image={project.image}
        isLoggedIn={data.isLoggedIn}
        onEdit={() => openEditModal(project)}
        onDelete={() => console.log('Delete', project)}
      />
    {/each}
  </div>
</section>

<form bind:this={form} style="display: none;" method="POST" action="?/createProject">
  <input type="hidden" name="title" value={title} />
  <input type="hidden" name="description" value={description} />
  <input type="hidden" name="image" value={image} />
</form>

{#if showModal}
  <AddProject
    title={title}
    description={description}
    image={image}
    onSubmit={(e) => {
      submitProject(e);
      showModal = false;
    }}
    onClose={() => showModal = false}
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