## Why the preview is failing

The Vite dev server is throwing a syntax error and refusing to compile the app:

```text
Internal server error: Expression expected
File: /dev-server/src/components/CosmoPdpStory.tsx
Line 352: <<<<<<< HEAD
```

`src/components/CosmoPdpStory.tsx` contains an **unresolved Git merge conflict** — the literal `<<<<<<< HEAD`, `=======`, and `>>>>>>>` marker lines are still in the source code. SWC (the TS/JSX parser) sees these as invalid expressions, so the whole module fails to load and the preview goes blank.

I scanned the rest of the project and this is the **only** file with conflict markers. Once it's resolved, the preview should come back.

## The conflict (lines 351–365)

Both sides render the third "Pack up in seconds" image, but they differ in two ways:

| | HEAD side | Incoming side |
|---|---|---|
| Image size | Larger (340/520/560px) | Smaller (232/360/388px) with negative top margins |
| Component | `<RippleLipImage ... />` (custom effect) | Plain `<img ... />` |

The shared closing `src=`, `alt=`, `className=`, `loading=`, `scale={7}` props sit *below* the conflict block, so whichever opening tag we keep must be the one that those props belong to.

Note: `scale={7}` is a `RippleLipImage`-only prop — a plain `<img>` will warn about it. That's a strong signal the intended version is the **HEAD / `RippleLipImage`** side.

## Recommended resolution

Keep the **HEAD side** (larger image + `RippleLipImage`):

```text
<div className="flex w-full justify-end self-end pr-0">
  <div className="relative ml-auto mr-0 w-full max-md:max-w-[min(76vw,340px)] md:max-w-[min(62vw,520px)] lg:max-w-[560px]">
    <RippleLipImage
      src="/cosmo-pdp/story/image3.png"
      alt=""
      className="block h-auto w-full object-contain object-bottom object-right max-md:max-h-[min(34vh,320px)] md:max-h-[min(60vh,560px)] lg:max-h-[620px]"
      loading="lazy"
      scale={7}
    />
    <ArrowOverlay ... />
```

…and delete the three conflict marker lines (352, 355, 358) plus the duplicate `<div>` / `<img>` opener from the incoming side.

## Steps

1. Open `src/components/CosmoPdpStory.tsx`.
2. Replace lines 351–358 with the HEAD version above (one `<div>` wrapper + `<RippleLipImage` opener), leaving lines 359+ untouched so the existing props/closing tags still pair correctly.
3. Save — Vite will auto-reload and the preview should render again.
4. If you actually intended the smaller/plain-`<img>` variant instead, let me know and I'll resolve it the other way (and drop the `scale={7}` prop).

## Want me to apply the fix?

Switch back to Build mode and I'll resolve it with the HEAD version. If you'd prefer the incoming (smaller image, plain `<img>`) version, just say so.
