<script lang="ts">
  import { enhance } from '$app/forms';
  import Loader from '$lib/components/Loader.svelte';
  import FileDropper from '$lib/components/FileDropper.svelte';
  import { selectedProject } from '$lib/utils/state';

  let updateForm: HTMLFormElement | null = $state(null);
  let hiddenFileInput: HTMLInputElement | null = $state(null);
  let id = $state($selectedProject?.projectId || '');
  let title = $state($selectedProject?.title || '');
  let description = $state($selectedProject?.description || '');
  let file: File | null = $state(null);
  let existingImageUrl: string = $state($selectedProject?.featuredImageUrl || '');
  let submitting = $state(false);

  let {
    onclickClose = () => {}
  }: {
    onclickClose?(): void;
  } = $props();

  function submit(event: Event) {
    event.preventDefault();
    updateForm?.requestSubmit();
  }

  function close() {
    onclickClose();
  }

  const enhancement = async () => {
    submitting = true;
    return async ({ update }: { update: () => Promise<void> }) => {
      await update().then(() => {
        submitting = false;
        close();
      });
    };
  };


  $effect(() => {
    if (file && hiddenFileInput) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      hiddenFileInput.files = dataTransfer.files;
    } else if (hiddenFileInput) {
      hiddenFileInput.value = ''; // clear it
    }
  });
</script>

<div class="modal-backdrop">
  <div class="modal-content">
    <header>
      <h2>Edit Project</h2>
      <button class="close-btn" onclick={close}>×</button>
    </header>

    {#if submitting}
      <Loader label="Updating Project..." />
    {:else}

      <form onsubmit={submit}>
        <label>
          Title
          <input type="text" bind:value={title} required />
        </label>
        <label>
          Description
          <textarea bind:value={description} required></textarea>
        </label>

        <FileDropper
          bind:file
          previewUrl={existingImageUrl}
          onremove={() => {
            file = null;
            existingImageUrl = '';
           }}
        />

        <button type="submit">Save</button>
      </form>
    {/if}
  </div>
</div>

<form bind:this={updateForm} method="POST" enctype="multipart/form-data" action="?/updateProject" use:enhance={enhancement}>
  <input type="text" name="id" value={id} />
  <input type="text" name="title" value={title} />
  <input type="text" name="description" value={description} />
  <input type="text" name="existingKey" value={$selectedProject?.featuredImage || ''} />
  <input type="file" name="file" bind:this={hiddenFileInput} style="display: none;" />
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
    font-weight: 600;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  button[type="submit"]:hover {
    background: oklch(0.6 0.2 260);
  }
</style>