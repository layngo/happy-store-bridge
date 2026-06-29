#!/usr/bin/env python3
"""Export Instagram story highlight covers with subtle brand-blue icon outlines."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "exports" / "instagram-story-highlights"
ASSETS = Path.home() / ".cursor/projects/Users-tombro-happy-store-bridge-1/assets"

CANVAS = 1080
BG = (255, 255, 255)
SCALE = 0.36
BRAND_BLUE = (58, 159, 176)  # #3a9fb0
OUTLINE_RADIUS = 5

HIGHLIGHTS = [
    ("play", "ChatGPT_Image_Jun_27__2026__12_18_00_PM-6eb38e3d-47b0-4ec7-9a1b-a543f7aaf149.png"),
    ("pet", "ChatGPT_Image_Jun_27__2026__12_14_59_PM-d1fbb2c1-467a-4d1f-9784-a520dc25fa25.png"),
    ("nail", "ChatGPT_Image_Jun_27__2026__12_18_56_PM-9c60f230-e4ce-48e2-8265-32aaedb45a9e.png"),
    ("cosmetic", "ChatGPT_Image_Jun_27__2026__12_15_28_PM-ec1ea52b-4e38-4431-8ad4-abd10599aeea.png"),
    ("traveler", "fdsfsd-4f04b40f-cc66-418a-93e0-ae1dc892e4bb.png"),
]


def icon_mask(rgb: np.ndarray, alpha: np.ndarray | None = None, threshold: float = 96.0) -> np.ndarray:
    lum = 0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]
    mask = lum < threshold
    if alpha is not None:
        mask &= alpha > 64
    return mask


def dilate_mask(mask: np.ndarray, radius: int) -> np.ndarray:
    layer = Image.fromarray((mask.astype(np.uint8) * 255))
    for _ in range(radius):
        layer = layer.filter(ImageFilter.MaxFilter(3))
    return np.array(layer) > 127


def flatten_on_white(img: Image.Image) -> tuple[np.ndarray, np.ndarray]:
    rgba = img.convert("RGBA")
    arr = np.array(rgba)
    white = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
    white.alpha_composite(rgba)
    rgb = np.array(white.convert("RGB"))
    alpha = arr[:, :, 3]
    return rgb, alpha


def add_blue_accent_outline(img: Image.Image) -> Image.Image:
    rgb, alpha = flatten_on_white(img)
    mask = icon_mask(rgb, alpha)
    if not mask.any():
        return Image.fromarray(rgb, "RGB")

    outline = dilate_mask(mask, OUTLINE_RADIUS) & ~mask
    out = np.full(rgb.shape, 255, dtype=np.uint8)
    out[mask] = (0, 0, 0)
    out[outline] = BRAND_BLUE
    return Image.fromarray(out)


def export_highlight(key: str, src_name: str) -> Path:
    src = ASSETS / src_name
    if not src.exists():
        raise FileNotFoundError(f"Missing highlight source: {src}")

    icon = add_blue_accent_outline(Image.open(src))
    target = round(CANVAS * SCALE)
    icon = icon.resize((target, target), Image.Resampling.LANCZOS)

    canvas = Image.new("RGB", (CANVAS, CANVAS), BG)
    offset = (CANVAS - target) // 2
    canvas.paste(icon, (offset, offset))

    out_path = OUT_DIR / f"instagram-highlight-{key}.png"
    canvas.save(out_path, "PNG")
    return out_path


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    exported: list[Path] = []
    for key, src_name in HIGHLIGHTS:
        exported.append(export_highlight(key, src_name))

    print("Exported Instagram story highlight covers:")
    for path in exported:
        print(f"  {path}")


if __name__ == "__main__":
    main()
