<script lang="ts">
	import { onMount } from "svelte";
	import { slide } from "svelte/transition";
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
					loading="lazy"
					src={image}
					alt={`Slide ${i + 1}`}
					transition:slide={{
						axis: "x",
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
		padding: 2rem;
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: var(--border-radius);
	}

	.carousel {
		width: 100%;
		height: 100%;
		display: inline-block;
		overflow: hidden;
		border-radius: var(--border-radius);
	}

	img {
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: var(--border-radius);
		object-fit: cover;
	}

	.carousel__controls {
		padding: 0 1rem;
		display: flex;
		justify-content: space-between;
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);

		& > button {
			background-color: var(--fg-color);
			color: white;
			border: none;
			padding: 0.5rem;
			cursor: pointer;
			transition: background-color 0.3s;
			border-radius: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 3rem;
			aspect-ratio: 1;

			&:nth-child(even) {
				transform: rotate(180deg);
			}
		}
	}

	.carousel__indicators {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 1rem;

		& > button {
			background-color: var(--fg-color);
			color: white;
			border: none;
			aspect-ratio: 1;
			width: 1rem;
			cursor: pointer;
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
</style>
