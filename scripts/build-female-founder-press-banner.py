#!/usr/bin/env python3
"""Expand Female Founder press banner with white margins and teal circle accents."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = (
    Path.home()
    / ".cursor/projects/Users-tombro-happy-store-bridge-1/assets"
    / "ChatGPT_Image_Jun_2__2026__01_29_35_PM-a1665988-71dc-42d4-869d-834f05978f66.png"
)
OUT_DIR = ROOT / "public" / "press"
BG = (254, 254, 254)
TARGET_W = 2048
TARGET_H = 768

# Decorative circle crops from source art (x0, y0, x1, y1)
TOP_CIRCLE_BOX = (248, 0, 418, 118)
BOTTOM_CIRCLE_BOX = (8, 628, 188, 768)


def extract_sprite(img: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    crop = img.crop(box).convert("RGBA")
    data = np.array(crop)
    rgb = data[:, :, :3].astype(np.int16)
    # Treat near-white as transparent so circles paste cleanly on margins.
    near_white = np.all(rgb >= 246, axis=2)
    dark = np.all(rgb < 40, axis=2)
    alpha = data[:, :, 3].astype(np.int16)
    alpha[near_white] = 0
    alpha[dark] = np.minimum(alpha[dark], 180)
    data[:, :, 3] = np.clip(alpha, 0, 255).astype(np.uint8)
    return Image.fromarray(data)


def paste_sprite(canvas: Image.Image, sprite: Image.Image, xy: tuple[int, int]) -> None:
    canvas.paste(sprite, xy, sprite)


def main() -> None:
    if not SRC.is_file():
        raise SystemExit(f"Missing source image: {SRC}")

    src = Image.open(SRC).convert("RGBA")
    sw, sh = src.size
    if sh != TARGET_H:
        src = src.resize((int(sw * (TARGET_H / sh)), TARGET_H), Image.Resampling.LANCZOS)
        sw, sh = src.size

    pad_right = TARGET_W - sw

    canvas = Image.new("RGBA", (TARGET_W, TARGET_H), (*BG, 255))
    canvas.paste(src, (0, 0), src)

    # White expand on the right only (text overlay zone).
    if pad_right > 0:
        right_fill = Image.new("RGBA", (pad_right, TARGET_H), (*BG, 255))
        canvas.paste(right_fill, (sw, 0))

    top_m = extract_sprite(src, TOP_CIRCLE_BOX).transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    bottom_m = extract_sprite(src, BOTTOM_CIRCLE_BOX).transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    _, bh = bottom_m.size

    # Teal circle accents on the expanded right margin
    paste_sprite(canvas, top_m, (sw + 48, -18))
    paste_sprite(canvas, bottom_m, (TARGET_W - bw - 36, TARGET_H - bh - 8))

    out = canvas.convert("RGB")
    out_path = OUT_DIR / "featured-female-founder-show.png"
    out_2x_path = OUT_DIR / "featured-female-founder-show@2x.png"
    out.save(out_path, format="PNG", optimize=False)

    out_2x = out.resize((TARGET_W * 2, TARGET_H * 2), Image.Resampling.LANCZOS)
    out_2x.save(out_2x_path, format="PNG", optimize=False)

    print(f"Wrote {out_path} ({out.size[0]}x{out.size[1]})")
    print(f"Wrote {out_2x_path} ({out_2x.size[0]}x{out_2x.size[1]})")


if __name__ == "__main__":
    main()
