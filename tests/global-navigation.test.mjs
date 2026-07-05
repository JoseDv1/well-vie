import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const navbarSource = readFileSync(resolve(root, "src/components/Navbar.astro"), "utf8");
const footerSource = readFileSync(resolve(root, "src/components/Footer.astro"), "utf8");

test("global navigation removes Book Now calls to action", () => {
	for (const source of [navbarSource, footerSource]) {
		assert.doesNotMatch(source, /Book Now/i);
		assert.doesNotMatch(source, /calendly\.com\/well-viebymckenzie/);
		assert.match(source, /href="\/contact"/);
	}
});
