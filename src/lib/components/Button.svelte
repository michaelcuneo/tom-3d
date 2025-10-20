<script lang="ts">
  import { onMount } from 'svelte';

  let {
    onclick = () => {},
    label = 'Download 3D Sound FX',
    icon = '⬇️',
    variant = 'primary'  // you can add more variants if you like
  }: {
    onclick?: () => void;
    label?: string;
    icon?: string;
    variant?: 'primary' | 'alt';
  } = $props();

  let isPressed = false;

  function handleMouseDown() {
    isPressed = true;
  }
  function handleMouseUp() {
    isPressed = false;
  }
</script>

<button
  class="download-btn {variant} {isPressed ? 'pressed' : ''}"
  onclick={onclick}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  onmouseleave={handleMouseUp}
  aria-label={label}
>
  <span class="icon">{icon}</span>
  <span class="text">{label}</span>
</button>

<style>
  :global(:root) {
    /* Colors for variant; adjust as needed */
    --btn-bg-start: oklch(0.18 0.12 260);
    --btn-bg-end:   oklch(0.28 0.16 260);
    --btn-text:     oklch(0.98 0.01 260);
    --btn-shadow:   rgba(0, 0, 0, 0.35);
    --btn-gloss:    rgba(255, 255, 255, 0.15);
  }

  .download-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 1.1rem 2.2rem;
    font-family: 'Inter', sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--btn-text);
    background: linear-gradient(145deg, var(--btn-bg-start), var(--btn-bg-end));
    border: none;
    border-radius: 0.8rem;
    cursor: pointer;
    overflow: hidden;
    transition: transform 150ms ease, box-shadow 200ms ease;
    box-shadow:
      inset 0 -2px 6px rgba(0,0,0,0.4),
      0 6px 12px var(--btn-shadow),
      0 10px 20px var(--btn-shadow);
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  }

  .download-btn .icon {
    margin-right: 0.6rem;
    font-size: 1.4rem;
    display: inline-flex;
    align-items: center;
  }

  .download-btn::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(to bottom, var(--btn-gloss), transparent);
    pointer-events: none;
  }

  .download-btn:hover {
    transform: translateY(-2px);
    box-shadow:
      inset 0 -2px 6px rgba(0,0,0,0.45),
      0 10px 22px var(--btn-shadow),
      0 16px 32px var(--btn-shadow);
  }

  .download-btn.pressed {
    transform: translateY(0);
    box-shadow:
      inset 0 2px 6px rgba(0,0,0,0.5),
      0 4px 8px rgba(0,0,0,0.3);
  }

  /* Alt variant (optional) */
  .download-btn.alt {
    --btn-bg-start: oklch(0.22 0.14 40);
    --btn-bg-end:   oklch(0.32 0.18 40);
    /* You can override other variables if needed for a secondary style */
  }
</style>
