#!/usr/bin/env python3
"""
update_noscript.py — regenerate the two blocks in index.html that are derived
from the CAPTURES array, so neither can drift away from the gallery.

The CAPTURES array in index.html is the single source of truth for captures.
This script parses it (the fields are one per line, consistently formatted)
and rewrites:

  * the <noscript> SEO gallery list, between the NOSCRIPT-LIST markers
  * the ItemList JSON-LD in the head, between the ITEMLIST markers

Run from the repo root:
    python3 scripts/update_noscript.py

It runs automatically in the convert-webp GitHub Action, so pushing a new
image keeps both blocks in sync without any manual step.
"""

import html as htmllib
import json
import re
import sys
from pathlib import Path

INDEX_HTML = Path(__file__).resolve().parent.parent / "index.html"
SITE_URL = "https://chryse.co.uk"

START = "<!-- NOSCRIPT-LIST:START"
END = "<!-- NOSCRIPT-LIST:END -->"
ITEMLIST_START = "<!-- ITEMLIST:START"
ITEMLIST_END = "<!-- ITEMLIST:END -->"

# First sentence of a description, for the noscript summary. Won't split on the
# abbreviations that actually occur in this prose ("C/2025 R2", "Sh2-45",
# "M17"), because it requires the full stop to be followed by whitespace and a
# capital — but a trailing decimal like "20.9 million" is safe either way since
# it isn't followed by a capital.
FIRST_SENTENCE_RE = re.compile(r"^(.+?[.!?])(?=\s+[A-Z(])")

FIELD_RE = re.compile(r"""^\s{4}(img|tag|title|meta|desc):\s+(['"])(.*)\2,\s*$""")


def slugify(title):
    """Mirror the gallery's JS slugify() — see generate_capture_pages.py."""
    slug = title.lower()
    slug = re.sub(r"['‘’]", "", slug)
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")


def parse_captures(text):
    """Parse the CAPTURES array with a line-based reader.

    Entry fields sit at 4-space indent, one per line, quoted with ' or ".
    An entry ends at a line whose content is exactly '},'. Lines inside a
    depth: [...] block are indented deeper and never match FIELD_RE.
    """
    start = text.index("const CAPTURES = [")
    end = text.index("];", start)
    captures, entry = [], {}
    for line in text[start:end].splitlines():
        m = FIELD_RE.match(line)
        if m:
            entry[m.group(1)] = m.group(3)
        elif line.strip() == "},":
            if "title" in entry:
                captures.append(entry)
            entry = {}
    return captures


def first_sentence(desc):
    """Opening sentence of a description, for the noscript summary.

    The block used to carry each capture's whole description — the same text
    that is the entire body of that capture's page at /photos/<slug>/. That put
    a full copy of all 59 page bodies on the home page and left the canonical
    home of each description ambiguous. One sentence still tells a non-JS
    crawler what the capture is, and the link beside it goes to the real page.
    """
    m = FIRST_SENTENCE_RE.match(desc.strip())
    return m.group(1) if m else desc.strip()


def build_itemlist(captures):
    """ItemList JSON-LD naming every capture page, in gallery order.

    The gallery grid is rendered from CAPTURES by JavaScript, so without this
    the home page's only machine-readable statement about what it contains is
    the CollectionPage entry, which describes the collection but never names a
    member. This will not produce a carousel — Google's ItemList rich results
    are limited to a handful of content types — but it does let the page say
    what it holds and in what order, and it links back to the CollectionPage in
    the hand-written @graph above via mainEntity.
    """
    data = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": f"{SITE_URL}/#gallery-items",
        "name": "Among Stars — every capture",
        "numberOfItems": len(captures),
        "itemListOrder": "https://schema.org/ItemListOrderDescending",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": i,
                "url": f"{SITE_URL}/photos/{slugify(c['title'])}/",
                "name": c["title"],
            }
            for i, c in enumerate(captures, 1)
        ],
    }
    body = json.dumps(data, ensure_ascii=False, indent=2)
    return f'<script type="application/ld+json">\n{body}\n</script>\n'


def build_list(captures):
    items = []
    for c in captures:
        title = c["title"]
        meta = c.get("meta", "")
        desc = first_sentence(c.get("desc", ""))
        # Append the catalogue ID from the meta ("Bubble Nebula (C11)") when
        # the meta has one and the title doesn't already mention it.
        catalogue = meta.split("·")[0].strip() if "·" in meta else ""
        heading = title
        if catalogue and catalogue.lower() not in title.lower():
            heading = f"{title} ({catalogue})"
        h3 = htmllib.escape(heading, quote=False)
        p_meta = htmllib.escape(meta, quote=False)
        p_desc = htmllib.escape(desc, quote=False)
        url = f"/photos/{slugify(title)}/"
        items.append(f'    <li><h3><a href="{url}">{h3}</a></h3><p>{p_meta}</p><p>{p_desc}</p></li>')
    return (
        '  <ul style="list-style:none;padding:0;">\n'
        + "\n".join(items)
        + "\n  </ul>\n"
    )


def main():
    text = INDEX_HTML.read_text(encoding="utf-8")

    captures = parse_captures(text)
    if len(captures) < 10:  # sanity guard against a bad parse wiping the block
        sys.exit(f"Parsed only {len(captures)} captures — refusing to rewrite noscript list.")

    def replace_between(src, start, end, body, indent=""):
        try:
            head, rest = src.split(start, 1)
            marker_line, rest = rest.split("\n", 1)
            _, tail = rest.split(end, 1)
        except ValueError:
            sys.exit(f"{start.strip('<!- ')} markers not found in index.html.")
        return head + start + marker_line + "\n" + body + indent + end + tail

    updated = replace_between(text, START, END, build_list(captures), indent="  ")
    updated = replace_between(updated, ITEMLIST_START, ITEMLIST_END,
                              build_itemlist(captures))

    if updated == text:
        print(f"noscript list and ItemList already in sync ({len(captures)} captures).")
        return

    INDEX_HTML.write_text(updated, encoding="utf-8")
    print(f"noscript list and ItemList regenerated with {len(captures)} captures.")


if __name__ == "__main__":
    main()
