#!/usr/bin/env node
/**
 * Sync content from Google Drive (synced locally) into src/content/*.json
 *
 * Drive layout expected:
 *   G:/My Drive/Projects/crucx.ai/03_Content/Authors/<Author_Name>/
 *       metadata.json   (optional — overrides defaults)
 *       avatar.jpg|png  (optional)
 *       books/
 *         <Book_Title>/
 *           metadata.json
 *           cover.jpg|png
 *
 * Run:  npm run sync:content
 *
 * Idempotent: rewrites src/content/{authors,books}.json from scratch each time.
 * Copies referenced images into public/authors and public/books.
 */
import fs from "node:fs";
import path from "node:path";

const DRIVE_ROOT =
  process.env.CRUCX_DRIVE_ROOT ||
  "G:/My Drive/Projects/crucx.ai/03_Content";
const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const OUT_CONTENT = path.join(REPO_ROOT, "src/content");
const OUT_PUBLIC_AUTHORS = path.join(REPO_ROOT, "public/authors");
const OUT_PUBLIC_BOOKS = path.join(REPO_ROOT, "public/books");

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readJSON(p, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return fallback;
  }
}

function findImage(dir, basenames) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  for (const base of basenames) {
    const match = files.find((f) =>
      new RegExp(`^${base}\\.(jpg|jpeg|png|webp)$`, "i").test(f)
    );
    if (match) return path.join(dir, match);
  }
  return null;
}

function copyImage(src, destDir, slug) {
  if (!src) return null;
  fs.mkdirSync(destDir, { recursive: true });
  const ext = path.extname(src).toLowerCase();
  const dest = path.join(destDir, `${slug}${ext}`);
  fs.copyFileSync(src, dest);
  return `/${path.relative(path.join(REPO_ROOT, "public"), dest).replace(/\\/g, "/")}`;
}

function sync() {
  const authorsRoot = path.join(DRIVE_ROOT, "Authors");
  if (!fs.existsSync(authorsRoot)) {
    console.error(`Drive root not found: ${authorsRoot}`);
    console.error(`Set CRUCX_DRIVE_ROOT env var to override.`);
    process.exit(1);
  }

  const authors = [];
  const books = [];

  const authorDirs = fs
    .readdirSync(authorsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const dir of authorDirs) {
    const authorPath = path.join(authorsRoot, dir.name);
    const meta = readJSON(path.join(authorPath, "metadata.json"));
    const slug = meta.slug || slugify(dir.name);
    const avatarSrc = findImage(authorPath, ["avatar", "headshot", "profile"]);
    const avatar = copyImage(avatarSrc, OUT_PUBLIC_AUTHORS, slug);

    const authorBookSlugs = [];
    const booksDir = path.join(authorPath, "books");
    if (fs.existsSync(booksDir)) {
      const bookDirs = fs
        .readdirSync(booksDir, { withFileTypes: true })
        .filter((d) => d.isDirectory());
      for (const b of bookDirs) {
        const bookPath = path.join(booksDir, b.name);
        const bMeta = readJSON(path.join(bookPath, "metadata.json"));
        const bSlug = bMeta.slug || slugify(b.name);
        const coverSrc = findImage(bookPath, ["cover", "thumbnail"]);
        const cover = copyImage(coverSrc, OUT_PUBLIC_BOOKS, bSlug);
        books.push({
          slug: bSlug,
          title: bMeta.title || b.name,
          authorSlug: slug,
          category: bMeta.category || "Uncategorized",
          cover: cover || "/books/placeholder.jpg",
          description: bMeta.description || "",
          price: bMeta.price ?? 0,
          publishedAt: bMeta.publishedAt || null,
          ...bMeta,
        });
        authorBookSlugs.push(bSlug);
      }
    }

    authors.push({
      slug,
      name: meta.name || dir.name.replace(/_/g, " "),
      tagline: meta.tagline || "",
      bio: meta.bio || "",
      avatar: avatar || "/authors/placeholder.jpg",
      books: authorBookSlugs,
      joinedAt: meta.joinedAt || null,
      ...meta,
    });
  }

  fs.mkdirSync(OUT_CONTENT, { recursive: true });
  fs.writeFileSync(
    path.join(OUT_CONTENT, "authors.json"),
    JSON.stringify(authors, null, 2) + "\n"
  );
  fs.writeFileSync(
    path.join(OUT_CONTENT, "books.json"),
    JSON.stringify(books, null, 2) + "\n"
  );

  console.log(
    `Synced ${authors.length} authors, ${books.length} books from Drive.`
  );
}

sync();
