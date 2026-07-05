import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(
	resolve(root, "src/components/PastRetreatGallery.svelte"),
	"utf8",
);

test("past retreat gallery mixes photos and muted looping videos", () => {
	assert.match(source, /Past Retreat Moments/);
	assert.match(source, /IMG_3594\.JPG/);
	assert.match(source, /IMG_3555\.JPG/);
	assert.match(source, /IMG_3949\.JPG/);
	assert.match(source, /IMG_3984\.JPG/);
	assert.match(source, /IMG_4358\.JPG/);
	assert.match(source, /IMG_4348\.MP4/);
	assert.match(source, /IMG_4336\.MP4/);
	assert.match(source, /autoplay\s+loop\s+muted\s+playsinline/s);
	assert.equal(source.match(/type: "(?:image|video)"/g)?.length, 10);
	assert.doesNotMatch(source, /IMG_9170\.JPG/);
	assert.doesNotMatch(source, /IMG_3908\.MP4/);
});

test("past retreat gallery fills the grid and opens as a lightbox slider", () => {
	assert.match(source, /grid-auto-flow: dense/);
	assert.match(source, /\.past-retreats-grid\s*{[^}]*grid-template-columns: repeat\(4, 1fr\)/s);
	assert.match(source, /class="lightbox"/);
	assert.match(source, /showPrevious/);
	assert.match(source, /showNext/);
	assert.match(source, /activeIndex \+ 1/);
	assert.match(source, /ArrowLeft/);
	assert.match(source, /ArrowRight/);
	assert.match(source, /Escape/);
});

test("past retreat lightbox uses the provided SVG arrow icons for navigation", () => {
	assert.match(source, /class="nav-icon"/);
	assert.match(source, /viewBox="0 0 57 94"/);
	assert.match(source, /\.lightbox-nav\s*{[^}]*font-size: 0/s);
	assert.match(source, /M0\.000293449 46\.8752C0\.00029337 45\.9729/);
	assert.match(source, /M56\.2497 46\.8738C56\.2497 47\.7762/);
	assert.match(source, /\.lightbox-nav \.nav-icon\s*{[^}]*height: 1\.1rem/s);
	assert.match(source, /\.lightbox-nav\.next \.nav-icon\s*{[^}]*transform: translateX\(2px\)/s);
	assert.doesNotMatch(source, /class="chevron"/);
	assert.doesNotMatch(source, /border-top: 2px solid currentColor/);
	assert.doesNotMatch(source, /aria-label="Previous media"[\s\S]*&lt;[\s\S]*<\/button>/);
	assert.doesNotMatch(source, /aria-label="Next media"[\s\S]*&gt;[\s\S]*<\/button>/);
});

test("past retreat lightbox uses a centered drawn close icon", () => {
	assert.match(source, /class="close-icon"/);
	assert.match(source, /\.lightbox-close\s*{[^}]*font-size: 0/s);
	assert.match(source, /\.lightbox-close \.close-icon::before,[\s\S]*\.lightbox-close \.close-icon::after\s*{[^}]*width: 1\.15rem;[^}]*height: 2px;[^}]*background-color: currentColor;/s);
	assert.match(source, /transform: translate\(-50%, -50%\) rotate\(45deg\)/);
	assert.match(source, /transform: translate\(-50%, -50%\) rotate\(-45deg\)/);
	assert.doesNotMatch(source, /aria-label="Close gallery"[\s\S]*>\s*x\s*<\/button>/);
});

test("past retreat lightbox has a fixed mobile modal layout", () => {
	assert.match(source, /@media \(max-width: 700px\)\s*{[\s\S]*\.lightbox\s*{[^}]*display: flex;[^}]*align-items: center;[^}]*justify-content: center;/s);
	assert.match(source, /\.lightbox-nav\s*{[^}]*position: absolute;[^}]*top: 50%;[^}]*transform: translateY\(-50%\);/s);
	assert.match(source, /\.lightbox-nav\.previous\s*{[^}]*left: max\(1rem, env\(safe-area-inset-left\)\)/s);
	assert.match(source, /\.lightbox-nav\.next\s*{[^}]*right: max\(1rem, env\(safe-area-inset-right\)\)/s);
	assert.doesNotMatch(source, /grid-template-rows: 1fr auto/);
});
