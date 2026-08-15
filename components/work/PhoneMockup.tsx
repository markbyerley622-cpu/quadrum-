"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ProductFilm } from "@/components/work/ProductFilm";

/**
 * A phone, drawn in CSS rather than shipped as a PNG bezel.
 *
 * Holds either a screenshot or a running film — see `film` below.
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
  /**
   * A recording to run in the screen instead of a still.
   *
   * The frame was built for screenshots and this is the one product whose
   * capture is of the app itself, on a phone, in portrait — so the honest way
   * to show it is running inside the device it was recorded on rather than
   * letterboxed into a landscape plate. When present, `src` is ignored.
   */
  film,
  /**
   * Width ÷ height of the screen, where the thing inside it is not a native
   * 9:19.5 capture.
   *
   * A device frame exists to say "this is what the product looks like in a
   * hand", and it stops saying that the moment the picture inside it is cropped
   * or letterboxed to fit a screen shape the recording never had. So the screen
   * takes its aspect from the recording, and the phone reads as whatever phone
   * that recording came off — Combat's capture is 252x548, which is a hair
   * taller than 9:19.5.
   */
  screenAspect,
  /**
   * The dynamic island. On by default, because a screen capture of an app has a
   * status bar the island belongs in front of. Turn it OFF for footage that is
   * a composed scene rather than a capture — an island drawn over a graded shot
   * is a black pill covering somebody's picture.
   */
  island = true,
  /** Travel of the idle float, in px. Under 12 or it stops reading as "floating". */
  drift = 8,
  delay = 0,
  priority = false,
  className = "",
}: {
  src?: string;
  alt: string;
  film?: { src: string; poster: string; still: string };
  screenAspect?: number;
  island?: boolean;
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
            <div
              className="relative w-full overflow-hidden rounded-[2.1rem] bg-void"
              style={{ aspectRatio: screenAspect ?? 9 / 19.5 }}
            >
              {film ? (
                <ProductFilm
                  src={film.src}
                  poster={film.poster}
                  still={film.still}
                  alt={alt}
                  priority={priority}
                  // The screen is about 262px across at its largest, so this is
                  // the size the still is fetched at. The film's own delivery
                  // width is set in scripts/build-work-video.js.
                  sizes="280px"
                />
              ) : src ? (
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(min-width: 1024px) 280px, 45vw"
                  priority={priority}
                  quality={92}
                  className="object-cover object-top"
                />
              ) : null}

              {/* Dynamic island. Inside the screen, as it is on the device. */}
              {island ? (
                <span
                  aria-hidden
                  className="absolute left-1/2 top-[9px] h-[22px] w-[32%] -translate-x-1/2 rounded-full bg-black"
                />
              ) : null}

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
