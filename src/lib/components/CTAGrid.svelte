<script lang="ts">
  import { MapPin, Mic, Headphones } from '@lucide/svelte';

  const items = [
    {
      icon: MapPin,
      title: 'Location Recording',
      text: 'Mobile recording services for classical and acoustic music in concert halls, churches, and other performance spaces.'
    },
    {
      icon: Mic,
      title: 'Field Recording',
      text: 'Capture real-world environments, from bustling cities to remote forests, with precision sound equipment.'
    },
    {
      icon: Headphones,
      title: 'Post Production',
      text: 'Editing, mixing, and mastering tailored to immersive soundscapes and 3D FX.'
    }
  ];
</script>

<section class="cta-grid-wrapper">
  <div class="cta-grid">
    {#each items as item}
      {@const Icon = item.icon}
      <div class="cta-box">
        <Icon size="64" color="oklch(0.662 0.141 193.12)" />
        <h2>{item.title}</h2>
        <p>{item.text}</p>
      </div>
    {/each}
  </div>
</section>

<style>
  .cta-grid-wrapper {
    padding: 4rem 1rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .cta-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  .cta-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    border-radius: 0.5rem;
    text-align: center;
    border: 1px solid oklch(0.85 0.01 260);
  }

  h2 {
    margin-bottom: 1rem;
    color: oklch(0.2 0.02 260);
  }

  p {
    line-height: 1.6;
    color: oklch(0.3 0.01 260);
  }
</style>
