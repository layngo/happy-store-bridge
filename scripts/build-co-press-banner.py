#!/usr/bin/env python3
"""CO— press banner: interview art left-aligned, white gradient into white right panel."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = (
    Path.home()
    / ".cursor/projects/Users-tombro-happy-store-bridge-1/assets"
    / "ChatGPT_Image_Jun_2__2026__02_19_57_PM-3878d67f-9641-4249-a5e4-8db2b43b27f0.png"
)
OUT_DIR = ROOT / "public" / "press"
BG = (255, 255, 255)
TARGET_W = 2048
TARGET_H = 768
FADE_START_RATIO = 0.52


def apply_white_fade_right(img: Image.Image) -> Image.Image:
    """Fade the right edge of the photo into white for text overlay."""
    rgba = np.array(img.convert("RGBA"), dtype=np.float64)
    h, w, _ = rgba.shape
    fade_start = int(w * FADE_START_RATIO)

    for x in range(fade_start, w):
        t = (x - fade_start) / max(w - fade_start - 1, 1)
        t = t**0.85
        rgba[:, x, :3] = rgba[:, x, :3] * (1.0 - t) + 255.0 * t
        rgba[:, x, 3] = 255.0

    return Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), "RGBA")


def main() -> None:
    if not SRC.is_file():
        raise SystemExit(f"Missing source image: {SRC}")

    src = Image.open(SRC).convert("RGBA")
    sw, sh = src.size
    if sh != TARGET_H:
        src = src.resize((int(sw * (TARGET_H / sh)), TARGET_H), Image.Resampling.LANCZOS)
        sw, sh = src.size

    src = apply_white_fade_right(src)

    pad_right = TARGET_W - sw
    canvas = Image.new("RGBA", (TARGET_W, TARGET_H), (*BG, 255))
    canvas.paste(src, (0, 0), src)

    if pad_right > 0:
        right_fill = Image.new("RGBA", (pad_right, TARGET_H), (*BG, 255))
        canvas.paste(right_fill, (sw, 0))

    out = canvas.convert("RGB")
    out_path = OUT_DIR / "featured-co-product-is-king-banner.png"
    out_2x_path = OUT_DIR / "featured-co-product-is-king-banner@2x.png"
    out.save(out_path, format="PNG", optimize=False)

    out_2x = out.resize((TARGET_W * 2, TARGET_H * 2), Image.Resampling.LANCZOS)
    out_2x.save(out_2x_path, format="PNG", optimize=False)

    print(f"Wrote {out_path} ({out.size[0]}x{out.size[1]})")
    print(f"Wrote {out_2x_path} ({out_2x.size[0]}x{out_2x.size[1]})")


if __name__ == "__main__":
    main()
