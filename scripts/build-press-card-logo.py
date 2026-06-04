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


def crop_source_border(img: Image.Image, pad: int = 26) -> Image.Image:
    """Strip outer gray/white fringe and excess black matte before logo keying."""
    arr = np.array(img.convert("RGB"), dtype=np.float32)
    h, w = arr.shape[:2]
    lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
    mx = arr.max(axis=2)
    mn = arr.min(axis=2)
    sat = np.divide(mx - mn, mx, where=mx > 0, out=np.zeros_like(mx))
    color = (sat > 0.13) & (mx > 58) & (lum > 48)

    def is_fringe_row(i: int) -> bool:
        return float(lum[i].mean()) > 32 and int(color[i].sum()) < 8

    def is_fringe_col(j: int) -> bool:
        return float(lum[:, j].mean()) > 32 and int(color[:, j].sum()) < 8

    top = 0
    while top < h and is_fringe_row(top):
        top += 1
    bottom = h - 1
    while bottom > top and is_fringe_row(bottom):
        bottom -= 1
    left = 0
    while left < w and is_fringe_col(left):
        left += 1
    right = w - 1
    while right > left and is_fringe_col(right):
        right -= 1

    cropped = arr[top : bottom + 1, left : right + 1]
    mx = cropped.max(axis=2)
    mn = cropped.min(axis=2)
    lum = 0.299 * cropped[:, :, 0] + 0.587 * cropped[:, :, 1] + 0.114 * cropped[:, :, 2]
    sat = np.divide(mx - mn, mx, where=mx > 0, out=np.zeros_like(mx))
    color = (sat > 0.13) & (mx > 58) & (lum > 48)
    ys, xs = np.where(color)
    if len(xs) == 0:
        return img.crop((left, top, right + 1, bottom + 1))

    ch, cw = cropped.shape[:2]
    x0 = max(0, int(xs.min()) - pad)
    y0 = max(0, int(ys.min()) - pad)
    x1 = min(cw, int(xs.max()) + pad + 1)
    y1 = min(ch, int(ys.max()) + pad + 1)
    return img.crop((left + x0, top + y0, left + x1, top + y1))


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


def _cntraveler_color_mask(arr: np.ndarray, a: np.ndarray) -> np.ndarray:
    lum, sat, _ = _color_stats(arr)
    mx = arr[:, :, :3].max(axis=2)
    return (a > 20) & (sat > 0.13) & (mx > 58) & (lum > 48)


def clear_enclosed_black_flood(img: Image.Image, lum_max: float = 52.0, sat_max: float = 0.12) -> Image.Image:
    """Knock out letter counters: dark pixels not connected to image edges."""
    arr = np.array(img.convert("RGBA"), dtype=np.uint8)
    lum, sat, a = _color_stats(arr)
    dark = (a > 0) & (lum <= lum_max) & (sat <= sat_max)
    h, w = dark.shape
    exterior = np.zeros_like(dark)
    stack: list[tuple[int, int]] = []
    for x in range(w):
        if dark[0, x]:
            stack.append((0, x))
        if dark[h - 1, x]:
            stack.append((h - 1, x))
    for y in range(h):
        if dark[y, 0]:
            stack.append((y, 0))
        if dark[y, w - 1]:
            stack.append((y, w - 1))
    while stack:
        y, x = stack.pop()
        if y < 0 or y >= h or x < 0 or x >= w or exterior[y, x] or not dark[y, x]:
            continue
        exterior[y, x] = True
        stack.extend([(y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)])
    arr[dark & ~exterior, 3] = 0
    return Image.fromarray(arr)


def apply_keep_mask(arr: np.ndarray, keep: np.ndarray) -> np.ndarray:
    """Zero alpha on everything outside the keep mask — removes dark matte halos."""
    out = arr.copy()
    out[~keep, 3] = 0
    return out


def build_cntraveler_logo(img: Image.Image) -> Image.Image:
    """Condé Nast Traveler: keep color fills + white stroke only; no black fringe."""
    img = crop_source_border(img)
    arr = np.array(img.convert("RGBA"), dtype=np.uint8)
    lum, sat, a = _color_stats(arr)
    mx = arr[:, :, :3].max(axis=2)

    bg = (lum < 42) & (sat < 0.11)
    arr[bg, 3] = 0

    lum, sat, a = _color_stats(arr)
    mx = arr[:, :, :3].max(axis=2)
    color = (a > 0) & (sat > 0.11) & (mx > 52) & (lum > 42)
    white_stroke = (a > 0) & (lum >= 198) & (sat <= 0.10)
    arr = apply_keep_mask(arr, color | white_stroke)

    out = Image.fromarray(arr)
    out = clear_enclosed_black_flood(out, lum_max=38.0, sat_max=0.09)
    return out


