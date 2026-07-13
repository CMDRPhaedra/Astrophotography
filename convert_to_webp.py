#!/usr/bin/env python3
"""
convert_to_webp.py — Among Stars image optimiser
------------------------------------------------
Converts all images in images/ to WebP, generates gallery thumbnails in
images/thumbs/, and updates references in index.html and _posts/*.md.

Usage:
    python convert_to_webp.py              # convert, update references, keep originals
    python convert_to_webp.py --delete     # also remove original files after conversion
    python convert_to_webp.py --dry-run    # show what would happen without doing anything
    python convert_to_webp.py --quality 90 # set WebP quality (default: 85)

Requirements:
    pip install Pillow
"""

import argparse
import re
import sys
from pathlib import Path

IMAGES_DIR   = Path("images")
THUMBS_DIR   = IMAGES_DIR / "thumbs"
INDEX_HTML   = Path("index.html")
POSTS_DIR    = Path("_posts")
# Extensions to convert (WebP files are skipped automatically)
CONVERT_EXTS = {".jpg", ".jpeg", ".png", ".gif", ".tiff", ".bmp"}
DEFAULT_QUALITY = 85
THUMB_WIDTH   = 640   # gallery cards render at ~320-450 px wide; 640 covers 2x displays
THUMB_QUALITY = 80


def parse_args():
    p = argparse.ArgumentParser(description="Convert images/ to WebP and update index.html")
    p.add_argument("--delete",  action="store_true", help="Delete original files after conversion")
    p.add_argument("--dry-run", action="store_true", help="Show what would happen without making changes")
    p.add_argument("--quality", type=int, default=DEFAULT_QUALITY,
                   help=f"WebP quality 1-100 (default: {DEFAULT_QUALITY})")
    return p.parse_args()


def check_pillow():
    try:
        from PIL import Image  # noqa: F401
    except ImportError:
        print("Error: Pillow is not installed.")
        print("       Run:  pip install Pillow")
        sys.exit(1)


def convert_images(args):
    from PIL import Image

    if not IMAGES_DIR.exists():
        print(f"Error: '{IMAGES_DIR}' directory not found. Run this script from your repo root.")
        sys.exit(1)

    candidates = [
        f for f in sorted(IMAGES_DIR.iterdir())
        if f.suffix.lower() in CONVERT_EXTS
    ]

    if not candidates:
        print("No images to convert — everything is already WebP or the folder is empty.")
        return {}

    print(f"Found {len(candidates)} image(s) to convert  (quality={args.quality})\n")

    renames = {}   # old_name → new_name  (just the filename, not full path)

    for src in candidates:
        dst = src.with_suffix(".webp")

        size_before = src.stat().st_size
        label_before = f"{size_before / 1024:.1f} KB"

        if dst.exists():
            # WebP already exists — still record the rename so HTML gets updated
            renames[src.name] = dst.name
            size_after = dst.stat().st_size
            label_after = f"{size_after / 1024:.1f} KB"
            saving = (1 - size_after / size_before) * 100
            print(f"  [exists]  {src.name} → {dst.name}  ({label_before} → {label_after}, {saving:+.0f}%)")
            continue

        if args.dry_run:
            print(f"  [dry-run] Would convert: {src.name} → {dst.name}  ({label_before})")
            renames[src.name] = dst.name
            continue

        try:
            with Image.open(src) as img:
                if getattr(img, "is_animated", False):
                    # Keep every frame — WebP supports animation natively
                    img.save(dst, "WEBP", save_all=True, quality=args.quality, method=6)
                else:
                    # Preserve transparency for PNG; otherwise convert to RGB
                    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                        img = img.convert("RGBA")
                    else:
                        img = img.convert("RGB")
                    img.save(dst, "WEBP", quality=args.quality, method=6)

            size_after = dst.stat().st_size
            label_after = f"{size_after / 1024:.1f} KB"
            saving = (1 - size_after / size_before) * 100
            print(f"  [ok]      {src.name} → {dst.name}  ({label_before} → {label_after}, {saving:+.0f}%)")
            renames[src.name] = dst.name

        except Exception as e:
            print(f"  [error]   {src.name}: {e}")

    return renames


def update_references(renames, dry_run):
    """Rewrite image references in index.html and _posts/*.md.

    Filenames are matched with boundary guards so a rename of m31.jpg can
    never corrupt a reference to new_m31.jpg or m31.jpg2.
    """
    if not renames:
        return

    targets = [INDEX_HTML] + sorted(POSTS_DIR.glob("*.md")) if POSTS_DIR.exists() else [INDEX_HTML]

    for target in targets:
        if not target.exists():
            print(f"\nWarning: '{target}' not found — skipping.")
            continue

        text = target.read_text(encoding="utf-8")
        updated = text
        changed = 0

        for old_name, new_name in renames.items():
            # No filename character directly before/after the match ('/' before is fine)
            pattern = re.compile(
                r"(?<![A-Za-z0-9_\-])" + re.escape(old_name) + r"(?![A-Za-z0-9_\-])",
                re.IGNORECASE,
            )
            count = len(pattern.findall(updated))
            if count:
                updated = pattern.sub(new_name, updated)
                changed += count

        if changed == 0:
            continue

        if dry_run:
            print(f"[dry-run] Would update {changed} reference(s) in {target}")
            continue

        target.write_text(updated, encoding="utf-8")
        print(f"{target}: updated {changed} reference(s)")


def generate_thumbnails(dry_run):
    """Create/refresh images/thumbs/<name>.webp for every full-size WebP.

    The gallery grid loads these instead of the multi-MB originals; the
    lightbox still uses the full-resolution file.
    """
    from PIL import Image

    made = 0
    for src in sorted(IMAGES_DIR.glob("*.webp")):
        dst = THUMBS_DIR / src.name
        if dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
            continue
        if dry_run:
            print(f"  [dry-run] Would create thumbnail: {dst}")
            made += 1
            continue
        THUMBS_DIR.mkdir(exist_ok=True)
        with Image.open(src) as img:
            if img.width > THUMB_WIDTH:
                img = img.resize(
                    (THUMB_WIDTH, round(img.height * THUMB_WIDTH / img.width)),
                    Image.LANCZOS,
                )
            img.save(dst, "WEBP", quality=THUMB_QUALITY, method=6)
        print(f"  [thumb]   {dst}  ({dst.stat().st_size / 1024:.1f} KB)")
        made += 1
    if made:
        print(f"\nGenerated {made} thumbnail(s).")


def delete_originals(renames, dry_run):
    deleted = 0
    for old_name in renames:
        src = IMAGES_DIR / old_name
        if not src.exists():
            continue
        if dry_run:
            print(f"  [dry-run] Would delete: {src}")
        else:
            src.unlink()
            print(f"  [deleted] {src}")
        deleted += 1
    if deleted:
        print(f"\nRemoved {deleted} original file(s).")


def main():
    args = parse_args()
    check_pillow()

    if args.dry_run:
        print("=== DRY RUN — no files will be changed ===\n")

    renames = convert_images(args)

    print()
    update_references(renames, args.dry_run)

    print()
    generate_thumbnails(args.dry_run)

    if args.delete and renames:
        print()
        delete_originals(renames, args.dry_run)

    print("\nDone.")
    if not args.dry_run and renames:
        print("Next step:  git add images/ index.html _posts && git commit -m 'Convert images to WebP'")


if __name__ == "__main__":
    main()
