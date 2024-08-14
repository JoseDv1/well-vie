<script>
	export let text;
	export let name;
</script>

<section>
	<p>{text}</p>
	<b>{name}</b>
</section>

<style>
	section {
		margin-block: var(--section-gap);
		background-color: var(--fg-color);
		padding: 2rem;
		border-radius: var(--border-radius);
	}

	p {
		color: var(--accent-color);
	}

	b {
		display: block;
		margin-top: 1rem;
		color: var(--bg-color);
	}
</style>
