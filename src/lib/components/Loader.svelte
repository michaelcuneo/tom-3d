<script>
	let { size = 32, label = 'Loading…' } = $props();
</script>

<div
	aria-label={label}
	role="status"
	class="loader"
	style="width: {size}px; height: {size}px"
></div>

<style>
	.loader {
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-top-color: #444;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
