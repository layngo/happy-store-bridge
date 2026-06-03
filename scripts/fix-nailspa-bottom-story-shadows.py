#!/usr/bin/env python3
"""Strip baked AI drop shadows from NAILSPA bottom story PNGs; export transparent cutouts."""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "nailspa-pdp" / "story"
SITE_BG = (250, 250, 250)
FILES = [
    ("bottom-hook.png", 0.32, True),  # zone_frac, flood_left_edge
    ("bottom-hero.png", 0.34, False),
]


def cd(a: tuple[int, int, int], b: tuple[int, int, int]) -> int:
    return max(abs(a[0] - b[0]), abs(a[1] - b[1]), abs(a[2] - b[2]))


def chroma(r: int, g: int, b: int) -> int:
    return max(r, g, b) - min(r, g, b)


def lum(r: int, g: int, b: int) -> float:
    return (r + g + b) / 3


def is_subject(r: int, g: int, b: int) -> bool:
    c, l = chroma(r, g, b), lum(r, g, b)
    if c > 42:
        return True
    if c > 26 and 88 < l < 245:
        return True
    if r > g + 9 and r > b + 9 and 68 < l < 248:
        return True
    return False


def is_wall(r: int, g: int, b: int, a: int) -> bool:
    if a < 128:
        return True
    if cd((r, g, b), (255, 255, 255)) <= 38:
        return True
    return chroma(r, g, b) < 16 and lum(r, g, b) > 238


def is_shadow_grey(r: int, g: int, b: int) -> bool:
    c, l = chroma(r, g, b), lum(r, g, b)
    return c < 48 and 88 < l < 228


def flood_mask(
    w: int,
    h: int,
    seeds: list[tuple[int, int]],
    predicate,
) -> list[list[bool]]:
    seen = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()
    for x, y in seeds:
        if 0 <= x < w and 0 <= y < h and not seen[y][x] and predicate(x, y):
            seen[y][x] = True
            q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and predicate(nx, ny):
                seen[ny][nx] = True
                q.append((nx, ny))
    return seen


def process(path: Path, zone_frac: float, flood_left: bool) -> None:
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()

    def get(x: int, y: int) -> tuple[int, int, int, int]:
        return px[x, y]

    # Wall / studio white → transparent
    wall = flood_mask(
        w,
        h,
        [(x, 0) for x in range(w)]
        + [(x, h - 1) for x in range(w)]
        + [(0, y) for y in range(h)]
        + [(w - 1, y) for y in range(h)],
        lambda x, y: is_wall(*get(x, y)),
    )
    for y in range(h):
        for x in range(w):
            if wall[y][x]:
                px[x, y] = (0, 0, 0, 0)

    y0 = int(h * (1 - zone_frac))

    def shadow_seed_predicate(x: int, y: int) -> bool:
        if y < y0:
            return False
        r, g, b, a = get(x, y)
        if a < 20 or is_subject(r, g, b):
            return False
        return is_shadow_grey(r, g, b)

    shadow_seeds = [(x, y) for y in range(y0, h) for x in range(w) if shadow_seed_predicate(x, y)]

    if flood_left:
        for y in range(h):
            r, g, b, a = get(0, y)
            if a >= 20 and not is_subject(r, g, b) and is_shadow_grey(r, g, b):
                shadow_seeds.append((0, y))

    shadow = flood_mask(w, h, shadow_seeds, shadow_seed_predicate)
    for y in range(h):
        for x in range(w):
            if shadow[y][x]:
                px[x, y] = (0, 0, 0, 0)

    # Flood grey shadow upward from bottom edge (contact shadow under product)
    def bottom_shadow_predicate(x: int, y: int) -> bool:
        r, g, b, a = get(x, y)
        if a < 20 or is_subject(r, g, b):
            return False
        return is_shadow_grey(r, g, b)

    bottom_seeds = [
        (x, h - 1)
        for x in range(w)
        if bottom_shadow_predicate(x, h - 1)
    ]
    bottom_shadow = flood_mask(w, h, bottom_seeds, bottom_shadow_predicate)
    for y in range(h):
        for x in range(w):
            if bottom_shadow[y][x]:
                px[x, y] = (0, 0, 0, 0)

    # Bottom-edge dark contact blobs
    for y in range(int(h * 0.92), h):
        for x in range(w):
            r, g, b, a = get(x, y)
            if a < 20 or is_subject(r, g, b):
                continue
            if chroma(r, g, b) < 50 and lum(r, g, b) < 200:
                px[x, y] = (0, 0, 0, 0)

    # Near-white fringe adjacent to transparency
    for _ in range(2):
        for y in range(h):
            for x in range(w):
                r, g, b, a = get(x, y)
                if a >= 20:
                    continue
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if not (0 <= nx < w and 0 <= ny < h):
                        continue
                    nr, ng, nb, na = get(nx, ny)
                    if na >= 200 and chroma(nr, ng, nb) < 24 and lum(nr, ng, nb) > 228:
                        px[nx, ny] = (0, 0, 0, 0)

    # Strip grey pixels in a band below the lowest colorful content
    ymax = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = get(x, y)
            if a < 128:
                continue
            if chroma(r, g, b) > 32 or lum(r, g, b) < 215:
                ymax = max(ymax, y)
    strip_from = min(h, ymax + 6)
    for y in range(strip_from, h):
        for x in range(w):
            r, g, b, a = get(x, y)
            if a < 20:
                continue
            if not is_subject(r, g, b) and chroma(r, g, b) < 52:
                px[x, y] = (0, 0, 0, 0)

    im.save(path, optimize=True)
    opaque = sum(1 for p in im.getdata() if p[3] > 128)
    print(f"  {path.name}: {100 * opaque / (w * h):.0f}% opaque pixels")


def main() -> None:
    print("Fixing NAILSPA bottom story shadows…")
    for name, zone, left in FILES:
        path = ROOT / name
        if not path.is_file():
            print(f"  missing {path}")
            continue
        process(path, zone, left)
    print("Done.")


if __name__ == "__main__":
    main()
