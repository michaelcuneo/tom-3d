<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import FileDropper from '$lib/components/FileDropper.svelte';
  import Loader from '$lib/components/Loader.svelte';
  import { generateImageWithThumb } from '$lib/utils/generateImageWithThumb';
  import { Cross } from '@lucide/svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

  let createForm: HTMLFormElement | null = $state(null);

  let title: string = $state('');
  let description: string = $state('');
  let submitting: boolean = $state(false);
  let file: File | null = $state(null);
  let featured: boolean = $state(false);

  let { onclickClose = () => {} } = $props();

  function close() {
    onclickClose();
  }

  const enhancement: SubmitFunction = async ({ cancel, formData }) => {
    if (file && typeof file !== 'string') {
      try {
        const { fullBlob, thumbBlob, fullKey, thumbKey } = await generateImageWithThumb(file);

        const fullFile = new File([fullBlob], fullKey, { type: fullBlob.type });
        const thumbFile = new File([thumbBlob], thumbKey, { type: thumbBlob.type });

        formData.set('imageKey', fullKey);
        formData.set('file_full', fullFile);
        formData.set('file_thumb', thumbFile);
      } catch (err) {
        submitting = false;
        cancel();
        return async () => {}; // prevent submit
      }
    }

    // 🔁 This runs *after* the form submission
    return async ({ result }) => {
      submitting = true;
      await applyAction(result);

      if (result.type === 'success') {
        await invalidateAll();
        close();
      } else {
        console.error('Failed to create project');
      }

      cancel();
      submitting = false;
    };
  };
</script>

<div class="modal-backdrop">
  <div class="modal-content">
    <header>
      <h2>Add Project</h2>
      <button class="close-btn" onclick={close}><Cross /></button>
    </header>

    {#if submitting}
      <Loader label="Creating Project..." />
    {:else}
      <form
        bind:this={createForm}
        method="POST"
        enctype="multipart/form-data"
        action="?/createProject"
        use:enhance={enhancement}
      >
        <label>
          Title
          <input type="text" name="title" bind:value={title} required />
        </label>

        <label>
          Description
          <textarea name="description" bind:value={description} required></textarea>
        </label>

        <label class="checkbox-row">
          <input type="checkbox" name="featured" bind:checked={featured} />
          <span class="checkbox-label">Feature this project</span>
        </label>

        <FileDropper bind:file previewUrl={undefined} />

        <button type="submit">Save</button>
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

  label {
    display: block;
    margin-bottom: 1rem;
    font-weight: 500;
    color: oklch(0.25 0.02 260);
  }

  input,
  textarea {
    width: 100%;
    padding: 0.5rem;
    font: inherit;
    border-radius: 0.5rem;
    border: 1px solid oklch(0.6 0.1 260);
    margin-top: 0.25rem;
    background: white;
    color: oklch(0.2 0.02 260);
  }

  button[type="submit"] {
    background: oklch(0.7 0.2 260);
    color: white;
    padding: 0.75rem 1.5rem;
    margin-top: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  button[type="submit"]:hover {
    background: oklch(0.6 0.2 260);
  }
  .checkbox-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-weight: 500;
    color: oklch(0.25 0.02 260);
    font-family: inherit;
  }

  .checkbox-row input[type='checkbox'] {
    width: 1.2rem;
    height: 1.2rem;
    accent-color: oklch(0.7 0.2 260); /* matches your button color */
    cursor: pointer;
  }

  .checkbox-label {
    user-select: none;
  }
</style>