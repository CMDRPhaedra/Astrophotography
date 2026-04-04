# Dale — Astrophotography

Personal astrophotography gallery. Built as a single HTML file, hosted on GitHub Pages.

**Live site:** https://yourusername.github.io/astrophotography

---

## Features

- **Gallery grid** with filterable categories (galaxies, nebulae, clusters, comets)
- **Search** — press `/` to focus the search bar and filter by target name, catalogue number, or any keyword in the description
- **Stats bar** — live count of total images and per-category breakdown with dot visualisation
- **Lightbox** with zoom (scroll to zoom, drag to pan, double-click to reset, pinch on mobile)
- **Add / Edit / Delete** cards directly in the browser (session only — push to make permanent)
- **Light / dark theme** toggle
- Animated starfield background

---

## How to add a new photo

### 1. Drop the image into the `Images/` folder

```
astrophotography/
├── index.html
└── Images/
    ├── M31 Andromeda Galaxy.PNG   ← your files go here
    ├── M42 Orion Nebula.jpeg
    └── ...
```

Any common format works: `.jpg`, `.jpeg`, `.png`, `.webp`. The folder name is `Images/` with a capital I — keep this consistent with the paths in `index.html`.

### 2. Add a card in `index.html`

Open `index.html` and find the gallery section (search for `ADD NEW CARDS ABOVE THIS LINE`). Copy an existing card block and paste it above that marker:

```html
<div class="card"
  data-img="Images/your-filename.jpg"
  data-tag="nebula"
  data-title="Your Target Name"
  data-meta="NGC 1234 · 15 Apr 2026 · Edinburgh"
  data-desc="Notes about capture — equipment, integration time, filters used.">
</div>
```

**`data-tag` options:** `galaxy` · `nebula` · `cluster` · `planet` · `other`

> Alternatively, use the **+ Add Photo** button on the live site for a quick in-browser preview — but remember these session edits won't survive a page refresh. Update `index.html` and push to make them permanent.

### 3. Push to GitHub

```bash
git add Images/your-filename.jpg index.html
git commit -m "Add Horsehead Nebula"
git push
```

Your site updates automatically within ~30 seconds.

---

## First-time setup on GitHub

1. Create a new repository at https://github.com/new — name it `astrophotography`
2. Upload `index.html` and the `Images/` folder (or use `git push`)
3. Go to **Settings → Pages**
4. Under *Source*, select **Deploy from a branch**, choose `main`, folder `/root`
5. Click Save — your site will be live at `https://yourusername.github.io/astrophotography`

### Custom domain (optional)

You can point a custom domain at your GitHub Pages site at no extra hosting cost:

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

## Editing card details

Hover any card on the live site and click **Edit** to update the title, category, date, image path, or description directly in the browser. You can also **Delete** a card from the same hover menu. Note that these edits only last for your current session — to make them permanent, update the corresponding `data-*` attributes in `index.html` and push.

---

## Search

The search bar sits in the filter row. Press `/` from anywhere on the page to jump to it. It searches across target names, catalogue numbers, metadata (date, location), and the full description text. It works in combination with the category filter buttons — e.g. you can filter to Nebulae and then search "Cygnus" to narrow further.

---

## Recommended image sizes

| Use | Size |
|-----|------|
| Wide cards (5th, 8th position) | 1800 × 800 px |
| Standard cards | 1200 × 900 px |
| Max file size | ~500 KB (use [Squoosh](https://squoosh.app) to compress) |

Keeping images compressed means faster load times, which matters on GitHub Pages.

---

## Stats bar

The stats bar between the filter row and the gallery updates automatically when you add or delete cards. No manual changes needed — it reads the cards in the DOM directly.
