import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(resolve(root, "src/components/Hero.astro"), "utf8");

test("hero supports right-anchored contained title placement", () => {
	assert.match(source, /pcTextRight\?: string/);
	assert.match(source, /containedTitle\?: boolean/);
	assert.match(source, /div\.hero\.contained-title\s*{[^}]*position: relative/s);
	assert.match(source, /right: var\(--pcTextRight\)/);
	assert.match(source, /div\.hero\.contained-title h1\s*{[^}]*margin: 0/s);
	assert.match(source, /@media \(width < 500px\)\s*{[^}]*div\.hero\.contained-title h1\s*{[^}]*top: var\(--textY\)/s);
	assert.match(source, /div\.hero\.contained-title h1\s*{[^}]*left: 1rem;[^}]*right: 1rem;[^}]*max-width: none;[^}]*text-align: right;/s);
});
