# Category Mapping Proposal — For Your Review

**Status**: Draft. Reply with overrides; I won't execute until approved.

---

## Part 1 — The 10 main categories (final)

| # | Category | Primary books |
|---|---|---:|
| 1 | Fiction & Literature | 23 |
| 2 | Mystery & Thriller | 6 |
| 3 | Romance | 3 |
| 4 | Sci-Fi & Fantasy | 4 |
| 5 | Self-Mastery & Productivity | 8 |
| 6 | Psychology & Big Ideas | 10 |
| 7 | Business & Money | 5 |
| 8 | Memoir & Biography | 6 |
| 9 | Children's Books | 18 |
| 10 | Poetry & Shorts | 8 |
| | **Total primary placements** | **91** |

Plus secondary tags (~22 cross-listings) so thin categories like Romance feel full when browsed (Pride & Prejudice, Normal People, Seven Husbands, etc. surface there too via secondary).

---

## Part 2 — Sub-categories (chip filters inside each category page)

| Main category | Sub-filters |
|---|---|
| Fiction & Literature | Literary · Contemporary · Historical · Classics |
| Mystery & Thriller | Psychological · Crime · Domestic · Cozy |
| Romance | Contemporary · Classic |
| Sci-Fi & Fantasy | Sci-Fi · Fantasy · Dystopian |
| Self-Mastery & Productivity | Habits · Productivity · Spirituality · Personal Growth |
| Psychology & Big Ideas | Behavioral Science · Sociology · Brain & Mind |
| Business & Money | Entrepreneurship · Personal Finance · Strategy |
| Memoir & Biography | Personal Memoir · Inspirational |
| Children's Books | Picture Books (0–7) · Middle Grade (8–12) · Young Reader (9–14) |
| Poetry & Shorts | Poetry · Novellas & Essays |

---

## Part 3 — JSON cleanup (legacy demo books)

We have 12 books in `src/content/books.json`. **10 are placeholders** with no real Amazon ASIN/URL — clicking "Buy on Amazon" won't work, which is bad UX. My recommendation:

| Slug | Recommendation | Why |
|---|---|---|
| the-loop | **DELETE** | Placeholder, fake book |
| atomic-creators | **DELETE** | Placeholder |
| midnight-library | **DELETE** | Duplicate — real Midnight Library is in DB with proper ASIN |
| dragons-promise | **DELETE** | Placeholder |
| digital-nomad-finance | **DELETE** | Placeholder |
| whispers-in-the-rain | **MOVE TO DB** | Real book (Anika Agarwal). Best to live in DB like all others |
| the-ai-playbook | **DELETE** | Placeholder |
| salt-and-stars | **DELETE** | Placeholder |
| cold-arithmetic | **DELETE** | Placeholder |
| quiet-leverage | **DELETE** | Placeholder |
| the-garden-protocol | **DELETE** | Placeholder |
| the-second-empire | **DELETE** | Placeholder |

Net effect: `books.json` becomes empty (or removed). Only real, Amazon-backed books in the marketplace. Catalog count stays at 92 (91 in DB + Whispers moves in = still 92).

**Reply OK to confirm this cleanup, or specify any placeholder you want to keep.**

---

## Part 4 — Per-book assignments

For each book: **primary category** · **sub-category** · *secondary categories (italic)*

### 📚 Fiction & Literature (23 primary)

| Book | Author | Sub | Secondary tags |
|---|---|---|---|
| 1984 | George Orwell | Classics | *Sci-Fi & Fantasy* |
| A Little Life | Hanya Yanagihara | Literary | — |
| A Thousand Splendid Suns | Khaled Hosseini | Historical | — |
| Brave New World | Aldous Huxley | Classics | *Sci-Fi & Fantasy* |
| Catch-22 | Joseph Heller | Classics | — |
| Cloud Atlas | David Mitchell | Literary | *Sci-Fi & Fantasy* |
| Eleanor Oliphant Is Completely Fine | Gail Honeyman | Contemporary | — |
| Normal People | Sally Rooney | Contemporary | *Romance* |
| Pride and Prejudice | Jane Austen | Classics | *Romance* |
| The Alchemist | Paulo Coelho | Literary | *Self-Mastery & Productivity* |
| The Book Thief | Markus Zusak | Historical | — |
| The Catcher in the Rye | J.D. Salinger | Classics | — |
| The God of Small Things | Arundhati Roy | Literary | — |
| The Great Gatsby | F. Scott Fitzgerald | Classics | — |
| The Help | Kathryn Stockett | Historical | — |
| The Kite Runner | Khaled Hosseini | Historical | — |
| The Lovely Bones | Alice Sebold | Literary | *Mystery & Thriller* |
| The Midnight Library | Matt Haig | Literary | — |
| The Seven Husbands of Evelyn Hugo | Taylor Jenkins Reid | Contemporary | *Romance* |
| The Vanishing Half | Brit Bennett | Literary | — |
| To Kill a Mockingbird | Harper Lee | Classics | — |
| Tomorrow, and Tomorrow, and Tomorrow | Gabrielle Zevin | Contemporary | — |
| Where the Crawdads Sing | Delia Owens | Literary | *Mystery & Thriller* |

