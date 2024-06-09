<script lang="ts">
	import { onMount } from "svelte";

	type Article = {
		text: string;
		image: string;
	};

	const articles: Article[] = [
		{
			text: "3 days dedicated to your deep inner transformation",
			image: "/imgs/retreats/experience/img1.webp",
		},
		{
			text: `Luxurious accommodations at an
			oasis located in Pacifica, California`,
			image: "/imgs/retreats/experience/img2.webp",
		},
		{
			text: `Top-tier private chef crafting culinary
			masterpieces for every meal`,
			image: "/imgs/retreats/experience/img3.webp",
		},
		{
			text: `Exclusive access to a pool, sauna, 5 mins
			from the beach and trails close by`,
			image: "/imgs/retreats/experience/img4.webp",
		},

		{
			text: `Yoga, Breathwork Sessions,
			Expert-led workshops`,
			image: "/imgs/retreats/experience/img5.webp",
		},
		{
			text: `Hiking, beach/pool time, carefree
			playfulness and tranquil moments of
			stillness`,
			image: "/imgs/retreats/experience/img6.webp",
		},
		{
			text: `Lifelong connections with an
			empowering community of
			like-minded women`,
			image: "/imgs/retreats/experience/img7.webp",
		},
		{
			text: `An extraordinary transformative
			healing experience`,
			image: "/imgs/retreats/experience/img8.webp",
		},
	];

	onMount(() => {
		const elements = document.querySelectorAll(".tooltip");
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						//
						const tooltip = entry.target.querySelector("div") as HTMLElement;
						tooltip.style.opacity = "1";
						tooltip.style.transform = "translateY(0) translateX(-50%)";
						const pElement = entry.target.querySelector("p") as HTMLElement;
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
		margin: calc(var(--bubble-height) + 2rem) auto 2rem;
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 3rem;
		padding: 0 2rem;
		max-width: 700px;
		& > article:nth-child(even) {
			align-self: end;
		}
	}

	article {
		--color: var(--fg-light-color);
		margin-top: var(--bubble-height);
		max-width: 300px;
	}

	article p {
		padding: 2rem 1rem;
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
