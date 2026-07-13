import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(resolve(root, "src/pages/reset.astro"), "utf8");
const normalizedSource = source.replace(/\s+/g, " ");

test("reset page reflects the updated offer details", () => {
	assert.match(source, /<span class="hero-label">Path 1<\/span>/);
	assert.match(
		normalizedSource,
		/A 3-week experience designed to help women slow down, reflect, reconnect to themselves, and experience breathwork, nervous system support, community, and honest conversation\./,
	);
	assert.match(
		normalizedSource,
		/Live online &bull; Open worldwide &bull; Replays included/,
	);
	assert.doesNotMatch(source, /A 30-Day Experience|A 30-day experience/);
	assert.doesNotMatch(source, /Sunday sessions|Week 2 & 4|WhatsApp community check-ins/);
	assert.match(source, /September 15, 2026/);
	assert.match(source, /USD \$333/);
	assert.match(source, /15 women/);
	assert.doesNotMatch(source, /\$333 \/|€333|â‚¬333|12 women/);
});

test("reset page presents the three week program inside The Reset", () => {
	const insideResetIndex = source.indexOf('<h2 class="slide">Inside The Reset</h2>');
	const weekOneIndex = source.indexOf("<h3>Week One</h3>");
	const weekTwoIndex = source.indexOf("<h3>Week Two</h3>");
	const weekThreeIndex = source.indexOf("<h3>Week Three</h3>");
	const portalIndex = source.indexOf("<h3>Your Well-Vie Portal</h3>");
	const includedIndex = source.indexOf("<h3>Included Throughout</h3>");
	const bonusIndex = source.indexOf("<h3>Private WhatsApp Community</h3>");

	assert.ok(insideResetIndex > -1, "expected Inside The Reset section heading");
	assert.ok(weekOneIndex > insideResetIndex, "expected Week One after heading");
	assert.ok(weekTwoIndex > weekOneIndex, "expected Week Two after Week One");
	assert.ok(weekThreeIndex > weekTwoIndex, "expected Week Three after Week Two");
	assert.ok(portalIndex > weekThreeIndex, "expected portal after Week Three");
	assert.ok(includedIndex > portalIndex, "expected Included Throughout after portal");
	assert.ok(bonusIndex > includedIndex, "expected WhatsApp community after included list");
	assert.match(
		normalizedSource,
		/Throughout The Reset, you'll have access to your private Well-Vie member portal\. A calm, organized space where everything lives in one place\. It's designed to support you between our live sessions and give you a space to return to whenever you need it\./,
	);
	for (const portalItem of [
		"Community Calendar",
		"Live Workshop Access",
		"Session Replays",
		"Guided Breathwork Library",
		"Body Scan Meditations",
		"Daily Intentions &amp; Affirmations",
		"Journal Prompts &amp; Reflection Exercises",
		"Community Space",
		"Program Resources",
	]) {
		assert.match(source, new RegExp(`<li>${portalItem}</li>`));
	}
	assert.match(source, /<h4>Connect &amp; Set Intentions<\/h4>/);
	assert.match(source, /<h4>Deepen &amp; Receive Support<\/h4>/);
	assert.match(source, /<h4>Reconnect &amp; Reset<\/h4>/);
	assert.match(
		normalizedSource,
		/Our first week is designed to help you slow down and reconnect\./,
	);
	assert.match(
		normalizedSource,
		/Together, we'll begin with a 90-minute LIVE community call where you'll meet the women inside your group, share introductions, and set intentions for the journey ahead\./,
	);
	assert.match(
		normalizedSource,
		/This week is about building a foundation and creating space for what comes next\./,
	);
	assert.match(
		normalizedSource,
		/Our second week is designed to help you go deeper\./,
	);
	assert.match(
		normalizedSource,
		/You'll learn practical somatic tools to bring into everyday life, have space to ask questions, and connect with other women walking through similar seasons\./,
	);
	assert.match(
		normalizedSource,
		/This week is about feeling seen, supported, and remembering that you don't have to carry everything alone\./,
	);
	assert.match(
		normalizedSource,
		/Our final week is designed to help you integrate and move forward with intention\./,
	);
	assert.match(
		normalizedSource,
		/You'll leave with practices and journal prompts to continue supporting yourself long after the three weeks have ended\./,
	);
	assert.match(
		normalizedSource,
		/This week is about honoring how far you've come and moving forward with greater clarity, connection, and self-awareness\./,
	);
	assert.match(source, /Three LIVE 90-minute sessions/);
	assert.match(source, /Guided breathwork journeys/);
	assert.match(source, /Nervous system support and somatic practices/);
	assert.match(source, /Journal prompts and reflection exercises/);
	assert.match(source, /Community and connection/);
	assert.match(source, /Replay access available if life gets in the way/);
	assert.match(source, /An intimate group setting \(limited to 15 women\)/);
	assert.match(source, /<p class="section-label">Bonus Feature<\/p>/);
	assert.match(source, /\.week-list\s*{[^}]*gap: calc\(var\(--element-gap\) \* 1\.45\);/s);
	assert.match(source, /\.week-card\s*{[^}]*padding-bottom: calc\(var\(--element-gap\) \* 1\.45\);/s);
	assert.match(
		normalizedSource,
		/Throughout the three weeks, you'll have access to a private WhatsApp group with the women inside your cohort\./,
	);
	assert.match(
		normalizedSource,
		/Think of it as an extension of our calls&mdash;a place to feel supported, stay connected, and remember that you don't have to navigate this journey alone\./,
	);
	assert.match(
		normalizedSource,
		/Some of the most meaningful moments happen between the calls\./,
	);
	assert.doesNotMatch(source, /What's Included|What to Expect/);
	assert.doesNotMatch(source, /includedItems|included-list/);
	assert.doesNotMatch(source, /One 60-minute coaching session|Replay access included/);
});

test("reset page sends interested women to the reset application", () => {
	const applyLinks = source.match(/<a href="\/reset\/apply\/" class="btn">Apply<\/a>/g) ?? [];
	const waitlistLinks =
		source.match(
			/<a href="\/ecosystem\/#path-ii-waitlist" class="btn">Join the Waitlist<\/a>/g,
		) ?? [];
	const beginLinks =
		source.match(
			/<a href="#what-to-expect" class="btn">Begin Your Journey<\/a>/g,
		) ?? [];

	assert.equal(applyLinks.length, 1);
	assert.equal(waitlistLinks.length, 1);
	assert.equal(beginLinks.length, 1);
	assert.match(
		source,
		/<section class="hero slide">(?:(?!<\/section>)[\s\S])*<a href="#what-to-expect" class="btn">Begin Your Journey<\/a>/,
	);
	assert.doesNotMatch(source, /class="section-anchor"/);
	assert.match(source, /<section id="what-to-expect" class="expect">/);
	assert.doesNotMatch(source, /<section class="expect slide">/);
	assert.match(source, /<h2 class="slide">Inside The Reset<\/h2>/);
	assert.match(
		source,
		/<section class="details slide">(?:(?!<\/section>)[\s\S])*<a href="\/reset\/apply\/" class="btn">Apply<\/a>/,
	);
	assert.match(
		source,
		/<section class="closing slide">(?:(?!<\/section>)[\s\S])*<a href="\/ecosystem\/#path-ii-waitlist" class="btn">Join the Waitlist<\/a>/,
	);
	assert.doesNotMatch(source, /Begin Your Journey Here/);
	assert.doesNotMatch(source, /Explore Path II/);
	assert.doesNotMatch(source, /Join The Reset|resetMailtoLink|mailto:mckenzie@well-vie\.com/);
});

test("reset page removes the why section", () => {
	assert.doesNotMatch(source, /<section class="why slide">/);
	assert.doesNotMatch(source, /Why "The Reset"\?/);
	assert.doesNotMatch(source, /The Reset is designed to create space/);
});

test("reset page describes what comes after Path I", () => {
	assert.match(source, /<h2>What Comes After\?<\/h2>/);
	assert.match(
		normalizedSource,
		/Women who complete Path I will receive priority access to Path II & Path III, retreats, workshops, in-person gatherings and future Well-Vie experiences\./,
	);
	assert.doesNotMatch(source, /Explore The Ecosystem/);
	assert.doesNotMatch(source, /What Comes After The Reset\?/);
	assert.doesNotMatch(source, /Women who complete The Reset/);
});
