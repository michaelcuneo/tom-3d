<script lang="ts">
  let {
    title = '',
    description = '',
    image = '',
    isAddCard = false,
    isLoggedIn = $bindable(false),
    onAdd,
    onEdit,
    onDelete
  }: {
    title?: string;
    description?: string;
    image?: string;
    isAddCard?: boolean;
    isLoggedIn?: boolean;
    onAdd?(): void;
    onEdit?(): void;
    onDelete?(): void;
  } = $props();
</script>

{#if isAddCard}
  <button
    class="project-card add-card"
    onclick={onAdd}
    aria-label="Add Project"
  >
    <div class="overlay centered">
      <h3>+ Add Project</h3>
    </div>
  </button>
{:else}
  <div class="project-card-wrapper">
    <!-- Change to an anchor one day in the future-->
    <div
      class="project-card"
      style="background-image: url('{image}')"
    >
      <div class="overlay">
        <h3>{isAddCard ? 'Add Project' : title}</h3>
        <p>{description}</p>
      </div>
      {#if isLoggedIn}
        <div class="card-actions">
          <button class="edit-btn" aria-label="Edit Project" onclick={onEdit}>✎</button>
          <button class="delete-btn" aria-label="Delete Project" onclick={onDelete}>🗑</button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .project-card-wrapper {
    position: relative;
  }

  .card-actions {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    display: flex;
    gap: 0.5rem;
    z-index: 2;
  }

  .card-actions button {
    background: oklch(0.2 0.02 260 / 0.8);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    padding: 0.4rem 0.6rem;
    border-radius: 0.4rem;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    transition: background 150ms ease;
  }

  .card-actions button:hover {
    background: oklch(0.15 0.02 260);
  }

  .edit-btn {
    background: oklch(0.3 0.1 260 / 0.9);
  }

  .delete-btn {
    background: oklch(0.6 0.2 30 / 0.9);
  }

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

  .add-card {
    background: oklch(0.9 0.01 260);
    justify-content: center;
    cursor: pointer;
  }

  .add-card:hover {
    background: oklch(0.88 0.01 260);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }

  .centered {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%;
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