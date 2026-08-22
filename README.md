# Dale — Astrophotography

<!-- BADGES:START -->
![license](https://img.shields.io/badge/license-All%20rights%20reserved-blue)
![Last commit](https://img.shields.io/github/last-commit/CMDRPhaedra/Astrophotography)
![Repo size](https://img.shields.io/github/repo-size/CMDRPhaedra/Astrophotography)
![Open issues](https://img.shields.io/github/issues/CMDRPhaedra/Astrophotography)
![HTML](https://img.shields.io/badge/HTML-76.7%25-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-14.1%25-blue)
![Python](https://img.shields.io/badge/Python-9.2%25-blue)
<!-- BADGES:END -->
![Images](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/CMDRPhaedra/Astrophotography/main/badges/images-count.json)
![Integration time](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/CMDRPhaedra/Astrophotography/main/badges/integration-time.json)

Personal astrophotography gallery. The gallery itself is a single self-contained `index.html`; the blog, the per-photo pages and the standalone pages around it are built by GitHub Pages' native Jekyll. Hosted on GitHub Pages.

**Live site:** https://chryse.co.uk

---

## Features

- **Gallery grid** with filterable categories (galaxies, nebulae, clusters, solar system)
- **Sort bar** — sort the gallery by Date, Distance, or Name, each reversible with a second click
- **Latest capture strip** — always shows the first entry in the `CAPTURES` array with a pulsing indicator
- **Search** — press `/` to focus the search bar; searches target names, catalogue numbers, and descriptions; works alongside the category filter
- **Descriptive gallery alt text** — grid thumbnails carry an alt combining the title and a snippet of the description (e.g. *"Elephant's Trunk Nebula — IC 1396A is a dense globule of cold gas…"*); the lightbox and latest-capture image keep a plain title alt since their full description is already shown as visible text right next to them, so a richer alt there would just duplicate it for screen readers
- **Per-capture alt text** — the photo pages and the `/photos/` grid build a unique alt sentence for every image from the capture's own front matter (catalogue, object type, distance, location) via the shared `_includes/capture-alt.html`, so no two images share a templated string; see [Per-photo pages](#per-photo-pages)
- **Per-page meta descriptions** — every capture and post carries its own `description`, so nothing falls back to a mid-sentence slice of its opening paragraph; capture descriptions are generated alongside the pages themselves, see [Meta descriptions](#meta-descriptions)
- **Stats bar** — live count of total images, per-category breakdown with dot visualisation, and total integration time observed
- **Lightbox** with scroll-to-zoom, drag-to-pan, double-click to reset, pinch on mobile, arrow key navigation, and image counter; includes Copy link, Sky view, and theme toggle buttons
- **Sky view** — a ⛶ Sky view button in the lightbox opens a full-screen interactive sky atlas (Aladin Lite, CDS Strasbourg) centred on the target, with DSS2 optical, 2MASS near-infrared, and Hα survey options; Aladin is ~1.8 MB and is fetched on first use rather than at page load, so it costs nothing to visitors who never open it
- **Equatorial coordinates** — the lightbox shows each target's J2000 RA/Dec, computed on the fly from the galactic `l`/`b` already stored for the 3D Map (an exact astronomical transform, so no coordinates are hand-entered and none can drift); shown only for cards whose primary depth entry has `l`/`b`
- **3D depth view** per card — hover any deep-sky card and click **⬡ 3D** to open an interactive Plotly scene at the card's real distance from Earth
- **⬡ 3D Distance** — all targets on a single stretched-log distance axis with a built-in explainer
- **⬡ 3D Map** — all targets in real galactic coordinates with type filters (All / Galaxies / Nebulae / Clusters) and a built-in explainer. Pure canvas, no external libraries.
- **Deep linking** — opening a lightbox updates the URL to `?photo=slug` (e.g. `?photo=veil-nebula-complex`); sharing that URL opens the site with that image already in the lightbox, including via iMessage, WhatsApp, and Discord
- **Per-photo pages** at [/photos/](https://chryse.co.uk/photos/) — every capture gets its own static, crawlable page at `/photos/<slug>/`, generated from the `CAPTURES` array so it can never drift from the gallery
- **Field notes blog** at [/blog/](https://chryse.co.uk/blog/) — Jekyll posts in `_posts/`, built automatically by GitHub Pages, with an RSS feed at `/feed.xml` (jekyll-feed)
- **Blog search** — the blog index has its own `/`-focused search bar, independent of the gallery's; it matches against the full text of every post, not just the visible excerpt
- **Keyboard accessible** — `/` focuses search, `?` opens a shortcut cheatsheet, Tab reaches every card and control, Enter/Space opens a card, arrows navigate the lightbox, Escape closes; a **?** button in the header surfaces the same cheatsheet for mouse users
- **Automatic WebP conversion** — a GitHub Action converts new images to WebP on every push and updates references in `index.html` and `_posts/` automatically
- **Automatic thumbnails** — the same Action generates 640 px thumbnails in `images/thumbs/`; the gallery grid loads those (~1.4 MB total) instead of the full-resolution files (~20 MB), and the lightbox still opens the full image
- **Self-updating noscript SEO block and `ItemList`** — `scripts/update_noscript.py` regenerates both the crawler-visible capture list and the head's `ItemList` JSON-LD from the `CAPTURES` array, so neither can drift; it also runs inside the Action
- **Self-updating README badges** — the Images and Integration time badges above are shields.io endpoint badges fed by `badges/*.json`, regenerated from the `CAPTURES` array by `scripts/generate_badges.py` inside the Action
- **Open Graph / Twitter card meta tags** for rich link previews
- **Structured data (JSON-LD)** — every photo page emits `ImageObject` + `BreadcrumbList`, blog posts emit `BlogPosting` + `BreadcrumbList`, and the gallery emits a `WebSite`/`Person`/`CollectionPage` graph plus an `ItemList` naming every capture, so Google Images and rich results have machine-readable context. Images declare `license` and `acquireLicensePage`, which is what qualifies them for Google Images' licensable treatment
- **Installable (PWA)** — a `manifest.webmanifest` with maskable 192/512 px icons (rasterised from `favicon.svg`) lets mobile visitors Add to Home Screen with a proper name and icon; no service worker, so nothing is cached offline
- **Custom 404 page** — an on-brand `/404.html` (dark theme, nav intact) served by GitHub Pages instead of the generic default
- **Favicon** — black hole event horizon icon (SVG for Chrome/Firefox, PNG fallback for Safari)
- **Light / dark theme** toggle — available in the main header, lightbox, and sky view modal; choice is remembered across visits
- **Profile links** — AstroBin and Instagram in both footers, plus a Follow button beside the theme toggle in the gallery header; all carry `rel="me"`, the visible counterpart to the `Person` schema's `sameAs`, see [SEO](#seo)
- **Gear & process page** at [/gear/](https://chryse.co.uk/gear/) — the Dwarf 3, shooting conditions in Edinburgh, and the capture/stacking workflow; linked from the nav, the hero, the gallery footer, and every photo page. The page has a hidden hardware-photo slot: drop a photo named `dwarf3_telescope.jpg` (any format) into `images/` and push — the Action converts it and the figure appears automatically
- **Bortle scale page** at [/bortle/](https://chryse.co.uk/bortle/) — what the nine sky-darkness classes mean and how each one maps to integration time, with the scale itself built in CSS rather than shipped as an image, so it reflows on mobile, follows the light/dark theme, and stays real indexable text. Emits `FAQPage` + `BreadcrumbList` JSON-LD
- **Sky conditions page** at [/sky/](https://chryse.co.uk/sky/) — tonight's imaging conditions over Edinburgh: a cloud-cover dial, a plain-English verdict, the astronomical darkness window, moon phase and illumination, and a twelve-hour cloud trend. Cloud comes from Apple WeatherKit via a proxy; all the astronomy is computed in the browser, so the page still works when the weather service is down. Not to be confused with the lightbox's **Sky view** (Aladin); see [Sky conditions page](#sky-conditions-page)
- **Privacy policy** at [/privacy/](https://chryse.co.uk/privacy/), linked from both the gallery and blog footers
- **Image licence** at [/licence/](https://chryse.co.uk/licence/) — restates the terms in the repo's `LICENSE` file as a public page, so the `license` and `acquireLicensePage` fields in the image schema resolve to the actual terms; linked from both footers
- **Image sitemap** at `/image-sitemap.xml` — a second sitemap alongside the generated `sitemap.xml`, giving every capture an `<image:image>` entry for Google Images; see [SEO](#seo)
- **Anchor app pages** at [/anchor/support/](https://chryse.co.uk/anchor/support/) and [/anchor/privacy/](https://chryse.co.uk/anchor/privacy/) — support and privacy pages for a separate macOS app, hosted here but deliberately kept outside the site's own navigation; see [Anchor pages](#anchor-pages)
- Animated starfield background

---

## How to add a new capture

### 1. Drop the image into `images/`

```
Astrophotography/
├── index.html
└── images/
    ├── m31_andromeda_galaxy.webp
    ├── m42_orion_nebula.webp
    └── ...
```

Follow the naming convention: all lowercase, underscores not spaces, no special characters, catalogue number first. For example: `ngc1234_whatever_nebula.jpg`.

Drop the file in any common format — `.jpg`, `.jpeg`, `.png`. The GitHub Action will convert it to `.webp` automatically on push.

### 2. Add an entry to the `CAPTURES` array in `index.html`

Open `index.html` and find the `CAPTURES` array near the top of the script block. Add a new object **at the very top** (latest capture first).

Use the **original filename** (before WebP conversion) — the Action will update it automatically:

```js
{
  img:   'images/ngc1234_whatever_nebula.jpg',
  tag:   'nebula',
  title: 'Whatever Nebula',
  meta:  'NGC 1234 · 01 May 2026 · Edinburgh · 45m',
  depth: [{ name: 'Whatever Nebula (NGC 1234)', type: 'nebula', ly: 5000, l: 123.4, b: -5.6 }],
  desc:  "Free text description. Apostrophes work fine here.",
},
```

**`tag` values:** `galaxy` · `nebula` · `cluster` · `other`

**`wide: true`** is optional. Adding it makes the card span two columns and switches its image to a 16:7 aspect ratio. Use it for your best or widest-field captures.

**`depth`** is optional but enables the per-card ⬡ 3D button and includes the target in the 3D Distance and 3D Map views. Omit it for comets or any target without a meaningful distance. The primary (first) entry **must include `l` and `b`** (galactic longitude and latitude in degrees) — without these the target won't appear on the 3D Map, and the lightbox won't show its J2000 RA/Dec (derived from `l`/`b` at runtime). Companion objects don't need `l`/`b`. Include multiple objects for cards that show more than one target:

```js
depth: [
  { name: 'Heart Nebula (IC 1805)',       type: 'nebula',  ly: 7500, l: 134.7, b: 1.2 },
  { name: 'Melotte 15 (central cluster)', type: 'cluster', ly: 7500 },
],
```

Valid `type` values: `galaxy` · `nebula` · `cluster` · `star`

**`meta` format:** `Catalogue · DD Mon YYYY · Location · Integration time` — the date is used by the Date sort, so keep it consistent.

The catalogue segment should list **every well-known designation** for the object, joined with ` / ` — e.g. `C27 / NGC 6888 / Sh2-105`, not just `C27`. Stick to catalogues already used on this site (Messier, NGC, IC, Caldwell, Barnard, Sharpless/`Sh2-`); verify each one (SIMBAD/Wikipedia), don't guess NGC/IC numbers from memory, and skip more obscure catalogues (vdB, LDN, UGC, Collinder, Melotte, etc.) even if they technically exist for that object — they aren't part of this site's vocabulary. Blog posts' `target` front matter (see [Blog](#blog) below) should list the same set, for consistency between a post and its gallery card.

**`skyTarget`** is optional and overrides the Sky view (Aladin) target. The Sky view resolves its target via `card.dataset.skyTarget || meta.split('·')[0].trim() || ...` — if `skyTarget` is omitted, the **entire** first segment of `meta` (everything before the first `·`) is sent to the CDS Sesame name resolver as-is. Sesame handles a single ID fine (`M42`, `NGC 6888`) but cannot parse a joined string, so **any capture whose catalogue segment contains ` / ` or ` & ` needs an explicit `skyTarget`** set to one single resolvable ID (usually the Messier or NGC number) — otherwise Sky View silently fails to centre on the target. This also covers the older case of Caldwell (`C11`) or Barnard (`B33`) shorthand, which Sesame doesn't understand even alone:

```js
meta:      'C11 / NGC 7635 / Sh2-162 · 10 Jul 2026 · Edinburgh · 2h 11m',
skyTarget: 'NGC 7635',
```

Captures tagged `other` (Moon, Sun, comets) never show the Sky view button — they have no fixed sky position.

### 3. Push to GitHub

```bash
git add images/ngc1234_whatever_nebula.jpg index.html
git commit -m "Add Whatever Nebula"
git push
```

The GitHub Action fires within seconds and does the rest: converts the image to WebP, generates its thumbnail, updates the filename references in `index.html` and `_posts/`, regenerates the noscript SEO block, the per-photo pages in `_captures/`, and the gallery stat badges from `CAPTURES`, and commits back. The live site updates within ~30 seconds of the Action completing.

---

## WebP conversion

All images are stored and served as WebP for fast load times. Conversion is handled automatically — you never need to think about it.

### How it works

A GitHub Action (`.github/workflows/convert-webp.yml`) triggers whenever images are pushed to `main`. It runs `convert_to_webp.py` at quality 85, deletes the originals, updates `index.html` and `_posts/` with the new filenames, generates any missing thumbnails in `images/thumbs/` (640 px wide, quality 80 — the gallery grid loads these instead of the full-size files), regenerates the noscript block, the per-photo pages, and the gallery stat badges, and commits everything back to the repo.

### Manual conversion (one-off or bulk)

To convert images locally without waiting for the Action — useful if you want to check file sizes first:

```bash
# Preview what would happen without making any changes
python3 convert_to_webp.py --dry-run

# Convert and update index.html, keep originals
python3 convert_to_webp.py --quality 85

# Convert, update index.html, and delete originals
python3 convert_to_webp.py --quality 85 --delete
```

Requires Pillow: `pip3 install Pillow --break-system-packages`

### Quality setting

The default quality is **85**, which is roughly equivalent to JPEG 90–92 in perceived sharpness. Typical savings on astrophotography images are 60–99% compared to the original PNGs and JPEGs. To adjust, edit the `Run WebP conversion` step in `convert-webp.yml`:

```yaml
run: python convert_to_webp.py --quality 85 --delete
```

---

## File naming convention

All image files live in `images/` (lowercase) and follow this pattern:

- All lowercase
- Underscores instead of spaces
- No special characters (no apostrophes, ampersands, brackets)
- Catalogue number first: `m42_`, `ngc6960_`, `ic443_`, `b33_`
- Push in any format — the Action converts to `.webp` automatically

Examples: `m42_orion_nebula.jpeg` → `m42_orion_nebula.webp` · `ngc6960_western_veil_nebula.png` → `ngc6960_western_veil_nebula.webp`

---

## Sort

Three sort options sit below the stats bar:

- **Date** (newest first by default) — reads the date from the `meta` field. Entries without a date sort as oldest.
- **Distance** (nearest first by default) — reads from the `depth` field. Entries without a `depth` value (solar-system captures) always sort to the bottom.
- **Name** (A→Z by default) — alphabetical by `title`.

Click the active sort button again to reverse direction. Sort and filter/search work together — the visible order always reflects both.

---

## 3D features

### Per-card 3D depth view (⬡ 3D button)

Hover any deep-sky card to reveal the **⬡ 3D** button in the top-left corner. Clicking it opens an interactive Plotly scene showing the card's target(s) on depth sticks at their real distances from Earth, with a sky-plane quad representing the photograph. Uses a stretched-log distance axis so nearby nebulae and distant galaxies coexist in the same scene. An expandable explainer inside the modal describes how to read the chart.

- Drag to rotate · scroll to zoom · hover markers for distance · double-click to reset
- Plotly (~3.4 MB) loads from CDN on first use and is cached for the session

### 3D Distance (nav button)

Shows all deep-sky targets together on a single stretched-log distance axis, sorted near→far. Same Plotly renderer as the per-card view. Includes an expandable explainer.

### 3D Map (nav button)

Shows all deep-sky targets in real galactic coordinates:

- **Radial position** — distance from Sol on a stretched-log scale, with labelled rings at 500 ly, 2 kly, 10 kly, 100 kly (Milky Way edge), 1 Mly, 10 Mly, 83 Mly
- **Angular position** — galactic longitude (l), the real direction of each target around the galactic plane
- **Pin height** — galactic latitude (b), how far above or below the galactic plane each target sits

Filter buttons (All / Galaxies / Nebulae / Clusters) let you isolate object types. An expandable explainer walks through how to read the map. Pure canvas renderer — no external libraries, opens instantly.

Controls: drag to rotate and tilt · scroll to zoom (up to 8×) · hover markers for coordinates · Reset restores default view · Escape closes

---

## First-time setup on GitHub

1. Create a new repository at https://github.com/new
2. Push the whole repo — alongside `index.html` and `images/`, the moving parts are `convert_to_webp.py` + `scripts/` (automation), `.github/` (the Actions), `_config.yml` + `_layouts/` + `_includes/` + `_posts/` + `blog/` (the Jekyll blog), `_captures/` + `photos/` (per-photo pages), `badges/` (gallery stat badges), `image-sitemap.xml` (image indexing), `anchor/` (the Anchor app pages), and `ads.txt` (AdSense verification, must stay at the domain root)
3. Go to **Settings → Pages**
4. Under *Source*, select **Deploy from a branch**, choose `main`, folder `/root`
5. Click Save — your site will be live at `https://yourusername.github.io/astrophotography`

### Custom domain

The site is live at **chryse.co.uk**, registered via IONOS with DNS pointing to GitHub Pages.

DNS A records (all four required):
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```
CNAME: `www` → `cmdrphaedra.github.io`

HTTPS is handled automatically by GitHub Pages via Let's Encrypt.

---

## Search (gallery)

Press `/` from anywhere on the gallery page to focus the search bar. It searches across target names, catalogue numbers, metadata, and description text. Works alongside the category filter — e.g. filter to Nebulae then search "Cygnus" to narrow further. Press Escape to clear and return focus to the page.

This is a separate implementation from the blog's own search (see [Blog search](#blog-search) below) — the gallery is a single JS-rendered page working off the in-memory `CAPTURES` array, while the blog is static Jekyll output with no shared runtime, so each needed its own small filter script.

---

## Latest capture strip

The strip between the hero text and the gallery always reflects `CAPTURES[0]` — the first entry in the array. To update it, simply add the new capture object at the top of the `CAPTURES` array.

It loads the **thumbnail**, not the full-resolution capture. The strip renders into a 340 px box and is the only eager image on the page, which makes it the likeliest Largest Contentful Paint element — pointing it at `img` meant a visitor could wait on a 1.6 MB file to paint a 340 px box. It falls back to the full image if the thumbnail is missing, the same way the grid cards do.

---

## Blog

Field notes live at [/blog/](https://chryse.co.uk/blog/), built by GitHub Pages' native Jekyll support — no extra Action, no build step. Only files with YAML front matter are processed; `index.html` has none and is served untouched. An RSS feed is generated at `/feed.xml` by jekyll-feed.

To add a post, create `_posts/YYYY-MM-DD-slug.md`:

```markdown
---
layout: post
title: "Sadr's Butterfly: A Trick of Perspective"
description: "72 minutes on IC 1318 in Cygnus. Sadr looks embedded in the nebula but sits three times closer — the glow comes from a hot star hidden in the dust."
date: 2026-07-13
target: "IC 1318 / Sh2-108 · Gamma Cygni Nebula"
distance: "4,900 light-years"
integration: "1h 12m"
image: /images/ic1318_gamma_cygni_nebula.webp
---

Post body in Markdown…
```

`target`, `distance`, and `integration` are optional and render in the post's meta line; `image` is the 16:9 cover and the Open Graph preview. Keep `target`'s catalogue segment (before the ` · `) consistent with the same object's gallery-card `meta` — see the multi-catalogue note above. Posts are published at `/blog/YYYY/MM/DD/slug/`, and the first paragraph is the excerpt shown on the blog index. To link a post back to its gallery card, use the deep-link form `[gallery card](/?photo=slug)`.

**Write a `description`.** It is the meta description and the Open Graph description, so it is what the post looks like in a search result and in a link preview. Aim for 150 characters or so and say what the post is actually about — without one the layout falls back to the first 155 characters of the opening paragraph, which almost always cuts mid-sentence. See [Meta descriptions](#meta-descriptions).

`updated` is optional: set it to a `YYYY-MM-DD` date when you meaningfully revise a published post, and the `BlogPosting` schema reports it as `dateModified`. Without it `dateModified` equals `datePublished`, which is accurate for a post that hasn't been touched since it went up.

`image_alt` is optional and overrides the cover image's alt text, which otherwise falls back to the post title. The title is fine for a nebula photo, where the image is the thing the title names. Set `image_alt` when the cover is an information graphic rather than a capture — the Bortle post uses it to give the scale chart the same full description it carries on `/bortle/`.

**The first block of a post must be prose, not raw HTML.** Jekyll takes the excerpt from everything before the first blank line, and Liquid's `strip_html` discards `<style>` and `<script>` blocks wholesale rather than just unwrapping them. A post that opens with one gets an empty excerpt on the blog index *and* an empty `description` in its `BlogPosting` schema, silently. If a post needs its own CSS — for example to override the 16:9 `.post-cover` crop for a cover that isn't 16:9 — put the `<style>` block after the opening paragraph.

---

## Blog search

The blog index (`blog/index.html`) has its own search bar, built the same way as the gallery's but entirely separately, since the blog has no access to the gallery's `CAPTURES` array or JS runtime.

At build time, Jekyll's `{% for post in site.posts %}` loop stamps each `<li class="post-item">` with a `data-search` attribute containing that post's title, `target`, and full content (via `strip_html | strip_newlines | escape`) — not just the truncated excerpt shown on the page, so a search can match text that never appears in the visible preview. A small inline script filters `.post-item`s by substring match against `data-search`, highlights matches in the title with `<mark>`, shows a live result count, and supports the same `/`-to-focus and Escape-to-clear behaviour as the gallery search.

Because it's plain client-side JS reading attributes already in the rendered HTML, there's no separate index file to keep in sync and no build step beyond what GitHub Pages already does.

---

## Per-photo pages

Every capture also gets its own static page at `/photos/<slug>/`, with an index of all of them at [/photos/](https://chryse.co.uk/photos/). These are Jekyll collection pages (`_captures/`, published via the `captures` collection in `_config.yml` with the `capture` layout) — fully crawlable HTML with the image, capture details, and description, unlike the JavaScript-rendered gallery.

Each page's `description` front matter is generated too, by `build_description()` in the same script — see [Meta descriptions](#meta-descriptions) for why it is assembled from the metadata rather than taken from the prose.

The files in `_captures/` are generated from the `CAPTURES` array by `scripts/generate_capture_pages.py` — **never edit them by hand**. The slug mirrors the gallery's own `slugify()`, so `/photos/<slug>/` and the `?photo=<slug>` deep links always agree, and each page links back to its gallery card. The script runs automatically in the convert-webp Action, so pushing a new image keeps the pages in sync; to regenerate locally, run `python3 scripts/generate_capture_pages.py` from the repo root.

---

## Anchor pages

The repo also hosts the support and privacy pages for **Anchor**, a separate macOS menu bar app that keeps desktop icons where you put them. They live at [/anchor/support/](https://chryse.co.uk/anchor/support/) and [/anchor/privacy/](https://chryse.co.uk/anchor/privacy/). Nothing to do with astrophotography — they're here because the Mac App Store requires a public support URL and a public privacy policy URL, and this domain was already live.

They use `_layouts/app.html`, which is deliberately standalone rather than extending `default.html`: a visitor arriving from the App Store gets Anchor's own header and a two-item Support / Privacy nav, not the gallery navigation, which would be baffling in that context. It keeps the same palette, typography and light/dark handling as the rest of the site, so the pages still read as part of chryse.co.uk, and its footer links back to the gallery.

Neither page is linked from the site's own navigation, and both are ordinary Jekyll pages — they're picked up by `sitemap.xml` automatically.

---

## Google AdSense

`ads.txt` in the repo root declares the AdSense publisher ID (`pub-3829889623088010`) as an authorised seller of this domain's inventory. It's served at `https://chryse.co.uk/ads.txt` and is required by AdSense for the domain to be verified. Don't rename, move or exclude it — the file has to sit at the domain root to be found.

---

## Open Graph tags

The `<head>` includes Open Graph and Twitter card meta tags for rich previews in iMessage, Discord, Slack, and social media, along with `og:site_name` and `og:locale` (`en_GB`). The document language is `en-GB` throughout, matching the `inLanguage` the schema already declared. To update the preview image, use **absolute URLs**:

```html
<meta property="og:image" content="https://chryse.co.uk/images/your-filename.webp">
<meta name="twitter:image" content="https://chryse.co.uk/images/your-filename.webp">
```

The `og:image` should be at least 1200 × 630 px for best results.

Jekyll pages take their preview from the page's own `image` front matter, and fall back to `og_image` in `_config.yml` when there isn't one. Only the posts, the capture pages and `/bortle/` set their own, so without the fallback `/gear/`, `/photos/`, `/blog/`, `/sky/`, `/privacy/` and `/licence/` shared as a bare title with no picture. The fallback also covers a post whose cover hasn't been added yet — the layout checks the file actually exists, so a missing cover degrades to the site image rather than advertising a 404.

---

## Recommended image sizes

| Use | Size |
|-----|------|
| Wide cards | 1800 × 800 px |
| Standard cards | 1200 × 900 px |

Push in any format — the Action handles compression to WebP automatically. No need to pre-process images before pushing.

---

## Deep linking

Every time a lightbox opens, the URL updates automatically — for example:

```
https://chryse.co.uk/?photo=veil-nebula-complex
https://chryse.co.uk/?photo=markarians-chain
https://chryse.co.uk/?photo=horsehead-nebula
```

Query parameters (`?photo=`) are used rather than hash fragments (`#`) so that links shared via iMessage, WhatsApp, Discord, and other messaging apps open the correct image. Hash fragments are stripped by most apps when generating link previews; query parameters are preserved.

Copying the URL from the address bar always gives a shareable link that opens directly to that image. When someone follows the link they land on the gallery with the correct lightbox already open, regardless of any filter or sort they might have active.

The slug is generated automatically from the `title` field — no extra configuration needed in `CAPTURES`. The rules are: lowercase, apostrophes removed, non-alphanumeric characters replaced with hyphens. Closing the lightbox restores the clean gallery URL.

---

## SEO

The site is verified with Google Search Console and a sitemap submitted at `https://chryse.co.uk/sitemap.xml`. The sitemap is generated automatically on every build by the `jekyll-sitemap` plugin (see `_config.yml`) — there is nothing to update by hand. The `<head>` includes a canonical URL tag and a sitemap link for search engine discovery. A `robots.txt` in the repo root allows all crawlers and points to both sitemaps.

Every indexable page also carries `max-snippet:-1, max-image-preview:large, max-video-preview:-1`, which lifts the snippet and preview limits Google would otherwise pick for itself. These are honoured by AI Overviews and AI Mode as well as ordinary results, so they are what permits a full passage to be quoted and the image shown at full size rather than as a thumbnail. Pages that set `noindex` in their front matter — currently only `404.html` — keep that instead.

### Image sitemap

`jekyll-sitemap` has no support for the sitemap image extension, so the captures — the whole point of the site, and the thing most likely to be found through Google Images — were invisible to image indexing. `image-sitemap.xml` in the repo root is a second sitemap that fixes this: a Liquid template looping the `captures` collection, one `<image:image>` entry per capture page pointing at that page's full-size image. It carries `sitemap: false` so `jekyll-sitemap` doesn't list it inside `sitemap.xml`.

**Both sitemaps need submitting in Search Console** — `sitemap.xml` and `image-sitemap.xml`. Both are listed in `robots.txt`. The file regenerates itself from the collection on every build, so adding a capture needs no edit here.

Only `<image:loc>` is emitted. Google deprecated `image:title`, `image:caption`, `image:geo_location` and `image:license` and now ignores them; the descriptive text that used to live in those tags is in each image's alt attribute and `ImageObject` schema instead.

### Meta descriptions

`_layouts/default.html` builds the `<meta name="description">` and `og:description` from the page's own `description` front matter, falling back to a 155-character slice of the excerpt only when there isn't one. The branch matters: written as a single filter chain, `page.description | default: page.excerpt | ... | truncate: 155` applies the truncate to *whichever value survived the default*, so a description written by hand was cut at 155 too — `/gear/`, `/photos/` and `/blog/` were all being chopped mid-word.

Every capture and post now carries its own, so nothing relies on the fallback. **Posts are written by hand** (see [Blog](#blog)). **Capture descriptions are generated** by `build_description()` in `scripts/generate_capture_pages.py`, assembled from title, catalogue, object type, distance, integration and date:

```
Omega Nebula (M17 / NGC 6618 / Sh2-45) — a nebula 5,500 light-years from
Earth. 3h 45m of integration from Edinburgh with a Dwarf 3 smart telescope.
```

The prose can't be reused for this. Capture descriptions open with sentences of 150–270 characters (median 156), which is exactly why truncating the first one read so badly — assembling the sentence instead means it always ends where it should. Clauses are optional in reverse order of value: the date is dropped first when the sentence would run long, then the distance, then the integration time. The catalogue IDs go in early on purpose, since `M17` and `Sh2-45` are what people type into a search box and they differ on every page.

Two wrinkles come from the source data. Roughly half the gallery has no single distance — the wide fields and pairs carry several depth targets, and the Sun and Moon carry none — so that case folds the object type into the capture sentence rather than leaving a terse `— a galaxy.` fragment. And `tag` is a single gallery-filter category, so a frame holding several objects is still tagged `galaxy`; a `PLURAL_TITLE` regex catches the five titles that say so plainly (Leo Triplet, Markarian's Chain, Cigar & Bode's, Heart & Soul, Veil Complex) and gives them `galaxies` or `nebulae`.

### Alt text

Grid thumbnails on the gallery combine the title with a snippet of the description. The photo pages and the `/photos/` grid go further: `_includes/capture-alt.html` builds a unique sentence per capture from the front matter `scripts/generate_capture_pages.py` already writes — catalogue, object type, distance and location — so each image gets its own string rather than one template with the title swapped. Near-identical alt text across a whole gallery gives Google Images nothing to tell one capture from another. Every clause except title, tag and location is conditional, since the comets have no catalogue and the Sun and Moon have neither distance nor a meaningful object type.

The include is shared by `_layouts/capture.html` and `photos/index.html` specifically so the two can't drift. Callers must `strip` the result before putting it in an attribute.

A `<noscript>` block in `index.html` lists every capture as static HTML so crawlers that don't execute JavaScript can still index the gallery. It is generated from the `CAPTURES` array by `scripts/update_noscript.py` (run automatically by the convert-webp Action, or manually with `python3 scripts/update_noscript.py`) — never edit it by hand.

Each entry carries only the **first sentence** of its description. It used to carry the whole thing, which put a verbatim copy of all 59 capture-page bodies on the home page and left the canonical home of each description ambiguous — the same text was the entire body of `/photos/<slug>/`. One sentence still tells a non-JS crawler what the capture is, and the link beside it goes to the page that owns the full text. That alone halved the block, from about 41,000 characters to 18,700.

The per-photo pages at `/photos/<slug>/` (see above) give every capture a real, individually indexable URL on top of the noscript block, and are picked up by the sitemap automatically.

**Structured data (JSON-LD)** is emitted on every page for rich results: photo pages carry `ImageObject` + `BreadcrumbList` (in `_layouts/capture.html`), blog posts carry `BlogPosting` + `BreadcrumbList` (in `_layouts/post.html`), and the gallery head carries a `WebSite` / `Person` / `CollectionPage` `@graph` (in `index.html`). `/gear/` and `/sky/` add their own `BreadcrumbList`, and `/bortle/` adds `FAQPage` on top of one. All of it is filled from the same front matter and `CAPTURES` data the pages already use, so it can't drift from what's displayed.

**`ItemList`** names the members of each index, which none of them previously did — the home page's grid is rendered from `CAPTURES` by JavaScript, and its `CollectionPage` entry described the collection without ever naming a member. The home page's list is generated by `scripts/update_noscript.py` between the `ITEMLIST` markers (it can't be Liquid — `index.html` has no front matter and Jekyll never processes it) and is wired to the `CollectionPage` via `mainEntity`. `/photos/` and `/blog/` build theirs in Liquid; `/blog/` wraps its list in a `Blog` node whose `@id` is what every post's `isPartOf` points at, so the two agree instead of describing the blog separately. Worth being clear that **this will not produce a carousel** — Google's `ItemList` rich results cover a handful of content types and a photo archive isn't one. It is there so the indexes can state what they hold and in what order.

The **`Person`** entity carries a description, `homeLocation`, `knowsAbout` and `sameAs` alongside the name and job title. `sameAs` is how a search engine reconciles the Dale on this site with the same person on AstroBin or Instagram, rather than treating each as an unrelated name. Only add profiles that genuinely belong to the same person — a `sameAs` pointing at a profile that isn't yours, or at a URL that 404s, actively fails verification rather than being merely useless.

The same three profiles appear as visible `rel="me"` links in both footers, and as a **Follow** button beside the theme toggle in the gallery header. That button is styled off `.theme-toggle` so it matches the surrounding controls, with the Instagram glyph as inline SVG in `currentColor` — no external request and no brand asset. `rel="me"` is the visible counterpart to `sameAs`: a link a crawler follows as a matter of course, rather than a hint it may ignore. It carries most weight when the profile links back here too, so put `chryse.co.uk` in the bio of anything added. External profile links open in a new tab; every internal link on the site stays in place.

Both image schemas declare `license` and `acquireLicensePage`, pointing at [/licence/](https://chryse.co.uk/licence/). That pair is what qualifies an image for Google Images' licensable treatment, and the target has to be a page that actually states the terms — pointing it at the privacy policy, as the blog layout once did, is a dead signal rather than a working one. The photo pages matter most here, since `image-sitemap.xml` points at them. Keep `copyrightNotice` in both layouts in step with the repo's `LICENSE` file and the `/licence/` page.

A missing-page request is served by an on-brand `404.html` (uses `layout: default`, `sitemap: false`) rather than the GitHub Pages default, and the site ships a `manifest.webmanifest` (with 192/512 px icons rasterised from `favicon.svg`) so it is installable as a PWA — no service worker, so nothing is cached offline.

---

## Sky conditions page

[/sky/](https://chryse.co.uk/sky/) answers one question — is it worth setting up tonight? — for Edinburgh specifically (55.9533°N, −3.1883°W, hard-coded as `data-lat`/`data-lon` on the page). It shows a cloud-cover dial with a plain-English verdict, the astronomical darkness window, moon rise/set with phase and illumination, and a twelve-hour cloud trend.

**This is not the lightbox's Sky view** — that's the Aladin star atlas, documented [below](#sky-view-lightbox). Same word, unrelated features.

### Where the data comes from

The split matters, because it's what keeps the page useful when things break:

- **Cloud cover, visibility, hourly forecast** — Apple WeatherKit, fetched from a proxy at `https://weather.chryse.co.uk/weather`. That proxy is a **separate Cloudflare Worker, not in this repo** — WeatherKit needs a signed JWT, which can't be done from a static page without leaking the key. The endpoint is set via `data-endpoint` on the `.sky` element in `sky/index.md`, with `data-endpoint-dev` pointing at `localhost:8787` for local Worker development.
- **Twilight, moon rise/set, phase, illumination** — computed in the browser by `assets/js/sky-conditions.js`, following Meeus' *Astronomical Algorithms* in the low-precision forms popularised by SunCalc. Accurate to about a minute for the sun and a few minutes for the moon.

Nothing astronomical is fetched, for three reasons worth preserving: WeatherKit's `moonPhase` is a string enum with no illumination percentage, so it has to be computed anyway; twilight is pure geometry and routing it through a weather proxy buys nothing; and Edinburgh sits above the latitude where astronomical night exists in summer — in 2026 the sun fails to reach 18° below the horizon from 5 May to 9 August, and WeatherKit returns null throughout. Computing locally lets the page explain *why* there's no darkness and when it returns, rather than printing a dash for a third of the year.

### States

The page is a four-state machine driven by `data-state` on the `.sky` element, so the JS never touches inline display rules:

| State | Shown |
|---|---|
| `loading` | Skeleton ring, "Reading the sky…" |
| `ready` | Full content |
| `partial` | Full content plus a notice that cloud figures are missing |
| `error` | Error box with a Try again button |

`partial` is the important one: if the Worker is unreachable, darkness and moon still render from local computation and only the cloud numbers drop out.

The page refreshes every 30 minutes — cloud forecasts move hourly, and anything faster just burns WeatherKit quota. It emits `WebApplication` + `BreadcrumbList` + `FAQPage` JSON-LD, the `WebApplication` carrying a free `Offer` and the Edinburgh `GeoCoordinates` it reports for.

`sky-conditions.js` exports its astronomy functions via `module.exports` when run under Node, so the solar and lunar maths can be exercised without a browser.

---

## Sky view (lightbox)

Every deep-sky lightbox shows a **⛶ Sky view** button next to the Copy link button (solar-system captures — Moon, Sun, comets — don't, as they have no fixed sky position). Clicking it opens a full-screen modal powered by [Aladin Lite](https://aladin.cds.unistra.fr/AladinLite/) from the Centre de Données astronomiques de Strasbourg (CDS).

The viewer is centred automatically on the target using the catalogue ID extracted from the `meta` field (e.g. `NGC 6960`), or the capture's `skyTarget` field where the meta ID isn't resolvable (Caldwell/Barnard designations, compound metas). Three survey layers are available:

- **DSS2** — Digitized Sky Survey optical colour imagery
- **2MASS** — near-infrared survey, useful for seeing through dust
- **Hα** — hydrogen-alpha emission, highlights ionised gas regions

Controls: scroll to zoom · drag to pan · use the Goto control to jump to any object · Escape or click outside to close.

The Aladin logo and attribution link are preserved in the bottom-right corner of the viewer as required by CDS terms of use.

Aladin's script and stylesheet total ~1.8 MB and are **loaded on first use**, not from `index.html`'s `<head>`. Loading them up front made every visitor pay for them before the page could paint, for a feature reached only by opening a capture and clicking this button. `loadAladin()` injects both on the first open and caches the promise, following the same pattern `loadPlotly()` uses for the 3D views; the modal shows a spinner while they download, and a guard stops a slow load from painting a stale target over a newly opened one. If the fetch fails the modal says so and a later open retries.

---

## Lightbox navigation

While the lightbox is open:

- **← →** arrow keys or on-screen buttons step through images in the current filtered/sorted view
- The detail panel shows a counter e.g. **3 of 47**
- **⧉ Copy link** button copies a direct shareable URL to the clipboard — the link opens the site with that image's lightbox already open
- Images fade in once loaded
- The counter and arrows respect the active category filter, search, and sort order
