#!/usr/bin/env python3
"""Expand Female Founder press banner — art left-aligned, white right, vector circles on top."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SRC = (
    Path.home()
    / ".cursor/projects/Users-tombro-happy-store-bridge-1/assets"
    / "ChatGPT_Image_Jun_2__2026__01_29_35_PM-a1665988-71dc-42d4-869d-834f05978f66.png"
)
OUT_DIR = ROOT / "public" / "press"
BG = (254, 254, 254)
TEAL = (18, 160, 158, 255)
TARGET_W = 2048
TARGET_H = 768


def make_striped_circle(diameter: int) -> Image.Image:
    """Simple teal / white diagonal stripe disc (vector-style, full opacity on top)."""
    size = diameter
    tile_size = int(size * 2.8)
    tile = Image.new("RGBA", (tile_size, tile_size), (255, 255, 255, 255))
    draw = ImageDraw.Draw(tile)
    period = 14
    half = period // 2
    for offset in range(-tile_size, tile_size * 2, period):
        draw.polygon(
            [
                (offset, 0),
                (offset + half, 0),
                (offset + half + tile_size, tile_size),
                (offset + tile_size, tile_size),
            ],
            fill=TEAL,
        )

    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
    origin = (tile_size - size) // 2
    disc = tile.crop((origin, origin, origin + size, origin + size))

    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(disc, (0, 0), mask)
    return out


def erase_play_button(img: Image.Image) -> None:
    """Remove the white play control from the bottom-left of the source art."""
    draw = ImageDraw.Draw(img)
    draw.ellipse((68, 662, 208, 768), fill=(*BG, 255))


def paste_on_top(canvas: Image.Image, sprite: Image.Image, xy: tuple[int, int]) -> None:
    canvas.paste(sprite, xy, sprite)


def main() -> None:
    if not SRC.is_file():
        raise SystemExit(f"Missing source image: {SRC}")

    src = Image.open(SRC).convert("RGBA")
    sw, sh = src.size
    if sh != TARGET_H:
        src = src.resize((int(sw * (TARGET_H / sh)), TARGET_H), Image.Resampling.LANCZOS)
        sw, sh = src.size

    erase_play_button(src)

    pad_right = TARGET_W - sw
    canvas = Image.new("RGBA", (TARGET_W, TARGET_H), (*BG, 255))
    canvas.paste(src, (0, 0), src)

    if pad_right > 0:
        right_fill = Image.new("RGBA", (pad_right, TARGET_H), (*BG, 255))
        canvas.paste(right_fill, (sw, 0))

    # Vector circles — always composited last, on top of photo + white fill.
    top_disc = make_striped_circle(176)
    bottom_disc = make_striped_circle(152)

    paste_on_top(canvas, top_disc, (292, -22))
    paste_on_top(canvas, bottom_disc, (28, TARGET_H - bottom_disc.size[1] + 6))
    paste_on_top(canvas, top_disc, (sw + 56, -22))
    paste_on_top(canvas, bottom_disc, (TARGET_W - bottom_disc.size[0] - 40, TARGET_H - bottom_disc.size[1] + 6))

    out = canvas.convert("RGB")
    out_path = OUT_DIR / "featured-female-founder-show.png"
    out_2x_path = OUT_DIR / "featured-female-founder-show@2x.png"
    out.save(out_path, format="PNG", optimize=False)

    out_2x = out.resize((TARGET_W * 2, TARGET_H * 2), Image.Resampling.LANCZOS)
    out_2x.save(out_2x_path, format="PNG", optimize=False)

    print(f"Wrote {out_path} ({out.size[0]}x{out.size[1]})")
    print(f"Wrote {out_2x_path} ({out_2x.size[0]}x{out_2x.size[1]})")


if __name__ == "__main__":
    main()
