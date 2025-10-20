<script lang="ts">
  import { enhance } from '$app/forms';
  import { selectedProject } from '$lib/utils/state';

  let deleteForm: HTMLFormElement | null = $state(null);
  
  let { onclickClose = () => {} }: { onclickClose?(): void } = $props();

  let projectId: string | null = $state($selectedProject?.projectId || null);
  let imageKey: string | null = $state($selectedProject?.featuredImage || null);

  function submit(event: Event) {
    event.preventDefault();
    deleteForm?.requestSubmit();
  }

  function close() {
    onclickClose();
  }
</script>

<div class="modal-backdrop">
  <div class="modal-content">
    <header>
      <h2>Delete Project</h2>
      <button class="close-btn" onclick={close}>×</button>
    </header>

    <form onsubmit={submit}>
      <p>Are you sure you want to delete <strong>{$selectedProject?.title}</strong>?</p>
      <div class="actions">
        <button type="button" onclick={close}>Cancel</button>
        <button type="submit" class="danger">Delete</button>
      </div>
    </form>
  </div>
</div>

<form bind:this={deleteForm} method="POST" action="?/deleteProject" use:enhance style="display: none;">
  <input type="hidden" name="id" value={projectId} />
  <input type="hidden" name="key" value={imageKey} />
</form>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: oklch(0 0 0 / 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: oklch(0.98 0.01 260);
    color: oklch(0.2 0.02 260);
    padding: 2rem;
    border-radius: 1rem;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .close-btn {
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: oklch(0.3 0.02 260);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }

  button {
    padding: 0.5rem 1.25rem;
    border-radius: 0.5rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
  }

  .danger {
    background: oklch(0.6 0.2 20);
    color: white;
  }

  .danger:hover {
    background: oklch(0.5 0.2 20);
  }
</style>
