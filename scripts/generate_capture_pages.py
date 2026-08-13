#!/usr/bin/env python3
"""
generate_capture_pages.py — regenerate the per-photo Jekyll pages in _captures/
from the CAPTURES array in index.html, so every capture gets its own crawlable
page at /photos/<slug>/ without anything being written twice.

The CAPTURES array in index.html is the single source of truth for captures
(see update_noscript.py, which uses the same line-based parse). Each entry
becomes one markdown file in _captures/; Jekyll publishes the collection at
/photos/<slug>/ where <slug> mirrors the gallery's own slugify() so the
?photo= deep links and the static pages always agree.

Run from the repo root:
    python3 scripts/generate_capture_pages.py

It runs automatically in the convert-webp GitHub Action, so pushing a new
image keeps the pages in sync without any manual step.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX_HTML = ROOT / "index.html"
CAPTURES_DIR = ROOT / "_captures"

FIELD_RE = re.compile(r"""^\s{4}(img|tag|title|meta|desc):\s+(['"])(.*)\2,\s*$""")
DEPTH_LY_RE = re.compile(r"\bly:\s*([\d.]+)")

MONTHS = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12,
}
DATE_RE = re.compile(r"^(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})$")


def slugify(title):
    """Mirror the gallery's JS slugify() so /photos/<slug>/ and ?photo=<slug> agree."""
    slug = title.lower()
    slug = re.sub(r"['‘’]", "", slug)
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")


def parse_captures(text):
    """Parse the CAPTURES array with a line-based reader (see update_noscript.py).

    Entry fields sit at 4-space indent, one per line, quoted with ' or ".
    An entry ends at a line whose content is exactly '},'. The depth: [...]
    line never matches FIELD_RE; its ly: values are collected separately.
    """
    start = text.index("const CAPTURES = [")
    end = text.index("];", start)
    captures, entry = [], {}
    for line in text[start:end].splitlines():
        m = FIELD_RE.match(line)
        if m:
            entry[m.group(1)] = m.group(3)
        elif line.lstrip().startswith("depth:"):
            entry["ly"] = DEPTH_LY_RE.findall(line)
        elif line.strip() == "},":
            if "title" in entry:
                captures.append(entry)
            entry = {}
    return captures


def parse_meta(meta):
    """Split 'IC 1318 · 18 Jul 2026 · Edinburgh · 1h 17m' into named parts.

    The catalogue always comes first; the remaining parts are recognised by
    shape (date, then location, then integration) so entries that omit the
    integration time still parse.
    """
    parts = [p.strip() for p in meta.split("·")]
    # A lone part that isn't a date is a location ("Edinburgh"), not a
    # catalogue — the comet entries have no catalogue ID.
    if len(parts) == 1 and parts and not DATE_RE.match(parts[0]):
        return {"location": parts[0]}
    out = {"catalogue": parts[0] if parts else ""}
    rest = parts[1:]
    for part in rest:
        m = DATE_RE.match(part)
        if m and "date" not in out:
            day, mon, year = int(m.group(1)), MONTHS.get(m.group(2).lower()), int(m.group(3))
            if mon:
                out["date"] = f"{year:04d}-{mon:02d}-{day:02d}"
                out["display_date"] = part
                continue
        if "location" not in out and not re.search(r"\d", part):
            out["location"] = part
        elif "integration" not in out:
            out["integration"] = part
    return out


def format_distance(ly_values):
    """One depth target → '4,900 light-years'; multiple or none → no distance."""
    if len(ly_values) != 1:
        return ""
    ly = float(ly_values[0])
    if ly < 1:
        return ""
    return f"{ly:,.0f} light-years"


def backfill_dates(metas):
    """Give date-less entries (the comets) a sort date from a neighbour.

    CAPTURES is curated latest-first, so borrowing the date of the nearest
    dated entry below (older) — or above as a fallback — keeps the /photos/
    ordering consistent with the gallery. display_date stays unset, so the
    borrowed date is never shown on the page.
    """
    dates = [m.get("date") for m in metas]
    for i, meta in enumerate(metas):
        if meta.get("date"):
            continue
        borrowed = next((d for d in dates[i + 1:] if d), None) or \
                   next((d for d in reversed(dates[:i]) if d), None)
        if borrowed:
            meta["date"] = borrowed


KIND = {"nebula": "a nebula", "galaxy": "a galaxy", "cluster": "a star cluster"}
KIND_PLURAL = {"nebula": "nebulae", "galaxy": "galaxies", "cluster": "star clusters"}
# tag is a single gallery-filter category, so a frame holding several objects is
# still tagged "galaxy" — which would describe Markarian's Chain as "a galaxy".
# These five titles say plainly that they hold more than one, so the description
# follows the title rather than the tag. Matches: Leo Triplet, Markarian's Chain,
# Cigar Galaxy & Bode's Galaxy, Heart & Soul Nebula, Veil Nebula Complex.
PLURAL_TITLE = re.compile(r"\s&\s|\bComplex\b|\bChain\b|\bTriplet\b|\bPair\b|\bGroup\b", re.I)
SCOPE = "a Dwarf 3 smart telescope"
DESC_LIMIT = 155


def build_description(capture, meta, distance, limit=DESC_LIMIT):
    """A complete, self-contained meta description for one capture.

    Built from the metadata rather than the prose because the prose opens with
    sentences of 150-270 characters — the layout used to truncate the first one
    at 155, which is how every photo page ended up advertising itself mid-clause
    ("...sitting almost directly along the line of sight to the..."). Assembling
    the sentence here means it always ends where it should.

    The catalogue IDs go in early on purpose: "M17", "NGC 6618" and "Sh2-45" are
    what people actually type into a search box, and they differ on every page,
    so nothing here is boilerplate even though the shape repeats.

    Clauses are optional in reverse order of value — the capture date is dropped
    first when the sentence would run long, then the distance, then the
    integration time. Some entries have none of them: the comets carry no
    catalogue, and the Sun and Moon have neither a distance nor a useful object
    type.
    """
    title = capture["title"]
    catalogue = meta.get("catalogue", "")
    location = meta.get("location") or "Edinburgh"
    integration = meta.get("integration", "")
    # display_date, not date: backfill_dates() borrows a neighbour's date for
    # the comets purely to sort them, and that borrowed value must not be shown.
    display_date = meta.get("display_date", "")
    tag = capture.get("tag", "")
    plural = bool(PLURAL_TITLE.search(title))
    kind = (KIND_PLURAL if plural else KIND).get(tag, "")

    head = f"{title} ({catalogue})" if catalogue else title

    def compose(with_distance, with_date):
        where = f"from {location}"
        if display_date and with_date:
            where += f" on {display_date}"
        shown_distance = distance if with_distance else ""

        # With a distance to state, the object gets a sentence of its own and
        # the capture details follow. Without one, "— a galaxy." would be a
        # terse fragment, so the type folds into the capture sentence instead
        # and the integration time trails it. Roughly half the gallery has no
        # single distance: the wide fields and pairs carry several depth
        # targets, and the Sun and Moon carry none.
        if kind and shown_distance:
            return (f"{head} — {kind} {shown_distance} from Earth. "
                    f"{f'{integration} of integration' if integration else 'Photographed'} "
                    f"{where} with {SCOPE}.")
        if kind:
            tail = f" {integration} of integration." if integration else ""
            return f"{head} — {kind} imaged {where} with {SCOPE}.{tail}"
        first = f"{head} — {shown_distance} from Earth." if shown_distance else f"{head}."
        lead = f"{integration} of integration" if integration else "Photographed"
        return f"{first} {lead} {where} with {SCOPE}."

    for with_distance, with_date in ((True, True), (True, False), (False, True)):
        candidate = compose(with_distance, with_date)
        if len(candidate) <= limit:
            return candidate
    return compose(False, False)


def build_page(capture, meta):
    slug = slugify(capture["title"])
    distance = format_distance(capture.get("ly", []))
    front = {
        "layout": "capture",
        "title": capture["title"],
        "description": build_description(capture, meta, distance),
        "catalogue": meta.get("catalogue", ""),
        "date": meta.get("date", ""),
        "display_date": meta.get("display_date", ""),
        "location": meta.get("location", ""),
        "integration": meta.get("integration", ""),
        "tag": capture.get("tag", ""),
        "image": "/" + capture.get("img", ""),
        "thumb": "/" + capture.get("img", "").replace("images/", "images/thumbs/", 1),
        "distance": distance,
        "gallery_link": f"/?photo={slug}",
    }
    lines = ["---", "# Generated by scripts/generate_capture_pages.py from the"]
    lines.append("# CAPTURES array in index.html — do not edit by hand.")
    for key, value in front.items():
        if value:
            # json.dumps produces a valid double-quoted YAML scalar
            lines.append(f"{key}: {json.dumps(value, ensure_ascii=False)}")
    lines.append("---")
    lines.append("")
    lines.append(capture.get("desc", ""))
    lines.append("")
    return slug, "\n".join(lines)


def main():
    text = INDEX_HTML.read_text(encoding="utf-8")

    captures = parse_captures(text)
    if len(captures) < 10:  # sanity guard against a bad parse wiping the pages
        sys.exit(f"Parsed only {len(captures)} captures — refusing to regenerate _captures/.")

    metas = [parse_meta(c.get("meta", "")) for c in captures]
    backfill_dates(metas)

    pages = {}
    for capture, meta in zip(captures, metas):
        slug, content = build_page(capture, meta)
        if slug in pages:
            sys.exit(f"Duplicate slug '{slug}' — give the two captures distinct titles.")
        pages[slug] = content

    CAPTURES_DIR.mkdir(exist_ok=True)
    written = unchanged = 0
    for slug, content in pages.items():
        path = CAPTURES_DIR / f"{slug}.md"
        if path.exists() and path.read_text(encoding="utf-8") == content:
            unchanged += 1
            continue
        path.write_text(content, encoding="utf-8")
        written += 1

    removed = 0
    for path in CAPTURES_DIR.glob("*.md"):
        if path.stem not in pages:
            path.unlink()
            removed += 1

    print(f"_captures/: {written} written, {unchanged} unchanged, {removed} removed "
          f"({len(pages)} captures total).")


if __name__ == "__main__":
    main()
