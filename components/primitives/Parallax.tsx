"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Scroll-linked depth for a single element.
 *
 * Two things move, both cheap and both on the compositor: a small vertical
 * offset, and — optionally — a fraction of a degree of Y rotation that resolves
 * to flat as the element reaches the middle of the viewport. The rotation is
 * what reads as "premium" rather than "animated": the object appears to settle
 * into the page instead of sliding onto it.
 *
 * Rules that keep this from becoming a gimmick:
 *
 *  - the offset stays under ~40px, so foreground and background never visibly
 *    desync and nothing important drifts out of its container;
 *  - the tilt maxes out at ~2.5°, below the angle at which text inside the
 *    element starts to look distorted;
 *  - the progress is spring-smoothed, so a trackpad flick does not translate
 *    into a jerk;
 *  - `prefers-reduced-motion` returns the children untouched, with no wrapper
 *    and no scroll listener at all.
 *
 * Never wrap body copy in this. It is for plates, devices and decorative
 * layers — anything the reader is expected to *read* has to hold still.
 */
export function Parallax({
  children,
  /** Total travel in px across the element's pass through the viewport. */
  distance = 28,
  /** Starting Y rotation in degrees. Negative tilts the left edge away. */
  tilt = 0,
  className = "",
}: {
  children: ReactNode;
  distance?: number;
  tilt?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // `start end → end start` covers the element's entire pass through the
  // viewport, so progress is 0 as it appears from below and 1 as it leaves.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  const y = useTransform(smooth, [0, 1], [distance, -distance]);
  // Flat and full size by the time the element is centred (progress 0.5), and
  // it stays that way on the way out — a tilt that returns on exit reads as a
  // wobble, and something that shrinks as it leaves reads as a mistake.
  const rotateY = useTransform(smooth, [0, 0.5, 1], [tilt, 0, 0]);
  const scale = useTransform(smooth, [0, 0.5, 1], [0.975, 1, 1]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className} style={{ perspective: 2200 }}>
      <motion.div style={{ y, rotateY, scale, transformStyle: "preserve-3d" }}>
        {children}
      </motion.div>
    </div>
  );
}
