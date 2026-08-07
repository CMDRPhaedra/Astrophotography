/**
 * Sky Conditions — /sky/
 * ---------------------------------------------------------------------------
 * Cloud cover comes from the WeatherKit proxy. Everything astronomical —
 * twilight times, moon rise/set, moon illumination — is computed here in the
 * browser rather than fetched, for three reasons:
 *
 *   1. WeatherKit's moonPhase is a *string* enum ("waningCrescent"). There is
 *      no illumination percentage in the API at all, so it has to be computed
 *      regardless.
 *   2. Twilight is pure geometry — latitude, longitude, date. It needs no
 *      forecast, so routing it through a weather proxy buys nothing and adds a
 *      redeploy every time the maths changes.
 *   3. Edinburgh sits above the latitude where astronomical night exists in
 *      summer. In 2026 the sun fails to reach 18° below the horizon from
 *      5 May to 9 August, and WeatherKit returns null throughout. Computing
 *      it locally lets the page say *why* there's no darkness, and when it
 *      comes back, rather than printing a dash for a third of the year.
 *
 * The practical payoff: if the proxy is down, the page still renders the
 * twilight window and the moon. Only the cloud figures go missing.
 *
 * The solar/lunar routines follow Meeus, "Astronomical Algorithms" (2nd ed.),
 * in the low-precision forms popularised by SunCalc. Accuracy is around a
 * minute for solar events and a few minutes for lunar rise/set — far inside
 * what matters when deciding whether to set a telescope up.
 */
