#!/usr/bin/env python3
"""Normalize Lite stop-motion: paired frames share stage box, bottom Y, and horizontal centroid."""

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
MAX_W = CANVAS - 48

SOURCES = {
    "frame-01.png": ASSETS
    / "ChatGPT_Image_May_23__2026__09_11_12_PM__3_-3135a85f-e888-4d8c-a6c8-6935d228aa96.png",
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
    return im.resize((max(1, round(w * target_h / h)), target_h), Image.Resampling.LANCZOS)


def fit_in_box(im: Image.Image, box_w: int, box_h: int) -> Image.Image:
    w, h = im.size
    if w == 0 or h == 0:
        return im
    scale = min(box_w / w, box_h / h)
    nw = max(1, round(w * scale))
    nh = max(1, round(h * scale))
    scaled = im.resize((nw, nh), Image.Resampling.LANCZOS)
    box = Image.new("RGBA", (box_w, box_h), (0, 0, 0, 0))
    box.alpha_composite(scaled, ((box_w - nw) // 2, (box_h - nh) // 2))
    return box


def alpha_centroid_x(im: Image.Image) -> float:
    px = im.load()
    w, h = im.size
    sum_x = 0.0
    count = 0
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 20:
                sum_x += x
                count += 1
    return sum_x / count if count else w / 2


def load_frame(name: str, rmbg) -> Image.Image:
    path = FRAMES_DIR / name
    src = SOURCES.get(name)
    im = Image.open(src if src and src.is_file() else path)
    im = rmbg.remove_background_rgba(
        im,
        bg_rgb=rmbg.SITE_BG_RGB,
        tol=50,
        soft=22,
        near_white_lum=244,
        near_white_chroma=24,
    )
    return rmbg.trim_alpha_bbox(im, pad=8)


def paste_on_canvas(piece: Image.Image, paste_x: int, paste_y: int) -> Image.Image:
    canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    canvas.alpha_composite(piece, (paste_x, paste_y))
    return canvas


def align_pair(name_a: str, name_b: str, rmbg) -> None:
    a = crop_content(load_frame(name_a, rmbg))
    b = crop_content(load_frame(name_b, rmbg))

    target_h = max(a.size[1], b.size[1])
    a = scale_to_height(a, target_h)
    b = scale_to_height(b, target_h)
    target_w = max(a.size[0], b.size[0])

    if target_w > MAX_W:
        shrink = MAX_W / target_w
        target_w = MAX_W
        target_h = max(1, round(target_h * shrink))
        a = scale_to_height(crop_content(load_frame(name_a, rmbg)), target_h)
        b = scale_to_height(crop_content(load_frame(name_b, rmbg)), target_h)
        target_w = max(a.size[0], b.size[0])

    a_box = fit_in_box(a, target_w, target_h)
    b_box = fit_in_box(b, target_w, target_h)

    paste_y = CANVAS - BOTTOM_PAD - target_h
    base_x = (CANVAS - target_w) // 2

    # Match horizontal visual center of green (A) on blue (B)
    dx = round(alpha_centroid_x(a_box) - alpha_centroid_x(b_box))
    paste_a = base_x
    paste_b = max(0, min(CANVAS - target_w, base_x + dx))

    paste_on_canvas(a_box, paste_a, paste_y).save(FRAMES_DIR / name_a, optimize=True)
    paste_on_canvas(b_box, paste_b, paste_y).save(FRAMES_DIR / name_b, optimize=True)

    print(
        f"  {name_a}@{paste_a} {name_b}@{paste_b} "
        f"box {target_w}x{target_h} centroid_dx={dx}"
    )


def main() -> None:
    rmbg = load_rmbg()
    FRAMES_DIR.mkdir(parents=True, exist_ok=True)
    print("Aligning stop-motion pairs…")
    for a, b in PAIRS:
        align_pair(a, b, rmbg)
    print("Done.")


if __name__ == "__main__":
    main()
