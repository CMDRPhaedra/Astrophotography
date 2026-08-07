---
layout: default
title: Sky Conditions
permalink: /sky/
description: "Tonight's imaging conditions over Edinburgh — cloud cover, the astronomical darkness window, moon phase and illumination, and a twelve-hour cloud trend."
---

<div class="blog-label">The sky tonight</div>
<h1 style="font-size:clamp(1.8rem,4vw,2.6rem);font-weight:300;margin-bottom:0.8rem;">Is it worth setting up?</h1>
<p style="font-family:'Inconsolata',monospace;font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--dim);margin-bottom:2.5rem;">Edinburgh · 55.95°N 3.19°W · Updated through the night</p>

<style>
  /* ── Condition colours ───────────────────────────────────────────────────
     Tuned for the dark theme first, then given darker equivalents for the
     light background, the same way the Bortle class colours are. Every light
     value below clears 4.5:1 on #f5f2ec. */
  .sky {
    --clear:    #7fc9ae;
    --broken:   #d6a75a;
    --poor:     #d4783f;
    --overcast: #c25c4e;
    --moonlit:  #d8c48a;
  }
  [data-theme="light"] .sky {
    --clear:    #1f7a63;
    --broken:   #8a5c07;
    --poor:     #a4520d;
    --overcast: #b03f13;
    --moonlit:  #7a5f1f;
  }

  .sky { margin-bottom: 2.5rem; }

  /* Only one of the three panes is ever visible; the state machine lives on
     data-state so the JS never has to touch inline display rules. */
  .sky-pane { display: none; }
  .sky[data-state="loading"] .sky-pane--loading { display: block; }
  .sky[data-state="error"]   .sky-pane--error   { display: block; }
  .sky[data-state="ready"]   .sky-pane--content,
  .sky[data-state="partial"] .sky-pane--content { display: block; }
  .sky[data-state="partial"] .sky-degraded { display: block; }
  .sky-degraded { display: none; }

  /* ── Hero: dial + verdict ────────────────────────────────────────────── */
  .sky-hero {
    display: grid; grid-template-columns: 220px 1fr; gap: 2.5rem;
    align-items: center; margin-bottom: 2.5rem;
  }

  .sky-dial { position: relative; width: 220px; height: 220px; }
  .sky-dial svg { width: 100%; height: 100%; transform: rotate(-90deg); display: block; }
  .sky-dial-track { fill: none; stroke: var(--border); stroke-width: 6; }
  .sky-dial-fill {
    fill: none; stroke: var(--tone, var(--accent)); stroke-width: 6;
    stroke-dashoffset: var(--dash-from);
    animation: skyDial 1.4s cubic-bezier(.16,1,.3,1) 0.2s forwards;
  }
  @keyframes skyDial { to { stroke-dashoffset: var(--dash-to); } }

  /* Aperture-barrel ticks — a nod to the lens without the mockup's glow,
     which would sit oddly against the rest of the site. */
  .sky-dial-ticks { fill: none; stroke: var(--border); stroke-width: 1; }

  .sky-dial-centre {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center;
  }
  .sky-dial-number { font-size: 3.4rem; font-weight: 300; line-height: 1; }
  .sky-dial-number sup { font-size: 1.1rem; color: var(--dim); top: -1.3em; }
  .sky-dial-label {
    font-family: 'Inconsolata', monospace; font-size: 0.6rem; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--dim); margin-top: 0.5rem;
  }

  .sky-verdict { font-size: clamp(1.5rem,3.4vw,2.1rem); font-weight: 300; line-height: 1.2; margin-bottom: 0.9rem; }
  .sky-tone--good    { color: var(--clear); }
  .sky-tone--caution { color: var(--broken); }
  .sky-tone--bad     { color: var(--overcast); }
  .sky-tone--unknown { color: var(--dim); }

  /* Three levels of emphasis rather than one. The lead is the assessment,
     the risk list is scannable hazards, the note is background — rendering
     all three as identical italic paragraphs made a wall of slanted text
     with no way to tell which sentence mattered. */
  .sky-verdict-sub > *:last-child { margin-bottom: 0 !important; }

  .sky-lead { color: var(--ink); line-height: 1.65; margin-bottom: 1.1rem; }

  .sky-risks { list-style: none; margin: 0 0 1.1rem; padding: 0; }
  .sky-risk { display: flex; align-items: baseline; gap: 0.6rem; margin-bottom: 0.45rem; line-height: 1.55; }
  .sky-risk:last-child { margin-bottom: 0; }
  .sky-risk-dot { flex: 0 0 auto; width: 5px; height: 5px; border-radius: 50%; transform: translateY(-0.15em); }
  .sky-risk--warn .sky-risk-dot { background: var(--broken); }
  .sky-risk--bad  .sky-risk-dot { background: var(--overcast); }
  .sky-risk-text {
    font-family: 'Inconsolata', monospace; font-size: 0.75rem; letter-spacing: 0.03em;
    color: var(--dim);
  }
  .sky-risk--bad .sky-risk-text { color: var(--ink); }

  .sky-note { color: var(--dim); line-height: 1.7; font-style: italic; font-size: 0.95rem; margin-bottom: 0.6rem; }

  /* ── Stat grid ───────────────────────────────────────────────────────── */
  .sky-stats {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1px; background: var(--border); border: 1px solid var(--border);
    margin-bottom: 2.5rem;
  }
  .sky-stat { background: var(--card-bg); padding: 1rem 1.1rem 1.2rem; }
  .sky-stat-label {
    font-family: 'Inconsolata', monospace; font-size: 0.58rem; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--dim); margin-bottom: 0.55rem; line-height: 1.5;
  }
  .sky-stat-value { font-size: 1.45rem; font-weight: 300; line-height: 1.2; }
  .sky-stat-value.is-moon { color: var(--moonlit); }
  .sky-stat-value.is-good { color: var(--clear); }
  .sky-stat-value.is-warn { color: var(--broken); }
  .sky-stat-value.is-bad  { color: var(--overcast); }
  .sky-stat-detail {
    font-family: 'Inconsolata', monospace; font-size: 0.62rem; letter-spacing: 0.05em;
    color: var(--dim); margin-top: 0.4rem; line-height: 1.6;
  }

  /* ── Twelve-hour chart ───────────────────────────────────────────────── */
  .sky-chart-head {
    display: flex; justify-content: space-between; align-items: baseline;
    flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;
  }
  .sky-chart-title { font-size: 1.2rem; font-weight: 400; }
  .sky-chart-source {
    font-family: 'Inconsolata', monospace; font-size: 0.6rem; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--dim);
  }

  .sky-chart {
    display: flex; gap: 0.6rem;
    background: var(--card-bg); border: 1px solid var(--border);
    padding: 0.9rem 0.9rem 0.6rem;
  }
  .sky-chart-body { flex: 1 1 auto; min-width: 0; }

  /* A y-axis makes a row of 6% slivers read as "almost no cloud" rather than
     as a chart that failed to draw. */
  .sky-axis-y {
    flex: 0 0 auto; height: 130px; display: flex; flex-direction: column;
    justify-content: space-between; align-items: flex-end;
    font-family: 'Inconsolata', monospace; font-size: 0.52rem;
    letter-spacing: 0.04em; color: var(--dim);
  }
  .sky-axis-y span { line-height: 1; transform: translateY(-0.3em); }
  .sky-axis-y span:first-child { transform: none; }

  .sky-plot {
    display: flex; align-items: flex-end; gap: 3px; height: 130px;
    background-image: linear-gradient(var(--border) 1px, transparent 1px);
    background-size: 100% 25%;
    background-position: 0 -1px;
  }

  .sky-col {
    flex: 1; height: 100%; display: flex; align-items: flex-end; justify-content: center;
  }
  /* The shaded band is the dark window — the hours that actually matter. */
  .sky-col.is-night { background: rgba(200,169,110,0.07); }
  [data-theme="light"] .sky-col.is-night { background: rgba(160,120,64,0.10); }

  .sky-bar {
    width: 100%; max-width: 18px; background: var(--border);
    transform: scaleY(0); transform-origin: bottom;
    animation: skyBar 0.6s cubic-bezier(.16,1,.3,1) forwards;
  }
  @keyframes skyBar { to { transform: scaleY(1); } }
  .sky-bar--clear    { background: var(--clear); }
  .sky-bar--broken   { background: var(--broken); }
  .sky-bar--poor     { background: var(--poor); }
  .sky-bar--overcast { background: var(--overcast); }

  .sky-axis-x { display: flex; gap: 3px; margin-top: 0.45rem; }
  .sky-bar-time {
    flex: 1; text-align: center;
    font-family: 'Inconsolata', monospace; font-size: 0.55rem; letter-spacing: 0.02em;
    color: var(--dim);
  }
  .sky-bar-time.is-night { color: var(--accent); }
  .sky-chart-note {
    font-family: 'Inconsolata', monospace; font-size: 0.6rem; letter-spacing: 0.06em;
    color: var(--dim); line-height: 1.7; margin-top: 0.7rem;
  }

  /* ── Loading, error, degraded ────────────────────────────────────────── */
  .sky-skeleton { border: 1px solid var(--border); background: var(--card-bg); padding: 2.5rem; text-align: center; }
  .sky-skeleton-ring {
    width: 90px; height: 90px; margin: 0 auto 1.2rem;
    border: 3px solid var(--border); border-top-color: var(--accent);
    border-radius: 50%; animation: skySpin 1.1s linear infinite;
  }
  @keyframes skySpin { to { transform: rotate(360deg); } }
  .sky-skeleton p, .sky-error-box p {
    font-family: 'Inconsolata', monospace; font-size: 0.68rem; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--dim);
  }

  .sky-error-box { border: 1px solid var(--border); background: var(--card-bg); padding: 2rem; text-align: center; }
  .sky-error-box p + p { margin-top: 0.7rem; text-transform: none; letter-spacing: 0.05em; }
  .sky-retry {
    font-family: 'Inconsolata', monospace; font-size: 0.65rem; letter-spacing: 0.12em;
    text-transform: uppercase; background: transparent; border: 1px solid var(--border);
    color: var(--dim); padding: 0.45rem 1.2rem; cursor: pointer; margin-top: 1.2rem;
    transition: border-color 0.2s, color 0.2s;
  }
  .sky-retry:hover { border-color: var(--accent); color: var(--accent); }

  .sky-degraded {
    border: 1px solid var(--border); border-left: 2px solid var(--broken);
    background: var(--card-bg); padding: 0.9rem 1.1rem; margin-bottom: 2rem;
    font-family: 'Inconsolata', monospace; font-size: 0.63rem; letter-spacing: 0.06em;
    color: var(--dim); line-height: 1.7;
  }

  .sky-foot {
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;
    border-top: 1px solid var(--border); padding-top: 1rem; margin-top: 1.5rem;
    font-family: 'Inconsolata', monospace; font-size: 0.6rem; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--dim);
  }
  .sky-foot a { color: var(--dim); }
  .sky-foot a:hover { color: var(--accent); }
  .sky-empty { color: var(--dim); font-style: italic; }

  .sky-body h3 { font-size: 1.45rem; font-weight: 400; margin: 2.6rem 0 0.8rem; }
  .sky-body p { margin-bottom: 1.2rem; }
  .sky-body a { color: var(--accent); }
  .sky-caveat {
    font-family: 'Inconsolata', monospace; font-size: 0.65rem; letter-spacing: 0.06em;
    line-height: 1.8; color: var(--dim); border-top: 1px solid var(--border);
    padding-top: 1.2rem; margin-top: 2.5rem;
  }

  @media (max-width: 700px) {
    .sky-hero { grid-template-columns: 1fr; gap: 1.8rem; justify-items: center; text-align: center; }
    .sky-verdict-sub p { text-align: left; }
    .sky-stats { grid-template-columns: repeat(2, 1fr); }
    /* An odd card count leaves a hole, and because the grid uses its gap to
       draw the rules, that hole renders as a solid border-coloured block.
       Letting the last one span the row keeps the edge clean. */
    .sky-stats .sky-stat:last-child:nth-child(odd) { grid-column: 1 / -1; }
    .sky-chart { gap: 0.4rem; padding: 0.7rem 0.6rem 0.5rem; }
    .sky-plot, .sky-axis-y { height: 110px; }
    .sky-plot, .sky-axis-x { gap: 2px; }
    .sky-bar-time { font-size: 0.48rem; }
  }
  /* Nine cards single-file is a long scroll on a phone, and two columns stay
     legible well below the narrowest common handset — so only fall back to
     one column on genuinely tiny viewports. */
  @media (max-width: 330px) {
    .sky-stats { grid-template-columns: 1fr; }
  }
  @media (max-width: 380px) {
    .sky-dial, .sky-dial-wrap { width: 180px; height: 180px; }
    .sky-stat { padding: 0.85rem 0.8rem 1rem; }
    .sky-stat-value { font-size: 1.25rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    .sky-dial-fill { animation: none; stroke-dashoffset: var(--dash-to); }
    .sky-bar { animation: none; transform: scaleY(1); }
    .sky-skeleton-ring { animation: none; }
  }
</style>

<div class="sky"
     data-sky-conditions
     data-state="loading"
     data-endpoint="https://weather.chryse.co.uk/weather"
     data-endpoint-dev="http://localhost:8787/weather"
     data-lat="55.9533"
     data-lon="-3.1883">

  <div class="sky-pane sky-pane--loading">
    <div class="sky-skeleton">
      <div class="sky-skeleton-ring"></div>
      <p>Reading the sky…</p>
    </div>
  </div>

  <div class="sky-pane sky-pane--error">
    <div class="sky-error-box">
      <p>Sky conditions unavailable</p>
      <p data-slot="error-detail">Something went wrong working out tonight's conditions.</p>
      <button class="sky-retry" type="button" data-action="retry">Try again</button>
    </div>
  </div>

  <div class="sky-pane sky-pane--content">
    <div class="sky-degraded">
      The weather service could not be reached, so cloud cover and visibility are missing.
      Darkness and moon figures below are computed locally and remain accurate.
    </div>

    <div class="sky-hero">
      <div data-slot="dial"></div>
      <div>
        <div class="sky-verdict" data-slot="verdict"></div>
        <div class="sky-verdict-sub" data-slot="verdict-sub"></div>
      </div>
    </div>

    <div class="sky-stats" data-slot="stats"></div>

    <div class="sky-chart-head">
      <div class="sky-chart-title">Cloud cover, next twelve hours</div>
      <div class="sky-chart-source">Hourly forecast</div>
    </div>
    <div data-slot="chart"></div>

    <div class="sky-foot">
      <span><a href="https://weatherkit.apple.com/legal-attribution.html" rel="noopener">Weather data provided by&nbsp;Apple&nbsp;Weather</a></span>
      <span data-slot="updated"></span>
    </div>
  </div>
</div>

<div style="font-size:1.15rem;line-height:1.85;">
<div class="sky-body" markdown="1">

### Reading the numbers

Cloud cover is the number that decides the night, so it gets the dial. Below about 20% you can work; between 20% and 45% you are gambling on gaps; above 75% there is no point carrying the telescope outside. The percentage in the dial is the current reading, while the verdict uses the average across the hours that actually fall inside the dark window — a cloudy evening that clears by midnight is a good night, and an average over the whole forecast would hide that.

The darkness window matters more than sunset. Astronomical twilight — the sun 18° below the horizon — is the point at which the sky stops contributing its own glow and faint detail becomes reachable. From Edinburgh that window is generous in winter and non-existent in high summer: between early May and early August the sun never sinks far enough, and the deepest available darkness is nautical twilight instead. The page says so plainly when that happens rather than showing a blank.

Moon illumination is the other half of the picture, and it is not simply about phase. A brilliant gibbous moon that sets an hour after dusk costs you very little; a half moon riding high all night costs you a great deal. The verdict weighs illumination against how much of the dark window the moon actually spends above the horizon, which is why a bright moon sometimes still reads as a good night.

The last three figures decide whether a clear night survives contact with reality, and they are reported as the worst value across the dark window rather than an average — all three are threshold effects, and an average would hide precisely the hour that ends the session. Dew point spread is the gap between the air temperature and the point at which moisture condenses: below about 2°C it forms on the corrector, and with no dew heater on the telescope that is the end of the night rather than an inconvenience. Wind is quoted with its gusts, because a 1.3&nbsp;kg telescope on a tripod copes with a steady breeze and not with the gust that lands mid-exposure. Rain chance is there for the hardware rather than the picture.

What none of this covers is seeing and transparency — how much the atmosphere is boiling, and how much of the starlight actually reaches the ground. Those are the numbers astronomers argue about, and they come from specialist astronomy forecasts rather than a general weather service. Cloud, moon, dew and wind are the honest limit of what can be answered here.

None of this replaces looking out of the window. Forecasts at this resolution are honest about the next few hours and increasingly speculative after that, and Scottish weather has a talent for ignoring them entirely. Treat it as a reason to check, not a promise. What a light-polluted sky costs you even on a clear night is covered on the [Bortle page](/bortle/), and the [gear page](/gear/) explains what the telescope can do with the hours you get.

<p class="sky-caveat">Cloud cover, visibility and the hourly forecast come from Apple WeatherKit. Twilight times, moon rise and set, phase and illumination are computed in your browser from the date and Edinburgh's coordinates using standard low-precision solar and lunar algorithms — accurate to about a minute for the sun and a few minutes for the moon, which is well inside what matters for planning a session. Times are shown in Edinburgh local time regardless of where you are reading from.</p>

</div>
</div>

<script src="/assets/js/sky-conditions.js" defer></script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Among Stars", "item": "https://chryse.co.uk/" },
    { "@type": "ListItem", "position": 2, "name": "Sky Conditions" }
  ]
}
</script>
