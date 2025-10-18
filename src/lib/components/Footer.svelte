<div>
	<span>
		<div class="small">
			<ul>
				<li>© 3D Sound FX <a href="/auth/login">2025</a></li>
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
		font-family: 'Roboto', sans-serif;
	}
	span {
		color: oklch(0.985 0 0);
	}
	ul {
		display: flex;
		list-style: none;
		font-size: var(--fs-small) !important;
		gap: 1.5rem;
		padding: 0;
		margin: 0;
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
