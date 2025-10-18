<script lang="ts">
  let {
    href = '',
    label = '',
    icon = '',
    description = '',
    isOpen = $bindable(false)
  }: {
    href?: string;
    label?: string;
    icon?: string;
    description?: string;
    isOpen?: boolean;
  } = $props();
</script>

<a
  href={href}
  class="link"
  aria-label={`${label} - ${description}`}
  onclick={() => (isOpen = false)}
>
  {#if icon}
    <span class="pre material-icons">{icon}</span>
  {/if}

  <div class="content">
    <span class="primary">{label}</span>
    <span class="secondary">{description}</span>
  </div>

  <span class="arrow material-icons">arrow_forward</span>
</a>
<style>
.link {
  display: flex;
  align-items: center; /* This vertically centers the whole row */
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 1rem;
  height: 4rem;
  color: oklch(0.85 0.01 260);
  text-decoration: none;
  overflow: hidden;
  transition: background-color 0.3s ease, height 0.3s ease;
}

.link .pre {
  font-size: var(--fs-h2);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  transform: translateY(-0.75rem);
  transition: transform 0.3s ease;
}

.link .content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  min-width: 0;
  overflow: hidden;
}

.link .primary {
  font-size: var(--fs-h2);
	font-family: 'Changa One', sans-serif;
  text-transform: uppercase;
  line-height: 1; /* Helps with vertical centering */
}

.link .secondary {
  font-size: var(--fs-h4);
  font-family: 'Roboto', sans-serif;
  color: var(--color-accent);
  opacity: 0;
  transform: translateY(-0.5rem);
  transition: opacity 0.3s ease, transform 0.3s ease;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

/* Icon arrow */
.link .arrow {
  flex-shrink: 0;
  color: var(--color-accent);
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
}

/* Hover effects */
.link:hover {
  background-color: oklch(0.662 0.141 193.12);
  height: 5.5rem;
}

.link:hover .secondary {
  opacity: 1;
  transform: translateY(0);
}

.link:hover .pre {
  transform: translateY(0);
}

.link:hover .arrow {
  opacity: 1;
  transform: translateX(0.25rem);
}
</style>
