// Emits public/search-index.json combining books + authors.
// Run automatically before `next build` via `prebuild` script.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const books = JSON.parse(readFileSync(resolve(root, "src/content/books.json"), "utf8"));
const authors = JSON.parse(readFileSync(resolve(root, "src/content/authors.json"), "utf8"));

const index = [
  ...books.map((b) => ({ kind: "book", ...b })),
  ...authors.map((a) => ({ kind: "author", ...a })),
];

const out = resolve(root, "public/search-index.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(index));
console.log(`[search-index] wrote ${index.length} entries -> ${out}`);
