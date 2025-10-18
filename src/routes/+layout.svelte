<script lang="ts">
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

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="root app-content">
	<Overlay />
	<Header />
	<div class="main">
		{@render children?.()}
	</div>
	<Footer />
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
