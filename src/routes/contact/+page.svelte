<script lang="ts">
  import Lander from "$lib/components/Lander.svelte";

  let { first, last, email, message } = $state({ first: '', last: '', email: '', message: '' });
  let submitted = $state(false);

  function submitForm(e: Event) {
    e.preventDefault();
    submitted = true;
    // Submit logic goes here
  }
</script>

<Lander header="3D Sound FX" subheader="Contact" image="" position="center" />
<section class="contact-wrapper">
  <div class="contact-panel">
    <h2>Have a project in mind?</h2>

    {#if submitted}
      <p class="thank-you">Thanks for your message! I’ll get back to you soon.</p>
    {:else}
      <form onsubmit={submitForm}>
        <div class="row">
          <div class="input-group">
            <label for="first">First</label>
            <input id="first" type="text" bind:value={first} required />
          </div>

          <div class="input-group">
            <label for="last">Last</label>
            <input id="last" type="text" bind:value={last} required />
          </div>
        </div>

        <label for="email">Email</label>
        <input id="email" type="email" bind:value={email} required />

        <label for="message">Write a message</label>
        <textarea id="message" rows="5" bind:value={message} required></textarea>

        <button type="submit">Send</button>
      </form>
    {/if}
  </div>
</section>

<style>
  .contact-wrapper {
    padding: 4rem 1rem;
    display: flex;
    justify-content: center;
    background: none;
  }

  .contact-panel {
    width: 100%;
    max-width: 700px;
    padding: 2rem;
    background: oklch(0.97 0 260);
    border-radius: 1rem;
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
    font-family: 'Inter', sans-serif;
    color: oklch(0.18 0.01 260);
  }

  h2 {
    margin-bottom: 2rem;
    text-align: center;
  }

  .row {
    display: flex;
    gap: 1.5rem;
  }

  .input-group {
    flex: 1;
  }

  label {
    display: block;
    margin: 1.2rem 0 0.4rem;
    font-weight: 600;
  }

  input,
  textarea {
    width: 100%;
    border: 1px solid oklch(0.3 0.02 260 / 0.4);
    border-bottom: 2px solid oklch(0.3 0.02 260);
    background: oklch(255 0.01 1);
    padding: 0.5rem 0.75rem;
    color: oklch(0.3 0.02 260);
    border-radius: 4px;
    transition: border-color 150ms ease;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: oklch(0.7 0.2 260);
    border-bottom-color: oklch(0.7 0.2 260);
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }

  button {
    margin-top: 2rem;
    background: oklch(0.7 0.2 260);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 150ms ease;
  }

  button:hover {
    background: oklch(0.6 0.15 260);
  }

  .thank-you {
    text-align: center;
    margin-top: 2rem;
  }
</style>
