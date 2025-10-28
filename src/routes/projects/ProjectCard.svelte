<script lang="ts">
	import { SquarePen, Delete, X } from '@lucide/svelte';
  import captain from '$lib/assets/captain.webp';
  import LightBox from '$lib/components/LightBox.svelte';

	let {
		title = '',
		description = '',
		mediaUrl = '', // image, YouTube, or Vimeo URL
		isAddCard = false,
		isLoggedIn = false,
		onclick = () => {},
		onclickEdit = () => {},
		onclickDelete = () => {}
	}: {
		title?: string;
		description?: string;
		mediaUrl?: string;
		isAddCard?: boolean;
		isLoggedIn?: boolean;
		onclick?(): void;
		onclickEdit?(): void;
		onclickDelete?(): void;
	} = $props();

  console.log('ProjectCard imageUrl:', mediaUrl);

	let showLightbox = $state(false);
	let thumbnail = $state('');
	let videoType: 'youtube' | 'vimeo' | 'image' | null = $state(null);
	let videoId = $state('');

	function detectType(url: string): 'youtube' | 'vimeo' | 'image' | null {
		if (!url) return null;
		if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
		if (/vimeo\.com/.test(url)) return 'vimeo';
		if (/\.(jpg|jpeg|png|gif|webp|avif)$/i.test(url)) return 'image';
		return 'image';
	}

	function getVideoId(url: string) {
		const ytMatch = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
		const vmMatch = url.match(/vimeo\.com\/(\d+)/);
		return ytMatch?.[1] || vmMatch?.[1] || '';
	}

	async function loadThumbnail(url: string) {
		if (!url) return (thumbnail = '');

		videoType = detectType(url);
		if (videoType === 'image') {
			thumbnail = url;
			return;
		}

		if (videoType === 'youtube') {
			videoId = getVideoId(url);
			thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
			return;
		}

		if (videoType === 'vimeo') {
			videoId = getVideoId(url);
			if (!videoId) return;
			try {
				const res = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
				const data = await res.json();
				thumbnail = data?.[0]?.thumbnail_large || '';
			} catch {
				thumbnail = '';
			}
		}
	}

	$effect(() => {
		if (mediaUrl) loadThumbnail(mediaUrl);
	});

	function handleCardClick() {
		if (!isAddCard && mediaUrl) {
			showLightbox = true;
			document.body.style.overflow = 'hidden';
		}
	}

	function closeLightbox() {
		showLightbox = false;
		document.body.style.overflow = '';
	}
</script>

{#if isAddCard}
	<div class="project-card-wrapper">
	  <div class="project-card" role="button" tabindex="0" onclick={onclick} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') onclick(); }}>
      <img class="media-thumb" src={captain} alt="Add Project" />
      <div class="overlay">
        <h3>+ Add Project</h3>
        <p>Create a new project entry</p>
      </div>
    </div>
	</div>
{:else}
	<div class="project-card-wrapper">
		<div class="project-card" role="button" tabindex="0" onclick={handleCardClick} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}>
			{#if thumbnail}
				<img class="media-thumb" src={thumbnail} alt={title} />
			{/if}

			{#if videoType === 'youtube' || videoType === 'vimeo'}
				<div class="play-icon">▶</div>
			{/if}

			<div class="overlay">
				<h3>{title}</h3>
				<p>{description}</p>
			</div>

			{#if isLoggedIn}
				<div class="card-actions">
          <!--
					<button class="icon-btn edit" onclick={(e) => { e.stopPropagation(); onclickEdit(); }} title="Edit">
						<SquarePen size="18" />
					</button>
          -->
					<button class="icon-btn delete" onclick={(e) => { e.stopPropagation(); onclickDelete(); }} title="Delete">
						<Delete size="18" />
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

{#if showLightbox}
  <LightBox
    onClose={closeLightbox}
    show={showLightbox}
    title={title}
    description={description}
    videoType={videoType}
    videoId={videoId}
    imageUrl={videoType === 'image' ? mediaUrl : ''}
  />
{/if}

<style>
  /* make each card fill its grid cell */
.project-card-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
}
.project-card {
	width: clamp(260px, 23vw, 320px);
	aspect-ratio: 1 / 1;
	border-radius: 1rem;
	position: relative;
	overflow: hidden;
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	font-family: 'Inter', sans-serif;
	cursor: pointer;
	background: oklch(0.15 0.02 260);
}

.project-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 10px 26px rgba(0, 0, 0, 0.25);
}

/* ✅ Thumbnail */
.media-thumb {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover; /* keep 1:1 square fill */
	object-position: center;
	border-radius: inherit;
	transition: transform 0.3s ease;
	background: oklch(0.2 0 260);
	z-index: 1;
}

/* ✅ Overlay Text */
.overlay {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	padding: 1rem;
	background: linear-gradient(to top, oklch(0.1 0 260 / 0.75), transparent 70%);
	color: oklch(0.97 0 260);
	z-index: 2;
}

h3 {
	margin: 0;
	font-size: clamp(1rem, 0.9vw + 0.6rem, 1.3rem);
	font-weight: 600;
	line-height: 1.2;
	text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}

p {
	margin-top: 0.3rem;
	font-size: clamp(0.8rem, 0.5vw + 0.4rem, 0.95rem);
	line-height: 1.4;
	color: oklch(0.9 0.02 260 / 0.9);
}

/* ✅ Action Buttons */
.card-actions {
	position: absolute;
	top: 0.6rem;
	right: 0.6rem;
	display: flex;
	gap: 0.4rem;
	z-index: 3;
}

.icon-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	border: none;
	cursor: pointer;
	background: rgba(0, 0, 0, 0.5);
	color: white;
	backdrop-filter: blur(6px);
	transition: background 0.2s ease, transform 0.2s ease;
}

.icon-btn:hover {
	transform: scale(1.05);
}

.icon-btn.edit:hover {
	background: oklch(0.65 0.15 260);
}

.icon-btn.delete:hover {
	background: oklch(0.65 0.18 30);
}

/* ✅ Play Icon */
.play-icon {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 2.8rem;
	color: white;
	background: rgba(0, 0, 0, 0.5);
	width: 64px;
	height: 64px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	z-index: 2;
	transition: background 0.3s ease, transform 0.2s ease;
}

.project-card:hover .play-icon {
	background: rgba(0, 0, 0, 0.7);
	transform: translate(-50%, -50%) scale(1.05);
}

/* ✅ Lightbox ("lightframe") */
/* ✅ Ensure cards align flush along the bottom of their row */
</style>
