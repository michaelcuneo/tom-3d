<script lang="ts">
	import type { Snippet } from 'svelte';

	import 'reset.css';
	import 'sanitize.css';
	import 'sanitize.css/forms.css';
	import 'sanitize.css/typography.css';
	import 'sanitize.css/assets.css';
	import '@fontsource/changa-one';
	import '@fontsource/material-icons';
	import '@fontsource/roboto';

	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import Footer from '$lib/components/Footer.svelte';
	import Overlay from '$lib/components/Overlay.svelte';

	let {
		children,
		data
	}: {
		children?: Snippet;
		data?: {
			isLoggedIn: boolean;
		};
	} = $props();
</script>

<svelte:head>
	<!-- 🌐 Basic SEO -->
	<title>Thomas — Immersive & Surround Sound Recordist | Newcastle NSW</title>
	<meta name="description" content="Thomas is a sound recordist based in Newcastle, NSW, Australia. Specialising in immersive, surround, and location-based audio for film, live performance, and natural soundscapes." />
	<link rel="canonical" href="https://3dsoundfx.com/" />

	<!-- ✅ Open Graph (Facebook, LinkedIn, WhatsApp, etc.) -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://3dsoundfx.com/" />
	<meta property="og:site_name" content="3D Sound FX" />
	<meta property="og:title" content="Thomas — Immersive & Surround Sound Recordist | Newcastle NSW" />
	<meta property="og:description" content="Capturing the depth and realism of sound through immersive recording. Thomas works on natural soundscapes, live performances, and film scores throughout NSW." />
	<meta property="og:image" content="https://3dsoundfx.com/turntable.webp" />
	<meta property="og:image:secure_url" content="https://3dsoundfx.com/turntable.png" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Thomas recording immersive audio at a mixing console" />
	<meta property="fb:app_id" content="0" />

	<!-- 🐦 Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://3dsoundfx.com/" />
	<meta name="twitter:title" content="Thomas — Immersive & Surround Sound Recordist | Newcastle NSW" />
	<meta name="twitter:description" content="Immersive sound recordist capturing the atmosphere of place and performance. Based in Newcastle, serving Sydney & the Hunter region." />
	<meta name="twitter:image" content="https://3dsoundfx.com/turntable.png" />

	<!-- 🍏 Apple / iMessage -->
	<meta name="apple-mobile-web-app-title" content="3D Sound FX" />
	<meta name="format-detection" content="telephone=no" />

	<!-- 💬 WhatsApp -->
	<meta property="og:image" content="https://3dsoundfx.com/turntable.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- 🧩 Rich Preview Schema -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Person",
			"name": "Thomas",
			"jobTitle": "Sound Recordist",
			"url": "https://3dsoundfx.com/",
			"image": "https://3dsoundfx.com/turntable.png",
			"worksFor": {
				"@type": "Organization",
				"name": "3D Sound FX",
				"url": "https://3dsoundfx.com/"
			},
			"sameAs": [
				"https://www.facebook.com/",
				"https://www.instagram.com/",
				"https://www.linkedin.com/"
			],
			"address": {
				"@type": "PostalAddress",
				"addressLocality": "Newcastle",
				"addressRegion": "NSW",
				"addressCountry": "Australia"
			},
			"description": "Immersive and surround sound recordist based in Newcastle, specialising in natural soundscapes, live performances, and film score recording."
		}
	</script>

	<!-- 🔍 Additional SEO -->
	<meta name="robots" content="index, follow" />
	<meta name="keywords" content="sound recordist, immersive audio, surround sound, field recording, film sound, natural soundscapes, live performances, Newcastle, Sydney, Hunter Valley, NSW, Australia" />
	<meta name="author" content="Thomas - 3D Sound FX" />
	<meta name="theme-color" content="#111111" />
</svelte:head>

<div class="root app-content">
	<Overlay />
	<Header />
	<div class="main">
		{@render children?.()}
	</div>
	<Footer isLoggedIn={data?.isLoggedIn} />
</div>

<style>
	.root {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		height: 100%;
	}
	.main {
		flex-grow: 1;
	}
</style>
