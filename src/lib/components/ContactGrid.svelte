<script lang="ts">
  import { MapPin, Phone, Mail } from '@lucide/svelte';
	import { stringify } from 'querystring';

  const contactItems = [
    {
      icon: MapPin,
      title: 'Address',
      lines: [{
        type: 'string',
        string: 'Newcastle, Australia.'
       },
       {
        type: 'string',
        string: 'Serving a Global Audience'
       }]
    },
    {
      icon: Phone,
      title: 'Phone',
      lines: [{
        type: 'string',
        string: 'Email for Phone Number'
      }]
    },
    {
      icon: Mail,
      title: 'Email',
      lines: [{
        type: 'html',
        string: '<a href="mailto:admin@3dsoundfx.com">admin@3dsoundfx.com</a>'
      }]
    },
  ];
</script>

{#snippet renderedLine(data: string)}
  {@html data}
{/snippet}

<section class="contact-grid">
  {#each contactItems as item}
    {@const Icon = item.icon}
    <div class="contact-box">
      <Icon size="32" stroke-width="1.5" color="oklch(0.662 0.141 193.12)" />
      <h2>{item.title}</h2>
      {#each item.lines as line}
        {#if line.type === 'string'}
          <p>{line.string}</p>
        {:else}
          <p>{@render renderedLine(line.string)}</p>
        {/if}
      {/each}
    </div>
  {/each}
</section>

<style>
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .contact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1px;
    border: 1px solid black;
    background: black;
    animation: fadeInUp 500ms ease-in-out both;
  }

  .contact-box {
    background: white;
    padding: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: oklch(0.2 0.02 260);
    transition: padding 300ms ease;
  }

  h2 {
    margin: 1rem 0 0.5rem;
    font-weight: 600;
    color: oklch(0.2 0.02 260);
  }

  p {
    margin: 0.25rem 0;
    color: oklch(0.2 0.02 260);
  }

  @media (max-width: 800px) {
    .contact-box {
      padding: 1.75rem;
    }
  }

  @media (max-width: 600px) {
    .contact-grid {
      grid-template-columns: 1fr 1fr;
    }
    .contact-box {
      padding: 1.5rem;
    }
  }

  @media (max-width: 400px) {
    .contact-grid {
      grid-template-columns: 1fr;
    }
    .contact-box {
      padding: 1.25rem;
    }
  }
</style>