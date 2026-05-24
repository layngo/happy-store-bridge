#!/usr/bin/env python3
"""Normalize Lite stop-motion: paired frames share size + bottom-center position on 1024² canvas."""

from __future__ import annotations

import importlib.util
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
FRAMES_DIR = ROOT / "public/products/lay-n-go-lite-18/stop-motion"
RMBG_SCRIPT = ROOT / "scripts/remove-product-studio-backgrounds.py"
ASSETS = Path("/Users/tombro/.cursor/projects/Users-tombro-happy-store-bridge-1/assets")

CANVAS = 1024
BOTTOM_PAD = 24

# frame index -> optional source in assets (rebuild from originals when present)
SOURCES = {
    "frame-01.png": ASSETS / "composer-annotation-437eb74a-dc17-4ea3-aaa8-a6fe315c4231.png",
    "frame-02.png": ASSETS / "composer-annotation-23a6cebb-ea23-4e39-ba4d-0ea62f1fac2c.png",
    "frame-03.png": ASSETS / "composer-annotation-0a72f1a9-b211-4ffe-8493-47defe738ef9.png",
    "frame-04.png": ASSETS / "ChatGPT_Image_May_23__2026__09_08_43_PM__1_-f301522f-778d-4094-97b6-df86677a807f.png",
    "frame-05.png": ASSETS / "ChatGPT_Image_May_23__2026__09_08_46_PM__4_-3fd242e8-2a63-484f-9613-bcde779e6c56.png",
    "frame-06.png": ASSETS / "ChatGPT_Image_May_23__2026__09_34_35_PM-ed9035dc-39bb-4da3-a4e5-b146b66a470c.png",
    "frame-07.png": ASSETS / "ChatGPT_Image_May_23__2026__09_37_14_PM-0063bec3-f853-4832-ab2f-2794799e9fed.png",
    "frame-08.png": ASSETS / "ChatGPT_Image_May_23__2026__09_39_23_PM-bf39c6c4-ef8b-40ba-86f2-b7dd6c138a38.png",
}

PAIRS = [
    ("frame-01.png", "frame-05.png"),
    ("frame-02.png", "frame-06.png"),
    ("frame-03.png", "frame-07.png"),
    ("frame-04.png", "frame-08.png"),
]


def load_rmbg():
    spec = importlib.util.spec_from_file_location("rmbg", RMBG_SCRIPT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def crop_content(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    bbox = im.getbbox()
    return im.crop(bbox) if bbox else im


def scale_to_height(im: Image.Image, target_h: int) -> Image.Image:
    w, h = im.size
    if h == 0:
        return im
    new_w = max(1, round(w * target_h / h))
    return im.resize((new_w, target_h), Image.Resampling.LANCZOS)


def center_in_box(im: Image.Image, box_w: int, box_h: int) -> Image.Image:
    box = Image.new("RGBA", (box_w, box_h), (0, 0, 0, 0))
    x = (box_w - im.width) // 2
    y = (box_h - im.height) // 2
    box.alpha_composite(im, (x, y))
    return box


def load_frame(name: str, rmbg) -> Image.Image:
    path = FRAMES_DIR / name
    src = SOURCES.get(name)
    if src and src.is_file():
        im = Image.open(src)
    else:
        im = Image.open(path)
    im = rmbg.remove_background_rgba(
        im,
        bg_rgb=rmbg.SITE_BG_RGB,
        tol=50,
        soft=22,
        near_white_lum=244,
        near_white_chroma=24,
    )
    return rmbg.trim_alpha_bbox(im, pad=8)


def align_pair(name_a: str, name_b: str, rmbg) -> None:
    a = crop_content(load_frame(name_a, rmbg))
    b = crop_content(load_frame(name_b, rmbg))

    target_h = max(a.size[1], b.size[1])
    a = scale_to_height(a, target_h)
    b = scale_to_height(b, target_h)
    target_w = max(a.size[0], b.size[0])

    # Cap width so wide open mats still fit canvas
    max_w = CANVAS - 48
    if target_w > max_w:
        shrink = max_w / target_w
        target_w = max_w
        target_h = max(1, round(target_h * shrink))
        a = scale_to_height(crop_content(a), target_h)
        b = scale_to_height(crop_content(b), target_h)
        a = center_in_box(a, target_w, target_h)
        b = center_in_box(b, target_w, target_h)
    else:
        a = center_in_box(a, target_w, target_h)
        b = center_in_box(b, target_w, target_h)

    paste_y = CANVAS - BOTTOM_PAD - target_h
    paste_x = (CANVAS - target_w) // 2

    for name, piece in ((name_a, a), (name_b, b)):
        canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
        canvas.alpha_composite(piece, (paste_x, paste_y))
        out = FRAMES_DIR / name
        canvas.save(out, optimize=True)
        print(f"  {name} box {target_w}x{target_h} at ({paste_x},{paste_y})")


def main() -> None:
    rmbg = load_rmbg()
    FRAMES_DIR.mkdir(parents=True, exist_ok=True)
    print("Aligning stop-motion pairs (green / blue same stage per step)…")
    for a, b in PAIRS:
        align_pair(a, b, rmbg)
    print("Done.")


if __name__ == "__main__":
    main()
