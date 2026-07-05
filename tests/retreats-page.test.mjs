import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(resolve(root, "src/pages/retreats/index.astro"), "utf8");

test("retreats page keeps the card UI and only shows Europe 2027", () => {
	assert.match(source, /Europe 2027/);
	assert.match(source, /Join The Waitlist/);
	assert.match(source, /Europe%202027%20Retreat%20Waitlist/);
	assert.match(source, /<Retreat\s+[\s\S]*image="\/imgs\/retreats\/past\/IMG_0037\.JPG"[\s\S]*title="Europe 2027"[\s\S]*button="Join The Waitlist"[\s\S]*\/>/);
	assert.match(source, /main\.upcoming-retreats > section\s*{[^}]*grid-template-columns: minmax\(280px, 500px\)/s);
	assert.doesNotMatch(source, /Palm Springs|France Retreat|Portugal Retreat/);
});

test("retreats hero title is positioned for desktop readability", () => {
	assert.match(source, /containedTitle/);
	assert.match(source, /textPosition={\["auto", "12%"\]}/);
	assert.match(source, /textRight="1rem"/);
	assert.match(source, /pcTextPosition={\["auto", "12%"\]}/);
	assert.match(source, /pcTextRight="clamp\(2rem, 7vw, 8rem\)"/);
	assert.match(source, /textShadow="0 4px 28px rgba\(0, 0, 0, 0\.75\), 0 1px 3px rgba\(0, 0, 0, 0\.65\)"/);
	assert.match(source, /@media \(max-width: 500px\)\s*{[^}]*:global\(\.hero\.contained-title h1\)\s*{[^}]*font-size: clamp\(3rem, 20vw, 4rem\)/s);
});

test("retreats page showcases a curated past retreat photo gallery", () => {
	assert.match(source, /import PastRetreatGallery/);
	assert.match(source, /<PastRetreatGallery client:load \/>/);
});
