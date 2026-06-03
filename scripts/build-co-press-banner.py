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
# Wide, gentle blend — avoids a visible vertical seam mid-photo.
FADE_START_RATIO = 0.30
FADE_END_RATIO = 0.90


def _smoothstep(t: np.ndarray) -> np.ndarray:
    return t * t * (3.0 - 2.0 * t)


def apply_white_fade_right(img: Image.Image) -> Image.Image:
    """Fade the right side of the photo into white for text overlay."""
    rgba = np.array(img.convert("RGBA"), dtype=np.float64)
    _h, w, _ = rgba.shape
    fade_start = w * FADE_START_RATIO
    fade_end = w * FADE_END_RATIO

    xs = np.arange(w, dtype=np.float64)
    t = np.clip((xs - fade_start) / max(fade_end - fade_start, 1.0), 0.0, 1.0)
    t = _smoothstep(t)
    t = t.reshape(1, w, 1)

    rgba[:, :, :3] = rgba[:, :, :3] * (1.0 - t) + 255.0 * t
    rgba[:, :, 3] = 255.0

    return Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8))


def resize_to_height(img: Image.Image, target_h: int) -> Image.Image:
    sw, sh = img.size
    if sh == target_h:
        return img
    new_w = int(sw * (target_h / sh))
    return img.resize((new_w, target_h), Image.Resampling.LANCZOS)


def build_desktop_banner(src: Image.Image) -> Image.Image:
    src = apply_white_fade_right(src)
    sw, sh = src.size
    pad_right = TARGET_W - sw
    canvas = Image.new("RGBA", (TARGET_W, TARGET_H), (*BG, 255))
    canvas.paste(src, (0, 0), src)
    if pad_right > 0:
        canvas.paste(Image.new("RGBA", (pad_right, TARGET_H), (*BG, 255)), (sw, 0))
    return canvas.convert("RGB")


MOBILE_W = 1536
MOBILE_H = 768


def build_mobile_banner(src: Image.Image) -> Image.Image:
    """No right fade — full interview art for stacked mobile layout."""
    art = resize_to_height(src, MOBILE_H)
    aw, ah = art.size
    canvas = Image.new("RGBA", (MOBILE_W, MOBILE_H), (*BG, 255))
    canvas.paste(art, (0, 0), art)
    if aw < MOBILE_W:
        canvas.paste(Image.new("RGBA", (MOBILE_W - aw, MOBILE_H), (*BG, 255)), (aw, 0))
    return canvas.convert("RGB")


def main() -> None:
    if not SRC.is_file():
        raise SystemExit(f"Missing source image: {SRC}")

    raw = Image.open(SRC).convert("RGBA")
    desktop_src = resize_to_height(raw, TARGET_H)

    out = build_desktop_banner(desktop_src)
    out_path = OUT_DIR / "featured-co-product-is-king-banner.png"
    out_2x_path = OUT_DIR / "featured-co-product-is-king-banner@2x.png"
    out.save(out_path, format="PNG", optimize=False)
    out.resize((TARGET_W * 2, TARGET_H * 2), Image.Resampling.LANCZOS).save(
        out_2x_path, format="PNG", optimize=False
    )

    mobile = build_mobile_banner(raw)
    mobile_path = OUT_DIR / "featured-co-product-is-king-banner-mobile.png"
    mobile_2x_path = OUT_DIR / "featured-co-product-is-king-banner-mobile@2x.png"
    mobile.save(mobile_path, format="PNG", optimize=False)
    mobile.resize((MOBILE_W * 2, MOBILE_H * 2), Image.Resampling.LANCZOS).save(
        mobile_2x_path, format="PNG", optimize=False
    )

    print(f"Wrote {out_path} ({out.size[0]}x{out.size[1]})")
    print(f"Wrote {out_2x_path}")
    print(f"Wrote {mobile_path} ({mobile.size[0]}x{mobile.size[1]}) — no gradient")
    print(f"Wrote {mobile_2x_path}")


if __name__ == "__main__":
    main()
