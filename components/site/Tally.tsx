"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { easeOut } from "@/lib/motion";
import type { Figure } from "@/lib/content";

/**
 * One figure, counted up the first time it is seen.
 *
 * The count is the whole point of animating these: a number that fades in is
 * decoration, and a number that RUNS is the reader watching a total accumulate.
 * It is also the one place on this page where motion carries meaning rather than
 * polish, which is why it is spent here and not on the headline above it.
 *
 * Three rules keep it from being a gimmick:
 *
 *  1. IT RUNS ONCE. Re-counting every time the reader scrolls back would turn a
 *     fact into a toy, and by the second pass they are trying to read it.
 *  2. IT NEVER LIES ABOUT THE SHAPE. The value is rendered with its final digit
 *     count throughout, so "$19.9M" does not begin life as "$0M" and jump width
 *     — the layout is stable from the first frame and nothing reflows around it.
 *  3. IT RESOLVES EXACTLY. The last frame is assigned from the source value
 *     rather than left wherever the easing landed, so the number on screen is
 *     the number in the content file, to the digit.
 *
 * Under `prefers-reduced-motion` the final value is rendered immediately and no
 * observer is created at all.
 */
export function Tally({ figure }: { figure: Figure }) {
  const { value, decimals = 0, prefix = "", suffix = "" } = figure;

  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let start = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        // Long enough to read as counting, short enough that a reader scrolling
        // at speed still sees it land. Below about 700ms it reads as a flicker.
        const duration = 1100;

        const step = (now: number) => {
          start ||= now;
          const t = Math.min((now - start) / duration, 1);
          setShown(t === 1 ? value : value * easeOut(t));
          if (t < 1) frame = requestAnimationFrame(step);
        };

        frame = requestAnimationFrame(step);
      },
      // Most of the figure has to be on screen. A count that finishes while the
      // number is still under the fold is a count nobody saw.
      { threshold: 0.6 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reduced, value]);

  return (
    <span
      ref={ref}
      // `tabular-nums` is doing real work: without it every digit change nudges
      // the number's width and the whole column jitters for a second.
      className="type-display tnum block text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.92] tracking-[-0.045em] text-ink"
    >
      {prefix}
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}
