# Cinematic Scroll Portfolio — Setup Notes

## 1. Drop in your frames
Put `frame_0001.webp` → `frame_0300.webp` in `assets/sequence/`.

Export tips for smooth scrubbing without killing mobile:
- **Resolution**: export at 1920×1080 max. The canvas draws at `devicePixelRatio`
  capped to `1.75` (see `MAX_DPR` in `main.js`), so anything higher just wastes
  bandwidth.
- **File size**: WebP quality 65–75 is usually indistinguishable during a fast
  scrub. Aim for ~15–35KB/frame → a 300-frame set lands around 5–10MB total.
- **Frame count**: 300 is a lot for mobile data. If you want a lighter build,
  drop to 120–150 frames and change `FRAME_COUNT` in `main.js` — the scrub math
  doesn't care how many frames there are.

## 2. How the scrub maps to content
`index.html` has four overlay panels (`data-panel="hero|career|projects|outro"`)
sitting on top of the canvas inside `.pin-wrap`. Their visible ranges are set
in `main.js` → `panelRanges`, as fractions of the total scrub (0 = frame 1,
1 = frame 300):

```js
const panelRanges = {
  hero:     [0.00, 0.16],
  career:   [0.22, 0.46],
  projects: [0.52, 0.80],
  outro:    [0.86, 1.00],
};
```

Nudge these to match whatever's actually happening in your frame sequence at
those points (e.g. if the camera "arrives" at a career-relevant moment at
frame 90, that's `90/300 = 0.30`).

## 3. Swapping in your real content
Replace the placeholder copy in the `.overlay-hero` / `.overlay-career` /
`.overlay-projects` panels in `index.html`, and the `#skills` / `#contact`
sections further down, with your actual resume content. The GTA6/Vice-City
color and type tokens from your original file are preserved in `style.css`
(`--magenta`, `--cyan`, Bebas Neue / JetBrains Mono / Rajdhani), so anything
you paste in will inherit the same look.

## 4. Performance checklist already handled
- Bounded-concurrency preloader (`LOAD_CONCURRENCY = 8`) instead of firing 300
  requests at once.
- Canvas redraws are skipped unless the rounded frame index actually changes.
- `devicePixelRatio` capped at 1.75 so retina/high-DPI phones don't push huge
  canvases.
- `prefers-reduced-motion` fully disables the pin/scrub: last frame is shown
  statically and panels are revealed via a normal fade instead.
- Lenis's RAF is the single driver for both smooth scroll and
  `ScrollTrigger.update`, avoiding duplicate scroll listeners.

## 5. If it feels heavy on real devices
- Cut `FRAME_COUNT` (fewer, still-smooth steps — human eyes rarely need 300
  distinct frames over 500vh).
- Reduce `scrub-container` height from `500vh` if 5x viewport feels excessive
  for your content.
- Consider swapping WebP → AVIF if your build pipeline supports it, for
  another ~20–30% size reduction at equivalent quality.
