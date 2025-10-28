<script lang="ts">
  import { onMount } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import FileDropper from '$lib/components/FileDropper.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { generateImageWithThumb } from '$lib/utils/generateImageWithThumb';
	import { Cross } from '@lucide/svelte';
	import { selectedProject } from '$lib/utils/state';
	import type { SubmitFunction } from '@sveltejs/kit';

	let projectForm: HTMLFormElement | null = $state(null);
	let title: string = $state($selectedProject?.title || '');
	let description: string = $state($selectedProject?.description || '');
	let mediaUrl: string = $state($selectedProject?.mediaUrl || '');
	let submitting: boolean = $state(false);
	let file: File | null = $state(null);
	let featured: boolean = $state($selectedProject?.featured || false);

	let { onclickClose = () => {} } = $props();

	let modalEl: HTMLDivElement | null = $state(null);
	let previouslyFocused: HTMLElement | null = $state(null);

	function close() {
		onclickClose();
	}

	// --- ESC to close ---
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		previouslyFocused = document.activeElement as HTMLElement;

		// Focus first focusable element when modal opens
		setTimeout(() => {
			trapFocus(modalEl);
		}, 0);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
			previouslyFocused?.focus();
		};
	});

	// --- Focus Trap Implementation ---
	function trapFocus(container: HTMLElement | null) {
		if (!container) return;

		const focusableSelectors = [
			'a[href]',
			'button:not([disabled])',
			'textarea:not([disabled])',
			'input:not([disabled])',
			'select:not([disabled])',
			'[tabindex]:not([tabindex="-1"])'
		];
		const focusable = container.querySelectorAll<HTMLElement>(focusableSelectors.join(','));

		if (focusable.length) {
			focusable[0].focus();
		}

		function handleTrap(e: KeyboardEvent) {
			if (e.key !== 'Tab') return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];

			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}

		container.addEventListener('keydown', handleTrap);
	}

	// --- Form Enhancement (unchanged) ---
	function isVideoUrl(url: string): boolean {
		return /youtube\.com|youtu\.be|vimeo\.com/i.test(url);
	}

	const enhancement: SubmitFunction = async ({ cancel, formData }) => {
		submitting = true;

		if (mediaUrl && isVideoUrl(mediaUrl)) {
			formData.set('mediaUrl', mediaUrl);
		} else if (file && typeof file !== 'string') {
			try {
				const { fullBlob, thumbBlob, fullKey, thumbKey } = await generateImageWithThumb(file);

				const fullFile = new File([fullBlob], fullKey, { type: fullBlob.type });

				formData.set('mediaUrl', fullKey);
				formData.set('file_full', fullFile);
			} catch (err) {
				console.error('Image generation failed', err);
				submitting = false;
				cancel();
				return async () => {};
			}
		}

		if ($selectedProject?.projectId) {
			formData.set('projectId', $selectedProject.projectId);
		}

		return async ({ result }) => {
			await applyAction(result);

			if (result.type === 'success') {
				await invalidateAll();
				close();
			} else {
				console.error('Failed to save project');
			}

			submitting = false;
			cancel();
		};
	};
</script>

<!-- --- Modal + Focus Trap + Backdrop Click --- -->
<div class="modal-backdrop" onclick={close}>
	<div
		class="modal-content"
		role="dialog"
		aria-modal="true"
		aria-label={$selectedProject ? 'Edit Project' : 'Add Project'}
		onclick={(e) => e.stopPropagation()}
		bind:this={modalEl}
	>
		<header>
			<h2>{$selectedProject ? 'Edit Project' : 'Add Project'}</h2>
			<button class="close-btn" type="button" onclick={close}><Cross /></button>
		</header>

		{#if submitting}
			<Loader label={$selectedProject ? 'Updating Project...' : 'Creating Project...'} />
		{:else}
			<form
				bind:this={projectForm}
				method="POST"
				enctype="multipart/form-data"
				action={$selectedProject ? '?/updateProject' : '?/createProject'}
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

        <div class="media-inputs">
          <h3>Project Media</h3>

          {#if isVideoUrl(mediaUrl)}
            <!-- 🎥 Video input -->
            <label>
              Video URL (YouTube or Vimeo)
              <input
                type="url"
                name="mediaUrl"
                placeholder="https://youtu.be/... or https://vimeo.com/..."
                bind:value={mediaUrl}
              />
            </label>

            <p class="info-text">
              Detected video URL — this project will display a video.
            </p>

          {:else}
            <!-- 🖼 FileDropper -->
            <FileDropper
              bind:file
              previewUrl={mediaUrl || undefined}
              onremove={() => (mediaUrl = '')}
            />
          {/if}

          {#if !$selectedProject && !isVideoUrl(mediaUrl)}
            <!-- 🧠 Optional extra input for new projects -->
            <label>
              Or paste a Video URL (YouTube / Vimeo)
              <input
                type="url"
                name="mediaUrl"
                placeholder="https://youtu.be/... or https://vimeo.com/..."
                bind:value={mediaUrl}
              />
            </label>
          {/if}
        </div>

				<button type="submit">{$selectedProject ? 'Update' : 'Save'}</button>
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
		max-width: 520px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
		font-family: 'Inter', sans-serif;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
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
		padding: 0.6rem;
		font: inherit;
		border-radius: 0.5rem;
		border: 1px solid oklch(0.6 0.1 260);
		margin-top: 0.25rem;
		background: white;
		color: oklch(0.2 0.02 260);
	}

	.media-inputs {
		margin: 1.5rem 0;
		padding: 1rem;
		background: oklch(0.96 0.01 260 / 0.4);
		border-radius: 0.75rem;
	}

	.upload-label {
		margin: 0.5rem 0;
		font-size: 0.9rem;
		color: oklch(0.35 0.02 260);
	}

	.info-text {
		font-size: 0.9rem;
		color: oklch(0.35 0.02 260 / 0.9);
		margin-top: 0.25rem;
	}

	button[type='submit'] {
		background: oklch(0.7 0.2 260);
		color: white;
		padding: 0.75rem 1.5rem;
		margin-top: 1rem;
		font-weight: 600;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		width: 100%;
	}

	button[type='submit']:hover {
		background: oklch(0.6 0.2 260);
	}

	.checkbox-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
		font-weight: 500;
		color: oklch(0.25 0.02 260);
	}

	.checkbox-row input[type='checkbox'] {
		width: 1.2rem;
		height: 1.2rem;
		accent-color: oklch(0.7 0.2 260);
		cursor: pointer;
	}
</style>
