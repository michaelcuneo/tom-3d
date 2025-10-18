<script lang="ts">
	import BurgerLink from './BurgerLink.svelte';
	import { page } from '$app/state';

	let svg: SVGSVGElement;
	let slide: HTMLDivElement;
	let isOpen = false;

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			handleClick();
		}
	};
	const handleKeyUp = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			handleClick();
		}
	};

	const handleClick = () => {
		isOpen = !isOpen;
	};
</script>

<div class="menu">
	<svg
		bind:this={svg}
		role="button"
		aria-label="Menu"
		tabindex="0"
		class:active={isOpen}
		class="ham hamRotate ham4"
		viewBox="0 0 100 100"
		width="80"
		onclick={handleClick}
		onkeypress={handleKeyDown}
		onkeyup={handleKeyUp}
		aria-expanded={isOpen}
		aria-controls="menu"
		aria-haspopup="true"
		aria-pressed={isOpen ? 'true' : 'false'}
		aria-labelledby="menu"
		aria-describedby="menu"
	>
		<path
			class="line top"
			d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20"
		/>
		<path class="line middle" d="m 70,50 h -40" />
		<path
			class="line bottom"
			d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20"
		/>
	</svg>
</div>

<button
	class="backdrop"
	class:visible={isOpen}
	onclick={() => (isOpen = false)}
	onkeydown={(event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			isOpen = false;
		}
	}}
	aria-label="Close menu"
></button>

<div class="slide" bind:this={slide} class:open={isOpen}>
	<ul class="nav">
		<li>
			<BurgerLink href="/" icon="home" label="Home" description="Return to the homepage" bind:isOpen />
		</li>
		<li>
			<BurgerLink href="/field-recording" icon="grass" label="Field Recording" description="Recording in the wild." bind:isOpen />
		</li>
		<li>
			<BurgerLink href="/location-recording" icon="mic" label="Location Recording" description="Recording in the studio." bind:isOpen />
		</li>
		<li>
			<BurgerLink href="/projects" icon="workspaces" label="Projects" description="Current Projects" bind:isOpen />
		</li>
		<li>
			<BurgerLink href="/contact" icon="touch_app" label="Contact" description="Work with me" bind:isOpen />
		</li>
	</ul>
</div>

<style>
	.menu {
		position: fixed;
		z-index: 100;
	}
	.ham {
		cursor: pointer;
		outline: none;
		width: 4rem;
		height: 4rem;
	}
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 98;
		background-color: oklch(0.2 0.02 260);
		backdrop-filter: blur(0px);
		opacity: 0;
		pointer-events: none;
		transition:
			backdrop-filter 0.3s ease,
			background-color 0.3s ease,
			opacity 0.3s ease;
		will-change: backdrop-filter, opacity;
	}
	.backdrop.visible {
		background-color: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(5px);
		opacity: 1;
		pointer-events: auto;
	}
	.slide {
		position: fixed;
		top: 0;
		right: 0;
		width: 100vw;
		height: 100vh;
		background-color: oklch(0.2 0.02 260);
		z-index: 99;
		transform: translateX(100%);
		transition: transform 0.3s ease-in-out;
		box-shadow: -4px 0 8px rgba(0, 0, 0, 0.3);
		overflow-y: auto;
	}
	@media (min-width: 768px) {
		.slide {
			width: 100vw;
			max-width: 100vw;
		}
	}
	@media (max-width: 768px) {
		.menu {
			top: 0.3rem; /* Adjust for smaller screens */
			right: 0.3rem; /* Adjust for smaller screens */
		}
		.slide {
			width: 100vw;
			max-width: 100vw;
		}
	}
	.slide.open {
		transform: translateX(0%);
	}
	.nav {
		list-style: none;
		padding-top: 5.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
