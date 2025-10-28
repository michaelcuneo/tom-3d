<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { X } from 'lucide-svelte';

	let {
		show = $bindable(false),
		title = '',
		description = '',
		videoType = null,
		videoId = '',
		imageUrl = '',
		onClose = () => {}
	}: {
		show: boolean;
		title: string;
		description?: string;
		videoType: 'youtube' | 'vimeo' | 'image' | null;
		videoId?: string;
		imageUrl?: string;
		onClose(): void;
	} = $props();

	let dialogEl: HTMLDivElement | null = $state(null);
	let previouslyFocused: HTMLElement | null = $state(null);

	onMount(() => {
		if (show) {
			previouslyFocused = document.activeElement as HTMLElement;
			dialogEl?.focus();
			document.body.style.overflow = 'hidden';
		}
	});

	onDestroy(() => {
		document.body.style.overflow = '';
		previouslyFocused?.focus();
	});
</script>

{#if show}
	<div
		class="lightbox"
		role="dialog"
		aria-modal="true"
		aria-label={title}
		tabindex="-1"
		bind:this={dialogEl}
		onkeydown={(e) => e.key === 'Escape' && onClose()}
	>
		<button
			type="button"
			class="lightbox-backdrop"
			onclick={onClose}
			aria-label="Close lightbox"
			tabindex="-1"
		></button>

		<div class="lightbox-content" role="application" onclick={(e) => e.stopPropagation()}>
			<button class="close-btn" onclick={onClose} title="Close lightbox">
				<X size="28" />
			</button>

			{#if videoType === 'youtube'}
				<iframe
					src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
					title={title}
					allow="autoplay; encrypted-media"
					allowfullscreen
				></iframe>
			{:else if videoType === 'vimeo'}
				<iframe
					src={`https://player.vimeo.com/video/${videoId}?autoplay=1`}
					title={title}
					allow="autoplay; fullscreen; picture-in-picture"
					allowfullscreen
				></iframe>
			{:else if videoType === 'image'}
				<img src={imageUrl} alt={title} />
			{/if}

			<div class="lightbox-caption">
				<h3>{title}</h3>
				<p>{description}</p>
			</div>
		</div>
	</div>
{/if}

<style>
	/* --- YOUR CSS (kept exactly as provided) --- */
	.lightbox {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.85);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		backdrop-filter: blur(10px);
	}

	.lightbox-content {
		position: relative;
		width: 80%;
		max-width: 960px;
		max-height: 90vh;
		border-radius: 1rem;
		background: black;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
	}

	iframe,
	.lightbox img {
		width: 100%;
		height: auto;
		aspect-ratio: 16/9;
		object-fit: contain;
	}

	.lightbox-caption {
		color: white;
		padding: 1rem;
		text-align: center;
	}

	.close-btn {
		position: absolute;
		top: 0.6rem;
		right: 0.6rem;
		background: rgba(0, 0, 0, 0.4);
		border: none;
		border-radius: 50%;
		padding: 0.3rem;
		color: white;
		cursor: pointer;
		backdrop-filter: blur(6px);
		transition: background 0.2s ease;
		z-index: 5;
	}

	.close-btn:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	/* --- Added small addition for backdrop button --- */
	.lightbox-backdrop {
		all: unset;
		position: absolute;
		inset: 0;
		cursor: pointer;
	}
</style>
