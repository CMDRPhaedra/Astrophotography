# Dale — Astrophotography

Personal astrophotography gallery. Built as a single HTML file, hosted on GitHub Pages.

**Live site:** https://yourusername.github.io/astrophotography

---

## How to add a new photo

### 1. Drop the image into the `images/` folder

```
astrophotography/
├── index.html
└── images/
    ├── andromeda.jpg   ← your files go here
    ├── orion.jpg
    └── ...
```

Any common format works: `.jpg`, `.png`, `.webp`. Keep filenames lowercase with no spaces — e.g. `rosette-nebula.jpg` not `Rosette Nebula.jpg`.

### 2. Add a card in `index.html`

Open `index.html` and find the gallery section (search for `ADD NEW CARDS ABOVE THIS LINE`). Copy an existing card block and paste it above that marker:

```html
<div class="card"
  data-img="images/your-filename.jpg"
  data-tag="nebula"
  data-title="Your Target Name"
  data-meta="NGC 1234 · 15 Apr 2025 · Edinburgh"
  data-desc="Notes about capture — equipment, integration time, filters used.">
</div>
```

**`data-tag` options:** `galaxy` · `nebula` · `cluster` · `planet` · `other`

### 3. Push to GitHub

```bash
git add images/your-filename.jpg index.html
git commit -m "Add Horsehead Nebula"
git push
```

Your site updates automatically within ~30 seconds.

---

## First-time setup on GitHub

1. Create a new repository at https://github.com/new — name it `astrophotography`
2. Upload `index.html` and the `images/` folder (or use `git push`)
3. Go to **Settings → Pages**
4. Under *Source*, select **Deploy from a branch**, choose `main`, folder `/root`
5. Click Save — your site will be live at `https://yourusername.github.io/astrophotography`

---

## Editing card details

Hover any card on the live site and click **Edit** to update the title, category, date, or image path directly in the browser. Note that these edits only last for your current session — to make them permanent, update the corresponding `data-*` attributes in `index.html` and push.

---

## Recommended image sizes

| Use | Size |
|-----|------|
| Wide cards (5th, 8th) | 1800 × 800 px |
| Standard cards | 1200 × 900 px |
| Max file size | ~500 KB (use [Squoosh](https://squoosh.app) to compress) |

Keeping images compressed means faster load times, which matters on GitHub Pages.
