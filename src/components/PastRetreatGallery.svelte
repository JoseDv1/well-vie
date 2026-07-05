<script>
	import { onMount } from "svelte";

	const media = [
		{
			type: "image",
			src: "/imgs/retreats/past/IMG_3594.JPG",
			alt: "Women gathered outdoors in the desert for a retreat circle",
			className: "large",
		},
		{
			type: "video",
			src: "/videos/retreats/past/IMG_4348.MP4",
			alt: "Quiet video moment from a retreat living space",
			className: "wide",
		},
		{
			type: "image",
			src: "/imgs/retreats/past/IMG_3555.JPG",
			alt: "Sunlit retreat living room with blankets and seating",
			className: "wide",
		},
		{
			type: "image",
			src: "/imgs/retreats/past/IMG_3949.JPG",
			alt: "Candlelit quiet moment inside a retreat space",
			className: "standard",
		},
		{
			type: "image",
			src: "/imgs/retreats/past/IMG_3984.JPG",
			alt: "Two women smiling together in the desert landscape",
			className: "standard",
		},
		{
			type: "video",
			src: "/videos/retreats/past/IMG_4336.MP4",
			alt: "Retreat kitchen and gathering space video",
			className: "standard",
		},
		{
			type: "image",
			src: "/imgs/retreats/past/IMG_4358.JPG",
			alt: "Retreat welcome details with blanket and tea",
			className: "standard",
		},
		{
			type: "image",
			src: "/imgs/retreats/past/IMG_9135.JPG",
			alt: "Desert plant and blue sky near the retreat space",
			className: "standard",
		},
		{
			type: "image",
			src: "/imgs/retreats/past/IMG_3929.JPG",
			alt: "Woman preparing a retreat space indoors",
			className: "standard",
		},
		{
			type: "image",
			src: "/imgs/retreats/past/5ADF6681-5707-44CE-B38A-A3C5C0E2ECA0.JPG",
			alt: "Desert stones and soft retreat landscape details",
			className: "wide",
		},
	];

	let activeIndex = null;

	$: active = activeIndex === null ? null : media[activeIndex];

	function openLightbox(index) {
		activeIndex = index;
	}

	function closeLightbox() {
		activeIndex = null;
	}

	function showPrevious() {
		activeIndex = (activeIndex - 1 + media.length) % media.length;
	}

	function showNext() {
		activeIndex = (activeIndex + 1) % media.length;
	}

	onMount(() => {
		function handleKeydown(event) {
			if (activeIndex === null) return;

			if (event.key === "Escape") closeLightbox();
			if (event.key === "ArrowLeft") showPrevious();
			if (event.key === "ArrowRight") showNext();
		}

		window.addEventListener("keydown", handleKeydown);

		return () => window.removeEventListener("keydown", handleKeydown);
	});
</script>

