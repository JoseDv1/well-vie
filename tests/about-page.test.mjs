import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(resolve(root, "src/pages/about.astro"), "utf8");

test("about page includes McKenzie's signoff after the bio", () => {
	const paragraphsIndex = source.indexOf("paragraphs.map");
	const signoffIndex = source.indexOf('<div class="signoff slide">');

	assert.ok(signoffIndex > paragraphsIndex, "expected signoff after bio paragraphs");
	assert.match(source, /Bisous, McKenzie/);
	assert.match(source, /Founder of Well-Vie/);
});

test("about hero title is positioned safely on laptop-height viewports", () => {
	assert.doesNotMatch(source, /pcTextPosition={\["50%", "46%"\]}/);
});
