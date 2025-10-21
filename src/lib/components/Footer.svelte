<script lang="ts">
	let { isLoggedIn }: { isLoggedIn?: boolean } = $props();
	$inspect(isLoggedIn, 'props');
</script>

<div>
	<span>
		<div class="small">
			<ul>
				<li><a href={!isLoggedIn ? "/auth/login" : "/auth/logout"}>©</a> 3D Sound FX 2025</li>
				<li><a href="mailto:admin@3dsoundfx.com">admin@3dsoundfx.com</a></li>
				<li>ABN 57 464 019 656</li>
			</ul>
		</div>
	</span>
</div>

<style>
	div {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 3rem;
		background-color: oklch(21% 0.034 264.665);
	}
	span {
		color: oklch(0.985 0 0);
	}
	ul {
		display: flex;
		list-style: none;
		gap: 1.5rem;
		padding: 0;
		margin: 0;
	}
	li {
		margin: 0;
		font-family: 'Roboto', sans-serif;
		font-size: var(--fs-small);
		font-weight: 200;
	}
	a {
		color: oklch(0.985 0 0);
		text-decoration: none;
		transition:
			color 200ms ease,
			text-decoration 200ms ease;
	}
	a:hover {
		text-decoration: underline;
		color: oklch(0.95 0.1 280);
	}
	@media (max-width: 600px) {
		div {
			min-height: auto;
			height: auto;
			padding: 1rem 1rem;
		}
		ul {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			text-align: center;
		}
    li {
      margin: 0;
      font-size: var(--fs-small) !important;
      font-weight: 200;
    }
	}
</style>
