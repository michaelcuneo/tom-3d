<script lang="ts">
  let {
    file = $bindable<File | null>(null),
    variant = 'standard',
    label = `file-dropper-label-${Math.random().toString(36).substring(2, 15)}`,
    onremove = () => {},
    previewUrl = ''
  }: {
    file?: File | null;
    variant?: 'standard' | 'neumorphic';
    label?: string;
    onremove?(): void;
    previewUrl?: string;
  } = $props();

  let dropArea: HTMLElement | undefined = $state();
  let progressBar: HTMLElement | undefined = $state();
  let gallery: HTMLElement | undefined = $state();

  let progress = $state(0);
  let highlight = $state(false);
  let filesDone = $state(0);
  let filesToDo = $state(0);

  let hidden = $derived(() => filesDone === filesToDo && filesToDo !== 0);

  let internalPreviewUrl = $state<string | null>(null);

  $effect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      internalPreviewUrl = objectUrl;

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (!internalPreviewUrl) {
      // Only apply previewUrl if no object URL is currently in use
      internalPreviewUrl = previewUrl || null;
    }
  });

  const handleDragOver = (e: DragEvent) => {
    highlight = true;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: DragEvent) => {
    highlight = false;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      highlight = false;
    }
  };

  const handleFiles = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      setFile(input.files[0]);
    }
  };

  const setFile = (f: File) => {
    file = f;
  };

  const clearFile = () => {
    file = null;
    internalPreviewUrl = null;
    onremove();
  };
</script>

<div
  bind:this={dropArea}
  role="region"
  aria-label={label}
  class={`drop-area ${variant}`}
  class:highlight
  ondragenter={handleDragOver}
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
  onfocus={() => (highlight = true)}
  onblur={() => (highlight = false)}
>
  {#if !internalPreviewUrl}
    <p id={label} class="drop-instructions">
      Drag and drop your image file here or
      <label class="button" for="files">browse</label>.
    </p>

    <input
      type="file"
      class="files"
      id="files"
      aria-labelledby={label}
      accept="image/*"
      onchange={handleFiles}
    />
  {:else}
    <div class="gallery" bind:this={gallery} role="list" aria-label="Uploaded file preview">
      <div class="image-container" role="listitem">
        <img src={internalPreviewUrl} alt="Preview" />
        <p class="filename">{file?.name}</p>
        <button
          class="icon-button"
          type="button"
          aria-label={`Remove ${file?.name}`}
          onclick={clearFile}
        >
          <span aria-hidden="true" class="material-icons">cancel</span>
        </button>
      </div>
    </div>
  {/if}

  {#if !hidden && progress > 0 && progress < 100}
    <progress
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={progress}
      class="progress"
      bind:this={progressBar}
      max="100"
      value={progress}
    >
      {progress}%
    </progress>
  {/if}
</div>

<style>
	.drop-area {
		display: flex;
		flex-direction: column;
		border: 2px dashed #ccc;
		border-radius: 20px;
		width: 100%;
		min-width: 300px;
		max-width: 600px;
		padding: 1rem;
		justify-content: center;
		align-items: center;
		font-family: system-ui, sans-serif;
		color: #333;
		background: #fff;
		outline: none;
		transition: all 0.3s ease-in-out;
	}

	.drop-area:focus {
		box-shadow: 0 0 0 3px #007BFF;
	}

	.highlight {
		background-color: #f8f9fa;
		border-color: #007BFF;
	}

	.gallery {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		margin-top: 1rem;
		gap: 1rem;
	}

	.image-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #f8f9fa;
		border-radius: 12px;
		padding: 0.5rem 1rem;
		width: 100%;
	}

	.progress {
		width: 100%;
		height: 1rem;
		margin-top: 1rem;
	}

	.icon-button {
		background: #d32f2f;
		color: #fff;
		border-radius: 50%;
		border: none;
		padding: 6px;
		cursor: pointer;
	}

	.icon-button:hover {
		background: #b71c1c;
	}

	.files {
		display: none;
	}

	.button {
		text-decoration: underline;
		cursor: pointer;
		color: #007BFF;
	}

	img {
		height: 60px;
		border-radius: 8px;
	}

	.filename {
		margin: 0 1rem;
		flex-grow: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	/* Neumorphic variant */
	.drop-area.neumorphic {
		border: none;
		background: #e0e0e0;
		box-shadow:
			8px 8px 16px #bebebe,
			-8px -8px 16px #ffffff;
	}

	.drop-area.neumorphic.highlight {
		box-shadow:
			inset 8px 8px 16px #bebebe,
			inset -8px -8px 16px #ffffff;
	}

	.drop-area.neumorphic .image-container {
		background: #e0e0e0;
		box-shadow:
			4px 4px 10px #bebebe,
			-4px -4px 10px #ffffff;
	}

	.drop-area.neumorphic .progress {
		background: #e0e0e0;
		box-shadow:
			inset 4px 4px 8px #bebebe,
			inset -4px -4px 8px #ffffff;
		border-radius: 999px;
		overflow: hidden;
	}
</style>
