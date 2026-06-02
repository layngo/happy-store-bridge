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


def _color_stats(arr: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    rf, gf, bf = r.astype(np.float32), g.astype(np.float32), b.astype(np.float32)
    mx = np.maximum(np.maximum(rf, gf), bf)
    mn = np.minimum(np.minimum(rf, gf), bf)
    sat = (mx - mn) / np.maximum(mx, 1.0)
    lum = 0.299 * rf + 0.587 * gf + 0.114 * bf
    return lum, sat, a


def defringe_dark_halos(img: Image.Image, lum_max: float = 95.0) -> Image.Image:
    """Drop semi-transparent dark pixels left from background removal."""
    arr = np.array(img.convert("RGBA"), dtype=np.uint8)
    lum, _sat, a = _color_stats(arr)
    halo = (a > 0) & (a < 255) & (lum <= lum_max)
    arr[halo, 3] = 0
    return Image.fromarray(arr)


def remove_small_dark_specks(
    img: Image.Image,
    *,
    lum_max: float = 54.0,
    sat_max: float = 0.11,
    min_area: int = 420,
) -> Image.Image:
    """Remove tiny black fragments; keep larger intentional black letter fills."""
    from scipy.ndimage import label

    arr = np.array(img.convert("RGBA"), dtype=np.uint8)
    lum, sat, a = _color_stats(arr)
    dark = (a > 32) & (lum <= lum_max) & (sat <= sat_max)
    labeled, count = label(dark)
    for idx in range(1, count + 1):
        region = labeled == idx
        if int(region.sum()) < min_area:
            arr[region, 3] = 0
    return Image.fromarray(arr)


def strip_near_black_pixels(
    img: Image.Image,
    *,
    lum_max: float = 64.0,
    sat_max: float = 0.14,
) -> Image.Image:
    """Remove remaining black matte/halo pixels; colorful letters stay."""
    arr = np.array(img.convert("RGBA"), dtype=np.uint8)
    lum, sat, a = _color_stats(arr)
    mask = (a > 0) & (lum <= lum_max) & (sat <= sat_max)
    arr[mask, 3] = 0
    return Image.fromarray(arr)


def purge_dark_matte(
    img: Image.Image,
    *,
    lum_max: float = 92.0,
    sat_max: float = 0.17,
) -> Image.Image:
    """Remove black matte and dark fringe pixels; keep saturated letter fills."""
    arr = np.array(img.convert("RGBA"), dtype=np.uint8)
    lum, sat, a = _color_stats(arr)
    mask = (a > 0) & (lum <= lum_max) & (sat <= sat_max)
    arr[mask, 3] = 0
    return Image.fromarray(arr)


def clean_colorful_logo_edges(img: Image.Image) -> Image.Image:
    """Drop dark halos on semi-transparent edge pixels after keying."""
    arr = np.array(img.convert("RGBA"), dtype=np.uint8)
    lum, sat, a = _color_stats(arr)
    fringe = (a > 0) & (a < 255) & (lum < 150.0)
    stray = (a >= 180) & (lum < 82.0) & (sat < 0.15)
    arr[fringe | stray, 3] = 0
    return Image.fromarray(arr)


def build_cntraveler_logo(img: Image.Image) -> Image.Image:
    """Condé Nast Traveler: full-color wordmark, transparent counters, no black halos."""
    arr = np.array(img.convert("RGBA"), dtype=np.uint8)
    mx = arr[:, :, :3].max(axis=2)
    arr[mx < 44, 3] = 0

    remove_background = load_remove_bg()
    tmp_path = ROOT / "public" / "press" / ".cntraveler-logo-build.tmp.png"
    Image.fromarray(arr).save(tmp_path)
    remove_background(tmp_path)
    out = Image.open(tmp_path).convert("RGBA")
    tmp_path.unlink(missing_ok=True)

    out = purge_dark_matte(out, lum_max=96.0, sat_max=0.17)
    out = clean_colorful_logo_edges(out)
    out = defringe_dark_halos(out, lum_max=150.0)
    return out


def build_gma_logo(img: Image.Image) -> Image.Image:
    """GMA Deals & Steals: keep gold, map white headline to brand blue, clean counters."""
    arr = np.array(img.convert("RGBA"), dtype=np.uint8)

    # Uniform black matte → transparent (cleaner than flood-fill alone).
    out = strip_near_black_pixels(Image.fromarray(arr), lum_max=52.0, sat_max=0.12)

    remove_background = load_remove_bg()
    tmp_path = ROOT / "public" / "press" / ".gma-logo-build.tmp.png"
    out.save(tmp_path)
    remove_background(tmp_path)
    out = Image.open(tmp_path).convert("RGBA")
    tmp_path.unlink(missing_ok=True)

    out = strip_near_black_pixels(out, lum_max=58.0, sat_max=0.13)

    arr = np.array(out, dtype=np.uint8)
    lum, sat, a = _color_stats(arr)
    rf = arr[:, :, 0].astype(np.float32)
    gf = arr[:, :, 1].astype(np.float32)
    # Brand gold / yellow — never recolor or strip
    gold = (a > 32) & (sat > 0.16) & (rf > 140) & (gf > 110)
    # Pure white headline → GMA blue
    white = (a > 32) & ~gold & (lum >= 236) & (sat <= 0.05)
    arr[white, 0] = 58
    arr[white, 1] = 118
    arr[white, 2] = 188

    # Leftover opaque black inside letterforms (e.g. ampersand, serif strokes).
    stray_dark = (a > 64) & ~gold & (lum <= 88) & (sat <= 0.12)
    arr[stray_dark, 3] = 0

    out = Image.fromarray(arr)
    out = defringe_dark_halos(out, lum_max=135.0)
    return out


def build_logo(
    src: Path,
    dst: Path,
    *,
    darken_white: bool = False,
    mode: str = "default",
) -> tuple[int, int]:
    src_img = Image.open(src).convert("RGBA")

    if mode == "gma":
        out = build_gma_logo(src_img)
    elif mode == "cntraveler":
        out = build_cntraveler_logo(src_img)
    else:
        remove_background = load_remove_bg()
        tmp = dst.with_suffix(".tmp.png")
        src_img.save(tmp)
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
        "mode": "cntraveler",
    },
    "women-owned": {
        "src": ASSETS / "ChatGPT_Image_Jun_2__2026__02_32_08_PM-9ea9bdda-425d-4e65-815e-176475095c08.png",
        "dst": ROOT / "public/press/featured-women-owned-logo.png",
        "darken_white": True,
    },
    "gma": {
        "src": ASSETS / "ChatGPT_Image_Jun_2__2026__02_57_32_PM-b787e122-0555-4044-97fc-b4797094feef.png",
        "dst": ROOT / "public/press/featured-gma-deals-steals-logo.png",
        "darken_white": False,
        "mode": "gma",
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
        size = build_logo(
            src,
            cfg["dst"],
            darken_white=bool(cfg.get("darken_white")),
            mode=str(cfg.get("mode", "default")),
        )
        print(f"{name}: {cfg['dst'].name} {size[0]}x{size[1]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
