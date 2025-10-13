<script lang="ts">
  import { page } from "$app/state";
  
  $: console.log(page);
</script>

<section class="error-wrapper">
  <div class="error-panel">
    <div class="icon">❗</div>
    <h1>{page.status}</h1>
    <p>{page.error?.message}</p>
    <a href="/">Go back home</a>
  </div>
</section>

<style>
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .error-wrapper {
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: oklch(0.97 0 260);
    font-family: 'Inter', sans-serif;
    animation: fadeInUp 400ms ease-out;
  }

  .error-panel {
    background: oklch(0.97 0 260);
    color: oklch(0.18 0.01 260);
    padding: 3rem;
    border-radius: 1rem;
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.25);
    text-align: center;
    max-width: 500px;
    animation: fadeInUp 400ms ease-out 100ms both;
  }

  .icon {
    margin-bottom: 1.5rem;
    animation: fadeInUp 300ms ease-out;
  }

  h1 {
    margin-bottom: 1rem;
    animation: fadeInUp 400ms ease-out 150ms both;
  }

  p {
    margin-bottom: 2rem;
    animation: fadeInUp 400ms ease-out 200ms both;
  }

  a {
    display: inline-block;
    background: oklch(21% 0.034 264.665);
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-weight: 600;
    transition: background 150ms ease;
    animation: fadeInUp 400ms ease-out 250ms both;
  }

  a:hover {
    background: oklch(0.6 0.15 260);
  }
</style>