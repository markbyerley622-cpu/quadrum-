"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE, viewport } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait after the element enters the viewport. */
  delay?: number;
  /** Travel distance in px. Set 0 for a pure fade. */
  y?: number;
  duration?: number;
  className?: string;
};

/**
 * The default scroll-reveal. Deliberately understated: 22px of travel and an
 * opacity change. Anything larger starts to feel like a template.
 */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  duration = 0.85,
  className,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
