<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import Arrow from "@/assets/arrow.svg?raw";

	export let images: string[] = [];
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
		currentSlide = (currentSlide + 1) % images.length;
		clearInterval(interval);
	};

	const prevSlide = () => {
		currentSlide = (currentSlide - 1 + images.length) % images.length;
		clearInterval(interval);
	};

	const goToSlide = (i: number) => {
		currentSlide = i;
		clearInterval(interval);
	};
</script>

<section>
	<div class="carousel">
		{#each images as image, i}
			{#if i === currentSlide}
				<img
					src={image}
					alt={`Slide ${i + 1}`}
					in:fade={{
						duration: 1000,
					}}
				/>
			{/if}
		{/each}

		<div class="carousel__controls">
			<button on:click={() => prevSlide()}>
				{@html Arrow}
			</button>
			<button on:click={() => nextSlide()}>{@html Arrow}</button>
		</div>
	</div>

	<div class="carousel__indicators">
		{#each images as image, i}
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
		aspect-ratio: 16 / 9;
		border-radius: var(--border-radius);
	}

	img {
		width: 1200px;
		aspect-ratio: 16 / 9;
		border-radius: var(--border-radius);
		object-fit: cover;
	}

	.carousel__controls {
		padding: 0 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);

		& > button {
			opacity: 0.5;
			transition: background-color 0.3s;
			border-radius: 100%;

			display: flex;
			align-items: center;
			justify-content: center;
			transition: opacity 0.3s;
			width: 32px;

			&:nth-child(even) {
				transform: rotate(180deg);
			}

			&:hover {
				opacity: 1;
			}
		}
	}

	.carousel__indicators {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 1rem;

		& > button {
			transition: background-color 0.3s;
			border-radius: 100%;

			&:hover {
				background-color: var(--bg-color);
				outline: var(--fg-color) solid 1px;
			}

			&.active {
				background-color: var(--bg-color);
				outline: var(--fg-color) solid 1px;
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
</style>
