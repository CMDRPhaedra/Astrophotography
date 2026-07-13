#!/usr/bin/env python3
"""
update_noscript.py — regenerate the <noscript> SEO gallery list in index.html
from the CAPTURES array, so the two can never drift apart.

The CAPTURES array in index.html is the single source of truth for captures.
This script parses it (the fields are one per line, consistently formatted)
and rewrites everything between the NOSCRIPT-LIST:START / :END markers.

Run from the repo root:
    python3 scripts/update_noscript.py

It runs automatically in the convert-webp GitHub Action, so pushing a new
image keeps the noscript block in sync without any manual step.
"""

import html as htmllib
import re
import sys
from pathlib import Path

INDEX_HTML = Path(__file__).resolve().parent.parent / "index.html"

START = "<!-- NOSCRIPT-LIST:START"
END = "<!-- NOSCRIPT-LIST:END -->"

FIELD_RE = re.compile(r"""^\s{4}(img|tag|title|meta|desc):\s+(['"])(.*)\2,\s*$""")


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


def build_list(captures):
    items = []
    for c in captures:
        title = c["title"]
        meta = c.get("meta", "")
        desc = c.get("desc", "")
        # Append the catalogue ID from the meta ("Bubble Nebula (C11)") when
        # the meta has one and the title doesn't already mention it.
        catalogue = meta.split("·")[0].strip() if "·" in meta else ""
        heading = title
        if catalogue and catalogue.lower() not in title.lower():
            heading = f"{title} ({catalogue})"
        h3 = htmllib.escape(heading, quote=False)
        p_meta = htmllib.escape(meta, quote=False)
        p_desc = htmllib.escape(desc, quote=False)
        items.append(f"    <li><h3>{h3}</h3><p>{p_meta}</p><p>{p_desc}</p></li>")
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

    try:
        head, rest = text.split(START, 1)
        marker_line, rest = rest.split("\n", 1)
        _, tail = rest.split(END, 1)
    except ValueError:
        sys.exit("NOSCRIPT-LIST markers not found in index.html.")

    updated = head + START + marker_line + "\n" + build_list(captures) + "  " + END + tail
    if updated == text:
        print(f"noscript list already in sync ({len(captures)} captures).")
        return

    INDEX_HTML.write_text(updated, encoding="utf-8")
    print(f"noscript list regenerated with {len(captures)} captures.")


if __name__ == "__main__":
    main()
