import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(resolve(root, "src/components/Testimonial.astro"), "utf8");

test("testimonial quote and attribution are centered", () => {
	assert.match(source, /section\s*{[^}]*text-align: center;/s);
	assert.match(source, /p\s*{[^}]*text-align: center;/s);
	assert.match(source, /b\s*{[^}]*text-align: center;/s);
});