def _gma_gold_mask(arr: np.ndarray, a: np.ndarray, lum: np.ndarray, sat: np.ndarray) -> np.ndarray:
    rf = arr[:, :, 0].astype(np.float32)
    gf = arr[:, :, 1].astype(np.float32)
    bf = arr[:, :, 2].astype(np.float32)
    return (
        (a > 24)
        & (
            ((sat > 0.13) & (rf > 125) & (gf > 95))
            | ((rf > 195) & (gf > 155) & (bf < 130))
        )
    )


def _gma_blue_mask(arr: np.ndarray, a: np.ndarray) -> np.ndarray:
    rf = arr[:, :, 0].astype(np.float32)
    gf = arr[:, :, 1].astype(np.float32)
    bf = arr[:, :, 2].astype(np.float32)
    # Tight abc wordmark blue only — avoids cyan fringe on the gold ampersand.
    return (a > 24) & (bf > 80) & (rf < 85) & (gf < 125) & (bf >= rf + 20)


def _gma_white_mask(arr: np.ndarray, a: np.ndarray, lum: np.ndarray, sat: np.ndarray) -> np.ndarray:
    return (a > 24) & (lum >= 212) & (sat <= 0.075)


def strip_gma_fringe(arr: np.ndarray, keep: np.ndarray) -> np.ndarray:
    """Drop halos, cyan keying junk, and semi-transparent edge pixels."""
    out = arr.copy()
    lum, sat, a = _color_stats(out)
    rf = out[:, :, 0].astype(np.float32)
    gf = out[:, :, 1].astype(np.float32)
    bf = out[:, :, 2].astype(np.float32)

    cyan = (a > 0) & ~keep & (bf >= rf) & (bf >= gf * 0.92) & (lum < 210)
    dark = (a > 0) & ~keep & (lum < 118) & (sat < 0.16)
    soft = (a > 0) & (a < 210) & ~keep
    out[cyan | dark | soft, 3] = 0
    return out


def remove_small_dark_regions(
    arr: np.ndarray,
    *,
    lum_max: float = 102.0,
    sat_max: float = 0.15,
    min_area: int = 520,
    protect: np.ndarray | None = None,
) -> None:
    from scipy.ndimage import label

    lum, sat, a = _color_stats(arr)
    dark = (a > 20) & (lum <= lum_max) & (sat <= sat_max)
    if protect is not None:
        dark &= ~protect
    labeled, count = label(dark)
    for idx in range(1, count + 1):
        region = labeled == idx
        if int(region.sum()) < min_area:
            arr[region, 3] = 0


def build_gma_logo(img: Image.Image) -> Image.Image:
    """GMA Deals & Steals: gold + abc blue + white headline; CSS drop shadow on site."""
    img = crop_source_border(img)
    arr = np.array(img.convert("RGBA"), dtype=np.uint8)
    lum, sat, a = _color_stats(arr)

    bg = (lum < 42) & (sat < 0.11)
    arr[bg, 3] = 0

    lum, sat, a = _color_stats(arr)
    gold = _gma_gold_mask(arr, a, lum, sat)
    blue = _gma_blue_mask(arr, a)
    white = _gma_white_mask(arr, a, lum, sat)
    keep = gold | blue | white
    arr = apply_keep_mask(arr, keep)
    arr = strip_gma_fringe(arr, keep)

    out = Image.fromarray(arr)
    out = clear_enclosed_black_flood(out, lum_max=40.0, sat_max=0.10)
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
    card_targets: dict[str, tuple[int, int, Path | None]] = {
        "cntraveler": (887, 350, ROOT / "public/press/logos/cntraveler.png"),
        "gma": (718, 634, ROOT / "public/press/logos/gma.png"),
    }
    if mode in card_targets:
        target_w, target_h, logo_dst = card_targets[mode]
        w, h = out.size
        scale = min(target_w / w, target_h / h)
        nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
        resized = out.resize((nw, nh), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
        canvas.paste(resized, ((target_w - nw) // 2, (target_h - nh) // 2), resized)
        out = canvas
    out.save(dst, format="PNG", optimize=False)
    if mode in card_targets:
        _, _, logo_dst = card_targets[mode]
        if logo_dst is not None:
            out.save(logo_dst, format="PNG", optimize=False)
    return out.size


LOGOS = {
    "cntraveler": {
        "src": ASSETS / "ChatGPT_Image_Jun_2__2026__10_13_19_PM-fc631a4e-d3c5-470a-9d62-c97c4e9fc9d2.png",
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
        "src": ASSETS / "ChatGPT_Image_Jun_2__2026__10_05_54_PM-d31d4e6f-d078-42c1-9aa9-c147419060bb.png",
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