### 🔍 Mystery & Thriller (6 primary)

| Book | Author | Sub | Secondary tags |
|---|---|---|---|
| Big Little Lies | Liane Moriarty | Domestic | *Fiction & Literature* |
| Gone Girl | Gillian Flynn | Psychological | — |
| The Da Vinci Code | Dan Brown | Crime | — |
| The Girl on the Train | Paula Hawkins | Psychological | — |
| The Silent Patient | Alex Michaelides | Psychological | — |
| The Thursday Murder Club | Richard Osman | Cozy | — |

### 💕 Romance (3 primary)

| Book | Author | Sub | Secondary tags |
|---|---|---|---|
| Beach Read | Emily Henry | Contemporary | *Fiction & Literature* |
| It Ends with Us | Colleen Hoover | Contemporary | — |
| Verity | Colleen Hoover | Contemporary | *Mystery & Thriller* |

### 🚀 Sci-Fi & Fantasy (4 primary)

| Book | Author | Sub | Secondary tags |
|---|---|---|---|
| A Game of Thrones | George R.R. Martin | Fantasy | — |
| Project Hail Mary | Andy Weir | Sci-Fi | — |
| The Fellowship of the Ring | J.R.R. Tolkien | Fantasy | — |
| The Hitchhiker's Guide to the Galaxy | Douglas Adams | Sci-Fi | — |

### 🧘 Self-Mastery & Productivity (8 primary)

| Book | Author | Sub | Secondary tags |
|---|---|---|---|
| Atomic Habits | James Clear | Habits | *Psychology & Big Ideas* |
| Daring Greatly | Brené Brown | Personal Growth | *Psychology & Big Ideas* |
| Deep Work | Cal Newport | Productivity | — |
| Ikigai | Hector Garcia | Spirituality | — |
| Range | David Epstein | Personal Growth | *Psychology & Big Ideas* |
| The 7 Habits of Highly Effective People | Stephen Covey | Personal Growth | — |
| The Art of Letting Go | Miles Niska | Spirituality | — |
| The Power of Now | Eckhart Tolle | Spirituality | — |

### 🧠 Psychology & Big Ideas (10 primary)

| Book | Author | Sub | Secondary tags |
|---|---|---|---|
| Grit | Angela Duckworth | Brain & Mind | *Self-Mastery & Productivity* |
| Mindset | Carol Dweck | Brain & Mind | *Self-Mastery & Productivity* |
| Outliers | Malcolm Gladwell | Sociology | — |
| Quiet | Susan Cain | Brain & Mind | — |
| Sapiens | Yuval Noah Harari | Sociology | — |
| Talking to Strangers | Malcolm Gladwell | Behavioral Science | — |
| The Body Keeps the Score | Bessel van der Kolk | Brain & Mind | — |
| The Tipping Point | Malcolm Gladwell | Sociology | — |
| Think Again | Adam Grant | Brain & Mind | *Self-Mastery & Productivity* |
| Thinking, Fast and Slow | Daniel Kahneman | Behavioral Science | — |

### 💼 Business & Money (5 primary)

| Book | Author | Sub | Secondary tags |
|---|---|---|---|
| Bad Blood | John Carreyrou | Entrepreneurship | *Memoir & Biography* |
| Rich Dad Poor Dad | Robert Kiyosaki | Personal Finance | — |
| The 4-Hour Workweek | Tim Ferriss | Entrepreneurship | *Self-Mastery & Productivity* |
| The Psychology of Money | Morgan Housel | Personal Finance | *Psychology & Big Ideas* |
| Zero to One | Peter Thiel | Entrepreneurship | — |

### 📖 Memoir & Biography (6 primary)

| Book | Author | Sub | Secondary tags |
|---|---|---|---|
| Becoming | Michelle Obama | Personal Memoir | — |
| Born a Crime | Trevor Noah | Personal Memoir | — |
| Can't Hurt Me | David Goggins | Inspirational | *Self-Mastery & Productivity* |
| Educated | Tara Westover | Personal Memoir | — |
| Man's Search for Meaning | Viktor Frankl | Inspirational | *Psychology & Big Ideas* |
| Tuesdays with Morrie | Mitch Albom | Inspirational | *Poetry & Shorts* |

### 🧒 Children's Books (18 primary)