<section class="past-retreats">
	<div class="past-retreats-heading">
		<h2>Past Retreat Moments</h2>
		<p>
			A glimpse into the spaces, conversations, and connection that shape
			Well-Vie retreats.
		</p>
	</div>

	<div class="past-retreats-grid">
		{#each media as item, index}
			<button
				type="button"
				class={`media-tile ${item.className}`}
				aria-label={`Open ${item.alt}`}
				on:click={() => openLightbox(index)}
			>
				{#if item.type === "video"}
					<video
						src={item.src}
						aria-label={item.alt}
						autoplay
						loop
						muted
						playsinline
						preload="metadata"
					/>
				{:else}
					<img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
				{/if}
			</button>
		{/each}
	</div>
</section>

{#if active}
	<div class="lightbox" role="dialog" aria-modal="true" aria-label="Past retreat gallery">
		<button class="lightbox-close" type="button" aria-label="Close gallery" on:click={closeLightbox}>
			<span class="close-icon" aria-hidden="true"></span>
		</button>
		<button class="lightbox-nav previous" type="button" aria-label="Previous media" on:click={showPrevious}>
			<svg class="nav-icon" viewBox="0 0 57 94" aria-hidden="true" focusable="false">
				<path
					d="M0.000293449 46.8752C0.00029337 45.9729 0.390912 45.1174 1.06669 44.5236L51.0667 0.773591C51.6604 0.25406 52.3948 0.000152925 53.1253 0.000152861C53.9964 0.000152785 54.8597 0.359531 55.4769 1.06655C56.6136 2.36345 56.4808 4.33995 55.1839 5.47675L7.87192 46.8748L55.1839 88.2728C56.4808 89.4095 56.6136 91.3822 55.4769 92.683C54.3402 93.9799 52.3675 94.1127 51.0667 92.9759L1.06669 49.2259C0.390912 48.6322 0.000293527 47.7776 0.000293449 46.8752Z"
					fill="currentColor"
				/>
			</svg>
		</button>
		<div class="lightbox-frame">
			{#if active.type === "video"}
				<video src={active.src} aria-label={active.alt} controls autoplay loop muted playsinline />
			{:else}
				<img src={active.src} alt={active.alt} />
			{/if}
		</div>
		<button class="lightbox-nav next" type="button" aria-label="Next media" on:click={showNext}>
			<svg class="nav-icon" viewBox="0 0 57 94" aria-hidden="true" focusable="false">
				<path
					d="M56.2497 46.8738C56.2497 47.7762 55.8591 48.6316 55.1833 49.2254L5.1833 92.9754C4.58955 93.495 3.8552 93.7489 3.1247 93.7489C2.25361 93.7489 1.3903 93.3895 0.773101 92.6825C-0.363599 91.3856 -0.230799 89.4091 1.06607 88.2723L48.3781 46.8743L1.06607 5.47627C-0.230829 4.33957 -0.363629 2.36687 0.773101 1.06607C1.9098 -0.230829 3.8825 -0.363629 5.1833 0.773101L55.1833 44.5231C55.8591 45.1168 56.2497 45.9714 56.2497 46.8738Z"
					fill="currentColor"
				/>
			</svg>
		</button>
		<p class="lightbox-count">{activeIndex + 1} / {media.length}</p>
	</div>
{/if}

<style>
	.past-retreats {
		display: flex;
		flex-direction: column;
		gap: var(--element-gap);
		align-items: center;
		margin-top: var(--section-gap);
	}

	.past-retreats-heading {
		max-width: 720px;
		text-align: center;
	}

	.past-retreats-heading p {
		margin-top: 1rem;
		line-height: 1.8;
	}

	.past-retreats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-auto-rows: 210px;
		grid-auto-flow: dense;
		gap: 1rem;
		width: 100%;
	}

	.media-tile {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		min-height: 0;
		padding: 0;
		overflow: hidden;
		border: 0;
		border-radius: var(--border-radius);
		background-color: var(--fg-light-color);
		cursor: pointer;
	}

	.media-tile:hover,
	.media-tile:focus-visible {
		transform: translateY(-2px);
		box-shadow: 0 16px 40px rgba(112, 139, 94, 0.18);
	}

	.media-tile:focus-visible {
		outline: 3px solid var(--accent-color);
		outline-offset: 4px;
	}

	.media-tile img,
	.media-tile video {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.media-tile.large {
		grid-column: span 2;
		grid-row: span 2;
	}

	.media-tile.wide {
		grid-column: span 2;
	}

	.media-tile.standard:nth-child(5) img {
		object-position: center top;
	}

	@media (max-width: 900px) {
		.past-retreats-grid {
			grid-template-columns: repeat(2, 1fr);
			grid-auto-rows: 220px;
		}
	}

	@media (max-width: 600px) {
		.past-retreats-grid {
			grid-template-columns: 1fr;
			grid-auto-rows: 260px;
		}

		.media-tile,
		.media-tile.large,
		.media-tile.wide {
			grid-column: auto;
			grid-row: auto;
		}
	}

	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: grid;
		grid-template-columns: minmax(48px, 1fr) minmax(0, 1100px) minmax(48px, 1fr);
		align-items: center;
		gap: 1rem;
		padding: 2rem;
		background-color: rgba(17, 24, 14, 0.88);
	}

	.lightbox-frame {
		grid-column: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		max-height: 86vh;
	}

	.lightbox-frame img,
	.lightbox-frame video {
		max-width: 100%;
		max-height: 86vh;
		border-radius: var(--border-radius);
		object-fit: contain;
		background-color: #11180e;
	}

	.lightbox-close,
	.lightbox-nav {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		min-height: 48px;
		padding: 0;
		border: 1px solid rgba(250, 255, 255, 0.55);
		border-radius: 50%;
		background-color: rgba(250, 255, 255, 0.12);
		color: var(--bg-color);
		line-height: 1;
	}

	.lightbox-nav {
		font-size: 0;
	}

	.lightbox-nav .nav-icon {
		display: block;
		width: auto;
		height: 1.1rem;
	}

	.lightbox-nav.next .nav-icon {
		transform: translateX(2px);
	}

	.lightbox-close {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		font-size: 0;
	}

	.lightbox-close .close-icon {
		position: relative;
		display: block;
		width: 1rem;
		height: 1rem;
	}

	.lightbox-close .close-icon::before,
	.lightbox-close .close-icon::after {
		content: "";
		position: absolute;
		top: 50%;
		left: 50%;
		width: 1.15rem;
		height: 2px;
		border-radius: 999px;
		background-color: currentColor;
		transform-origin: center;
	}

	.lightbox-close .close-icon::before {
		transform: translate(-50%, -50%) rotate(45deg);
	}

	.lightbox-close .close-icon::after {
		transform: translate(-50%, -50%) rotate(-45deg);
	}

	.lightbox-nav.previous {
		justify-self: end;
	}

	.lightbox-nav.next {
		justify-self: start;
	}

	.lightbox-count {
		position: absolute;
		left: 50%;
		bottom: 1.25rem;
		transform: translateX(-50%);
		color: var(--bg-color);
		font-size: 1rem;
	}

	@media (max-width: 700px) {
		.lightbox {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0;
			padding: 4.5rem 1rem 4rem;
		}

		.lightbox-frame {
			grid-column: auto;
			width: 100%;
			max-height: calc(100dvh - 8.5rem);
		}

		.lightbox-frame img,
		.lightbox-frame video {
			max-width: 100%;
			max-height: calc(100dvh - 8.5rem);
		}

		.lightbox-close {
			top: max(1rem, env(safe-area-inset-top));
			right: max(1rem, env(safe-area-inset-right));
		}

		.lightbox-nav {
			position: absolute;
			top: 50%;
			width: 44px;
			height: 44px;
			min-height: 44px;
			transform: translateY(-50%);
		}

		.lightbox-nav.previous {
			left: max(1rem, env(safe-area-inset-left));
			justify-self: auto;
		}

		.lightbox-nav.next {
			right: max(1rem, env(safe-area-inset-right));
			justify-self: auto;
		}

		.lightbox-count {
			bottom: max(1rem, env(safe-area-inset-bottom));
		}
	}
</style>
