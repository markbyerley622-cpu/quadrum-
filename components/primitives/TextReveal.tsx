"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ElementType, ReactNode } from "react";
import { maskedLine, stagger, viewport } from "@/lib/motion";

type TextRevealProps = {
  /** Pre-split lines. Splitting is authored, not measured — no layout thrash. */
  lines: readonly ReactNode[];
  as?: ElementType;
  className?: string;
  /** Per-line offset. 0.09s reads as one gesture; more reads as a list. */
  stagger?: number;
  delay?: number;
};

/**
 * Masked line reveal. Each line sits in an overflow-clipped block and rises
 * into it, so the type appears to be uncovered rather than moved.
 *
 * The text is always present in the DOM as real text — the mask is purely
 * visual, so this costs nothing in accessibility or SEO.
 */
export function TextReveal({
  lines,
  as: Tag = "h2",
  className,
  stagger: staggerAmount = 0.09,
  delay = 0,
}: TextRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={stagger(staggerAmount, delay)}
    >
      <Tag className={className}>
        {lines.map((line, i) => (
          // pb/-mb pair gives descenders room without opening a visual gap.
          <span key={i} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
            <motion.span className="block will-change-transform" variants={maskedLine}>
              {line}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  );
}
