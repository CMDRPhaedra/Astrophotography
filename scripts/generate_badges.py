#!/usr/bin/env python3
"""Generate shields.io endpoint-badge JSON from the CAPTURES array in index.html.

Writes badges/images-count.json and badges/integration-time.json, each in the
shields.io "endpoint" schema (https://shields.io/badges/endpoint-badge), so the
README badges stay in sync with the gallery automatically.
"""
import json
import re
from pathlib import Path

INDEX_PATH = Path("index.html")
BADGES_DIR = Path("badges")

META_RE = re.compile(r"meta:\s*'([^']*)'")
TIME_RE = re.compile(r"^(?:(\d+)h)?\s*(?:(\d+)m)?$")


def parse_minutes(meta: str) -> int:
    parts = [p.strip() for p in meta.split("\xb7")]  # '·'
    if len(parts) < 4:
        return 0
    match = TIME_RE.match(parts[-1])
    if not match:
        return 0
    hours, minutes = match.groups()
    return int(hours or 0) * 60 + int(minutes or 0)


def format_duration(total_minutes: int) -> str:
    hours, minutes = divmod(total_minutes, 60)
    if hours and minutes:
        return f"{hours}h {minutes}m"
    if hours:
        return f"{hours}h"
    return f"{minutes}m"


def write_endpoint(path: Path, label: str, message: str, color: str) -> None:
    path.write_text(
        json.dumps({"schemaVersion": 1, "label": label, "message": message, "color": color}, indent=2)
        + "\n"
    )


def main() -> None:
    text = INDEX_PATH.read_text()
    metas = META_RE.findall(text)

    image_count = len(metas)
    total_minutes = sum(parse_minutes(m) for m in metas)

    BADGES_DIR.mkdir(exist_ok=True)
    write_endpoint(BADGES_DIR / "images-count.json", "images", str(image_count), "blue")
    write_endpoint(BADGES_DIR / "integration-time.json", "integration time", format_duration(total_minutes), "9c27b0")

    print(f"images: {image_count}, integration time: {format_duration(total_minutes)}")


if __name__ == "__main__":
    main()
