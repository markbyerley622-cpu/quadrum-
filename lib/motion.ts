import type { Transition, Variants } from "motion/react";

/**
 * One motion language for the whole site.
 *
 * Rule of thumb applied throughout: motion communicates arrival and hierarchy,
 * never decoration. Durations sit between 0.5s and 0.9s — fast enough not to
 * hold the reader up, slow enough to read as intentional rather than snappy.
 */

/** The house curve. Matches --ease-quad in globals.css. */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/**
 * The house curve as a function, for the rare animation driven by
 * `requestAnimationFrame` rather than by CSS or `motion` — a number counting up,
 * for instance. `EASE` is a set of bezier control points: a transition can
 * consume those, a counter cannot.
 *
 * This is easeOutQuint, which tracks cubic-bezier(0.22, 1, 0.36, 1) closely
 * enough that a figure counting under it and a panel sliding under the CSS curve
 * read as the same gesture. Solving the bezier per frame would be more correct
 * and indistinguishable.
 */
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 5);

export const transition = {
  /** Default for content arriving on scroll. */
  reveal: { duration: 0.85, ease: EASE } satisfies Transition,
  /** Masked line reveals — slightly longer, they travel further. */
  line: { duration: 0.95, ease: EASE } satisfies Transition,
  /** Interface feedback: hover, expand, nav state. */
  ui: { duration: 0.42, ease: EASE } satisfies Transition,
  /** Full-screen menu. */
  overlay: { duration: 0.62, ease: EASE_IN_OUT } satisfies Transition,
} as const;

/** Shared viewport config so every section triggers at the same point. */
export const viewport = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -8% 0px",
} as const;

/** Fade + short rise. The workhorse. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: transition.reveal },
};

/** Parent that staggers its children's `fadeUp`. */
export const stagger = (
  staggerChildren = 0.075,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Child of a masked container — slides up from fully below the mask. */
export const maskedLine: Variants = {
  hidden: { y: "108%" },
  visible: { y: "0%", transition: transition.line },
};

/** Hairline rules that draw themselves left-to-right. */
export const drawRule: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.1, ease: EASE },
  },
};
