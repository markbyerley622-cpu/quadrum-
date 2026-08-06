"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";

/**
 * `reducedMotion="user"` makes every transform and layout animation in the app
 * respect prefers-reduced-motion automatically — elements resolve straight to
 * their final position, and only opacity is allowed to change.
 *
 * This is belt-and-braces with the CSS media query in globals.css: the CSS
 * covers keyframe animations, this covers everything driven by Motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASE }}>
      {children}
    </MotionConfig>
  );
}
