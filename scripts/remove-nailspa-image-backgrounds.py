#!/usr/bin/env python3
"""Remove near-white backgrounds from Nailspa / Lite product PNGs (flood-fill from edges)."""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public"

# Product / lifestyle assets only — not story diagrams or decorative accents.
TARGETS = [
    *sorted((ROOT / "products/lay-n-go-nailspa-18/heroes").glob("*.png")),
    ROOT / "nailspa-pdp/story/bottom-hero.png",
    ROOT / "nailspa-pdp/story/bottom-hook.png",
    *sorted((ROOT / "products/lay-n-go-lite-18").glob("*.png")),
]
# Lifestyle gallery shots (real environments) keep their original backgrounds.
SKIP = {"image1.png", *{p.name for p in (ROOT / "products/lay-n-go-lite-18").glob("lite-gallery-*.png")}}

TOL = 30
SOFT = 20


def color_dist(a: tuple[int, int, int], b: tuple[int, int, int]) -> int:
    return max(abs(a[0] - b[0]), abs(a[1] - b[1]), abs(a[2] - b[2]))


def sample_background(im: Image.Image) -> tuple[int, int, int]:
    w, h = im.size
    px = im.load()
    samples: list[tuple[int, int, int]] = []
    for x, y in (
        (0, 0),
        (w - 1, 0),
        (0, h - 1),
        (w - 1, h - 1),
        (w // 2, 0),
        (0, h // 2),
        (w - 1, h // 2),
        (w // 2, h - 1),
    ):
        r, g, b, a = px[x, y]
        if a < 200:
            continue
        samples.append((r, g, b))
    if not samples:
        return (255, 255, 255)
    return (
        sum(c[0] for c in samples) // len(samples),
        sum(c[1] for c in samples) // len(samples),
        sum(c[2] for c in samples) // len(samples),
    )


def remove_background(path: Path) -> None:
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()
    bg = sample_background(im)

    bg_mask = [[False] * w for _ in range(h)]
    seen = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def try_seed(x: int, y: int) -> None:
        if not (0 <= x < w and 0 <= y < h) or seen[y][x]:
            return
        r, g, b, a = px[x, y]
        if a < 128:
            bg_mask[y][x] = True
            seen[y][x] = True
            q.append((x, y))
            return
        if color_dist((r, g, b), bg) <= TOL:
            seen[y][x] = True
            bg_mask[y][x] = True
            q.append((x, y))

    for x in range(w):
        try_seed(x, 0)
        try_seed(x, h - 1)
    for y in range(h):
        try_seed(0, y)
        try_seed(w - 1, y)

    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if not (0 <= nx < w and 0 <= ny < h) or seen[ny][nx]:
                continue
            r, g, b, a = px[nx, ny]
            if a < 128:
                seen[ny][nx] = True
                bg_mask[ny][nx] = True
                q.append((nx, ny))
                continue
            if color_dist((r, g, b), bg) <= TOL:
                seen[ny][nx] = True
                bg_mask[ny][nx] = True
                q.append((nx, ny))

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if bg_mask[y][x]:
                px[x, y] = (r, g, b, 0)
                continue
            d = color_dist((r, g, b), bg)
            lum = (r + g + b) / 3
            chroma = max(r, g, b) - min(r, g, b)
            if d <= TOL + SOFT:
                t = max(0.0, min(1.0, (d - TOL) / max(SOFT, 1)))
                px[x, y] = (r, g, b, int(t * 255))
            elif lum >= 246 and chroma < 14:
                px[x, y] = (r, g, b, 0)

    im.save(path, optimize=True)
    data = list(im.getdata())
    tr = sum(1 for p in data if p[3] < 20)
    print(f"  {path.relative_to(ROOT.parent)} — {100 * tr / len(data):.0f}% transparent")


def main() -> None:
    print("Removing backgrounds…")
    for path in TARGETS:
        if path.name in SKIP:
            print(f"  skip {path.name}")
            continue
        if not path.is_file():
            print(f"  missing {path}")
            continue
        remove_background(path)
    print("Done.")


if __name__ == "__main__":
    main()
