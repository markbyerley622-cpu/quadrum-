"use client";

import { motion } from "motion/react";
import { GridLines } from "@/components/primitives/GridLines";
import { TextReveal } from "@/components/primitives/TextReveal";
import { Core } from "@/components/site/Core";
import { hero, site } from "@/lib/content";
import { EASE } from "@/lib/motion";

/**
 * Act I — the opening slide.
 *
 * It is built as a slide rather than as a landing-page hero, and the difference
 * is what is NOT here. There is no lead paragraph, no three-item promise strip,
 * no feature row, and no gallery. There is one claim, one object, and two
 * numbers.
 *
 * WHAT THIS REPLACED, and why polishing it further was the wrong move. The
 * previous hero ran the headline over six real product frames composed at depth,
 * with a paragraph and a three-column standfirst beneath. Every element was
 * defensible and the whole was a collage: six things moving behind a seventh
 * thing to read. Asked what the most important object on that screen was, a
 * visitor could not have said — which means the screen had no position, only
 * contents. The fix was not a better arrangement of six frames. It was one
 * frame, with the other five inside it. See `Core`.
 *
 * THE HIERARCHY, which is the part that must not be traded away:
 *
 *      claim  →  one focal object  →  tiny supporting fact
 *
 * Anything added to this screen has to displace something, not join it. The
 * negative space is the most expensive thing here and the easiest to spend by
 * accident.
 *
 * THE SCREEN IS ENTERED, NOT LEFT. Scrolling pushes the core toward the reader
 * and through them, which is the same gesture the proof act uses between
 * products — so the page opens with the move it is going to keep making, and
 * the first product arrives as the far side of the object rather than as the
 * next section.
 *
 * ON A PHONE the composition is not reproduced, it is re-cut: the claim, the
 * sectors, the object at full width, the two facts as one quiet row. Nothing is
 * shrunk to fit and nothing overlaps.
 */
export function Hero() {
  return (
    <section
      id="top"
      data-tone="light"
      data-lattice="hero"
      className="relative flex min-h-[100svh] flex-col justify-center pb-10 pt-24 md:pb-16 md:pt-32"
    >
      {/* Column rules sit below the lattice canvas; everything else above it.
          See the layering contract in components/primitives/Section.tsx. */}
      <GridLines columns={6} className="-z-10 hidden md:block" />

      <div className="container-page relative z-10">
        {/* --- Slide header: what we do / where we are -------------------
            Full width above the composition rather than inside a column, so
            the screen reads as a plate with a header rule rather than as a
            two-column layout with a caption. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.45 }}
            className="type-label max-w-[30ch] leading-[1.7] text-ink-45 lg:max-w-none"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.55 }}
            className="type-label flex items-center gap-2.5 text-ink-45"
          >
            <span aria-hidden className="size-[5px] shrink-0 rounded-full bg-accent animate-blink" />
            {site.location}
          </motion.p>
        </div>

        {/* --- The composition -------------------------------------------
            Claim left, object right, both centred on one line, with the page's
            margins doing most of the work. Stacking the two vertically was
            tried first and could not be made to fit: three lines of 88px type
            plus a viewport-scale object is more than one screen, so the object
            ended up half below the fold and the screen lost its subject. Set
            side by side, the claim and the object are both whole, and the empty
            space between and around them is the composition rather than what is
            left over from it.

            Below `lg` this collapses to one column in the same order — the
            claim, then the thing it is about. */}
        <div className="mt-12 grid grid-cols-1 items-center gap-y-12 md:mt-16 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
          <div className="lg:col-span-6">
            <TextReveal
              as="h1"
              className="type-display -ml-[0.05em]"
              stagger={0.1}
              delay={0.22}
              lines={[hero.headline[0], hero.headline[1], hero.headline[2]]}
            />

            {/* The range, as five words. No paragraph follows it, and that is
                the single biggest cut on this screen. */}
            <motion.ul
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
              className="type-label mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-ink-45 md:mt-12"
            >
              {hero.sectors.map((sector, i) => (
                <li key={sector} className="flex items-center gap-3">
                  {i > 0 ? (
                    <span aria-hidden className="block size-[3px] bg-ink-25" />
                  ) : null}
                  {sector}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* The object. It arrives last and slowest of anything on the screen:
              by the time it has resolved, the claim has been read, which is the
              order the two are meant to land in. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.7, ease: EASE, delay: 0.4 }}
            className="lg:col-span-5 lg:col-start-8"
          >
            <Core facts={hero.facts} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
