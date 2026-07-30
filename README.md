# Dale — Astrophotography

<!-- BADGES:START -->
![license](https://img.shields.io/badge/license-All%20rights%20reserved-blue)
![Last commit](https://img.shields.io/github/last-commit/CMDRPhaedra/Astrophotography)
![Repo size](https://img.shields.io/github/repo-size/CMDRPhaedra/Astrophotography)
![Open issues](https://img.shields.io/github/issues/CMDRPhaedra/Astrophotography)
![HTML](https://img.shields.io/badge/HTML-91.4%25-blue)
![Python](https://img.shields.io/badge/Python-8.6%25-blue)
<!-- BADGES:END -->
![Images](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/CMDRPhaedra/Astrophotography/main/badges/images-count.json)
![Integration time](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/CMDRPhaedra/Astrophotography/main/badges/integration-time.json)

Personal astrophotography gallery. Built as a single HTML file, hosted on GitHub Pages.

**Live site:** https://chryse.co.uk

---

## Features

- **Gallery grid** with filterable categories (galaxies, nebulae, clusters, solar system)
- **Sort bar** — sort the gallery by Date, Distance, or Name, each reversible with a second click
- **Latest capture strip** — always shows the first entry in the `CAPTURES` array with a pulsing indicator
- **Search** — press `/` to focus the search bar; searches target names, catalogue numbers, and descriptions; works alongside the category filter
- **Descriptive gallery alt text** — grid thumbnails carry an alt combining the title and a snippet of the description (e.g. *"Elephant's Trunk Nebula — IC 1396A is a dense globule of cold gas…"*); the lightbox and latest-capture image keep a plain title alt since their full description is already shown as visible text right next to them, so a richer alt there would just duplicate it for screen readers
- **Stats bar** — live count of total images, per-category breakdown with dot visualisation, and total integration time observed
- **Lightbox** with scroll-to-zoom, drag-to-pan, double-click to reset, pinch on mobile, arrow key navigation, and image counter; includes Copy link, Sky view, and theme toggle buttons
- **Sky view** — a ⛶ Sky view button in the lightbox opens a full-screen interactive sky atlas (Aladin Lite, CDS Strasbourg) centred on the target, with DSS2 optical, 2MASS near-infrared, and Hα survey options
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
- **Self-updating noscript SEO block** — `scripts/update_noscript.py` regenerates the crawler-visible capture list from the `CAPTURES` array, so the two can't drift; it also runs inside the Action
- **Self-updating README badges** — the Images and Integration time badges above are shields.io endpoint badges fed by `badges/*.json`, regenerated from the `CAPTURES` array by `scripts/generate_badges.py` inside the Action
- **Open Graph / Twitter card meta tags** for rich link previews
- **Structured data (JSON-LD)** — every photo page emits `ImageObject` + `BreadcrumbList`, blog posts emit `BlogPosting` + `BreadcrumbList`, and the gallery emits a `WebSite`/`Person`/`CollectionPage` graph, so Google Images and rich results have machine-readable context
- **Installable (PWA)** — a `manifest.webmanifest` with maskable 192/512 px icons (rasterised from `favicon.svg`) lets mobile visitors Add to Home Screen with a proper name and icon; no service worker, so nothing is cached offline
- **Custom 404 page** — an on-brand `/404.html` (dark theme, nav intact) served by GitHub Pages instead of the generic default
- **Favicon** — black hole event horizon icon (SVG for Chrome/Firefox, PNG fallback for Safari)
- **Light / dark theme** toggle — available in the main header, lightbox, and sky view modal; choice is remembered across visits
- **Gear & process page** at [/gear/](https://chryse.co.uk/gear/) — the Dwarf 3, shooting conditions in Edinburgh, and the capture/stacking workflow; linked from the nav, the hero, the gallery footer, and every photo page. The page has a hidden hardware-photo slot: drop a photo named `dwarf3_telescope.jpg` (any format) into `images/` and push — the Action converts it and the figure appears automatically
- **Bortle scale page** at [/bortle/](https://chryse.co.uk/bortle/) — what the nine sky-darkness classes mean and how each one maps to integration time, with the scale itself built in CSS rather than shipped as an image, so it reflows on mobile, follows the light/dark theme, and stays real indexable text. Emits `FAQPage` + `BreadcrumbList` JSON-LD
- **Privacy policy** at [/privacy/](https://chryse.co.uk/privacy/), linked from both the gallery and blog footers
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
2. Push the whole repo — alongside `index.html` and `images/`, the moving parts are `convert_to_webp.py` + `scripts/` (automation), `.github/` (the Actions), `_config.yml` + `_layouts/` + `_posts/` + `blog/` (the Jekyll blog), `_captures/` + `photos/` (per-photo pages), and `badges/` (gallery stat badges)
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

---

## Blog

Field notes live at [/blog/](https://chryse.co.uk/blog/), built by GitHub Pages' native Jekyll support — no extra Action, no build step. Only files with YAML front matter are processed; `index.html` has none and is served untouched. An RSS feed is generated at `/feed.xml` by jekyll-feed.

To add a post, create `_posts/YYYY-MM-DD-slug.md`:

```markdown
---
layout: post
title: "Sadr's Butterfly: A Trick of Perspective"
date: 2026-07-13
target: "IC 1318 / Sh2-108 · Gamma Cygni Nebula"
distance: "4,900 light-years"
integration: "1h 12m"
image: /images/ic1318_gamma_cygni_nebula.webp
---

Post body in Markdown…
```

`target`, `distance`, and `integration` are optional and render in the post's meta line; `image` is the 16:9 cover and the Open Graph preview. Keep `target`'s catalogue segment (before the ` · `) consistent with the same object's gallery-card `meta` — see the multi-catalogue note above. Posts are published at `/blog/YYYY/MM/DD/slug/`, and the first paragraph doubles as the excerpt on the blog index and the meta description. To link a post back to its gallery card, use the deep-link form `[gallery card](/?photo=slug)`.

---

## Blog search

The blog index (`blog/index.html`) has its own search bar, built the same way as the gallery's but entirely separately, since the blog has no access to the gallery's `CAPTURES` array or JS runtime.

At build time, Jekyll's `{% for post in site.posts %}` loop stamps each `<li class="post-item">` with a `data-search` attribute containing that post's title, `target`, and full content (via `strip_html | strip_newlines | escape`) — not just the truncated excerpt shown on the page, so a search can match text that never appears in the visible preview. A small inline script filters `.post-item`s by substring match against `data-search`, highlights matches in the title with `<mark>`, shows a live result count, and supports the same `/`-to-focus and Escape-to-clear behaviour as the gallery search.

Because it's plain client-side JS reading attributes already in the rendered HTML, there's no separate index file to keep in sync and no build step beyond what GitHub Pages already does.

---

## Per-photo pages

Every capture also gets its own static page at `/photos/<slug>/`, with an index of all of them at [/photos/](https://chryse.co.uk/photos/). These are Jekyll collection pages (`_captures/`, published via the `captures` collection in `_config.yml` with the `capture` layout) — fully crawlable HTML with the image, capture details, and description, unlike the JavaScript-rendered gallery.

The files in `_captures/` are generated from the `CAPTURES` array by `scripts/generate_capture_pages.py` — **never edit them by hand**. The slug mirrors the gallery's own `slugify()`, so `/photos/<slug>/` and the `?photo=<slug>` deep links always agree, and each page links back to its gallery card. The script runs automatically in the convert-webp Action, so pushing a new image keeps the pages in sync; to regenerate locally, run `python3 scripts/generate_capture_pages.py` from the repo root.

---

## Open Graph tags

The `<head>` includes Open Graph and Twitter card meta tags for rich previews in iMessage, Discord, Slack, and social media. To update the preview image, use **absolute URLs**:

```html
<meta property="og:image" content="https://chryse.co.uk/images/your-filename.webp">
<meta name="twitter:image" content="https://chryse.co.uk/images/your-filename.webp">
```

The `og:image` should be at least 1200 × 630 px for best results.

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

The site is verified with Google Search Console and a sitemap submitted at `https://chryse.co.uk/sitemap.xml`. The sitemap is generated automatically on every build by the `jekyll-sitemap` plugin (see `_config.yml`) — there is nothing to update by hand. The `<head>` includes a canonical URL tag and a sitemap link for search engine discovery. A `robots.txt` in the repo root allows all crawlers and points to the sitemap.

A `<noscript>` block in `index.html` contains static HTML versions of all captures so search engine crawlers that don't execute JavaScript can index the gallery content and descriptions. It is generated from the `CAPTURES` array by `scripts/update_noscript.py` (run automatically by the convert-webp Action, or manually with `python3 scripts/update_noscript.py`) — never edit it by hand.

The per-photo pages at `/photos/<slug>/` (see above) give every capture a real, individually indexable URL on top of the noscript block, and are picked up by the sitemap automatically.

**Structured data (JSON-LD)** is emitted on every page for rich results: photo pages carry `ImageObject` + `BreadcrumbList` (in `_layouts/capture.html`), blog posts carry `BlogPosting` + `BreadcrumbList` (in `_layouts/post.html`), and the gallery head carries a `WebSite` / `Person` / `CollectionPage` `@graph` (in `index.html`). All of it is filled from the same front matter and `CAPTURES` data the pages already use, so it can't drift from what's displayed.

A missing-page request is served by an on-brand `404.html` (uses `layout: default`, `sitemap: false`) rather than the GitHub Pages default, and the site ships a `manifest.webmanifest` (with 192/512 px icons rasterised from `favicon.svg`) so it is installable as a PWA — no service worker, so nothing is cached offline.

---

## Sky view

Every deep-sky lightbox shows a **⛶ Sky view** button next to the Copy link button (solar-system captures — Moon, Sun, comets — don't, as they have no fixed sky position). Clicking it opens a full-screen modal powered by [Aladin Lite](https://aladin.cds.unistra.fr/AladinLite/) from the Centre de Données astronomiques de Strasbourg (CDS).

The viewer is centred automatically on the target using the catalogue ID extracted from the `meta` field (e.g. `NGC 6960`), or the capture's `skyTarget` field where the meta ID isn't resolvable (Caldwell/Barnard designations, compound metas). Three survey layers are available:

- **DSS2** — Digitized Sky Survey optical colour imagery
- **2MASS** — near-infrared survey, useful for seeing through dust
- **Hα** — hydrogen-alpha emission, highlights ionised gas regions

Controls: scroll to zoom · drag to pan · use the Goto control to jump to any object · Escape or click outside to close.

The Aladin logo and attribution link are preserved in the bottom-right corner of the viewer as required by CDS terms of use.

---

## Lightbox navigation

While the lightbox is open:

- **← →** arrow keys or on-screen buttons step through images in the current filtered/sorted view
- The detail panel shows a counter e.g. **3 of 47**
- **⧉ Copy link** button copies a direct shareable URL to the clipboard — the link opens the site with that image's lightbox already open
- Images fade in once loaded
- The counter and arrows respect the active category filter, search, and sort order
