#!/usr/bin/env python3
"""Expand Condé Nast press banner: source art left-aligned, white fill on the right."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = (
    Path.home()
    / ".cursor/projects/Users-tombro-happy-store-bridge-1/assets"
    / "ChatGPT_Image_Jun_2__2026__01_41_56_PM-400e75b0-f081-40ce-8fe9-71950a1c5a18.png"
)
OUT_DIR = ROOT / "public" / "press"
BG = (255, 255, 255)
TARGET_W = 2048
TARGET_H = 768


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

    if pad_right > 0:
        right_fill = Image.new("RGBA", (pad_right, TARGET_H), (*BG, 255))
        canvas.paste(right_fill, (sw, 0))

    out = canvas.convert("RGB")
    out_path = OUT_DIR / "featured-cntraveler-travel-gifts.png"
    out_2x_path = OUT_DIR / "featured-cntraveler-travel-gifts@2x.png"
    out.save(out_path, format="PNG", optimize=False)

    out_2x = out.resize((TARGET_W * 2, TARGET_H * 2), Image.Resampling.LANCZOS)
    out_2x.save(out_2x_path, format="PNG", optimize=False)

    print(f"Wrote {out_path} ({out.size[0]}x{out.size[1]})")
    print(f"Wrote {out_2x_path} ({out_2x.size[0]}x{out_2x.size[1]})")


if __name__ == "__main__":
    main()
