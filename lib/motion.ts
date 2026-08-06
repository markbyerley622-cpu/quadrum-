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
