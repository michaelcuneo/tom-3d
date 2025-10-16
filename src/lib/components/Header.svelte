<script lang="ts">
	import threedS from '$lib/assets/3Ds.svg';
	import BurgerMenu from './BurgerMenu.svelte';
</script>

<header class="animated-header">
	<img src={threedS} alt="3d-s logo" class="logo fade-up" />
	<span class="heading fade-up delay-1">3D SOUND FX</span>
	<hr class="divider fade-up delay-2" />

	<!-- Desktop Nav -->
	<ul class="fade-up desktop-nav delay-3">
		<li><a href="/">Home</a></li>
		<li><a href="/field-recording">Field Recording</a></li>
		<li><a href="/location-recording">Location Recording</a></li>
		<li><a href="/projects">Projects</a></li>
		<li><a href="/contact">Contact</a></li>
	</ul>

	<!-- Mobile Burger Menu -->
	<div class="mobile-nav">
		<BurgerMenu />
	</div>
</header>

<style>
	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.fade-up {
		opacity: 0;
		animation: fadeUp 250ms ease-out forwards;
	}

	.delay-1 {
		animation-delay: 50ms;
	}

	.delay-2 {
		animation-delay: 100ms;
	}

	.delay-3 {
		animation-delay: 150ms;
	}

	.animated-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		height: 210px;
		background-color: oklch(0.141 0.005 285.823);
		animation: fadeUp 250ms ease-out;
		position: relative;
		border-bottom: 1px solid oklch(0.967 0.001 286.375);
		box-shadow:
			0 4px 6px -2px rgba(0, 0, 0, 0.5),
			0 8px 20px -4px rgba(0, 0, 0, 0.35),
			inset 0 -1px 0 rgba(255, 255, 255, 0.06);
	}

	.logo {
		height: 95px;
		margin: 0;
		padding: 0;
	}

	.heading {
		color: oklch(0.967 0.001 286.375);
		font-family: 'Changa One', sans-serif;
		margin: 0;
	}

	.divider {
		width: 100%;
		border: 0;
		height: 1px;
		background: oklch(0.967 0.001 286.375);
		margin: 0;
	}

	ul.desktop-nav {
		display: flex;
		gap: 4rem;
		height: 80px;
		list-style: none;
		text-transform: uppercase;
		font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
		font-weight: 600;
		padding: 0;
		margin: 0;
	}

	a {
		text-decoration: none;
		font-weight: 700;
		color: oklch(0.967 0.001 286.375);
		transition:
			color 200ms ease,
			text-decoration 200ms ease;
	}

	a:hover {
		text-decoration: underline;
		color: oklch(0.95 0.1 280);
	}

	.mobile-nav {
		display: none;
	}

	@media (max-width: 1024px) {
		.animated-header {
			flex-direction: row;
			align-items: center;
			height: auto;
		}
		.logo {
			height: 35px;
			margin: 1rem 1rem 1rem 1rem;
		}
		hr {
			display: none;
		}
		ul.desktop-nav {
			display: none;
		}
		.mobile-nav {
			display: block;
			position: absolute;
			top: 1rem;
			right: 1rem;
		}
	}
</style>
