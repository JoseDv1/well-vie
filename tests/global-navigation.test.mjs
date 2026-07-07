import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const layoutSource = readFileSync(resolve(root, "src/layouts/Layout.astro"), "utf8");
const navbarSource = readFileSync(resolve(root, "src/components/Navbar.astro"), "utf8");
const footerSource = readFileSync(resolve(root, "src/components/Footer.astro"), "utf8");

test("global navigation removes Book Now calls to action", () => {
	for (const source of [navbarSource, footerSource]) {
		assert.doesNotMatch(source, /Book Now/i);
		assert.doesNotMatch(source, /calendly\.com\/well-viebymckenzie/);
		assert.match(source, /href="\/contact"/);
	}
});

test("scroll reveal animation uses fixed offset and early trigger", () => {
	assert.match(layoutSource, /transform = "translateY\(32px\)"/);
	assert.doesNotMatch(layoutSource, /translateY\(25%\)/);
	assert.match(
		layoutSource,
		/{ rootMargin: "0px 0px -10% 0px", threshold: 0 }/,
	);
	assert.match(layoutSource, /observer\.unobserve\(entry\.target\)/);
});

test("layout marks Safari for browser-specific hero fitting", () => {
	assert.match(layoutSource, /navigator\.userAgent/);
	assert.match(layoutSource, /document\.documentElement\.classList\.add\("is-safari"\)/);
});
