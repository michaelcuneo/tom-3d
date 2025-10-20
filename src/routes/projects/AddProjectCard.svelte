<script lang="ts">
  let {
    onclick = () => {},
  }: {
    onclick?(): void;
  } = $props();
</script>

<div class="project-card-wrapper">
  <button class="project-card add-card" onclick={onclick}>
    <div class="overlay">
      <h3>+ Add Project</h3>
      <p>Create a new project entry</p>
    </div>
  </button>
</div>

<style>
  .project-card-wrapper {
    position: relative;
  }

  .project-card {
    background: linear-gradient(to bottom, oklch(0.95 0.01 260), oklch(0.1 0 0));
    border-radius: 1rem;
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
    font-family: 'Inter', sans-serif;
    max-width: 600px;
    margin: 2rem auto;
    overflow: hidden;
    position: relative;
    height: 320px;
    width: 100%;
    display: flex;
    align-items: flex-end;
    text-decoration: none;
    transition: transform 200ms ease, box-shadow 200ms ease;
    color: oklch(0.97 0 260);
    cursor: pointer;
  }

  .project-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  }

  .add-card {
    background: none;
    justify-content: center;
    padding: 0;
    border: none;
  }

  .overlay {
    padding: 2rem;
    width: 100%;
    background: linear-gradient(to top, oklch(0.1 0 0 / 0.85), transparent);
    text-align: left;
  }

  h3 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 700;
  }

  p {
    margin: 0.25rem 0 0;
    font-size: 0.95rem;
    opacity: 0.8;
  }
</style>
