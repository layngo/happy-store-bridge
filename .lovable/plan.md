## What I found

Audited the whole codebase against WCAG 2.1 AA / ADA. The site already does a lot right (shadcn primitives, most images have alt, headings are mostly clean, forms use `Label`+`Input`), but there are real gaps to close.

### Critical (must fix)
1. **Missing `<main>` landmark on most pages.** Only `Search`, `AboutUsV2`, `CosmoArrowPlayground`, and `StaticPageLayout` wrap content in `<main>`. The Home page, Product Detail (PDP), Collection, Collections Index, Cosmetic Bags V2, Military/First Responder, NotFound, and PolicyBridge all render their primary content in a `<div>`. Screen reader / keyboard users can't jump to main content.
2. **Icon-only buttons without accessible names.**
   - `CartDrawer` — remove (trash), qty –, qty + buttons have no `aria-label`.
   - `ProductDetail` quantity stepper – / + (3 instances) have no `aria-label`.
3. **`index.html` metadata is the Lovable default** — title is "Lovable App", description is "Lovable Generated Project", OG image points at lovable.dev. Screen readers announce the title; search/social cards are broken. Needs real Lay-n-Go title/description/OG image.

### Warning (degraded experience)
4. **`min-h-screen` everywhere** (~15 pages). On mobile this causes layout jumps when the URL bar shows/hides. Replace with `min-h-dvh` for the root layout wrappers.
5. **Low-contrast text on light backgrounds.** `SearchBar` uses `text-slate-400` / `placeholder:text-slate-400` over `bg-white/80` (PDP "light" mode). That's roughly 3:1 — fails AA for body text. Swap to design tokens (`text-muted-foreground` on the appropriate surface, or a darker slate).
6. **`tabIndex={-1}` on a hero anchor in `Index.tsx` line 106.** Need to verify it isn't removing a normally-focusable element from the tab order. If it's on a visible `<a>` / `<button>`, remove it.
7. **PDP gallery uses two parallel sets of prev/next buttons** (desktop hidden md:inline-flex, mobile only md:hidden). Both are labeled "Show previous photo" — duplicating the same a11y name in the DOM is harmless but the live region announcing "Photo X of Y" should be inside a single region, not duplicated. (Minor — verify on PDP.)

### Info / nice-to-have
8. Add a **"Skip to main content"** link as the first focusable element so keyboard users can bypass the header/nav.
9. **Decorative images** (`alt=""` already used in a few places — `CosmoPdpStory`, gallery arrows) — extend the audit to any remaining purely-decorative imagery and ensure they're `alt=""` not missing.
10. Confirm focus-visible rings render on all custom-styled buttons (a few PDP "light" buttons override `border-*` without an explicit `focus-visible:ring-*`).

## What I will change

### 1. Page landmark structure
Add `<main id="main-content">` wrappers to every top-level page that's currently using a `<div>`:
- `Index.tsx`, `ProductDetail.tsx`, `Collection.tsx`, `CollectionsIndex.tsx`, `CosmeticBagsV2.tsx`, `MilitaryFirstResponder.tsx`, `NotFound.tsx`, `PolicyBridge.tsx`.
- Keep the existing flex column wrapper; just change the inner content container from `<div>` → `<main>`. Exactly one `<main>` per route.

### 2. Skip link
Add a `SkipToMain` component rendered once at the top of `AppContent`:
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded focus:bg-foreground focus:px-3 focus:py-2 focus:text-background">
  Skip to main content
</a>
```

### 3. Icon-button labels
- `CartDrawer`: add `aria-label="Remove {product title}"`, `aria-label="Decrease quantity"`, `aria-label="Increase quantity"`.
- `ProductDetail` quantity stepper(s): same `aria-label`s on – / +. Also wrap the qty number in `aria-live="polite"` so screen readers hear the new value.

### 4. `index.html` metadata
Replace placeholders with:
- `<title>Lay-n-Go — Organizational Solutions for Life, Play &amp; Travel</title>`
- Real meta description (~150 chars about Lay-n-Go's patented activity mat & carryall system).
- Real OG/Twitter title, description, image (use an existing hero asset from `/public`).
- Add `<meta name="theme-color" content="..."/>` and a canonical link tag.

### 5. Viewport height
Project-wide find/replace `min-h-screen` → `min-h-dvh` on the page root wrappers (keep `min-h-screen` only inside shadcn `ui/*` primitives we don't touch).

### 6. Contrast fixes
- `SearchBar` (light variant): change `text-slate-400` / `placeholder:text-slate-400` → `text-slate-600` / `placeholder:text-slate-500` (≥4.5:1 on white).
- Sweep for `text-neutral-{300,400}` / `text-gray-{300,400}` over light surfaces and bump to the next darker step where they're body text.

### 7. Verify `tabIndex={-1}` in `Index.tsx`
Open the file at line 106; if it's on a normally-interactive element with no manual focus-management reason, remove it. If it's a wrapper a `<Carousel>` programmatically focuses, leave it and document why.

### 8. Smoke test
After edits: open `/`, `/collections`, `/collections/cosmetic-bags`, a couple of PDPs, and `/pages/contact` in the preview, tab through with the keyboard, and confirm:
- Skip link appears on first Tab.
- Header / nav / "Add to cart" / quantity stepper / cart drawer are all reachable and labeled.
- Focus ring is visible everywhere.

## Out of scope (call out, don't fix here)
- Full color audit of every PDP marketing section's typography (Cosmo story, large callouts) — those use lots of arbitrary `text-neutral-*` over imagery. Worth a separate dedicated pass.
- Video components (`VimeoLoopFadeEmbed`) — autoplay/muted is fine; captions are a Vimeo-side setting.
- A proper ADA legal accessibility statement page (recommend adding `/pages/accessibility` later linking to a public contact for accommodations).

## Estimated work
~9 files touched. No dependencies added. No behavior changes — purely additive a11y + metadata + token-based contrast fixes.
