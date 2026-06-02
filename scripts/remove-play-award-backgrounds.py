#!/usr/bin/env python3
"""Remove uniform corner backgrounds from play award badge images (edge flood-fill)."""

from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

AWARDS_DIR = Path(__file__).resolve().parents[1] / "public" / "play-awards"
TOLERANCE = 40


def corner_background_rgb(pixels: np.ndarray) -> np.ndarray:
    h, w = pixels.shape[:2]
    samples = np.stack(
        [
            pixels[0, 0, :3],
            pixels[0, w - 1, :3],
            pixels[h - 1, 0, :3],
            pixels[h - 1, w - 1, :3],
        ],
        axis=0,
    ).astype(np.float32)
    return np.median(samples, axis=0)


def flood_background_mask(rgb: np.ndarray, bg: np.ndarray, tolerance: float) -> np.ndarray:
    h, w = rgb.shape[:2]
    is_bg = np.zeros((h, w), dtype=bool)
    visited = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for y, x in ((0, 0), (0, w - 1), (h - 1, 0), (h - 1, w - 1)):
        queue.append((y, x))

    tol_sq = tolerance * tolerance

    while queue:
        y, x = queue.popleft()
        if visited[y, x]:
            continue
        visited[y, x] = True

        diff = rgb[y, x] - bg
        if float(np.dot(diff, diff)) > tol_sq:
            continue

        is_bg[y, x] = True
        if y > 0:
            queue.append((y - 1, x))
        if y + 1 < h:
            queue.append((y + 1, x))
        if x > 0:
            queue.append((y, x - 1))
        if x + 1 < w:
            queue.append((y, x + 1))

    return is_bg


def remove_background(path: Path) -> None:
    img = Image.open(path).convert("RGBA")
    pixels = np.array(img, dtype=np.float32)
    bg = corner_background_rgb(pixels)
    is_bg = flood_background_mask(pixels[:, :, :3], bg, TOLERANCE)

    pixels[:, :, 3] = np.where(is_bg, 0, 255).astype(np.uint8)
    out = Image.fromarray(pixels.astype(np.uint8))
    out_path = path.with_suffix(".png")
    out.save(out_path, optimize=True)
    if out_path != path and path.suffix.lower() in {".jpg", ".jpeg"}:
        path.unlink()
    print(f"  {out_path.name}")


def main() -> int:
    if not AWARDS_DIR.is_dir():
        print(f"Missing {AWARDS_DIR}", file=sys.stderr)
        return 1

    files = sorted(
        p for p in AWARDS_DIR.iterdir() if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}
    )
    print(f"Processing {len(files)} award images in {AWARDS_DIR}")
    for path in files:
        remove_background(path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
