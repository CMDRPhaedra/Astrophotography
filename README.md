# Dale — Astrophotography

Personal astrophotography gallery. Built as a single HTML file, hosted on GitHub Pages.

**Live site:** https://cmdrphaedra.github.io/Astrophotography/

---

## Features

- **Gallery grid** with filterable categories (galaxies, nebulae, clusters, comets)
- **Sort bar** — sort the gallery by Date, Distance, or Name, each reversible with a second click
- **Latest capture strip** — always shows the first entry in the `CAPTURES` array with a pulsing indicator
- **Search** — press `/` to focus the search bar; searches target names, catalogue numbers, and descriptions; works alongside the category filter
- **Stats bar** — live count of total images and per-category breakdown with dot visualisation
- **Lightbox** with scroll-to-zoom, drag-to-pan, double-click to reset, pinch on mobile, arrow key navigation, and image counter
- **3D depth view** per card — hover any deep-sky card and click **⬡ 3D** to open an interactive Plotly scene at the card's real distance from Earth
- **⬡ 3D Distance** — all targets on a single stretched-log distance axis with a built-in explainer
- **⬡ 3D Map** — all targets in real galactic coordinates with type filters (All / Galaxies / Nebulae / Clusters) and a built-in explainer. Pure canvas, no external libraries.
- **Deep linking** — opening a lightbox updates the URL hash (e.g. `#veil-nebula-complex`); sharing that URL opens the site with that image already in the lightbox
- **Open Graph / Twitter card meta tags** for rich link previews
- **Light / dark theme** toggle — choice is remembered across visits
- Animated starfield background

---

## How to add a new capture

### 1. Drop the image into `images/`

```
Astrophotography/
├── index.html
└── images/
    ├── m31_andromeda_galaxy.png
    ├── m42_orion_nebula.jpeg
    └── ...
```

Follow the naming convention: all lowercase, underscores not spaces, no special characters, catalogue number first. For example: `ngc1234_whatever_nebula.jpg`.

Any common format works: `.jpg`, `.jpeg`, `.png`, `.webp`.

### 2. Add an entry to the `CAPTURES` array in `index.html`

Open `index.html` and find the `CAPTURES` array near the top of the script block. Add a new object **at the very top** (latest capture first):

```js
{
  img:   'images/ngc1234_whatever_nebula.jpg',
  tag:   'nebula',
  title: 'Whatever Nebula',
  meta:  'NGC 1234 · 01 May 2026 · Edinburgh · 45m',
  depth: [{ name: 'Whatever Nebula (NGC 1234)', type: 'nebula', ly: 5000 }],
  desc:  "Free text description. Apostrophes work fine here.",
},
```

**`tag` values:** `galaxy` · `nebula` · `cluster` · `other`

**`depth`** is optional but enables the per-card ⬡ 3D button and includes the target in the 3D Distance and 3D Map views. Omit it for comets or any target without a meaningful distance. Include multiple objects for cards that show more than one target:

```js
depth: [
  { name: 'Heart Nebula (IC 805)',       type: 'nebula',  ly: 7500 },
  { name: 'Melotte 15 (central cluster)', type: 'cluster', ly: 7500 },
],
```

Valid `type` values: `galaxy` · `nebula` · `cluster` · `star`

**`meta` format:** `Catalogue · DD Mon YYYY · Location · Integration time` — the date is used by the Date sort, so keep it consistent.

### 3. Push to GitHub

```bash
git add images/ngc1234_whatever_nebula.jpg index.html
git commit -m "Add Whatever Nebula"
git push
```

The site updates within ~30 seconds.

---

## File naming convention

All image files live in `images/` (lowercase) and follow this pattern:

- All lowercase
- Underscores instead of spaces
- No special characters (no apostrophes, ampersands, brackets)
- Catalogue number first: `m42_`, `ngc6960_`, `ic443_`, `b33_`
- Extension lowercase: `.jpg`, `.png`, `.jpeg`

Examples: `m42_orion_nebula.jpeg` · `ngc6960_western_veil_nebula.png` · `c32_whale_galaxy.png`

---

## Sort

Three sort options sit below the stats bar:

- **Date** (newest first by default) — reads the date from the `meta` field. Entries without a date sort as oldest.
- **Distance** (nearest first by default) — reads from the `depth` field. Entries without a `depth` value (comets, Sol) always sort to the bottom.
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
2. Upload `index.html` and the `images/` folder (or use `git push`)
3. Go to **Settings → Pages**
4. Under *Source*, select **Deploy from a branch**, choose `main`, folder `/root`
5. Click Save — your site will be live at `https://yourusername.github.io/astrophotography`

### Custom domain (optional)

1. Buy a domain from any registrar (Namecheap, Porkbun, Cloudflare, etc.)
2. Add these A records at your registrar pointing to GitHub's servers:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
3. Go to your repo → **Settings → Pages → Custom domain**, enter your domain and save
4. Tick **Enforce HTTPS** once DNS propagates (can take a few minutes to 48 hours)

---

## Search

Press `/` from anywhere on the page to focus the search bar. It searches across target names, catalogue numbers, metadata, and description text. Works alongside the category filter — e.g. filter to Nebulae then search "Cygnus" to narrow further. Press Escape to clear and return focus to the page.

---

## Latest capture strip

The strip between the hero text and the gallery always reflects `CAPTURES[0]` — the first entry in the array. To update it, simply add the new capture object at the top of the `CAPTURES` array.

---

## Open Graph tags

The `<head>` includes Open Graph and Twitter card meta tags for rich previews in iMessage, Discord, Slack, and social media. To update the preview image:

```html
<meta property="og:image" content="images/your-filename.png">
<meta name="twitter:image" content="images/your-filename.png">
```

The `og:image` should be at least 1200 × 630 px for best results.

---

## Recommended image sizes

| Use | Size |
|-----|------|
| Wide cards (5th, 8th position) | 1800 × 800 px |
| Standard cards | 1200 × 900 px |
| Max file size | ~500 KB (use [Squoosh](https://squoosh.app) to compress) |

Keeping images compressed matters on GitHub Pages where there is no server-side compression.

---

## Deep linking

Every time a lightbox opens, the URL updates automatically — for example:

```
https://cmdrphaedra.github.io/Astrophotography/#veil-nebula-complex
https://cmdrphaedra.github.io/Astrophotography/#markarians-chain
https://cmdrphaedra.github.io/Astrophotography/#horsehead-nebula
```

Copying the URL from the address bar always gives a shareable link that opens directly to that image. When someone follows the link they land on the gallery with the correct lightbox already open, regardless of any filter or sort they might have active.

The slug is generated automatically from the `title` field — no extra configuration needed in `CAPTURES`. The rules are: lowercase, apostrophes removed, non-alphanumeric characters replaced with hyphens. Closing the lightbox restores the clean gallery URL.

---

## Lightbox navigation

While the lightbox is open:

- **← →** arrow keys or on-screen buttons step through images in the current filtered/sorted view
- The detail panel shows a counter e.g. **3 of 47**
- Images fade in once loaded
- The counter and arrows respect the active category filter, search, and sort order
