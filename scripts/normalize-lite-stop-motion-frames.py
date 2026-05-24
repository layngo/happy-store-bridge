#!/usr/bin/env python3
"""Normalize Lite stop-motion frames: shared 1024 canvas, matched closed-bag height & bottom Y."""

from __future__ import annotations

import importlib.util
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
FRAMES_DIR = ROOT / "public/products/lay-n-go-lite-18/stop-motion"
RMBG_SCRIPT = ROOT / "scripts/remove-product-studio-backgrounds.py"

CANVAS = 1024
BOTTOM_PAD = 24
MAX_W = CANVAS - 48


def load_rmbg():
    spec = importlib.util.spec_from_file_location("rmbg", RMBG_SCRIPT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def crop_content(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    bbox = im.getbbox()
    return im.crop(bbox) if bbox else im


def fit_to_stage(im: Image.Image, target_h: int) -> Image.Image:
    w, h = im.size
    scale = min(target_h / h, MAX_W / w)
    return im.resize(
        (max(1, round(w * scale)), max(1, round(h * scale))),
        Image.Resampling.LANCZOS,
    )


def paste_bottom_center(canvas: Image.Image, piece: Image.Image) -> None:
    x = (CANVAS - piece.width) // 2
    y = CANVAS - BOTTOM_PAD - piece.height
    canvas.alpha_composite(piece, (x, y))


def main() -> None:
    rmbg = load_rmbg()
    paths = sorted(FRAMES_DIR.glob("frame-*.png"))
    if not paths:
        raise SystemExit(f"No frames in {FRAMES_DIR}")

    for path in paths:
        im = rmbg.remove_background_rgba(
            Image.open(path),
            bg_rgb=rmbg.SITE_BG_RGB,
            tol=50,
            soft=22,
            near_white_lum=244,
            near_white_chroma=24,
        )
        im = rmbg.trim_alpha_bbox(im, pad=8)
        im.save(path, optimize=True)

    closed_h = max(
        crop_content(Image.open(FRAMES_DIR / "frame-01.png")).size[1],
        crop_content(Image.open(FRAMES_DIR / "frame-05.png")).size[1],
    )

    for path in paths:
        scaled = fit_to_stage(crop_content(Image.open(path)), closed_h)
        canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
        paste_bottom_center(canvas, scaled)
        canvas.save(path, optimize=True)
        print(f"  {path.name} {scaled.size} bottom={CANVAS - BOTTOM_PAD - scaled.height}")

    print(f"Done — closed-bag target height {closed_h}px on {CANVAS}×{CANVAS} canvas.")


if __name__ == "__main__":
    main()
