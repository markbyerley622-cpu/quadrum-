"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { GridLines } from "@/components/primitives/GridLines";
import { TextReveal } from "@/components/primitives/TextReveal";
import { ProductCanvas } from "@/components/site/ProductCanvas";
import { hero, site } from "@/lib/content";
import { EASE } from "@/lib/motion";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Depth, not spectacle: the hero drifts up slightly slower than the page and
  // dims as the next section arrives, so the transition feels like one move.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);

  return (
    <section
      ref={ref}
      id="top"
      data-tone="light"
      data-lattice="hero"
      className="relative flex min-h-[100svh] flex-col justify-end pb-8 pt-28 md:pb-10"
    >
      {/* Column rules sit below the lattice canvas; everything else above it.
          See the layering contract in components/primitives/Section.tsx. */}
      <GridLines columns={6} className="-z-10 hidden md:block" />

      {/* The evidence, behind the claim. Six real product frames at depth — see
          ProductCanvas for why the opening screen shows the work rather than an
          abstraction, and how the composition stays out of the headline's way. */}
      <ProductCanvas />

      <motion.div style={{ y, opacity }} className="container-page relative z-10">
        {/* --- Top line: who we are / where we are ----------------------- */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 pb-10 md:pb-14">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.5 }}
            className="type-label max-w-[30ch] leading-[1.7] text-ink-45 lg:max-w-none"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.6 }}
            className="type-label flex items-center gap-2.5 text-ink-45"
          >
            <span aria-hidden className="size-[5px] shrink-0 rounded-full bg-accent animate-blink" />
            {site.location}
          </motion.p>
        </div>

        {/* --- The statement --------------------------------------------- */}
        <TextReveal
          as="h1"
          className="type-display -ml-[0.055em]"
          stagger={0.1}
          delay={0.28}
          lines={[
            hero.headline[0],
            hero.headline[1],
            <span key="l3">
              Built to <span className="type-serif pr-[0.04em]">last.</span>
            </span>,
          ]}
        />

        {/* --- Lead, offset right. Asymmetry is the point. ---------------- */}
        <div className="mt-12 grid grid-cols-1 gap-y-10 md:mt-16 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-5 lg:col-span-4">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.9 }}
              className="h-px w-full origin-left bg-rule-strong md:w-16"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: EASE, delay: 0.85 }}
            className="md:col-span-7 lg:col-span-6 lg:col-start-6"
          >
            <p className="type-lead measure text-ink-70">{hero.lead}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* --- Standfirst strip: the promise, as three facts ---------------- */}
      <div className="container-page relative z-10 mt-12 md:mt-16">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 1 }}
          className="h-px w-full origin-left bg-rule"
        />
        <ul className="grid grid-cols-1 sm:grid-cols-3">
          {hero.standfirst.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 1.1 + i * 0.08 }}
              className={`flex items-baseline gap-3 py-4 sm:py-5 ${
                i > 0 ? "border-t border-rule sm:border-l sm:border-t-0 sm:pl-6" : ""
              }`}
            >
              <span className="type-label tnum text-ink-25">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="type-small text-ink-70">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* --- Scroll cue --------------------------------------------------- */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 1.5 }}
        className="container-page relative z-10 mt-6 hidden md:block"
      >
        <div className="flex items-center gap-3">
          <span className="type-label text-ink-25">Scroll</span>
          <span className="relative block h-px w-14 overflow-hidden bg-rule">
            <motion.span
              className="absolute inset-y-0 left-0 w-1/3 bg-ink-45"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
            />
          </span>
        </div>
      </motion.div>
    </section>
  );
}
