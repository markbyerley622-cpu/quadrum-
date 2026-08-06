"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { EASE, viewport } from "@/lib/motion";

/**
 * The connective tissue between acts.
 *
 * This is the device that stops the page reading as a stack of sections: each
 * act ends by asking the question the next act answers, and a hairline draws
 * itself downward into that act as you scroll. You are never told a section has
 * ended — you are handed the next question.
 *
 * The line's height is bound to scroll rather than triggered on entry, so it
 * tracks the reader instead of playing at them.
 */
export function Hinge({
  act,
  question,
  dark = false,
}: {
  /** The act being entered, e.g. "II · The proof". */
  act: string;
  question: string;
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const height = useTransform(scrollYProgress, [0.15, 0.55], ["0%", "100%"]);

  const rule = dark ? "bg-rule-invert-strong" : "bg-rule-strong";
  const faint = dark ? "bg-rule-invert" : "bg-rule";

  return (
    <div
      ref={ref}
      data-tone={dark ? "dark" : "light"}
      // Hinges are the one place with almost nothing to read, so the object
      // gets to be at full strength here.
      data-lattice="hinge"
      // Tightened once the proof act went full-bleed. Three hinges at the old
      // scale cost the better part of two screens of pure connective tissue,
      // which is a lot of scroll to spend on a question mark.
      className="relative py-14 md:py-20"
    >
      {/* A dark hinge joins two dark acts, so it has to carry the surface
          itself. Same layering contract as `Section`. */}
      {dark ? <div aria-hidden className="absolute inset-0 -z-10 bg-void" /> : null}

      <div className="container-page relative z-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Line in */}
          <div className={`relative h-12 w-px md:h-16 ${faint}`}>
            <motion.div
              style={{ height }}
              className={`absolute inset-x-0 top-0 w-px ${rule}`}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewport}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className={`type-label mt-8 ${dark ? "text-bone-60" : "text-ink-45"}`}
          >
            {act}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.9, ease: EASE, delay: 0.18 }}
            className={`type-serif mt-5 text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.15] ${
              dark ? "text-bone" : "text-ink"
            }`}
          >
            {question}
          </motion.p>

          {/* Line out */}
          <div className={`mt-8 h-12 w-px md:h-16 ${faint}`}>
            <motion.div
              style={{ height }}
              className={`w-px ${rule}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
