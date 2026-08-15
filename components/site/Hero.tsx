"use client";

import { motion } from "motion/react";
import { GridLines } from "@/components/primitives/GridLines";
import { TextReveal } from "@/components/primitives/TextReveal";
import { hero, site } from "@/lib/content";
import { EASE } from "@/lib/motion";

/**
 * Act I — the opening slide.
 *
 * One sentence, five words of range, and the page.
 *
 * IT HAS BEEN THREE THINGS AND THIS IS THE THIRD, so the reasoning is worth
 * keeping. It began as a headline over six real product frames composed at
 * depth, with a lead paragraph and a three-column promise strip beneath: every
 * element defensible, the whole a collage, and no way to say what the most
 * important object on the screen was. That was replaced with a single
 * dimensional object — a dark slab with the six products passing through it —
 * on the principle that six focal points is none and one is one. The principle
 * holds. The object did not: it was the most elaborate thing on the site and it
 * was still, in the end, a box of screenshots standing next to the sentence
 * that actually makes the argument.
 *
 * So the screen is now the sentence. Nothing has replaced the object, and that
 * is the point — a claim this size does not need a picture beside it to be
 * taken seriously, and the six products are one scroll away in an act that
 * shows each of them at the size of the window.
 *
 * WHAT NOT TO ADD BACK. The temptation on a screen with this much air is to
 * fill it, and every previous version of this file lost the same argument the
 * same way: something reasonable gets added, then something reasonable next to
 * it, and the claim ends up as one of four things rather than the only one. The
 * two figures that used to sit under the object are not here for exactly that
 * reason — the count act carries both of them at full size on the very next
 * screen, so repeating them here would be the page saying the same thing twice
 * in three hundred pixels.
 *
 * ON A PHONE nothing changes but the scale. There is no composition to re-cut.
 */
/**
 * Sets `hero.emphasis` in the accent wherever it closes a line, and returns the
 * rest of the line untouched.
 *
 * Done here rather than in `lib/content.ts` so the copy stays a string a
 * non-engineer can edit without meeting a `<span>`. The line is still one
 * continuous piece of text in the DOM — the colour change is inside it, not a
 * second element beside it — so the mask reveal, the line breaks and anything
 * reading the page aloud are all unaffected.
 */
function accent(line: string) {
  if (!line.endsWith(hero.emphasis)) return line;

  return (
    <>
      {line.slice(0, -hero.emphasis.length)}
      <span className="text-accent">{hero.emphasis}</span>
    </>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      data-tone="light"
      data-lattice="hero"
      className="relative flex min-h-[100svh] flex-col justify-center pb-16 pt-24 md:pb-20 md:pt-32"
    >
      {/* Column rules sit below the lattice canvas; everything else above it.
          See the layering contract in components/primitives/Section.tsx. */}
      <GridLines columns={6} className="-z-10 hidden md:block" />

      <div className="container-page relative z-10">
        {/* --- Slide header: what we do / where we are ------------------- */}
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

        {/* --- The claim -------------------------------------------------
            Set against the left edge and given the width of the page. The
            three-line break is authored rather than left to wrapping — see
            `type-display` in the stylesheet for the size that keeps it. */}
        <TextReveal
          as="h1"
          className="type-display mt-14 -ml-[0.05em] md:mt-20"
          stagger={0.1}
          delay={0.22}
          lines={hero.headline.map(accent)}
        />

        {/* --- The range, as five words. Nothing follows it. ------------- */}
        <motion.ul
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
          className="type-label mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-ink-45 md:mt-16"
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
    </section>
  );
}
