import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(readFileSync(resolve(root, "content.json"), "utf8"));

test("home page uses the updated ecosystem summary", () => {
	const ecosystemArticle = content.pages.home.articles.find(
		(article) => article.title === "Introducing The Ecosystem",
	);

	assert.ok(ecosystemArticle, "expected home page Ecosystem article");
	assert.equal(
		ecosystemArticle.content,
		"The Ecosystem is a supportive community for women seeking deeper connection, breathwork practices, nervous system support, and intentional spaces for healing and growth.",
	);
	assert.doesNotMatch(ecosystemArticle.content, /desiring deeper connection/);
	assert.doesNotMatch(ecosystemArticle.content, /honest connection|Through community/);
});
