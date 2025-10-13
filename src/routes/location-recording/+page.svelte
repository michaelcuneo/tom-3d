<script lang="ts">
	import Lander from "$lib/components/Lander.svelte";
  import image from '$lib/assets/concerthall.jpeg';
</script>

<Lander header="3D Sound FX" subheader="CLASSICAL MUSIC LOCATION RECORDING" image={image} position="bottom" />
<div class="page-content">
  <section class="intro">
    <h2>Location Recording</h2>
    <p>Professionally recorded ambiences using custom outdoor recording systems for surround and immersive formats. Ideal for use in film, games, installations, and spatial audio projects.</p>
  </section>
</div>

<style>
  .page-content {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: 'Inter', sans-serif;
    color: oklch(0.2 0.02 260);
  }
  .intro h2 {
    margin-bottom: 1rem;
    text-align: center;
  }
  .intro p {
    line-height: 1.6;
    margin-bottom: 1rem;
    text-align: justify;
  }
</style>