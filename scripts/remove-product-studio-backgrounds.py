#!/usr/bin/env python3
"""Remove near-white studio backgrounds from product PNGs (Nailspa heroes, Lite diagram, Nailspa bottom)."""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public"

TARGETS = [
    *sorted((ROOT / "products/lay-n-go-nailspa-18/heroes").glob("*.png")),
    ROOT / "nailspa-pdp/story/bottom-hero.png",
    ROOT / "nailspa-pdp/story/bottom-hook.png",
    *sorted((ROOT / "products/lay-n-go-lite-18").glob("*.png")),
    *sorted((ROOT / "products/lay-n-go-lifestyle-44").glob("*.png")),
]

SKIP = {
    "image1.png",
    *{p.name for p in (ROOT / "products/lay-n-go-lite-18").glob("lite-gallery-*.png")},
    *{p.name for p in (ROOT / "products/lay-n-go-lifestyle-44").glob("lifestyle-gallery-*.png")},
}

TOL = 36
SOFT = 18
NEAR_WHITE_LUM = 242
NEAR_WHITE_CHROMA = 18

LITESTRAP_SRC = Path(
    "/Users/tombro/.cursor/projects/Users-tombro-happy-store-bridge-1/assets/"
    "fdfd-8d10ba29-21d3-4785-a701-083dfb9464b0.png"
)
LITESTRAP_OUT = ROOT / "products/lay-n-go-lite-18/litestrap.png"
LITESTRAP_SIZE = 512
LITESTRAP_FILL = 0.9


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


def remove_background_rgba(
    im: Image.Image,
    *,
    bg_rgb: tuple[int, int, int] | None = None,
    tol: int = TOL,
    soft: int = SOFT,
    near_white_lum: float = NEAR_WHITE_LUM,
    near_white_chroma: int = NEAR_WHITE_CHROMA,
) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    bg = bg_rgb if bg_rgb is not None else sample_background(im)

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
        if color_dist((r, g, b), bg) <= tol:
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
            if color_dist((r, g, b), bg) <= tol:
                seen[ny][nx] = True
                bg_mask[ny][nx] = True
                q.append((nx, ny))

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) / 3
            chroma = max(r, g, b) - min(r, g, b)
            if bg_mask[y][x] or (lum >= near_white_lum and chroma <= near_white_chroma):
                px[x, y] = (r, g, b, 0)
                continue
            d = color_dist((r, g, b), bg)
            if d <= tol + soft:
                t = max(0.0, min(1.0, (d - tol) / max(soft, 1)))
                px[x, y] = (r, g, b, int(t * 255))

    return im


# Site `bg-background` ≈ hsl(0 0% 98%) → #fafafa
SITE_BG_RGB = (250, 250, 250)

FLANK_SOURCES = {
    "story-flank-left.png": Path(
        "/Users/tombro/.cursor/projects/Users-tombro-happy-store-bridge-1/assets/"
        "litelite-22365047-940a-4d28-8120-7fb50d3f38b9.png"
    ),
    "story-flank-right.png": Path(
        "/Users/tombro/.cursor/projects/Users-tombro-happy-store-bridge-1/assets/"
        "lite33-17af9887-8790-4b65-8816-0c48997da099.png"
    ),
}


def trim_alpha_bbox(im: Image.Image, pad: int = 8) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(im.width, x1 + pad)
    y1 = min(im.height, y1 + pad)
    return im.crop((x0, y0, x1, y1))


def process_flank_file(src: Path, out: Path) -> None:
    im = remove_background_rgba(
        Image.open(src),
        bg_rgb=SITE_BG_RGB,
        tol=50,
        soft=22,
        near_white_lum=244,
        near_white_chroma=24,
    )
    im = trim_alpha_bbox(im, pad=12)
    out.parent.mkdir(parents=True, exist_ok=True)
    im.save(out, optimize=True)
    tr = sum(1 for p in im.getdata() if p[3] < 20)
    print(f"  {out.relative_to(ROOT.parent)} (flank) — {100 * tr / len(im.getdata()):.0f}% transparent")


def build_litestrap_circle(src: Path, out: Path) -> None:
    im = remove_background_rgba(Image.open(src))
    bbox = im.getbbox()
    if not bbox:
        raise SystemExit(f"no content in {src}")
    im = im.crop(bbox)
    cw, ch = im.size
    side = max(cw, ch)
    pad_side = int(side / LITESTRAP_FILL)
    square = Image.new("RGBA", (pad_side, pad_side), (0, 0, 0, 0))
    square.paste(im, ((pad_side - cw) // 2, (pad_side - ch) // 2))
    out_im = square.resize((LITESTRAP_SIZE, LITESTRAP_SIZE), Image.Resampling.LANCZOS)
    out.parent.mkdir(parents=True, exist_ok=True)
    out_im.save(out, optimize=True)
    out_im.save(out.parent / "callout-handle.png", optimize=True)
    tr = sum(1 for p in out_im.getdata() if p[3] < 20)
    print(f"  {out.relative_to(ROOT.parent)} (circle crop) — {100 * tr / len(out_im.getdata()):.0f}% transparent")


def process_file(path: Path, *, use_site_bg: bool = False) -> None:
    src = Image.open(path)
    if use_site_bg:
        im = remove_background_rgba(
            src,
            bg_rgb=SITE_BG_RGB,
            tol=50,
            soft=22,
            near_white_lum=244,
            near_white_chroma=24,
        )
        im = trim_alpha_bbox(im, pad=8)
    else:
        im = remove_background_rgba(src)
    im.save(path, optimize=True)
    tr = sum(1 for p in im.getdata() if p[3] < 20)
    print(f"  {path.relative_to(ROOT.parent)} — {100 * tr / len(im.getdata()):.0f}% transparent")


LIFESTYLE_STUDIO = {
    p.name
    for p in (ROOT / "products/lay-n-go-lifestyle-44").glob("*.png")
    if p.name not in SKIP and p.name.startswith(("callout-", "feature-", "hero-", "play-"))
}


def main() -> None:
    print("Removing studio backgrounds…")
    for path in TARGETS:
        if path.name in SKIP:
            print(f"  skip {path.name}")
            continue
        if path.name in ("litestrap.png", "callout-handle.png"):
            continue
        if not path.is_file():
            print(f"  missing {path}")
            continue
        use_site = path.name in LIFESTYLE_STUDIO or "lay-n-go-lite-18" in str(path)
        process_file(path, use_site_bg=use_site)

    if LITESTRAP_SRC.is_file():
        print("Building litestrap callout from user asset…")
        build_litestrap_circle(LITESTRAP_SRC, LITESTRAP_OUT)
    else:
        print(f"  warn: litestrap source missing at {LITESTRAP_SRC}")

    print("Rebuilding Lite play-strip flanks for site background…")
    lite_dir = ROOT / "products/lay-n-go-lite-18"
    for name, src in FLANK_SOURCES.items():
        out = lite_dir / name
        if src.is_file():
            process_flank_file(src, out)
        else:
            print(f"  warn: flank source missing {src}")

    print("Done.")


if __name__ == "__main__":
    main()
