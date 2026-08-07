"use client";

import Image from "next/image";
import { motion } from "motion/react";

/**
 * A phone, drawn in CSS rather than shipped as a PNG bezel.
 *
 * Drawing it means the frame scales with the layout, stays crisp on every
 * display, and costs nothing to download. The construction is four nested
 * boxes:
 *
 *   rim      a 1px vertical gradient standing in for the light that catches
 *            the top and bottom of a metal band
 *   band     the band itself
 *   bezel    the black surround the screen sits in
 *   screen   the capture, clipped
 *
 * Everything is sized in rem against a width the caller sets, and the corner
 * radii step down box by box. Concentric radii are the whole illusion — a frame
 * whose inner and outer corners share one radius reads as a rectangle with a
 * border, not as an object.
 */

/** Seconds for one float cycle. Different per phone so the pair never pulses in time. */
const FLOAT = { duration: 9, ease: "easeInOut" as const, repeat: Infinity };

export function PhoneMockup({
  src,
  alt,
  /** Travel of the idle float, in px. Under 12 or it stops reading as "floating". */
  drift = 8,
  delay = 0,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  drift?: number;
  delay?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{ y: [0, -drift, 0] }}
      transition={{ ...FLOAT, delay }}
    >
      {/* Side buttons. Drawn behind the band so they read as embedded in it. */}
      <span
        aria-hidden
        className="absolute -left-[2px] top-[17%] h-[4.5%] w-[3px] rounded-l-full bg-[#3a3a3f]"
      />
      <span
        aria-hidden
        className="absolute -left-[2px] top-[24%] h-[7.5%] w-[3px] rounded-l-full bg-[#3a3a3f]"
      />
      <span
        aria-hidden
        className="absolute -left-[2px] top-[33.5%] h-[7.5%] w-[3px] rounded-l-full bg-[#3a3a3f]"
      />
      <span
        aria-hidden
        className="absolute -right-[2px] top-[27%] h-[11%] w-[3px] rounded-r-full bg-[#3a3a3f]"
      />

      {/* Rim → band */}
      <div
        className="relative rounded-[2.6rem] bg-gradient-to-b from-[#75757c] via-[#2a2a2e] to-[#5e5e66] p-px
                   shadow-[0_2px_6px_rgb(20_19_15/0.10),0_28px_50px_-24px_rgb(20_19_15/0.38),0_60px_110px_-50px_rgb(20_19_15/0.45)]"
      >
        <div className="rounded-[2.58rem] bg-gradient-to-b from-[#3c3c42] via-[#26262b] to-[#3c3c42] p-[3px]">
          {/* Bezel */}
          <div className="relative rounded-[2.4rem] bg-[#070709] p-[5px]">
            {/* Screen */}
            <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.1rem] bg-void">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 280px, 45vw"
                priority={priority}
                quality={92}
                className="object-cover object-top"
              />

              {/* Dynamic island. Inside the screen, as it is on the device. */}
              <span
                aria-hidden
                className="absolute left-1/2 top-[9px] h-[22px] w-[32%] -translate-x-1/2 rounded-full bg-black"
              />

              {/* Glass. One diagonal sheen at low opacity — enough to say the
                  screen has a surface, not enough to obscure the interface. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.14)_0%,rgb(255_255_255/0.04)_22%,transparent_46%)]"
              />
              {/* Inner edge, so the capture does not meet the bezel flat. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[2.1rem] ring-1 ring-inset ring-white/10"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
