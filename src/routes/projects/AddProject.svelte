<script lang="ts">
  import FileDropper from '$lib/components/FileDropper.svelte';
  
  const props: {
    title: string;
    description: string;
    image: string;
    onSubmit?(data: { title: string; description: string; image: string }): void;
    onClose?(): void;
  } = $props();

  function submit() {
    props.onSubmit?.({
      title: props.title,
      description: props.description,
      image: props.image
    });
  }

  function close() {
    props.onClose?.();
  }
</script>

<div class="modal-backdrop" role="dialog" aria-modal="true">
  <div class="modal-content">
    <header>
      <h2>{props.title ? 'Edit Project' : 'Add Project'}</h2>
      <button class="close-btn" aria-label="Close" onclick={close}>×</button>
    </header>

    <form onsubmit={submit}>
      <label>
        Title
        <input type="text" bind:value={props.title} required />
      </label>

      <label>
        Description
        <textarea bind:value={props.description} required></textarea>
      </label>

      <FileDropper multiple={false} />

      <button type="submit">Save</button>
    </form>
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
    font-weight: 600;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  button[type="submit"]:hover {
    background: oklch(0.6 0.2 260);
  }
</style>