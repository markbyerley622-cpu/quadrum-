# Quantar

Marketing site for a founder-led product strategy, design and engineering studio.

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Motion · TypeScript.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # every route prerenders to static
npm run typecheck
```

## The page is a narrative, not a stack of sections

Seven acts. Each ends with a **hinge** carrying the question the next act
answers, so the reader is handed forward rather than dropped into a new topic.

| | Act | Surface |
| --- | --- | --- |
| I | Opening — the claim | paper |
| II | The tension — why software fails, and the four forces behind it | dark |
| III | The turn — build for lasting performance, not launch day | dark → paper |
| IV | The approach — where you are, then how we work | paper |
| V | The proof — three problems worked through, and what that covers | paper |
| VI | The people — who does it, and what we refuse to do | paper |
| VII | The invitation | dark |

Three things resolve together across the page, all driven by scroll:

- the argument moves from problem to answer;
- the surface runs paper → dark → paper → dark, dissolving rather than cutting
  at the turn;
- the lattice orders itself from a chaotic cloud into a built structure.

**The chaos happens on the dark surface and the order on the light one.** That
coupling is the whole idea. Reordering the acts means re-checking `orderAt()`
in `lib/lattice.ts`.

If you edit an act, check that the hinge leading into it still asks the right
question. Hinges live in `hinges` in `lib/content.ts`.

## The lattice

One object, one canvas, the whole page — `components/lattice/Lattice.tsx`.

Sixty points hold two positions: a chaotic cloud tangled by arbitrary
dependencies, and an ordered architectural lattice. Scroll interpolates between
them, so the object *is* complexity resolving into structure rather than an
illustration of it. Four points resolve into the accent, late — the decisions
only read as decisive once the structure around them exists.

It is a fixed 2D canvas, not WebGL. Sixty points and ~175 hairlines cost
nothing, run at frame rate on a phone, and add no dependency; hairline strokes
in ink are already the page's visual language.

Three things worth knowing before changing it:

- **Placement is DOM-driven.** Acts declare where the object should sit via
  `data-lattice` (see `PLACEMENTS` in `lib/lattice.ts`). Scroll-progress
  keyframes were the obvious approach and the wrong one — they are pinned to
  document proportions, so editing one paragraph slides the object onto a
  column of text three acts away. The rule the placements encode: **the object
  never occupies the side the text is on**, and it is loudest in the hinges
  where there is nothing to read.
- **Tone is resolved per primitive, not per frame.** The object regularly
  straddles a dark/light boundary; a single global tone would leave half of it
  invisible. Each line and point asks what surface *it* is over, feathered
  across the edge.
- **Geometry is deterministic.** Seeded PRNG, no `Math.random`, so the object
  is identical on every load.

Under `prefers-reduced-motion` it renders the finished structure once and never
animates.

## Layering

The canvas floats *between* a section's surface and its content:

```
-z-10   surface   painted below the canvas
 z-0    canvas    fixed, in the root stacking context
 z-10   content   painted above the canvas
```

This only works because sections never create a stacking context. Everything
goes through `components/primitives/Section.tsx` — including the dark hinges
and the footer, which paint their own surfaces the same way. If you need a
decorative layer behind the canvas, it has to be rendered *by* `Section` (see
the `fadeOut` prop), not passed in as a child: children sit inside the `z-10`
wrapper, which both creates a stacking context and is inset by the section's
padding.

## Where things live

```
app/
  layout.tsx        fonts, metadata, motion provider, skip link
  page.tsx          the act order + JSON-LD
  globals.css       design system — tokens, type scale, motion, a11y
lib/
  content.ts        every string, organised by act
  lattice.ts        lattice geometry, placements, order curve
  motion.ts         shared easing, durations, variants
components/
  lattice/          the canvas renderer
  primitives/       Section, Hinge, Reveal, TextReveal, ScrollText, Rule…
  site/             one file per act
  visuals/          the three SVG concept-study diagrams
```

**All copy lives in `lib/content.ts`.**

## Design system

Driven by `@theme` tokens in `app/globals.css`.

| Token group | Notes |
| --- | --- |
| `--color-paper*` | Warm off-white surfaces. `paper-sunk` alternates sections. |
| `--color-ink*` | Warm near-black, never `#000`. Four opacity steps. |
| `--color-void`, `--color-bone*` | The inverted (dark) acts. |
| `--color-accent` | Burnt sienna. The **only** hue on the site. |
| `--color-rule*` | Hairlines — the main structural device. |
| `--ease-quad` | One easing curve, used by both CSS and Motion. |

Type is a fixed scale (`.type-display` → `.type-label`) with tracking hand-set
per size. Measure classes (`.measure`, `.measure-lead`) hold line lengths in the
readable range. Prefer these over ad-hoc `text-*` utilities.

## Motion

- `MotionConfig reducedMotion="user"` in `app/layout.tsx` disables transform and
  layout animation under `prefers-reduced-motion`; a CSS media query in
  `globals.css` covers keyframe animations. Both are deliberate.
- Only opacity and transform are animated, so nothing triggers layout.
- Word-by-word scroll illumination (`ScrollText`) is used **once**, on the turn.
  It hands the pace of the sentence to the reader, which is worth spending once
  and cheap-looking twice.
- **Do not set `strokeDasharray` on an element animated with `pathLength`** —
  Motion implements `pathLength` using dasharray and silently overrides it. Use
  the `fadeIn()` helper in `components/visuals/WorkVisuals.tsx` instead.

## Content notes

Three places state the studio's position rather than inventing social proof:

- **Selected work** is labelled *Concept study* in the copy, because it is.
- **Studio principles** sit inside the process stage each belongs to. They are
  Quantar's own positions, not client testimonials — inventing attributed
  praise for a studio presenting concept studies would be dishonest. If real,
  permissioned client quotes exist, give them their own act.
- **`metrics`** describes how the work is staffed. No client count, revenue
  figure or satisfaction score.

## Before going live

- Set the real domain in `site.url` (`lib/content.ts`) — it drives canonical
  URLs, Open Graph, `sitemap.xml` and `robots.txt`.
- Add `app/opengraph-image.tsx` (or a static `opengraph-image.png`); the
  Twitter card is declared `summary_large_image` and currently has no image.

## Notes

- **`API_KEY_21ST` is tooling-only.** It lives in `.env.local` (gitignored; see
  `.env.example`) and is read by the [21st.dev](https://21st.dev) CLI and MCP
  server when searching for or installing components — `npx @21st-dev/cli`. The
  site itself never reads it and makes no requests to 21st.dev at runtime. It is
  a secret key, so it must never be exposed as `NEXT_PUBLIC_*`. The CLI also
  accepts `TWENTYFIRST_TOKEN` or `--api-key`; note that `21st whoami` reports
  "not logged in" for API keys — it only recognises browser login sessions, so
  use `21st teams` or `21st bookmarks` to confirm a key works.
- `experimental.useTypeScriptCli` is enabled in `next.config.ts` because
  TypeScript 7 does not expose the JS compiler API Next uses for type checking.
- No raster images anywhere — the concept-study diagrams and the lattice are
  vector and canvas, so there are no image requests and no layout shift.
