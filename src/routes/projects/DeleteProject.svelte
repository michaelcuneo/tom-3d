<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { enhance, applyAction } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import Loader from '$lib/components/Loader.svelte';
  import { selectedProject } from '$lib/utils/state';
  import type { SubmitFunction } from '@sveltejs/kit';

  let submitting = $state(false);
  let { onclickClose = () => {} } = $props();

  let projectId: string = $state($selectedProject?.projectId || '');
  let imageKey: string = $state($selectedProject?.mediaUrl || '');
  let sort: number = $state($selectedProject?.sort || 0);

  const close = () => onclickClose();

  const enhancement: SubmitFunction = ({ cancel, formElement }) => {
    submitting = true; // show loader before sending form

    return async ({ result }) => {
      await applyAction(result);

      if (result.type === 'success') {
        await invalidateAll();
      } else {
        console.error('Failed to delete project');
      }

      submitting = false;
      close();
      cancel();
    };
  };
</script>

<div class="modal-backdrop" transition:fade={{ duration: 200 }}>
  <div class="modal-content" transition:scale={{ duration: 180, easing: cubicOut }}>
    <header>
      <h2>Delete Project</h2>
      <button class="close-btn" onclick={close}>×</button>
    </header>

    {#if submitting}
      <Loader label="Deleting Project..." />
    {:else}
      <form method="POST" action="?/deleteProject" use:enhance={enhancement}>
        <p>Are you sure you want to delete <strong>{$selectedProject?.title}</strong>?</p>
        <input type="hidden" name="id" value={projectId} />
        <input type="hidden" name="key" value={imageKey} />
        <input type="hidden" name="sort" value={sort} />
        <div class="actions">
          <button type="button" onclick={close}>Cancel</button>
          <button type="submit" class="danger">Delete</button>
        </div>
      </form>
    {/if}
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: oklch(0 0 0 / 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(6px);
  }

  .modal-content {
    background: oklch(0.98 0.01 260);
    color: oklch(0.2 0.02 260);
    padding: 2rem;
    border-radius: 1rem;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    transform-origin: center;
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
