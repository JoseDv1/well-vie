<script>
	import { onMount } from "svelte";

	export let articles;

	onMount(() => {
		const elements = document.querySelectorAll(".tooltip");
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						//
						const tooltip = entry.target.querySelector("div");
						tooltip.style.opacity = "1";
						tooltip.style.transform = "translateY(0) translateX(-50%)";
						const pElement = entry.target.querySelector("p");
						pElement.style.backgroundColor = "var(--fg-color)";
						pElement.style.color = "var(--bg-color)";
					}
				});
			},
			{ threshold: 1 }
		);

		elements.forEach((element) => {
			observer.observe(element);
		});
	});
</script>

<main>
	{#each articles as article}
		<article class="tooltip">
			<div>
				<img src={article.image} alt="" />
			</div>

			<p>{article.text}</p>
		</article>
	{/each}
</main>

<style>
	main {
		--bubble-height: 150px;
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: var(--section-gap);
		margin-block: var(--section-gap);

		& > article:nth-child(even) {
			align-self: end;
		}
	}

	article {
		--color: var(--fg-light-color);
		margin-top: var(--bubble-height);
		max-width: min(100%, 400px);

		@media (width <= 450px) {
			width: 100%;
		}
	}

	article p {
		padding: 2rem 1.5rem;
		border: 1px solid var(--fg-color);
		border-radius: var(--border-radius);
		background-color: var(--bg-color);
		z-index: 100;

		/* Initial Transistion Position */
		transition: all 1.5s;
		background-color: var(--bg-color);
		color: var(--fg-color);
	}

	article div {
		z-index: 0;
		--tip-height: 0.75rem;

		height: var(--bubble-height);
		aspect-ratio: 1;
		position: absolute;
		bottom: calc(100% + var(--tip-height));
		left: 50%;

		/* Initial Transistion Position */
		opacity: 0;
		transition: all 1.5s;
		transform: translateY(100%) translateX(-50%);

		&::after {
			content: "";
			display: inline-block;
			width: 2rem;
			height: var(--tip-height);
			background: var(--color);
			position: absolute;
			top: 99%;
			left: 50%;
			transform: translateX(-50%);
			clip-path: polygon(0 0, 100% 0, 50% 100%);
		}
	}

	div img {
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		border-radius: 50%;
		border: 8px solid var(--color);
	}
</style>
