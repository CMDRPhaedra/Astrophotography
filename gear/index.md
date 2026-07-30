---
layout: default
title: Gear & Process
permalink: /gear/
description: "The gear and process behind the images: a Dwarf 3 smart telescope, how the captures are stacked and processed, and what a small scope manages under Edinburgh's skies."
---

<div class="blog-label">The instrument</div>
<h1 style="font-size:clamp(1.8rem,4vw,2.6rem);font-weight:300;margin-bottom:0.8rem;">One small telescope</h1>
<p style="font-family:'Inconsolata',monospace;font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--dim);margin-bottom:2.5rem;">Every image on this site · One rig · Edinburgh, Scotland</p>

<div style="font-size:1.15rem;line-height:1.85;">
<style>
  .gear-body h3 { font-size: 1.45rem; font-weight: 400; margin: 2.2rem 0 0.8rem; }
  .gear-body p, .gear-body ul { margin-bottom: 1.2rem; }
  .gear-body ul { padding-left: 1.4rem; }
  .gear-body a { color: var(--accent); }
  .gear-specs { width: 100%; border-collapse: collapse; margin: 1.5rem 0 2rem; font-family: 'Inconsolata', monospace; font-size: 0.78rem; letter-spacing: 0.05em; }
  .gear-specs td { padding: 0.55rem 0.8rem; border-bottom: 1px solid var(--border); vertical-align: top; }
  .gear-specs td:first-child { color: var(--dim); text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.65rem; padding-top: 0.7rem; white-space: nowrap; }
</style>
<div class="gear-body" markdown="1">

Everything in the [gallery](/) — every galaxy, nebula, cluster and comet — was captured with a single instrument: a **Dwarf 3 smart telescope**, shooting from light-polluted city skies in Edinburgh, Scotland. No observatory, no equatorial pier, no cooled astronomy camera. This page is about what that little telescope is, why it works, and how the images get from photons to the pictures you see here.

<figure id="gear-photo" style="margin:2.5rem 0;">
  <img src="/images/dwarf3_telescope.webp" alt="The Dwarf 3 smart telescope used for every image on this site" style="width:100%;border:1px solid var(--border);display:block;" onerror="document.getElementById('gear-photo').style.display='none'">
  <figcaption style="font-family:'Inconsolata',monospace;font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--dim);margin-top:0.7rem;">The Dwarf 3 — the entire observatory, in one hand. Image courtesy of DwarfLab.</figcaption>
</figure>

### The telescope

The Dwarf 3 is a fully self-contained robotic observatory about the size of a hardback book. Aperture, mount, camera, filters, guiding, plate-solving, stacking and power all live in one sealed unit weighing around 1.3&nbsp;kg. You set it down, level it, pick a target from a catalogue, and it finds the object, tracks it, and integrates exposure after exposure for as long as you let it run.

<table class="gear-specs">
  <tr><td>Telephoto lens</td><td>35 mm apochromatic triplet, 150 mm focal length (f/4.3) — 737 mm equivalent</td></tr>
  <tr><td>Telephoto sensor</td><td>Sony IMX678 Starvis 2, 3840 × 2160, ~2.9° × 1.6° field of view</td></tr>
  <tr><td>Wide-angle lens</td><td>6.7 mm f/2 — 45 mm equivalent, with its own 1920 × 1080 sensor</td></tr>
  <tr><td>Filters</td><td>Built-in filter wheel — VIS, broadband astro, and dual-band (Hα + OIII) for emission nebulae</td></tr>
  <tr><td>Mount</td><td>Motorised alt-azimuth with equatorial mode, automatic plate-solving and tracking</td></tr>
  <tr><td>Weight</td><td>~1.3 kg, battery and everything included</td></tr>
</table>

It's really two cameras sharing one mount. The telephoto side does all the deep-sky work — every image in the [gallery](/) came through it, with a field of view about six full Moons across: wide enough to swallow the sprawling nebula complexes in Cygnus, tight enough to resolve structure in galaxies tens of millions of light-years out. The wide-angle camera sees a 45&nbsp;mm-equivalent slice of sky and plays the supporting role — helping the telescope orient itself and frame targets, and turning its hand to nightscapes, panoramas and meteor-watching when the deep-sky side is busy.

