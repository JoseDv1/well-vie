<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	export let testimonials: {
		name: string;
		text: string;
	}[];
	let currentSlide = 0;
	let interval = 0;

	onMount(() => {
		interval = setInterval(() => {
			nextSlide();
		}, 5000);

		return () => {
			clearInterval(interval);
		};
	});

	const nextSlide = () => {
		currentSlide = (currentSlide + 1) % testimonials.length;
	};

	const goToSlide = (i: number) => {
		currentSlide = i;
		clearInterval(interval);
	};
</script>

<section>
	<div class="carousel">
		<h3>Testimonials</h3>
		{#each testimonials as testimonials, i}
			{#if i === currentSlide}
				<div in:fade={{ duration: 1000 }} class="test">
					<p>{testimonials.text}</p>
					<b>{testimonials.name}</b>
				</div>
			{/if}
		{/each}
	</div>

	<div class="carousel__indicators">
		{#each testimonials as image, i}
			{#if i === currentSlide}
				<button
					class="carousel__indicator carousel__indicator active"
					on:click={() => goToSlide(i)}
				></button>
			{:else}
				<button class="carousel__indicator" on:click={() => goToSlide(i)}
				></button>
			{/if}
		{/each}
	</div>
</section>

<style>
	section {
		margin-block: var(--section-gap);
		padding-block: 2rem;
		aspect-ratio: 16/4;
	}

	.carousel__indicators {
		display: flex;
		justify-content: center;
		gap: 1rem;
		position: absolute;
		bottom: 2rem;
		gap: 1rem;
		left: 0;
		right: 0;

		& > button {
			transition: background-color 0.3s;
			border-radius: 100%;
			outline: var(--bg-color) solid 1px;

			&:hover,
			&.active {
				background-color: var(--bg-color);
			}
		}
	}

	button {
		min-height: auto;
		min-width: auto;
		width: 24px;
		padding: 0;
		aspect-ratio: 1;
		background-color: var(--fg-color);
		color: var(--bg-color);
	}

	.test {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 1rem;
		margin: 2rem auto;
	}

	h3 {
		text-align: center;
		margin-bottom: 1rem;
		color: var(--bg-color);
	}

	p {
		color: var(--accent-color);
	}

	b {
		display: block;
		margin-top: 1rem;
		color: var(--bg-color);
	}

	.carousel {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 1rem;
		max-width: max(50%, 300px);
		margin: 0 auto;
	}
</style>
