<script lang="ts">
  import ThreeDSFX from '$lib/assets/3DSoundFX_Logo.svg';
  import ThreeDSFX_2 from '$lib/assets/3DSoundFX_Logo_2.svg';
	import BurgerMenu from '$lib/components/BurgerMenu.svelte';
</script>

<header class="animated-header">
	<img src={ThreeDSFX} alt="3d-s logo" class="logo fade-up" />
  <img src={ThreeDSFX_2} alt="3d-s logo" class="mobile-logo fade-up delay-2" />
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
		height: 190px;
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
		margin: 1rem 0rem 0rem 0rem;
		padding: 0;
	}
  .mobile-logo {
    display: none;
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
		height: 45px;
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
      min-height: 72px;
      height: 190px;
			flex-direction: row;
			align-items: center;
		}
		.logo {
      display: none;
		}
    .mobile-logo {
      display: block;
      margin: 1.2rem;
      height: 25px;
    }
		hr {
			display: none;
		}
		ul.desktop-nav {
			display: none;
		}
		.mobile-nav {
			display: block;
		}
	}
</style>