A 35&nbsp;mm aperture sounds like a toy next to traditional astrophotography rigs — and next to a 10-inch reflector, it is. What makes it work is patience: the telescope takes short exposures continuously and stacks them, so the real aperture is time. A faint nebula that shows almost nothing in a single frame emerges cleanly after an hour or two of integration. The [integration time listed on every photo](/photos/) is that accumulated exposure.

The Dwarf 3 wasn't a leap of faith, either — it's an upgrade. Its predecessor, the Dwarf II, did sterling service here first: a great little telescope that proved the smart-scope concept was worth trusting, and earned its successor. When the Dwarf 3 arrived with better optics, a bigger sensor and the built-in filters, the Dwarf II was sold on to a new home — every image in the gallery came through the Dwarf 3. DwarfLab also makes a smaller, cheaper sibling, the Dwarf Mini; that one has never been used for anything on this site, so no claims are made about it here.

### The sky it works under

Edinburgh is not an easy place to do this. The city sky drowns faint targets in sodium and LED glow — around [Bortle 7 to 8](/bortle/) on the nine-point scale of sky darkness, which in practice means several times the integration time a rural site would need for the same image. And at 56° north there is no astronomical darkness at all from mid-May to late July: the sun never gets far enough below the horizon for the sky to fully darken.

Two things make deep-sky imaging possible anyway. The dual-band filter passes only the narrow hydrogen-alpha and oxygen-III wavelengths that emission nebulae actually shine in, rejecting most of the city's light pollution outright. And stacking suppresses the noise that remains — the signal adds up across frames while the noise averages away. Galaxies and clusters, which shine in broadband light a filter can't isolate, are harder from the city and simply demand more integration and clearer nights.

### From photons to pixels

The telescope stacks frames live as it shoots, so a session ends with a usable image straight off the device. But single sessions are rarely where the deep images come from — Scottish weather doesn't hand out four clear hours in a row very often.

That's where **Mega Stack** earns its place. Built into the DWARFLAB app, it re-stacks the raw sub-frames from separate sessions — different nights, even different exposure and gain settings — into one combined image, entirely on the telescope itself. An hour on a target tonight, another next week, more whenever the clouds part: Mega Stack folds them together, and the multi-hour integration times on the [longer captures here](/photos/) were built exactly that way, a clear spell at a time.

It also means none of these images is ever really finished. Targets get revisited whenever the sky allows, the new data folded into the old, and the image replaced with a deeper version — so the gallery quietly improves over time, and an integration time listed today is only a running total.

From there the image gets its finishing pass. DWARFLAB's **Stellar Studio** handles the astronomy-specific corrections — star correction, denoising and star reduction that know the difference between a star and noise. For deeper manual work the raw sub-frames are archived and re-stacked in [Siril](https://siril.org/), with stretching, colour calibration and noise reduction done by hand — always to pull out faint structure that's really there, never to invent detail that isn't.

The results, along with capture dates and integration times, end up in the [gallery](/) and on the [per-photo pages](/photos/); the occasional longer write-up about a specific target lands in the [field notes](/blog/).

### What it can't do

Honesty matters more than marketing here. A 35&nbsp;mm f/4.3 lens with a small sensor has real limits: planets render as tiny discs a few pixels across, tight double stars don't split, and small faint galaxies stay small and faint. The Dwarf 3 is at its best on the targets this gallery leans into — large nebulae, bright galaxies, star clusters, and comets — where its wide, fast field and tireless tracking count for more than raw aperture ever would.

That trade-off is the point. The best telescope is the one that actually gets used, and a self-contained unit that sets up in two minutes between Scottish weather windows gets used a great deal more than a car-boot full of counterweights.

</div>
</div>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Among Stars", "item": "https://chryse.co.uk/" },
    { "@type": "ListItem", "position": 2, "name": "Gear & Process" }
  ]
}
</script>
