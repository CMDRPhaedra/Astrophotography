---
layout: default
title: The Bortle Scale
permalink: /bortle/
image: /images/bortle_scale.webp
---

<div class="blog-label">The sky itself</div>
<h2 style="font-size:clamp(1.8rem,4vw,2.6rem);font-weight:300;margin-bottom:0.8rem;">What is Bortle?</h2>
<p style="font-family:'Inconsolata',monospace;font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--dim);margin-bottom:2.5rem;">Nine classes of darkness · And what each one costs you in time</p>

<style>
  .bortle-body h3 { font-size: 1.45rem; font-weight: 400; margin: 2.6rem 0 0.8rem; }
  .bortle-body p, .bortle-body ul { margin-bottom: 1.2rem; }
  .bortle-body ul { padding-left: 1.4rem; }
  .bortle-body li { margin-bottom: 0.5rem; }
  .bortle-body a { color: var(--accent); }

  /* ── The nine classes ────────────────────────────────────────────────── */
  .bortle-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.9rem; margin: 2rem 0 1rem; }
  .bortle-card { border: 1px solid var(--border); background: var(--card-bg); display: flex; flex-direction: column; overflow: hidden; }
  .bortle-sky { height: 92px; position: relative; }
  /* Stars sit above the skyglow gradient and fade out as the class number climbs. */
  .bortle-sky::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      radial-gradient(1.1px 1.1px at 12% 22%, #fff, transparent),
      radial-gradient(1px 1px at 28% 58%, #fff, transparent),
      radial-gradient(1.3px 1.3px at 44% 16%, #fff, transparent),
      radial-gradient(1px 1px at 61% 40%, #fff, transparent),
      radial-gradient(1.2px 1.2px at 77% 25%, #fff, transparent),
      radial-gradient(1px 1px at 88% 52%, #fff, transparent),
      radial-gradient(1px 1px at 19% 44%, #fff, transparent),
      radial-gradient(1.4px 1.4px at 53% 63%, #fff, transparent),
      radial-gradient(1px 1px at 35% 33%, #fff, transparent),
      radial-gradient(1.1px 1.1px at 70% 12%, #fff, transparent);
    opacity: var(--stars, 1);
  }
  /* The ground: a flat silhouette so the glow reads as sitting on a horizon. */
  .bortle-sky::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 14px; background: #05060a; }
  .bortle-meta { padding: 0.75rem 0.85rem 0.95rem; }
  .bortle-num { font-family: 'Inconsolata', monospace; font-size: 1.9rem; font-weight: 300; line-height: 1; color: var(--bc); }
  .bortle-name { font-size: 0.98rem; line-height: 1.3; margin-top: 0.35rem; }
  .bortle-where { font-family: 'Inconsolata', monospace; font-size: 0.6rem; letter-spacing: 0.09em; text-transform: uppercase; color: var(--dim); margin-top: 0.5rem; line-height: 1.5; }

  .b1 { --bc:#3f83c9; --stars:1;    } .b1 .bortle-sky { background: linear-gradient(#04060d, #060a14 62%, #0a1220); }
  .b2 { --bc:#2494ab; --stars:0.9;  } .b2 .bortle-sky { background: linear-gradient(#04060d, #070c17 58%, #12182a); }
  .b3 { --bc:#1e9c80; --stars:0.75; } .b3 .bortle-sky { background: linear-gradient(#05070f, #0a1018 52%, #262119); }
  .b4 { --bc:#5aab41; --stars:0.6;  } .b4 .bortle-sky { background: linear-gradient(#060810, #0d1219 48%, #3d2d1a); }
  .b5 { --bc:#bdb02f; --stars:0.45; } .b5 .bortle-sky { background: linear-gradient(#07090f, #12141a 44%, #5a3f1e); }
  .b6 { --bc:#dc9a20; --stars:0.32; } .b6 .bortle-sky { background: linear-gradient(#080a10, #181820 40%, #7c4f21); }
  .b7 { --bc:#e8781d; --stars:0.22; } .b7 .bortle-sky { background: linear-gradient(#0a0c12, #1e1c22 36%, #9d6023); }
  .b8 { --bc:#e64f20; --stars:0.13; } .b8 .bortle-sky { background: linear-gradient(#0c0e14, #262026 32%, #bd7026); }
  .b9 { --bc:#da2f24; --stars:0.07; } .b9 .bortle-sky { background: linear-gradient(#0e1016, #2e2429 28%, #d9832c); }

  /* The saturated class colours are tuned for the dark theme; on the light
     background they drop to 2:1–4:1, so light mode gets darker equivalents.
     All values below clear 4.9:1 on #f5f2ec. */
  [data-theme="light"] .b1 { --bc:#1d5fa8; } [data-theme="light"] .b2 { --bc:#116077; }
  [data-theme="light"] .b3 { --bc:#0f6b55; } [data-theme="light"] .b4 { --bc:#3a7529; }
  [data-theme="light"] .b5 { --bc:#6d6410; } [data-theme="light"] .b6 { --bc:#8a5c07; }
  [data-theme="light"] .b7 { --bc:#a4520d; } [data-theme="light"] .b8 { --bc:#b03f13; }
  [data-theme="light"] .b9 { --bc:#b32418; }

  .bortle-axis { display: flex; justify-content: space-between; font-family: 'Inconsolata', monospace; font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--dim); margin-bottom: 2rem; }

  /* ── Integration comparison table ────────────────────────────────────── */
  .snr-table { width: 100%; border-collapse: collapse; margin: 1.6rem 0 1rem; font-size: 0.82rem; }
  .snr-table th, .snr-table td { padding: 0.6rem 0.6rem; border: 1px solid var(--border); vertical-align: top; text-align: left; line-height: 1.5; }
  .snr-table thead th { font-family: 'Inconsolata', monospace; font-size: 0.62rem; letter-spacing: 0.09em; text-transform: uppercase; font-weight: 400; }
  .snr-table tbody th { font-family: 'Inconsolata', monospace; font-size: 0.6rem; letter-spacing: 0.09em; text-transform: uppercase; font-weight: 400; color: var(--dim); width: 21%; }
  .snr-mult { font-family: 'Inconsolata', monospace; font-size: 1rem; }
  .c-dark { color: #2494ab; } .c-sub { color: #5aab41; } .c-bright { color: #e8781d; } .c-city { color: #e64f20; }
  [data-theme="light"] .c-dark { color: #116077; } [data-theme="light"] .c-sub { color: #3a7529; }
  [data-theme="light"] .c-bright { color: #a4520d; } [data-theme="light"] .c-city { color: #b03f13; }

  .takeaway { border: 1px solid var(--border); background: var(--card-bg); padding: 1.3rem 1.4rem; margin: 2rem 0; }
  .takeaway h4 { font-family: 'Inconsolata', monospace; font-size: 0.65rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); font-weight: 400; margin-bottom: 0.9rem; }
  .takeaway p:last-child { margin-bottom: 0; }
  /* The summary card. Dark-only artwork by design, so it keeps its own
     background in light mode rather than being tinted to match. */
  .bortle-figure { margin: 1.8rem 0 0; }
  .bortle-figure img { width: 100%; height: auto; display: block; border: 1px solid var(--border); }
  .bortle-figure a { display: block; line-height: 0; }
  .bortle-figure figcaption { font-family: 'Inconsolata', monospace; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--dim); margin-top: 0.7rem; line-height: 1.6; }

  .caveat { font-family: 'Inconsolata', monospace; font-size: 0.65rem; letter-spacing: 0.06em; line-height: 1.8; color: var(--dim); border-top: 1px solid var(--border); padding-top: 1.2rem; margin-top: 2.5rem; }

  @media (max-width: 700px) {
    .bortle-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    /* The comparison table becomes stacked blocks — a 5-column grid is
       unreadable on a phone, and this keeps it as real text either way. */
    .snr-table, .snr-table tbody, .snr-table tr, .snr-table td, .snr-table th { display: block; }
    .snr-table thead { display: none; }
    .snr-table tr { margin-bottom: 1.4rem; border: 1px solid var(--border); }
    .snr-table th, .snr-table td { border: none; border-bottom: 1px solid var(--border); }
    .snr-table tbody th { width: auto; background: var(--card-bg); color: var(--ink); }
    .snr-table td::before { content: attr(data-col); display: block; font-family: 'Inconsolata', monospace; font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--dim); margin-bottom: 0.3rem; }
    .snr-table tr td:last-child { border-bottom: none; }
  }
  @media (max-width: 480px) {
    /* Two columns is still legible at phone width and halves the scroll —
       only drop to one below the narrowest common handsets. */
    .bortle-sky { height: 68px; }
    .bortle-name { font-size: 0.88rem; }
    .bortle-num { font-size: 1.6rem; }
  }
  @media (max-width: 340px) {
    .bortle-grid { grid-template-columns: 1fr; }
  }
</style>

<div style="font-size:1.15rem;line-height:1.85;">
<div class="bortle-body" markdown="1">

The Bortle scale is a nine-point measure of how dark your night sky actually is. Class 1 is a genuinely pristine sky — the kind that still exists in a few remote corners of the world, where the Milky Way casts a shadow. Class 9 is an inner-city sky where a handful of the brightest stars are all that survive the glow. Lower is darker; higher is worse.

It was published by John E. Bortle in *Sky & Telescope* in 2001, and it caught on because it gave amateur astronomers a shared vocabulary for something everyone could see but nobody could quantify. It's an observational scale rather than an instrument reading — you place your sky by what you can and can't see from it — which makes it approximate by design, but useful precisely because it describes the sky you're standing under rather than a number on a meter.

For anyone imaging with a [smart telescope](/gear/), it's the single most important number about your location, because it sets the price of every photo you take. Not in money — in hours.

### The nine classes

<div class="bortle-grid">
  <div class="bortle-card b1"><div class="bortle-sky"></div><div class="bortle-meta"><div class="bortle-num">1</div><div class="bortle-name">Excellent Dark Sky</div><div class="bortle-where">Remote rural locations</div></div></div>
  <div class="bortle-card b2"><div class="bortle-sky"></div><div class="bortle-meta"><div class="bortle-num">2</div><div class="bortle-name">Typical Dark Sky</div><div class="bortle-where">Rural areas</div></div></div>
  <div class="bortle-card b3"><div class="bortle-sky"></div><div class="bortle-meta"><div class="bortle-num">3</div><div class="bortle-name">Rural Sky</div><div class="bortle-where">Rural neighbourhoods</div></div></div>
  <div class="bortle-card b4"><div class="bortle-sky"></div><div class="bortle-meta"><div class="bortle-num">4</div><div class="bortle-name">Suburban Sky</div><div class="bortle-where">Suburban neighbourhoods</div></div></div>
  <div class="bortle-card b5"><div class="bortle-sky"></div><div class="bortle-meta"><div class="bortle-num">5</div><div class="bortle-name">Suburban / Urban Transition</div><div class="bortle-where">City outskirts</div></div></div>
  <div class="bortle-card b6"><div class="bortle-sky"></div><div class="bortle-meta"><div class="bortle-num">6</div><div class="bortle-name">Bright Suburban Sky</div><div class="bortle-where">Bright suburbs</div></div></div>
  <div class="bortle-card b7"><div class="bortle-sky"></div><div class="bortle-meta"><div class="bortle-num">7</div><div class="bortle-name">City Skyglow</div><div class="bortle-where">City neighbourhoods</div></div></div>
  <div class="bortle-card b8"><div class="bortle-sky"></div><div class="bortle-meta"><div class="bortle-num">8</div><div class="bortle-name">Bright City Sky</div><div class="bortle-where">City centres</div></div></div>
  <div class="bortle-card b9"><div class="bortle-sky"></div><div class="bortle-meta"><div class="bortle-num">9</div><div class="bortle-name">Inner-City Sky</div><div class="bortle-where">Inner city / downtown</div></div></div>
</div>

<div class="bortle-axis"><span>&larr; Darkest</span><span>Brightest &rarr;</span></div>

Most people who think they have a dark garden have a Class 5 or 6. Genuine Class 1 and 2 skies are rare enough that people travel to them deliberately — and the difference between a Class 4 sky and a Class 7 one is far larger in practice than three steps on a nine-point scale makes it sound.

### Why it costs you time

The physics is unglamorous. Every image you take contains signal — photons from the thing you're pointing at — and noise, which is everything else: the sky's own glow, plus the sensor's own contribution. What determines whether a faint nebula appears in your final image isn't how much signal you gathered but the ratio between the two, the signal-to-noise ratio.

Skyglow doesn't hide your target by covering it up. It swamps it. The light pollution lands on the same pixels as the nebula, and because the arrival of photons is random, that background brings its own statistical noise along with it — noise that grows with the square root of how much of it you've collected. Stacking beats it down, because the signal accumulates in step with exposure time while the noise only accumulates with its square root. That's why integration time works at all.

But it also means the returns are punishing. Doubling your signal-to-noise ratio takes four times the exposure. A sky that is several times brighter doesn't cost you several times as long — it costs you a good deal more than that, and the faintest targets can move out of reach entirely no matter how long you leave the telescope running.

<table class="snr-table">
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col" class="c-dark">Dark Sky<br>(Bortle 1&ndash;3)</th>
      <th scope="col" class="c-sub">Suburban<br>(Bortle 4&ndash;5)</th>
      <th scope="col" class="c-bright">Bright Suburban / City<br>(Bortle 6&ndash;7)</th>
      <th scope="col" class="c-city">City / Inner City<br>(Bortle 8&ndash;9)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Noise level</th>
      <td data-col="Bortle 1–3" class="c-dark">Very low</td>
      <td data-col="Bortle 4–5" class="c-sub">Low &ndash; moderate</td>
      <td data-col="Bortle 6–7" class="c-bright">High</td>
      <td data-col="Bortle 8–9" class="c-city">Very high</td>
    </tr>
    <tr>
      <th scope="row">Integration time for the same result</th>
      <td data-col="Bortle 1–3" class="snr-mult c-dark">0.5&times; &ndash; 1&times;</td>
      <td data-col="Bortle 4–5" class="snr-mult c-sub">~1.5&times; &ndash; 3&times;</td>
      <td data-col="Bortle 6–7" class="snr-mult c-bright">~3&times; &ndash; 8&times;</td>
      <td data-col="Bortle 8–9" class="snr-mult c-city">~8&times; &ndash; 20&times;+</td>
    </tr>
    <tr>
      <th scope="row">What that means in practice</th>
      <td data-col="Bortle 1–3">Faster results, more detail in less time. Faint targets are realistic.</td>
      <td data-col="Bortle 4–5">Slightly longer sessions needed, but still very productive.</td>
      <td data-col="Bortle 6–7">Expect long sessions. Fewer faint details in the same time.</td>
      <td data-col="Bortle 8–9">Very long sessions for faint targets. Best on bright objects.</td>
    </tr>
  </tbody>
</table>

<p style="font-family:'Inconsolata',monospace;font-size:0.62rem;letter-spacing:0.08em;line-height:1.7;color:var(--dim);">Multipliers are relative to a Bortle 3 baseline, for a deep-sky target of the same brightness.</p>

### What this looks like from Edinburgh

Every image in the [gallery](/) was taken from Edinburgh, which sits around Bortle 7 to 8 depending on where in the city you're standing — city skyglow shading into bright city sky, straddling the right-hand two columns above. There is no version of this hobby here where a faint target is a quick job, and the [capture times on the photo pages](/photos/) show it plainly.

The pattern in that data is the useful part. Emission nebulae — the Crescent, the Bubble, the Elephant's Trunk — came in at roughly one to three hours each. Broadband galaxies took far longer: four hours for M33 and M81, seven for Andromeda and the Pinwheel, ten for the Whirlpool. Same telescope, same sky, same city. The difference is entirely what can be filtered.

That's the loophole. Emission nebulae glow at specific wavelengths — hydrogen-alpha and oxygen-III — and a dual-band filter passes those while rejecting most of the sky's broadband glow, so a heavily light-polluted sky behaves like a far darker one for that class of target. Galaxies and star clusters shine across the whole visible spectrum, and no filter can separate their light from a streetlight's. For those, the only currency is time.

### Working with the sky you have

<div class="takeaway">
  <h4>The short version</h4>
  <p>Higher Bortle means more skyglow, which means more noise, which means more hours for the same picture. Dropping from Bortle 7 to Bortle 3 can cut the integration time you need by three to eight times or more — a better sky beats better gear, and it beats more patience.</p>
</div>

A few things follow from that, in rough order of how much they help:

- **Travel if you can.** An hour's drive to a Bortle 4 site does more for your images than any upgrade you can buy. Nothing else on this list comes close.
- **Use a dual-band or narrowband filter for emission nebulae.** From a city this is the difference between a target being possible and impossible, not merely between fast and slow.
- **Pick targets that suit your sky.** Bright nebulae, large galaxies, star clusters, planets and the Moon all hold up well under heavy light pollution. Faint dwarf galaxies and reflection nebulae will punish a bright sky no matter how long you run.
- **Stack across nights.** Integration doesn't have to be continuous. Combining sessions is how the long exposures here were built, an hour at a time, whenever the weather allowed.
- **Shoot high.** Skyglow is worst near the horizon, where you're looking through the most atmosphere and the most city. A target overhead is in a measurably darker sky than the same target low down.
- **Block direct light.** A neighbour's security light or an unshielded streetlamp in the frame does more damage than the general skyglow, and unlike the skyglow you can usually park something between it and the telescope.

None of this makes a city sky into a dark one. It makes a city sky workable, which is a different and more achievable goal — and the [gallery](/) is what that looks like in practice.

### The whole scale on one card

Everything above, on a single sheet — handy for saving or sharing. Click for the full-size version.

<figure class="bortle-figure">
  <a href="/images/bortle_scale.webp" title="Open the full-size chart">
    <img src="/images/bortle_scale.webp" width="1536" height="1024" loading="lazy" decoding="async"
         alt="Chart summarising the Bortle scale. Across the top, the nine classes from 1 (Excellent Dark Sky, remote rural locations) through 5 (Suburban/Urban Transition, city outskirts) to 9 (Inner-City Sky), each with a sky image showing progressively more skyglow. Below, a table of integration time needed for the same signal-to-noise ratio: 0.5–1x at Bortle 1–3, around 1.5–3x at Bortle 4–5, around 3–8x at Bortle 6–7, and around 8–20x or more at Bortle 8–9.">
  </a>
  <figcaption>The Bortle scale and what each class costs in integration time.</figcaption>
</figure>

<p class="caveat">The multipliers above are approximations. Real integration times vary with target brightness, telescope aperture and focal ratio, sensor performance, filter choice, moon phase, transparency and processing. Treat them as the right order of magnitude rather than a formula — the direction and rough scale are reliable, the exact numbers are not.</p>

</div>
</div>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Among Stars", "item": "https://chryse.co.uk/" },
    { "@type": "ListItem", "position": 2, "name": "The Bortle Scale" }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the Bortle scale?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Bortle scale is a nine-point measure of night sky darkness, published by John E. Bortle in Sky & Telescope in 2001. Class 1 is an excellent dark sky found in remote rural locations; Class 9 is an inner-city sky. Lower numbers mean darker skies and less light pollution."
      }
    },
    {
      "@type": "Question",
      "name": "How does the Bortle scale affect astrophotography?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Higher Bortle classes mean more skyglow, which adds background noise to every frame. Because signal-to-noise ratio improves only with the square root of exposure time, a brighter sky requires disproportionately more integration time for the same result — roughly 3 to 8 times longer at Bortle 6-7, and 8 to 20 times longer at Bortle 8-9, compared with a Bortle 3 sky."
      }
    },
    {
      "@type": "Question",
      "name": "Can you do astrophotography from a Bortle 8 city sky?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. A dual-band filter passing hydrogen-alpha and oxygen-III wavelengths rejects most city light pollution, making emission nebulae achievable in one to three hours even from a Bortle 8 sky. Broadband targets such as galaxies and star clusters cannot be filtered this way and need far longer — typically four to ten hours of stacked integration."
      }
    }
  ]
}
</script>
