import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(resolve(root, "src/pages/ecosystem.astro"), "utf8");
const normalizedSource = source.replace(/\s+/g, " ");

test("ecosystem why section uses collective voice", () => {
	assert.match(source, /<h2>Why "The Ecosystem"\?<\/h2>/);
	assert.match(
		normalizedSource,
		/We chose the word ecosystem because ecosystems are built on connection — life supporting life\./,
	);
	assert.match(
		normalizedSource,
		/Healing, growth, and regulation don't happen in isolation\. They happen through shared experiences, safe spaces, and meaningful connection\./,
	);
	assert.match(
		normalizedSource,
		/The Ecosystem is a space where women can feel supported, connected, and grow together\./,
	);
	assert.doesNotMatch(source, /I chose the word ecosystem/);
	assert.doesNotMatch(source, /through community, shared experiences/);
	assert.doesNotMatch(source, /designed to feel that way/);
});

test("ecosystem page uses the approved content flow", () => {
	const openingIndex = source.indexOf(
		'<section class="opening slide">',
	);
	const introIndex = source.indexOf('<section class="intro slide">');
	const whyIndex = source.indexOf('<section class="why slide">');
	const whoIndex = source.indexOf('<section class="who slide">');
	const insideIndex = source.indexOf('<section class="inside slide">');
	const pathIndex = source.indexOf('<section class="journey slide">');

	assert.ok(openingIndex > -1, "expected opening catchphrase section");
	assert.ok(introIndex > openingIndex, "expected Introducing section after opening");
	assert.ok(whyIndex > introIndex, "expected Why section after Introducing");
	assert.ok(whoIndex > whyIndex, "expected Who section after Why");
	assert.ok(insideIndex > whoIndex, "expected Inside section after Who");
	assert.ok(pathIndex > insideIndex, "expected Path section after Inside");
	assert.match(
		source,
		/A supportive space for women to breathe, reconnect, and feel held/,
	);
});

test("ecosystem who section omits healing-centered spaces", () => {
	assert.doesNotMatch(source, /healing-centered spaces/);
	assert.match(source, /"deeper connection"/);
	assert.match(source, /"intentional community"/);
	assert.match(source, /"honest growth"/);
});

test("ecosystem path is presented as a vertical ecosystem sequence", () => {
	assert.match(source, /<ol class="timeline">/);
	assert.match(source, /<h2>The Ecosystem<\/h2>/);
	assert.match(source, /<h3>Path I<\/h3>/);
	assert.match(
		source,
		/<li id="path-ii" class="timeline-item">(?:(?!<\/li>)[\s\S])*<h3>Path II<\/h3>/,
	);
	assert.match(source, /<h3>Path II<\/h3>/);
	assert.match(source, /<h3>Path III<\/h3>/);
	assert.match(source, /<a href="\/reset" class="btn">Begin Here<\/a>/);
	assert.match(
		normalizedSource,
		/A 3-week experience designed to help women slow down, reconnect, and build a foundation through breathwork, nervous system support, and community\./,
	);
	assert.match(
		normalizedSource,
		/A 3-month container for women ready to go deeper—supported by breathwork, expert guidance, and community to create lasting transformation\./,
	);
	assert.match(
		normalizedSource,
		/Immersive retreats designed for restoration, connection, and embodied growth\./,
	);
	assert.doesNotMatch(source, /<h3>Path 1<\/h3>/);
	assert.doesNotMatch(source, /A 30-day experience/);
	assert.doesNotMatch(source, /reflect, reconnect to themselves/);
	assert.doesNotMatch(source, /A deeper ongoing space/);
	assert.doesNotMatch(source, /In-person experiences centered around/);
	assert.doesNotMatch(source, /Learn About The Reset/);
	assert.doesNotMatch(source, /grid-template-columns: repeat\(3, 1fr\)/);
	assert.doesNotMatch(source, /class="path-grid"/);
});

test("ecosystem path ii includes opening details and waitlist link", () => {
	assert.match(
		source,
		/Opening January 2027/,
	);
	assert.match(
		source,
		/href="#path-ii-waitlist" class="btn">Join the Waitlist<\/a>/,
	);
	assert.match(source, /<EcosystemWaitlistForm \/>/);
	assert.doesNotMatch(source, /pathTwoWaitlistLink/);
	assert.doesNotMatch(source, /Limited to 15 women/);
	assert.doesNotMatch(source, /mailto:mckenzie@well-vie\.com/);
});

test("ecosystem opening and intro sections do not show apply buttons", () => {
	const applyButtons =
		source.match(
			/<button type="button" class="btn" popovertarget="ecosystem-application">Apply<\/button>/g,
		) ?? [];

	assert.equal(applyButtons.length, 0);
	assert.doesNotMatch(source, /popovertarget="ecosystem-application"/);
	assert.doesNotMatch(source, /<dialog popover id="ecosystem-application"/);
	assert.doesNotMatch(source, /application-popover/);
	assert.doesNotMatch(source, /<h2>Thank You for Sharing<\/h2>/);
	assert.doesNotMatch(source, /<a href="#" class="btn disabled">Apply<\/a>/);
	assert.doesNotMatch(source, /Join The Ecosystem|Explore Membership|Purchase Now/i);
});

test("ecosystem opening headline has a restrained page-level scale", () => {
	assert.match(
		source,
		/\.opening h1\s*{[^}]*font-size: clamp\(3\.5rem, 6\.2vw, 6rem\)/s,
	);
	assert.match(source, /\.opening h1\s*{[^}]*max-width: 760px/s);
	assert.doesNotMatch(source, /\.opening h1\s*{[^}]*font-size: var\(--heading\)/s);
});
