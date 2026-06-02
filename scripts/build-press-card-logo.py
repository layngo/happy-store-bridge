#!/usr/bin/env python3
"""Prepare press card logos: remove black bg, optional white→dark for white cards, trim padding."""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path.home() / ".cursor/projects/Users-tombro-happy-store-bridge-1/assets"
REMOVE_BG = ROOT / "scripts" / "remove-play-award-backgrounds.py"


def load_remove_bg():
    spec = importlib.util.spec_from_file_location("rmbg", REMOVE_BG)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(mod)
    return mod.remove_background


def trim_transparent(img: Image.Image, pad: int = 8) -> Image.Image:
    rgba = np.array(img.convert("RGBA"))
    alpha = rgba[:, :, 3]
    ys, xs = np.where(alpha > 12)
    if len(xs) == 0:
        return img
    left, right = int(xs.min()), int(xs.max())
    top, bottom = int(ys.min()), int(ys.max())
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(rgba.shape[1] - 1, right + pad)
    bottom = min(rgba.shape[0] - 1, bottom + pad)
    return img.crop((left, top, right + 1, bottom + 1))


def clear_enclosed_black(img: Image.Image, lum_max: float = 48.0, sat_max: float = 0.12) -> Image.Image:
    """Knock out letter counters and leftover black fill (not connected to corners)."""
    arr = np.array(img.convert("RGBA"), dtype=np.uint8)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    rf, gf, bf = r.astype(np.float32), g.astype(np.float32), b.astype(np.float32)
    mx = np.maximum(np.maximum(rf, gf), bf)
    mn = np.minimum(np.minimum(rf, gf), bf)
    sat = (mx - mn) / np.maximum(mx, 1.0)
    lum = 0.299 * rf + 0.587 * gf + 0.114 * bf
    mask = (a > 32) & (lum <= lum_max) & (sat <= sat_max)
    arr[mask, 3] = 0
    return Image.fromarray(arr)


def recolor_near_white_to_dark(img: Image.Image, lum_min: float = 215.0, sat_max: float = 0.14) -> Image.Image:
    """Only solid white/grey wordmark pixels — leaves brand colors untouched."""
    arr = np.array(img.convert("RGBA"), dtype=np.uint8)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    rf, gf, bf = r.astype(np.float32), g.astype(np.float32), b.astype(np.float32)
    mx = np.maximum(np.maximum(rf, gf), bf)
    mn = np.minimum(np.minimum(rf, gf), bf)
    sat = (mx - mn) / np.maximum(mx, 1.0)
    lum = 0.299 * rf + 0.587 * gf + 0.114 * bf
    mask = (a > 32) & (lum >= lum_min) & (sat <= sat_max)
    arr[mask, 0:3] = (arr[mask, 0:3].astype(np.float32) * 0.12 + 26.0).astype(np.uint8)
    return Image.fromarray(arr)


def build_logo(
    src: Path,
    dst: Path,
    *,
    darken_white: bool = False,
) -> tuple[int, int]:
    remove_background = load_remove_bg()
    tmp = dst.with_suffix(".tmp.png")
    Image.open(src).convert("RGBA").save(tmp)
    remove_background(tmp)
    out = Image.open(tmp).convert("RGBA")
    tmp.unlink(missing_ok=True)

    if darken_white:
        out = clear_enclosed_black(out)
        out = recolor_near_white_to_dark(out)

    out = trim_transparent(out, pad=10)
    out.save(dst, format="PNG", optimize=False)
    return out.size


LOGOS = {
    "cntraveler": {
        "src": ASSETS / "ChatGPT_Image_Jun_2__2026__02_59_57_PM-6d0ad19e-5356-4f55-9542-283361ad4116.png",
        "dst": ROOT / "public/press/featured-cntraveler-editors-picks.png",
        "darken_white": False,
    },
    "women-owned": {
        "src": ASSETS / "ChatGPT_Image_Jun_2__2026__02_32_08_PM-9ea9bdda-425d-4e65-815e-176475095c08.png",
        "dst": ROOT / "public/press/featured-women-owned-logo.png",
        "darken_white": True,
    },
    "gma": {
        "src": ASSETS / "ChatGPT_Image_Jun_2__2026__02_57_32_PM-b787e122-0555-4044-97fc-b4797094feef.png",
        "dst": ROOT / "public/press/featured-gma-deals-steals-logo.png",
        "darken_white": True,
    },
}


def main() -> int:
    names = sys.argv[1:] if len(sys.argv) > 1 else list(LOGOS.keys())
    for name in names:
        cfg = LOGOS.get(name)
        if not cfg:
            print(f"Unknown logo: {name}", file=sys.stderr)
            return 1
        src: Path = cfg["src"]
        if not src.is_file():
            print(f"Missing source: {src}", file=sys.stderr)
            return 1
        size = build_logo(src, cfg["dst"], darken_white=cfg["darken_white"])
        print(f"{name}: {cfg['dst'].name} {size[0]}x{size[1]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
