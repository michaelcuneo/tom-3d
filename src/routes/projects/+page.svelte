<script lang="ts">
  import Lander from '$lib/components/Lander.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';

  let { data }: { data: Projects } = $props();

  let time = new Date(Date.now());

  $inspect(data);
</script>

<Lander header="3D Sound FX" subheader="Recent Projects" image="" position="center" updated={time} />
<section class="projects-wrapper">
  <div class="project-grid">
    {#each data.projects as project}
      <ProjectCard {...project} />
    {/each}
  </div>
</section>

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