"use client";

import { useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * One scroll-progress source for a whole composition.
 *
 * The element's pass through the viewport is published as a single CSS custom
 * property, `--p` — 0 as the top edge arrives from below, 1 as the bottom edge
 * leaves the top — and everything inside consumes it in `calc()`. That is one
 * subscription and one style write per frame for an entire product spread, no
 * matter how many things are moving in it.
 *
 * The alternative — a `useTransform` per moving part, or worse a `useState` on
 * scroll — costs a React render per frame per element, and this act has six
 * spreads with up to three moving objects in each.
 *
 * WHY `--p` RESTS AT 0.5. The compositions are all written around `--c`:
 *
 *     --c: calc((var(--p) - 0.5) * 2)     →  -1 … 0 … 1
 *
 * so the neutral, at-rest composition is the one at `--c: 0`, which is exactly
 * what an untouched `--p: 0.5` produces. Under `prefers-reduced-motion` the
 * subscription is simply never attached: the property never changes, every shot
 * renders in its resting composition, and the act becomes a static cinematic
 * portfolio with no second code path to keep in sync. Nothing is disabled,
 * hidden or special-cased — the camera just does not move.
 */
export function ScrollStage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // `start end → end start` is the element's entire pass through the viewport,
  // so a shot is already moving before the reader sees it and keeps moving
  // after it has gone. A camera that parks at the centre of the screen and
  // waits is the thing that makes a scroll page read as a stack of cards.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    // Four decimals: below the point where a 1px difference on a 4K display is
    // resolvable, and short enough that the string is cheap to build.
    return scrollYProgress.on("change", (value) => {
      el.style.setProperty("--p", value.toFixed(4));
    });
  }, [reduced, scrollYProgress]);

  return (
    <div
      ref={ref}
      className={`stage ${className}`}
      style={{ ["--p" as string]: "0.5" }}
    >
      {children}
    </div>
  );
}
