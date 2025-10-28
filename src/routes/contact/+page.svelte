<script lang="ts">
	import Lander from '$lib/components/Lander.svelte';
	import { enhance } from '$app/forms';

	let { 
		first,
		last,
		email,
		message
	} = $state({
		first: '',
		last: '',
		email: '',
		message: ''
	});
	let submitted = $state(false);

	// Enhance form submission
	const handleEnhance = () => {
		return async ({ result }: { result: { type: string } }) => {
			if (result.type === 'success') {
				submitted = true;

				setTimeout(() => {
					submitted = false;
					first = last = email = message = '';
				}, 5000);
			}
		};
	};
</script>

<Lander header="3D Sound FX" subheader="Contact" image="" position="center" short={true} />

<section class="contact-wrapper">
	<div class="contact-panel">
		<h2>Have a project in mind?</h2>

		{#if submitted}
			<div class="thank-you fade-in">
				<div class="checkmark-wrapper">
					<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
						<circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
						<path class="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
					</svg>
				</div>
				<h3>Thanks for your message! 🎉</h3>
				<p>I’ll get back to you soon.</p>
			</div>
		{:else}
			<form action="?/contact" method="POST" use:enhance={handleEnhance} class="fade-in">
				<div class="row">
					<div class="input-group">
						<input name="first" id="first" type="text" bind:value={first} required />
						<label for="first">First</label>
					</div>

					<div class="input-group">
						<input name="last" id="last" type="text" bind:value={last} required />
						<label for="last">Last</label>
					</div>
				</div>

				<div class="input-group full">
					<input name="email" id="email" type="email" bind:value={email} required />
					<label for="email">Email</label>
				</div>

				<div class="input-group full">
					<textarea name="message" id="message" rows="5" bind:value={message} required></textarea>
					<label for="message">Write a message</label>
				</div>

				<button type="submit" class="submit-btn">Send Message</button>
			</form>
		{/if}
	</div>
</section>

<style>
	.contact-wrapper {
		padding: 4rem 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 80vh;
	}

	.contact-panel {
		width: 100%;
		max-width: 720px;
		padding: 2.5rem 3rem;
		background: rgba(255, 255, 255, 0.75);
		backdrop-filter: blur(16px) saturate(1.3);
		border-radius: 1.25rem;
		box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
		color: oklch(0.2 0.01 260);
		font-family: 'Inter', 'Roboto', sans-serif;
		transition: all 0.3s ease;
	}

	h2 {
		margin-bottom: 2rem;
		text-align: center;
		font-weight: 600;
		font-size: 1.8rem;
		color: oklch(0.25 0.02 260);
	}

	.row {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.input-group {
		position: relative;
		flex: 1;
		margin-top: 1.5rem;
	}

	.input-group.full {
		width: 100%;
	}

	input,
	textarea {
		width: 100%;
		padding: 1rem 0.75rem 0.25rem;
		font-size: 1rem;
		background: none;
		border: none;
		border-bottom: 2px solid oklch(0.65 0.05 260 / 0.3);
		color: oklch(0.25 0.02 260);
		outline: none;
		transition: all 0.25s ease;
	}

	input:focus,
	textarea:focus {
		border-bottom-color: oklch(0.7 0.2 260);
	}

	label {
		position: absolute;
		left: 0.75rem;
		top: 1rem;
		font-size: 1rem;
		color: oklch(0.4 0.02 260 / 0.7);
		pointer-events: none;
		transition: all 0.2s ease;
	}

	input:focus + label,
	input:valid + label,
	textarea:focus + label,
	textarea:valid + label {
		top: -0.5rem;
		font-size: 0.85rem;
		color: oklch(0.7 0.2 260);
	}

	textarea {
		resize: vertical;
		min-height: 130px;
	}

	.submit-btn {
		margin-top: 2.5rem;
		display: block;
		width: 100%;
		background: linear-gradient(135deg, oklch(0.65 0.18 270), oklch(0.6 0.16 250));
		color: white;
		border: none;
		padding: 0.9rem 1.5rem;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 600;
		font-size: 1.1rem;
		box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
		transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.3s ease;
	}

	.submit-btn:hover {
		background: linear-gradient(135deg, oklch(0.6 0.16 250), oklch(0.65 0.18 270));
		box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
		transform: translateY(-2px);
	}

	.thank-you {
		text-align: center;
		padding: 3rem 1rem;
	}

	.thank-you h3 {
		font-size: 1.8rem;
		color: oklch(0.3 0.02 260);
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.thank-you p {
		color: oklch(0.35 0.02 260 / 0.8);
		font-size: 1.1rem;
	}

	/* ✅ Fade in animation */
	.fade-in {
		opacity: 0;
		animation: fadeIn 0.4s ease forwards;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ✅ Checkmark animation */
	.checkmark-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.checkmark {
		width: 72px;
		height: 72px;
		stroke-width: 3;
		stroke: oklch(0.7 0.2 260);
		stroke-miterlimit: 10;
		box-shadow: inset 0px 0px 0px oklch(0.7 0.2 260);
		border-radius: 50%;
		display: block;
		margin: 0 auto;
	}

	.checkmark-circle {
		stroke-dasharray: 166;
		stroke-dashoffset: 166;
		stroke-width: 2;
		stroke-miterlimit: 10;
		stroke: oklch(0.7 0.2 260);
		fill: none;
		animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
	}

	.checkmark-check {
		transform-origin: 50% 50%;
		stroke-dasharray: 48;
		stroke-dashoffset: 48;
		animation: stroke 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
	}

	@keyframes stroke {
		100% {
			stroke-dashoffset: 0;
		}
	}
</style>
