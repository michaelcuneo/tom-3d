<script lang="ts">
	import Lander from "$lib/components/Lander.svelte";
  import image from '$lib/assets/turntable.png';
	import CTAGrid from "$lib/components/CTAGrid.svelte";
  import ContactGrid from "$lib/components/ContactGrid.svelte";
</script>

<Lander header="3D Sound FX" subheader="Sound Recordings by Thomas Mitchell" image={image} position="center" />
<div class="page-content">
  <section class="intro">
    <h1>Services</h1>
    <p>Thomas is a sound recordist specialising in surround and immersive audio for location-based projects. His work focuses on capturing natural soundscapes, live performances, and film scores.</p>
    <p>
      Based in Newcastle, New South Wales, Australia, Thomas works on location throughout the Sydney and Hunter regions.
    </p>
  </section>
</div>
<CTAGrid />
<ContactGrid />

<style>
  .page-content {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: 'Inter', sans-serif;
    color: oklch(0.2 0.02 260);
  }
  .intro h1 {
    margin-bottom: 1rem;
    text-align: center;
  }
  .intro p {
    line-height: 1.6;
    margin-bottom: 1rem;
    text-align: justify;
  }
</style>