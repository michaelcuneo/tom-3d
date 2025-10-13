<script lang="ts">
  let {
    header,
    subheader,
    image,
    position,
    updated
  }: {
    header: string,
    subheader: string,
    image: string,
    position: string
    updated?: Date
  } = $props();

  import Stacco from '$lib/assets/stacco.jpeg';

  if (!image) {
    image = Stacco;
  }
</script>

<div class="lander" style="background-image: url('{image}'); background-position: {position ? position : 'center'};">
  <section>
    <span class="head animate-fade">{header}</span>
    <span class="sub animate-rise">{subheader}</span>
    {#if updated}
      <div class="small">updated: {updated?.toLocaleDateString()}</div>
    {/if}
  </section>
</div>

<style>
  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(5px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes riseIn {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade {
    animation: fadeInUp 300ms ease-out forwards;
  }

  .animate-rise {
    animation: riseIn 400ms ease-out 50ms forwards;
  }

  .lander {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 45vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 0;
    animation: fadeInUp 300ms ease-out;
  }

  .lander::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 45vh;
    background-image: linear-gradient(180deg, rgba(12, 12, 12, 0.2), rgba(12, 12, 12, 0.5), rgba(12, 12, 12, 0.9));
    z-index: 0;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 50vw;
    z-index: 1;
  }

  .small {
    font-size: 0.75rem;
    color: oklch(.7 .02 285);
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
  }

  .head {
    font-family: 'Changa One', sans-serif;
    color: oklch(.985 0 0);
    text-transform: uppercase;
  }

  .sub {
    color: oklch(.985 0 0);
    text-transform: uppercase;
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    line-height: 1.4;
  }
</style>