(function (root) {
  'use strict';

  var RAD = Math.PI / 180;
  var J1970 = 2440588;
  var J2000 = 2451545;
  var DAY_MS = 86400000;
  var OBLIQUITY = RAD * 23.4397;      // Earth's axial tilt
  var SUN_DIST_KM = 149598000;

  var sin = Math.sin, cos = Math.cos, tan = Math.tan;
  var asin = Math.asin, atan = Math.atan2, acos = Math.acos;

  /* ── Julian date helpers ─────────────────────────────────────────────── */

  function toJulian(date) { return date.valueOf() / DAY_MS - 0.5 + J1970; }
  function fromJulian(j) { return new Date((j + 0.5 - J1970) * DAY_MS); }
  function toDays(date) { return toJulian(date) - J2000; }

  /* ── Equatorial coordinate conversions ───────────────────────────────── */

  function rightAscension(l, b) {
    return atan(sin(l) * cos(OBLIQUITY) - tan(b) * sin(OBLIQUITY), cos(l));
  }
  function declination(l, b) {
    return asin(sin(b) * cos(OBLIQUITY) + cos(b) * sin(OBLIQUITY) * sin(l));
  }
  function siderealTime(d, lw) { return RAD * (280.16 + 360.9856235 * d) - lw; }

  function altitude(H, phi, dec) {
    return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));
  }

  /* ── Sun ─────────────────────────────────────────────────────────────── */

  function solarMeanAnomaly(d) { return RAD * (357.5291 + 0.98560028 * d); }

  function eclipticLongitude(M) {
    // Equation of centre, plus the longitude of perihelion.
    var C = RAD * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M));
    var P = RAD * 102.9372;
    return M + C + P + Math.PI;
  }

  function sunCoords(d) {
    var M = solarMeanAnomaly(d);
    var L = eclipticLongitude(M);
    return { dec: declination(L, 0), ra: rightAscension(L, 0), M: M, L: L };
  }

  /* ── Solar event times (the "sunrise equation") ──────────────────────── */

  var J0 = 0.0009;

  function julianCycle(d, lw) { return Math.round(d - J0 - lw / (2 * Math.PI)); }
  function approxTransit(Ht, lw, n) { return J0 + (Ht + lw) / (2 * Math.PI) + n; }
  function solarTransitJ(ds, M, L) {
    return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L);
  }

  /**
   * Hour angle at which the sun sits at altitude h.
   *
   * Returns NaN when there is no such moment. That is not an error — at
   * Edinburgh's latitude it is the normal summer answer for h = -18°, and the
   * sign of the out-of-range argument tells us which way it failed:
   *   arg >  1  the sun never sinks that low  (no astronomical night)
   *   arg < -1  the sun never climbs that high (polar night at that threshold)
   */
  function hourAngle(h, phi, dec) {
    return acos((sin(h) - sin(phi) * sin(dec)) / (cos(phi) * cos(dec)));
  }

  function hourAngleArg(h, phi, dec) {
    return (sin(h) - sin(phi) * sin(dec)) / (cos(phi) * cos(dec));
  }

  /**
   * Rise/set times for a given solar altitude on the day containing `date`.
   *
   * `reason` distinguishes the two ways an event can be absent, which the UI
   * needs in order to explain itself rather than just printing a dash.
   */
  function sunEvent(date, lat, lng, angleDeg) {
    var lw = RAD * -lng;
    var phi = RAD * lat;
    var d = toDays(date);
    var n = julianCycle(d, lw);
    var ds = approxTransit(0, lw, n);
    var c = sunCoords(ds);
    var Jnoon = solarTransitJ(ds, c.M, c.L);

    var h = RAD * angleDeg;
    var arg = hourAngleArg(h, phi, c.dec);

    if (arg > 1) return { rise: null, set: null, noon: fromJulian(Jnoon), reason: 'never-below' };
    if (arg < -1) return { rise: null, set: null, noon: fromJulian(Jnoon), reason: 'never-above' };

    var w = acos(arg);
    var Jset = solarTransitJ(approxTransit(w, lw, n), c.M, c.L);
    var Jrise = Jnoon - (Jset - Jnoon);

    return {
      rise: fromJulian(Jrise),
      set: fromJulian(Jset),
      noon: fromJulian(Jnoon),
      reason: null
    };
  }

  function sunPosition(date, lat, lng) {
    var lw = RAD * -lng, phi = RAD * lat, d = toDays(date);
    var c = sunCoords(d);
    var H = siderealTime(d, lw) - c.ra;
    return { altitude: altitude(H, phi, c.dec), dec: c.dec };
  }

  /* ── Moon ────────────────────────────────────────────────────────────── */

  function moonCoords(d) {
    var L = RAD * (218.316 + 13.176396 * d);   // geocentric ecliptic longitude
    var M = RAD * (134.963 + 13.064993 * d);   // mean anomaly
    var F = RAD * (93.272 + 13.229350 * d);    // mean distance from ascending node

    var l = L + RAD * 6.289 * sin(M);          // longitude, main equation of centre
    var b = RAD * 5.128 * sin(F);              // latitude
    var dt = 385001 - 20905 * cos(M);          // distance, km

    return { ra: rightAscension(l, b), dec: declination(l, b), dist: dt };
  }

  function moonPosition(date, lat, lng) {
    var lw = RAD * -lng, phi = RAD * lat, d = toDays(date);
    var c = moonCoords(d);
    var H = siderealTime(d, lw) - c.ra;
    var h = altitude(H, phi, c.dec);

    // Refraction near the horizon lifts the apparent moon; without this the
    // rise/set times run a couple of minutes late.
    h = h + RAD * 0.017 / tan(h + RAD * 10.26 / (h / RAD + 5.10));

    return { altitude: h, distance: c.dist, ra: c.ra, dec: c.dec };
  }

  /**
   * Illuminated fraction and waxing/waning sense.
   *
   * `phase` runs 0 → 1 across a full lunation: 0 new, 0.25 first quarter,
   * 0.5 full, 0.75 last quarter.
   */
  function moonIllumination(date) {
    var d = toDays(date);
    var s = sunCoords(d);
    var m = moonCoords(d);

    // Geocentric elongation of the moon from the sun.
    var phi = acos(
      sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra)
    );
    // Phase angle at the moon (sun–moon–earth).
    var inc = atan(SUN_DIST_KM * sin(phi), m.dist - SUN_DIST_KM * cos(phi));
    var angle = atan(
      cos(s.dec) * sin(s.ra - m.ra),
      sin(s.dec) * cos(m.dec) - cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra)
    );

    return {
      fraction: (1 + cos(inc)) / 2,
      phase: 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / Math.PI,
      waxing: angle < 0
    };
  }

  function hoursLater(date, h) {
    return new Date(date.valueOf() + h * DAY_MS / 24);
  }

  /**
   * Moon rise and set within the 24 hours starting at local midnight of
   * `date`, found by sampling altitude hourly and refining sign changes with a
   * quadratic fit. The moon can legitimately do neither in a day — it rises
   * ~50 minutes later each day, so roughly monthly one of the two is skipped.
   */
  function moonTimes(date, lat, lng) {
    var t = new Date(date);
    t.setHours(0, 0, 0, 0);

    var hc = 0.133 * RAD;   // semidiameter + refraction at the horizon
    var h0 = moonPosition(t, lat, lng).altitude - hc;
    var rise, set, ye = 0;

    for (var i = 1; i <= 24; i += 2) {
      var h1 = moonPosition(hoursLater(t, i), lat, lng).altitude - hc;
      var h2 = moonPosition(hoursLater(t, i + 1), lat, lng).altitude - hc;

      var a = (h0 + h2) / 2 - h1;
      var b = (h2 - h0) / 2;
      var xe = -b / (2 * a);
      ye = (a * xe + b) * xe + h1;
      var d = b * b - 4 * a * h1;
      var roots = 0, x1 = 0, x2 = 0;

      if (d >= 0) {
        var dx = Math.sqrt(d) / (Math.abs(a) * 2);
        x1 = xe - dx;
        x2 = xe + dx;
        if (Math.abs(x1) <= 1) roots++;
        if (Math.abs(x2) <= 1) roots++;
        if (x1 < -1) x1 = x2;
      }

      if (roots === 1) {
        if (h0 < 0) rise = i + x1; else set = i + x1;
      } else if (roots === 2) {
        rise = i + (ye < 0 ? x2 : x1);
        set = i + (ye < 0 ? x1 : x2);
      }

      if (rise !== undefined && set !== undefined) break;
      h0 = h2;
    }

    var result = {
      rise: rise !== undefined ? hoursLater(t, rise) : null,
      set: set !== undefined ? hoursLater(t, set) : null
    };
    if (rise === undefined && set === undefined) {
      result[ye > 0 ? 'alwaysUp' : 'alwaysDown'] = true;
    }
    return result;
  }

  /**
   * All moon rise/set events over `days` consecutive days from `from`,
   * in time order.
   *
   * moonTimes() answers "what does the moon do on this calendar day", which is
   * the wrong question for an observing night: the moon that rises at 22:53
   * tonight sets tomorrow afternoon, while the set reported for today belongs
   * to last night's moon. Flattening several days into one ordered list lets
   * the caller pick the pair that actually brackets the dark window.
   */
  function moonEvents(from, days, lat, lng) {
    var out = [];
    for (var i = 0; i < days; i++) {
      var mt = moonTimes(new Date(from.valueOf() + i * DAY_MS), lat, lng);
      if (mt.rise) out.push({ type: 'rise', at: mt.rise });
      if (mt.set) out.push({ type: 'set', at: mt.set });
    }
    out.sort(function (a, b) { return a.at - b.at; });

    // Overlapping day scans can surface the same event twice.
    return out.filter(function (e, i, arr) {
      return i === 0 || e.type !== arr[i - 1].type || Math.abs(e.at - arr[i - 1].at) > 60000;
    });
  }

  /**
   * The moonrise and moonset that actually bear on tonight's dark window.
   *
   * The question is not "what did the moon do today" but "is the moon in the
   * way while it's dark", so the window drives the selection:
   *
   *   - already up at nightfall  → the rise that put it there, and the set
   *                                that takes it away again
   *   - rises during the window  → that rise, and the set after it
   *   - neither                  → `neverUp`, and the caller should say so
   *                                rather than print times for a moon that is
   *                                below the horizon the whole time
   *
   * The last case is the one worth being careful about: a moon that sets
   * twenty minutes before darkness falls is irrelevant to the session, and
   * quoting tomorrow evening's set for it would be actively misleading.
   */
  function moonNight(window, lat, lng) {
    var anchor = window.start || new Date();
    var winStart = (window.start || anchor).valueOf();
    var winEnd = (window.end || new Date(anchor.valueOf() + 6 * 3600000)).valueOf();

    var from = new Date(anchor.valueOf() - DAY_MS);
    from.setHours(0, 0, 0, 0);
    var events = moonEvents(from, 4, lat, lng);

    var upAtStart = moonPosition(new Date(winStart), lat, lng).altitude > 0;
    var rise = null, set = null, i;

    if (upAtStart) {
      for (i = events.length - 1; i >= 0; i--) {
        if (events[i].type === 'rise' && events[i].at.valueOf() <= winStart) {
          rise = events[i].at;
          break;
        }
      }
    } else {
      for (i = 0; i < events.length; i++) {
        if (events[i].type === 'rise' &&
            events[i].at.valueOf() > winStart &&
            events[i].at.valueOf() <= winEnd) {
          rise = events[i].at;
          break;
        }
      }
      if (!rise) return { rise: null, set: null, neverUp: true, upAtStart: false };
    }

    for (i = 0; i < events.length; i++) {
      if (events[i].type === 'set' && events[i].at.valueOf() > (rise ? rise.valueOf() : winStart)) {
        set = events[i].at;
        break;
      }
    }

    return { rise: rise, set: set, neverUp: false, upAtStart: upAtStart };
  }

  /* ── Tonight's observing window ──────────────────────────────────────── */

  /**
   * Work out the dark window for the *coming* night.
   *
   * "Tonight" is genuinely ambiguous around midnight, and getting it wrong is
   * the classic off-by-one-day bug in this kind of widget. The rule here: if
   * it is before local noon, the night in question began yesterday evening and
   * ends this morning; otherwise it begins this evening and ends tomorrow.
   *
   * Falls back through astronomical → nautical → civil darkness so that a
   * Scottish summer still produces a usable answer instead of an empty card.
   */
  function observingWindow(now, lat, lng) {
    var beforeNoon = now.getHours() < 12;
    var evening = new Date(now);
    if (beforeNoon) evening.setDate(evening.getDate() - 1);
    evening.setHours(12, 0, 0, 0);

    var morning = new Date(evening);
    morning.setDate(morning.getDate() + 1);

    var levels = [
      { key: 'astronomical', angle: -18, label: 'Astronomical dark' },
      { key: 'nautical', angle: -12, label: 'Nautical dark' },
      { key: 'civil', angle: -6, label: 'Civil twilight' }
    ];

    var attempted = [];
    for (var i = 0; i < levels.length; i++) {
      var lvl = levels[i];
      var dusk = sunEvent(evening, lat, lng, lvl.angle);
      var dawn = sunEvent(morning, lat, lng, lvl.angle);
      attempted.push(lvl.key);

      if (dusk.set && dawn.rise) {
        return {
          level: lvl.key,
          label: lvl.label,
          angle: lvl.angle,
          start: dusk.set,
          end: dawn.rise,
          durationMs: dawn.rise - dusk.set,
          degraded: i > 0,
          missing: attempted.slice(0, i)
        };
      }
    }

    return { level: null, label: null, start: null, end: null, durationMs: 0, degraded: true, missing: attempted };
  }

  /**
   * The next date on which astronomical night returns — used to tell the
   * reader how long the summer gap has left to run. Scans forward a year and
   * gives up rather than looping forever.
   */
  function nextAstronomicalNight(from, lat, lng) {
    var probe = new Date(from);
    probe.setHours(12, 0, 0, 0);
    for (var i = 0; i < 366; i++) {
      probe.setDate(probe.getDate() + 1);
      if (sunEvent(probe, lat, lng, -18).set) return new Date(probe);
    }
    return null;
  }

  /* ── Formatting ──────────────────────────────────────────────────────── */

  var TZ = 'Europe/London';

  // Times are always shown in Edinburgh's local time, not the reader's — the
  // sky being described is over Scotland regardless of who is looking.
  function fmtTime(date) {
    if (!date || isNaN(date)) return '—';
    return date.toLocaleTimeString('en-GB', {
      timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false
    });
  }

  // Just the hour, for the chart's x-axis. Stripping ":00" off a formatted
  // time would turn midnight into an empty label.
  function fmtHour(date) {
    if (!date || isNaN(date)) return '';
    return date.toLocaleTimeString('en-GB', {
      timeZone: TZ, hour: '2-digit', hour12: false
    }).replace(/[^0-9]/g, '');
  }

  function sameLocalDay(a, b) {
    if (!a || !b) return false;
    var opts = { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' };
    return a.toLocaleDateString('en-GB', opts) === b.toLocaleDateString('en-GB', opts);
  }

  function fmtDate(date) {
    if (!date || isNaN(date)) return '—';
    return date.toLocaleDateString('en-GB', {
      timeZone: TZ, day: 'numeric', month: 'long'
    });
  }

  function fmtDuration(ms) {
    if (!ms || ms <= 0) return '—';
    var mins = Math.round(ms / 60000);
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    return h + 'h ' + (m < 10 ? '0' : '') + m + 'm';
  }

  function phaseName(illum) {
    var f = illum.fraction;
    if (f < 0.02) return 'New moon';
    if (f > 0.98) return 'Full moon';
    if (Math.abs(f - 0.5) < 0.045) return illum.waxing ? 'First quarter' : 'Last quarter';
    if (f < 0.5) return illum.waxing ? 'Waxing crescent' : 'Waning crescent';
    return illum.waxing ? 'Waxing gibbous' : 'Waning gibbous';
  }

  // WeatherKit's own phase strings are authoritative for naming, so prefer
  // them when present and fall back to the computed name when the proxy is
  // unreachable or the field is null.
  var WK_PHASE = {
    new: 'New moon',
    waxingCrescent: 'Waxing crescent',
    firstQuarter: 'First quarter',
    waxingGibbous: 'Waxing gibbous',
    full: 'Full moon',
    waningGibbous: 'Waning gibbous',
    // Apple sends "thirdQuarter"; "lastQuarter" appears in some of its docs,
    // so both are mapped rather than trusting one spelling.
    thirdQuarter: 'Last quarter',
    lastQuarter: 'Last quarter',
    waningCrescent: 'Waning crescent'
  };

  /* ── Verdict ─────────────────────────────────────────────────────────── */

  /**
   * How much of the dark window the moon spends above the horizon, weighted by
   * how bright it is. A brilliant moon that sets at dusk barely matters; a
   * half moon up all night matters a lot.
   *
   * Sampled every ten minutes, which is deliberately coarse: a moon that
   * clears the horizon a few minutes before dawn rounds to zero influence,
   * and that is the correct answer for an imaging session.
   */
  function moonInterference(window, illum, lat, lng) {
    if (!window.start || !window.end) return { upFraction: 0, weight: 0 };

    var samples = 0, up = 0;
    var step = 10 * 60000;
    for (var t = window.start.valueOf(); t <= window.end.valueOf(); t += step) {
      samples++;
      if (moonPosition(new Date(t), lat, lng).altitude > 0) up++;
    }
    var upFraction = samples ? up / samples : 0;
    return { upFraction: upFraction, weight: upFraction * illum.fraction };
  }

  /**
   * Mean cloud cover across the hours that overlap the dark window. Falls back
   * to the plain 12-hour mean when the forecast doesn't reach the window —
   * which is what happens if you load the page in the early afternoon.
   */
  function windowCloud(hourly, window) {
    if (!hourly || !hourly.length) return null;

    var inWindow = [];
    if (window.start && window.end) {
      for (var i = 0; i < hourly.length; i++) {
        var t = new Date(hourly[i].time).valueOf();
        if (t >= window.start.valueOf() && t <= window.end.valueOf()) {
          inWindow.push(hourly[i].cloudCoverPercent);
        }
      }
    }

    var series = inWindow.length ? inWindow : hourly.map(function (h) { return h.cloudCoverPercent; });
    var sum = series.reduce(function (a, b) { return a + b; }, 0);
    return { mean: Math.round(sum / series.length), coveredWindow: inWindow.length > 0, hours: series.length };
  }

  /**
   * Worst-case dew, wind and rain across the dark window.
   *
   * Extremes rather than averages, because these three are threshold effects
   * rather than gradual ones: one hour where the dew point closes on the air
   * temperature fogs the corrector for the rest of the night, and a single
   * gust trails the sub it lands on. An average would hide exactly the hour
   * that ends the session.
   */
  function windowExtremes(hourly, window) {
    if (!hourly || !hourly.length) return null;

    var inWindow = [];
    if (window.start && window.end) {
      for (var i = 0; i < hourly.length; i++) {
        var t = new Date(hourly[i].time).valueOf();
        if (t >= window.start.valueOf() && t <= window.end.valueOf()) inWindow.push(hourly[i]);
      }
    }
    var series = inWindow.length ? inWindow : hourly;

    var maxPrecip = null, minSpread = null, maxGust = null, maxWind = null;
    for (var j = 0; j < series.length; j++) {
      var h = series[j];
      if (h.precipChancePercent != null) {
        maxPrecip = maxPrecip === null ? h.precipChancePercent : Math.max(maxPrecip, h.precipChancePercent);
      }
      if (h.temperatureC != null && h.dewPointC != null) {
        var spread = h.temperatureC - h.dewPointC;
        minSpread = minSpread === null ? spread : Math.min(minSpread, spread);
      }
      if (h.windGustKph != null) {
        maxGust = maxGust === null ? h.windGustKph : Math.max(maxGust, h.windGustKph);
      }
      if (h.windSpeedKph != null) {
        maxWind = maxWind === null ? h.windSpeedKph : Math.max(maxWind, h.windSpeedKph);
      }
    }

    return {
      maxPrecip: maxPrecip,
      minSpread: minSpread === null ? null : Math.round(minSpread * 10) / 10,
      maxGust: maxGust,
      maxWind: maxWind,
      coveredWindow: inWindow.length > 0
    };
  }

  // Below about 2°C the air is close enough to saturation that dew forms on
  // the corrector. The Dwarf 3 has no dew heater, so this ends a session
  // rather than degrading it.
  function dewBand(spread) {
    if (spread === null || spread === undefined) return 'unknown';
    if (spread < 2) return 'bad';
    if (spread < 4) return 'warn';
    return 'good';
  }

  // Gusts matter more than sustained wind for a 1.3 kg alt-az scope on a
  // tripod: the average is survivable, the gust is what trails a frame.
  function windBand(gust) {
    if (gust === null || gust === undefined) return 'unknown';
    if (gust >= 40) return 'bad';
    if (gust >= 25) return 'warn';
    return 'good';
  }

  function precipBand(pct) {
    if (pct === null || pct === undefined) return 'unknown';
    if (pct >= 50) return 'bad';
    if (pct >= 20) return 'warn';
    return 'good';
  }

  function cloudBand(pct) {
    if (pct === null || pct === undefined) return 'unknown';
    if (pct <= 20) return 'clear';
    if (pct <= 45) return 'broken';
    if (pct <= 75) return 'poor';
    return 'overcast';
  }

  /**
   * Plain-language call on the night. Cloud gates everything — no amount of
   * favourable moon rescues an overcast sky — and the moon only shades the
   * wording once the sky is worth pointing a telescope at.
   */
  function verdict(ctx) {
    var cloud = ctx.cloudMean;
    var band = cloudBand(cloud);
    var moonWeight = ctx.moon.weight;
    var notes = [];

    var headline, tone;

    if (cloud === null) {
      headline = 'Cloud data unavailable';
      tone = 'unknown';
      notes.push('The weather proxy did not respond, so this is the sky geometry only.');
    } else if (band === 'overcast') {
      headline = 'Clouded out';
      tone = 'bad';
      notes.push('Averaging ' + cloud + '% cloud across the window — not a night for setting up.');
    } else if (band === 'poor') {
      headline = 'Mostly clouded';
      tone = 'bad';
      notes.push(cloud + '% mean cloud. Gaps are possible but you would be chasing them.');
    } else if (band === 'broken') {
      headline = 'Patchy — worth watching';
      tone = 'caution';
      notes.push(cloud + '% mean cloud. Broken skies; usable if the gaps line up with your target.');
    } else if (moonWeight < 0.15) {
      headline = 'Good night for imaging';
      tone = 'good';
      notes.push(cloud + '% mean cloud with the moon out of the way for most of the window.');
    } else if (moonWeight < 0.45) {
      headline = 'Clear, with some moon';
      tone = 'good';
      notes.push(cloud + '% mean cloud, but the moon is up for part of the window.');
    } else {
      headline = 'Clear skies, bright moon';
      tone = 'caution';
      notes.push(cloud + '% mean cloud, though a ' + Math.round(ctx.illum.fraction * 100) +
        '% moon sits above the horizon for most of the dark hours. Narrowband targets will cope; galaxies will not.');
    }

    // Cloud decides whether to go out at all; these three decide whether the
    // night survives once you are out. They are reported even on a clouded-out
    // night, because a 90% gust warning is worth seeing before you carry the
    // tripod outside regardless.
    var ex = ctx.extremes;
    if (ex) {
      if (precipBand(ex.maxPrecip) === 'bad') {
        notes.push('Rain reaches ' + ex.maxPrecip + '% during the window — worth keeping the gear indoors.');
      } else if (precipBand(ex.maxPrecip) === 'warn') {
        notes.push(ex.maxPrecip + '% chance of rain at some point in the window; keep an eye on it.');
      }

      if (dewBand(ex.minSpread) === 'bad') {
        notes.push('Dew point closes to within ' + ex.minSpread + '°C of the air temperature — expect dew on the optics, and there is no heater to fight it.');
      } else if (dewBand(ex.minSpread) === 'warn') {
        notes.push('Dew point gets within ' + ex.minSpread + '°C; dew is possible late on.');
      }

      if (windBand(ex.maxGust) === 'bad') {
        notes.push('Gusts to ' + ex.maxGust + ' km/h. Too much for a light alt-az tripod — expect trailed frames.');
      } else if (windBand(ex.maxGust) === 'warn') {
        notes.push('Gusts to ' + ex.maxGust + ' km/h; some frames will trail, so shoot short and stack more.');
      }
    }

    if (ctx.window.level === null) {
      notes.push('The sun stays above civil twilight all night at this latitude right now — there is no usable darkness at all.');
    } else if (ctx.window.degraded) {
      var back = ctx.nextAstro;
      notes.push('No astronomical darkness tonight: at 56°N the sun does not reach 18° below the horizon in high summer. ' +
        ctx.window.label + ' is as dark as it gets' +
        (back ? ', and true astronomical night returns on ' + fmtDate(back) + '.' : '.'));
    }

    return { headline: headline, tone: tone, notes: notes };
  }

  /* ── Rendering ───────────────────────────────────────────────────────── */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  function statCard(label, value, detail, valueCls) {
    var card = el('div', 'sky-stat');
    card.appendChild(el('div', 'sky-stat-label', label));
    card.appendChild(el('div', 'sky-stat-value' + (valueCls ? ' ' + valueCls : ''), value));
    if (detail) card.appendChild(el('div', 'sky-stat-detail', detail));
    return card;
  }

  function renderDial(container, pct) {
    var R = 100;
    var circumference = 2 * Math.PI * R;
    var known = pct !== null && pct !== undefined;
    // The ring reads as "how much sky you have", so it fills on clear sky
    // rather than on cloud — a full ring means a good night at a glance.
    var clearFrac = known ? (100 - pct) / 100 : 0;
    var tone = known ? 'var(--' + cloudBand(pct) + ')' : 'var(--border)';

    // Twenty-four ticks outside the ring, echoing a lens barrel. Drawn rather
    // than hand-written so the spacing stays exact.
    var ticks = '';
    for (var i = 0; i < 24; i++) {
      var a = (i / 24) * Math.PI * 2;
      var r1 = R + 9, r2 = R + (i % 6 === 0 ? 17 : 13);
      ticks += '<line x1="' + (120 + r1 * Math.cos(a)).toFixed(1) +
        '" y1="' + (120 + r1 * Math.sin(a)).toFixed(1) +
        '" x2="' + (120 + r2 * Math.cos(a)).toFixed(1) +
        '" y2="' + (120 + r2 * Math.sin(a)).toFixed(1) + '"/>';
    }

    var wrap = el('div', 'sky-dial');
    wrap.innerHTML =
      '<svg viewBox="0 0 240 240" role="img" aria-label="' +
      (known ? pct + ' percent cloud cover right now' : 'Cloud cover unavailable') + '">' +
      '<g class="sky-dial-ticks">' + ticks + '</g>' +
      '<circle class="sky-dial-track" cx="120" cy="120" r="' + R + '"></circle>' +
      '<circle class="sky-dial-fill" cx="120" cy="120" r="' + R + '" ' +
      'style="stroke-dasharray:' + circumference.toFixed(1) + ';' +
      '--tone:' + tone + ';' +
      '--dash-from:' + circumference.toFixed(1) + ';' +
      '--dash-to:' + (circumference * (1 - clearFrac)).toFixed(1) + '"></circle>' +
      '</svg>';

    var centre = el('div', 'sky-dial-centre');
    var num = el('div', 'sky-dial-number');
    if (known) {
      num.appendChild(document.createTextNode(String(pct)));
      num.appendChild(el('sup', null, '%'));
    } else {
      num.textContent = '—';
    }
    centre.appendChild(num);
    centre.appendChild(el('div', 'sky-dial-label', 'Cloud cover'));
    wrap.appendChild(centre);
    container.appendChild(wrap);
  }

  function renderBars(container, hourly, window) {
    container.innerHTML = '';
    if (!hourly || !hourly.length) {
      container.appendChild(el('p', 'sky-empty', 'No hourly forecast available.'));
      return;
    }

    var chart = el('div', 'sky-chart');
    // The bars are decorative to a screen reader on their own, so the whole
    // chart carries one readable summary of the same numbers.
    chart.setAttribute('role', 'img');
    chart.setAttribute('aria-label', 'Hourly cloud cover forecast: ' +
      hourly.map(function (h) {
        return fmtTime(new Date(h.time)) + ' ' + h.cloudCoverPercent + '%';
      }).join(', ') + '.');

    var axis = el('div', 'sky-axis-y');
    ['100', '50', '0'].forEach(function (v) { axis.appendChild(el('span', null, v)); });
    chart.appendChild(axis);

    var body = el('div', 'sky-chart-body');
    var plot = el('div', 'sky-plot');
    var xAxis = el('div', 'sky-axis-x');

    hourly.forEach(function (h, i) {
      var t = new Date(h.time);
      var band = cloudBand(h.cloudCoverPercent);
      var inDark = window.start && window.end && t >= window.start && t <= window.end;

      // The night band is drawn as a tint behind the whole column rather than
      // by dimming the daytime bars — on a clear night every bar is a sliver,
      // and dimming half of them made the chart unreadable.
      var col = el('div', 'sky-col' + (inDark ? ' is-night' : ''));
      var bar = el('div', 'sky-bar sky-bar--' + band);
      // A 0% bar still needs to be visible as a bar, hence the floor.
      bar.style.height = 'max(2px, ' + h.cloudCoverPercent + '%)';
      bar.style.animationDelay = (0.04 * i) + 's';
      bar.title = h.cloudCoverPercent + '% cloud at ' + fmtTime(t) +
        (h.precipChancePercent ? ' · ' + h.precipChancePercent + '% chance of rain' : '') +
        (inDark ? ' · during darkness' : '');
      col.appendChild(bar);
      plot.appendChild(col);

      xAxis.appendChild(el('span', 'sky-bar-time' + (inDark ? ' is-night' : ''), fmtHour(t)));
    });

    body.appendChild(plot);
    body.appendChild(xAxis);
    chart.appendChild(body);
    container.appendChild(chart);

    var anyDark = hourly.some(function (h) {
      var t = new Date(h.time);
      return window.start && window.end && t >= window.start && t <= window.end;
    });
    var legend = el('p', 'sky-chart-note',
      anyDark
        ? 'Highlighted bars fall inside tonight\'s ' + window.label.toLowerCase() + ' window.'
        : 'The next twelve hours do not overlap tonight\'s dark window yet — check back closer to dusk.'
    );
    container.appendChild(legend);
  }

  function setState(root, state) {
    root.setAttribute('data-state', state);
  }

  function render(root, data, err) {
    var lat = parseFloat(root.dataset.lat);
    var lng = parseFloat(root.dataset.lon);
    var now = new Date();

    var window_ = observingWindow(now, lat, lng);
    var illum = moonIllumination(now);
    var mTimes = moonNight(window_, lat, lng);
    var moon = moonInterference(window_, illum, lat, lng);
    var nextAstro = window_.degraded ? nextAstronomicalNight(now, lat, lng) : null;

    var hourly = data && data.hourlyCloudCover ? data.hourlyCloudCover : null;
    var cloudStats = windowCloud(hourly, window_);
    var cloudMean = cloudStats ? cloudStats.mean : (data && data.cloudCoverPercent != null ? data.cloudCoverPercent : null);
    var extremes = windowExtremes(hourly, window_);

    var v = verdict({
      cloudMean: cloudMean,
      window: window_,
      moon: moon,
      illum: illum,
      nextAstro: nextAstro,
      extremes: extremes
    });

    // ── Hero
    var dialHost = root.querySelector('[data-slot="dial"]');
    dialHost.innerHTML = '';
    renderDial(dialHost, data ? data.cloudCoverPercent : null);

    var headline = root.querySelector('[data-slot="verdict"]');
    headline.textContent = v.headline;
    headline.className = 'sky-verdict sky-tone--' + v.tone;

    var sub = root.querySelector('[data-slot="verdict-sub"]');
    sub.innerHTML = '';
    v.notes.forEach(function (n) { sub.appendChild(el('p', null, n)); });

    // ── Stats
    var stats = root.querySelector('[data-slot="stats"]');
    stats.innerHTML = '';

    var darkLabel = window_.degraded ? window_.label + ' begins' : 'Astronomical dark begins';
    var darkLabelEnd = window_.degraded ? window_.label + ' ends' : 'Astronomical dark ends';

    stats.appendChild(statCard(
      darkLabel,
      fmtTime(window_.start),
      window_.degraded ? 'Deepest darkness available' : 'True dark begins'
    ));
    stats.appendChild(statCard(
      darkLabelEnd,
      fmtTime(window_.end),
      window_.durationMs ? fmtDuration(window_.durationMs) + ' window' : 'No dark window'
    ));
    stats.appendChild(statCard(
      'Moon phase',
      (data && WK_PHASE[data.moonPhase]) || phaseName(illum),
      Math.round(illum.fraction * 100) + '% illuminated',
      'is-moon'
    ));
    stats.appendChild(statCard(
      'Moonrise',
      mTimes.neverUp ? 'Down all night' :
        (mTimes.upAtStart ? 'Up at dusk' : fmtTime(mTimes.rise)),
      mTimes.neverUp ? 'Never above the horizon while dark' :
        moon.upFraction > 0.9 ? 'Above the horizon all window' :
          moon.upFraction > 0.4 ? 'Up for much of the window' :
            moon.upFraction > 0.05 ? 'Up briefly' : 'Barely up',
      mTimes.neverUp ? 'is-good' : null
    ));
    // A moon that sets during the session is a time you can plan around; one
    // that sets tomorrow afternoon is not, and printing that bare time reads
    // as though it happens tonight.
    var setsInWindow = mTimes.set && window_.end && mTimes.set < window_.end;
    stats.appendChild(statCard(
      'Moonset',
      mTimes.neverUp ? '—' : (setsInWindow ? fmtTime(mTimes.set) : 'Up past dawn'),
      mTimes.neverUp ? 'No moon to work around' :
        setsInWindow ? 'Dark sky after this' :
          mTimes.set
            ? 'Sets ' + fmtTime(mTimes.set) +
              (sameLocalDay(mTimes.set, window_.end) ? '' : ' tomorrow')
            : 'No set before dawn'
    ));
    stats.appendChild(statCard(
      'Visibility',
      data && data.visibilityKm != null ? data.visibilityKm + ' km' : '—',
      data && data.visibilityKm != null
        ? (data.visibilityKm >= 15 ? 'Clear horizon' : data.visibilityKm >= 8 ? 'Slight haze' : 'Murky')
        : 'Unavailable'
    ));

    // The three that decide whether a clear night actually survives.
    var toneClass = { good: 'is-good', warn: 'is-warn', bad: 'is-bad', unknown: null };

    var spread = extremes && extremes.minSpread != null ? extremes.minSpread : null;
    var dew = dewBand(spread);
    stats.appendChild(statCard(
      'Dew point spread',
      spread != null ? spread + '°C' : '—',
      dew === 'bad' ? 'Dew likely on the optics' :
        dew === 'warn' ? 'Dew possible late on' :
          dew === 'good' ? 'Optics should stay clear' : 'Unavailable',
      toneClass[dew]
    ));

    var gust = extremes && extremes.maxGust != null ? extremes.maxGust
             : (data && data.windGustKph != null ? data.windGustKph : null);
    var wind = extremes && extremes.maxWind != null ? extremes.maxWind
             : (data && data.windSpeedKph != null ? data.windSpeedKph : null);
    var wb = windBand(gust);
    stats.appendChild(statCard(
      'Wind',
      wind != null ? wind + ' km/h' : '—',
      gust != null
        ? 'Gusting ' + gust + ' — ' + (wb === 'bad' ? 'too much for the tripod' :
            wb === 'warn' ? 'some frames will trail' : 'steady enough')
        : 'Unavailable',
      toneClass[wb]
    ));

    var precip = extremes && extremes.maxPrecip != null ? extremes.maxPrecip : null;
    var pb = precipBand(precip);
    stats.appendChild(statCard(
      'Rain chance',
      precip != null ? precip + '%' : '—',
      pb === 'bad' ? 'Keep the gear indoors' :
        pb === 'warn' ? 'Possible — worth watching' :
          pb === 'good' ? 'Dry through the window' : 'Unavailable',
      toneClass[pb]
    ));

    // ── Chart
    renderBars(root.querySelector('[data-slot="chart"]'), hourly, window_);

    // ── Footer
    var updated = root.querySelector('[data-slot="updated"]');
    updated.textContent = err
      ? 'Sky geometry computed locally · cloud data unavailable'
      : 'Updated ' + fmtTime(now);

    setState(root, err ? 'partial' : 'ready');
  }

  /* ── Boot ────────────────────────────────────────────────────────────── */

  // CORS on the proxy is locked to https://chryse.co.uk, so a `jekyll serve`
  // preview can never reach the production endpoint. Falling back to a local
  // proxy automatically means the page works under `jekyll serve` without
  // anyone having to remember to edit the markup and un-edit it before
  // committing.
  function endpointFor(root) {
    var host = location.hostname;
    var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
    return (isLocal && root.dataset.endpointDev) || root.dataset.endpoint;
  }

  function load(root) {
    var endpoint = endpointFor(root);
    var lat = root.dataset.lat;
    var lon = root.dataset.lon;

    setState(root, 'loading');

    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    // Without this the card can sit on the loading skeleton indefinitely if
    // the VPS accepts the connection but never answers.
    var timer = setTimeout(function () { if (controller) controller.abort(); }, 8000);

    fetch(endpoint + '?lat=' + lat + '&lon=' + lon, {
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        if (!res.ok) throw new Error('proxy returned ' + res.status);
        return res.json();
      })
      .then(function (data) {
        clearTimeout(timer);
        render(root, data, null);
      })
      .catch(function (e) {
        clearTimeout(timer);
        // The astronomy needs no network, so a dead proxy degrades to a
        // still-useful card rather than an error page.
        try {
          render(root, null, e);
        } catch (renderErr) {
            setState(root, 'error');
            var msg = root.querySelector('[data-slot="error-detail"]');
            if (msg) msg.textContent = renderErr.message;
        }
      });
  }

  function init() {
    var roots = document.querySelectorAll('[data-sky-conditions]');
    Array.prototype.forEach.call(roots, function (root) {
      load(root);

      var retry = root.querySelector('[data-action="retry"]');
      if (retry) retry.addEventListener('click', function () { load(root); });

      // Cloud forecasts move on an hourly cadence; anything faster just burns
      // WeatherKit quota for no new information.
      setInterval(function () { load(root); }, 30 * 60 * 1000);
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  // Exposed so the astronomy can be exercised from Node without a browser.
  var api = {
    sunEvent: sunEvent,
    sunPosition: sunPosition,
    moonPosition: moonPosition,
    moonTimes: moonTimes,
    moonEvents: moonEvents,
    moonNight: moonNight,
    moonIllumination: moonIllumination,
    observingWindow: observingWindow,
    nextAstronomicalNight: nextAstronomicalNight,
    phaseName: phaseName,
    verdict: verdict,
    cloudBand: cloudBand,
    windowCloud: windowCloud,
    moonInterference: moonInterference,
    fmtTime: fmtTime,
    fmtDuration: fmtDuration
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SkyConditions = api;

})(typeof self !== 'undefined' ? self : this);
