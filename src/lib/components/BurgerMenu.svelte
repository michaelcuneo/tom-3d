<script lang="ts">
  import { afterNavigate } from '$app/navigation';

  let open = $state(false);
  let menuEl: HTMLElement;

  // lock scroll + trap focus when open
  $effect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      menuEl?.querySelector('a')?.focus();
    } else {
      document.body.style.overflow = '';
    }
  });

  function trapFocus(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    const focusables = [...menuEl.querySelectorAll('a')];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      (last as HTMLElement)?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      (first as HTMLElement)?.focus();
    }
  }
</script>

<!-- Burger -->
<button class="burger" aria-label="Toggle menu" onclick={() => open = !open}>
  <div class:open-bar={open}></div>
  <div class:open-bar={open}></div>
  <div class:open-bar={open}></div>
</button>

<!-- Sliding Menu -->
<aside
  class="menu {open ? 'menu-open' : ''}"
  bind:this={menuEl}
  aria-hidden={!open}
  tabindex="-1"
  onkeydown={trapFocus}
>
  <nav>
    <ul>
      <li><a href="/" onclick={() => open = false}>Home</a></li>
      <li><a href="/field-recording" onclick={() => open = false}>Field Recording</a></li>
      <li><a href="/location-recording" onclick={() => open = false}>Location Recording</a></li>
      <li><a href="/projects" onclick={() => open = false}>Projects</a></li>
      <li><a href="/contact" onclick={() => open = false}>Contact</a></li>
    </ul>
  </nav>
</aside>

<style>
  .burger {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 999;
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .burger div {
    width: 100%;
    height: 3px;
    background: var(--text-light);
    transition: transform 200ms ease, opacity 200ms ease;
  }

  .burger div.open-bar:nth-child(1) {
    transform: rotate(45deg) translate(4px, 4px);
  }

  .burger div.open-bar:nth-child(2) {
    opacity: 0;
  }

  .burger div.open-bar:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }

  .menu {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
    background: oklch(0.12 0.02 285);
    box-shadow: -4px 0 16px rgba(0, 0, 0, 0.2);
    transform: translateX(100%);
    transition: transform 300ms ease-out;
    padding: 2rem;
    z-index: 998;
    display: flex;
    flex-direction: column;
    justify-content: center;
    outline: none;
  }

  .menu.menu-open {
    transform: translateX(0);
  }

  nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  nav a {
    color: var(--text-light);
    text-decoration: none;
    text-transform: uppercase;
    transition: color 150ms;
  }

  nav a:hover {
    color: var(--accent);
  }
</style>