| Book | Author | Sub | Secondary tags |
|---|---|---|---|
| Charlie and the Chocolate Factory | Roald Dahl | Middle Grade | — |
| Charlotte's Web | E.B. White | Middle Grade | — |
| Diary of a Wimpy Kid | Jeff Kinney | Middle Grade | — |
| Goodnight Moon | Margaret Wise Brown | Picture Books | — |
| Green Eggs and Ham | Dr. Seuss | Picture Books | — |
| Harry Potter and the Philosopher's Stone | J.K. Rowling | Young Reader | *Sci-Fi & Fantasy* |
| James and the Giant Peach | Roald Dahl | Middle Grade | — |
| Matilda | Roald Dahl | Middle Grade | — |
| The BFG | Roald Dahl | Middle Grade | — |
| The Cat in the Hat | Dr. Seuss | Picture Books | — |
| The Giving Tree | Shel Silverstein | Picture Books | — |
| The Gruffalo | Julia Donaldson | Picture Books | — |
| The Hobbit | J.R.R. Tolkien | Young Reader | *Sci-Fi & Fantasy* |
| The Lion, the Witch and the Wardrobe | C.S. Lewis | Young Reader | *Sci-Fi & Fantasy* |
| The Tale of Peter Rabbit | Beatrix Potter | Picture Books | — |
| The Very Hungry Caterpillar | Eric Carle | Picture Books | — |
| Where the Wild Things Are | Maurice Sendak | Picture Books | — |
| Wonder | R.J. Palacio | Middle Grade | — |

### ✍️ Poetry & Shorts (8 primary + 1 from JSON)

| Book | Author | Sub | Secondary tags |
|---|---|---|---|
| Home Body | Rupi Kaur | Poetry | — |
| Milk and Honey | Rupi Kaur | Poetry | — |
| Pillow Thoughts | Courtney Peppernell | Poetry | — |
| The Little Prince | Antoine de Saint-Exupéry | Novellas & Essays | *Fiction & Literature* |
| The Old Man and the Sea | Ernest Hemingway | Novellas & Essays | *Fiction & Literature* |
| The Stranger | Albert Camus | Novellas & Essays | *Fiction & Literature* |
| The Sun and Her Flowers | Rupi Kaur | Poetry | — |
| The Witch Doesn't Burn in This One | Amanda Lovelace | Poetry | — |
| **Whispers in the Rain** (moved from JSON) | Anika Agarwal | Poetry | — |

---

## Notable judgment calls (worth your second opinion)

1. **1984 / Brave New World as Classics primary, Sci-Fi secondary** — most readers shop them as classics first. Swap if you'd prefer them as Sci-Fi primary.
2. **The Alchemist** — fable-style, sometimes shelved as Self-Help. Keeping as Fiction primary because it's a novel; tagged Self-Mastery secondary.
3. **Pride and Prejudice** — kept as Classics primary; Romance secondary (so it surfaces when readers browse Romance).
4. **Verity** — primary as Romance (publisher markets it as romantic suspense) with Mystery & Thriller secondary. Some sites would flip these.
5. **The Lovely Bones** — primary Fiction & Literature; the murder mystery thread surfaces via Mystery secondary.
6. **Tuesdays with Morrie** — moved primary from Shorts to Memoir; Shorts as secondary.
7. **Big Little Lies** — primary Mystery & Thriller (Domestic sub), Fiction secondary. Could go either way.
8. **Indian Voices** — Hosseini × 2 (Kite Runner, Thousand Splendid Suns) + Arundhati Roy + Anika Agarwal. Not adding "Indian Voices" as a category to keep the count at 10. Could add it as a curated tag for a homepage carousel later.

---

## How to review

**Reply with one of:**

- **"Approve all"** — I execute the full plan as-is
- **"Approve with these changes: …"** — I apply your overrides then execute
- **"Hold — let's discuss [X]"** — we iterate

Specific override format that's easy: *"Move [Book Title] primary to [Category]"* or *"Swap primary/secondary on [Book]"*.

---

## What I'll execute on approval (single revertable commit)

1. **DB migration**: add `primary_category text`, `secondary_categories text[]`, `sub_category text` columns to `book`
2. **Backfill UPDATEs**: 91 rows per the assignments above
3. **JSON cleanup**: delete 11 placeholder entries from `books.json`; move Whispers in the Rain to DB
4. **Frontend**:
   - `/books/` homepage: replace 8-category grid with 10-card 5×2 layout showing cover stacks + counts
   - `/marketplace/[category]/` page: chip-filter row for sub-categories, working filter logic
   - Category routes: support new slugs (`/marketplace/fiction-and-literature/`, etc.) with redirects from old (`/marketplace/self-help/` → `/marketplace/self-mastery-and-productivity/`)
   - Internal PDP breadcrumb: `Marketplace / {Primary} / {Sub} / {Book}`
   - BookCard: optional sub-category chip
5. **Admin updates**:
   - BookForm: primary dropdown, secondary multiselect, sub dropdown (filtered by primary)
   - CSV import template: add `primary_category`, `secondary_categories` (pipe-separated), `sub_category` columns
6. **Tag in homepage carousels**: Bestsellers / New Releases / By category / Editor's Picks unchanged but now sourcing from the new fields

Estimated work: 1.5–2 hours of dev. Single commit revertable via `git revert`.
