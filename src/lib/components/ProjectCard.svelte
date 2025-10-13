<script lang="ts">
  let { title, description, link, image }: { title: string; description: string; link: string; image: string } = $props();
</script>

<a class="project-card" href={link} style="background-image: url('{image}');">
  <div class="overlay">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
</a>

<style>
  .project-card {
    background-size: cover;
    background-position: center;
    border-radius: 1rem;
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
    font-family: 'Inter', sans-serif;
    max-width: 600px;
    margin: 2rem auto;
    overflow: hidden;
    position: relative;
    height: 320px;
    display: flex;
    align-items: flex-end;
    text-decoration: none;
    transition: transform 200ms ease, box-shadow 200ms ease;
  }

  .project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  }

  .overlay {
    background: linear-gradient(to top, oklch(0.1 0 260 / 0.85), transparent);
    padding: 2rem;
    width: 100%;
    color: oklch(0.97 0 260);
    transition: background 200ms ease;
  }

  h3 {
    margin-bottom: 0.75rem;
  }

  p {
    line-height: 1.6;
  }
</style>