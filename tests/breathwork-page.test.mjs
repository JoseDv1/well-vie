import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(resolve(root, "src/pages/breathwork.astro"), "utf8");
const bookingMessage =
	"Hi! I want to book a 1:1 breathwork session with you. My name is ";
const encodedBookingMessage = encodeURIComponent(bookingMessage);

test("breathwork page offers 1:1 sessions with text and WhatsApp booking actions", () => {
	assert.match(source, /<h3>1:1 Sessions<\/h3>/);
	assert.doesNotMatch(
		source,
		/Balanced Package|Revitalized Package|Purchase Package|square\.link|calendly\.com/,
	);
	assert.ok(
		source.includes(
			`href="https://wa.me/13162589949?text=${encodedBookingMessage}"`,
		),
		"expected WhatsApp booking link with a prefilled message",
	);
	assert.ok(
		source.includes(`href="sms:+13162589949&body=${encodedBookingMessage}"`),
		"expected SMS/iMessage booking link with a prefilled message",
	);
});
