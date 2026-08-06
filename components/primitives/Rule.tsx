"use client";

import { motion } from "motion/react";
import { drawRule, viewport } from "@/lib/motion";

/**
 * A hairline that draws itself in from the left when it enters view.
 *
 * Rules are the site's main structural device, so animating them is what makes
 * a section feel like it is being *set* rather than simply faded in.
 */
export function Rule({
  className = "",
  invert = false,
  delay = 0,
}: {
  className?: string;
  invert?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden
      className={`h-px w-full origin-left ${
        invert ? "bg-rule-invert" : "bg-rule"
      } ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={drawRule}
      transition={{ delay }}
    />
  );
}
