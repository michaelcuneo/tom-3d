<script lang="ts">
	let {
		files = $bindable([]),
		multiple = false,
		variant = 'standard',
		label = `file-dropper-label-${Math.random().toString(36).substring(2, 15)}`
	}: {
		files?: FileArray[];
		multiple?: boolean;
		variant?: 'standard' | 'neumorphic';
		label?: string;
	} = $props();

	let dropArea: HTMLElement | undefined = $state();
	let progressBar: HTMLElement | undefined = $state();
	let gallery: HTMLElement | undefined = $state();

	let progress = $state(0);
	let highlight = $state(false);

	let allFiles: File[] = $state<File[]>([]);
	let srcFiles: FileArray[] = $state<FileArray[]>([]);

	let filesDone = $state(0);
	let filesToDo = $state(0);

	let hidden = $derived(() => filesDone === filesToDo && filesToDo !== 0);

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
		if (files) {
			processFiles(files);
			highlight = false;
		}
	};

	const handleFiles = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const files = input.files;
		if (files && files.length) {
			processFiles(files);
		}
	};

	const processFiles = (files: FileList) => {
		allFiles = Array.from(files);
		filesToDo = files.length;
		filesDone = 0;
		[...files].forEach((file) => {
			previewFile(file);
		});
	};

	const previewFile = (file: File) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			srcFiles.push({
				name: file.name,
				src: reader.result as string
			});
			updateProgress();
		};
	};

	const updateProgress = () => {
		filesDone++;
		progress = Math.floor((filesDone / filesToDo) * 100);
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
	<p id={label} class="drop-instructions">
		Drag and drop your image files here or
		<label class="button" for="files">browse</label>.
	</p>

	<input
		type="file"
		class="files"
		id="files"
		aria-labelledby={label}
		{multiple}
		accept="image/*"
		onchange={handleFiles}
	/>

	<div class="gallery" bind:this={gallery} role="list" aria-label="Uploaded file previews">
		{#each srcFiles as file}
			<div class="image-container" role="listitem">
				<img src={file.src} alt={`Preview of ${file.name}`} />
				<p class="filename">{file.name}</p>
				<button
					class="icon-button"
					type="button"
					aria-label={`Remove ${file.name}`}
					onclick={() => (srcFiles = srcFiles.filter((src) => src !== file))}
				>
					<span aria-hidden="true" class="material-icons">cancel</span>
				</button>
			</div>
		{/each}
	</div>

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
		border: 2px dashed var(--color-outline);
		border-radius: 20px;
		width: 100%;
		min-width: 300px;
		max-width: 600px;
		padding: 1rem;
		justify-content: center;
		align-items: center;
		font-family: system-ui, sans-serif;
		color: var(--color-text);
		background: var(--color-background);
		outline: none;
		transition: all 0.3s ease-in-out;
	}

	.drop-area:focus {
		box-shadow: 0 0 0 3px var(--color-focus);
	}

	.highlight {
		background-color: var(--color-surface);
		border-color: var(--color-accent);
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
		background: var(--color-surface);
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
		background: var(--color-danger);
		color: var(--color-background);
		border-radius: 50%;
		border: none;
		padding: 6px;
		cursor: pointer;
	}

	.icon-button:hover {
		background: var(--color-danger-hover);
	}

	.files {
		display: none;
	}

	.button {
		text-decoration: underline;
		cursor: pointer;
		color: var(--color-accent);
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

	/* Neumorphic variant using your vars */
	.drop-area.neumorphic {
		border: none;
		background: var(--background-color);
		box-shadow:
			8px 8px 16px var(--neumorphism-shadow),
			-8px -8px 16px var(--neumorphism-highlight);
	}

	.drop-area.neumorphic.highlight {
		box-shadow:
			inset 8px 8px 16px var(--neumorphism-shadow-active),
			inset -8px -8px 16px var(--neumorphism-highlight-active);
	}

	.drop-area.neumorphic .image-container {
		background: var(--background-color);
		box-shadow:
			4px 4px 10px var(--neumorphism-shadow),
			-4px -4px 10px var(--neumorphism-highlight);
	}

	.drop-area.neumorphic .progress {
		background: var(--background-color);
		box-shadow:
			inset 4px 4px 8px var(--neumorphism-shadow),
			inset -4px -4px 8px var(--neumorphism-highlight);
		border-radius: 999px;
		overflow: hidden;
	}
</style>
