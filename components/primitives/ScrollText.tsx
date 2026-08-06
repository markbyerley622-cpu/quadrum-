"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { useRef } from "react";

/**
 * Scroll-linked word illumination.
 *
 * The sentence is dim, and scrolling lights it word by word — so the reader's
 * pace sets the reveal rather than a fixed timeline. Used exactly once, on the
 * philosophy statement, because it is expensive attention to spend.
 *
 * Implementation notes:
 *  - Words are real text in a real element; the effect is opacity only, so it
 *    is inert to screen readers, search engines and text selection.
 *  - Opacity-only means it composites on the GPU and never triggers layout.
 */

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);

  return (
    <span className="inline-block whitespace-pre">
      <motion.span style={{ opacity }} className="inline-block">
        {children}
      </motion.span>
    </span>
  );
}

export function ScrollText({
  text,
  className = "",
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  as?: "p" | "h2" | "h3";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Starts once the block is well into view, finishes before it leaves —
    // so the sentence is never still lighting up as it exits.
    offset: ["start 0.85", "end 0.55"],
  });

  const words = text.split(" ");

  if (reduced) {
    return (
      <div ref={ref}>
        <Tag className={className}>{text}</Tag>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <Tag className={className}>
        {words.map((word, i) => {
          const start = i / words.length;
          const end = (i + 1) / words.length;
          return (
            <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
              {i === words.length - 1 ? word : `${word} `}
            </Word>
          );
        })}
      </Tag>
    </div>
  );
}
