#!/usr/bin/env python3
"""Build lossless Gifts & Product Roundups category hero from TODAY Bobbie's Buzz art."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path.home() / ".cursor/projects/Users-tombro-happy-store-bridge-1/assets"
OUT = ROOT / "public" / "press"

DEFAULT_SRC = ASSETS / "ChatGPT_Image_Jun_2__2026__10_47_09_PM-92b20678-aec0-42e5-b65f-38d229fd6632.png"


def build(src: Path) -> None:
    img = Image.open(src).convert("RGB")
    w, h = img.size
    one = img.resize((w * 2, h * 2), Image.Resampling.LANCZOS)
    two = img.resize((w * 4, h * 4), Image.Resampling.LANCZOS)

    one_path = OUT / "category-hero-gifts-roundups.png"
    two_path = OUT / "category-hero-gifts-roundups@2x.png"
    card_path = OUT / "category-gifts-roundups.png"

    one.save(one_path, format="PNG", optimize=False)
    two.save(two_path, format="PNG", optimize=False)

    crop_w = h
    left = (w - crop_w) // 2
    card = img.crop((left, 0, left + crop_w, h)).resize((800, 800), Image.Resampling.LANCZOS)
    card.save(card_path, format="PNG", optimize=False)

    print(f"hero 1x: {one.size} -> {one_path.name}")
    print(f"hero 2x: {two.size} -> {two_path.name}")
    print(f"card: {card.size} -> {card_path.name}")


def main() -> int:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC
    if not src.is_file():
        print(f"Missing source: {src}", file=sys.stderr)
        return 1
    build(src)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
