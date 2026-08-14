"use client";

import { useReducedMotion, useScroll } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * THE CORE — the one object the opening screen is about.
 *
 * A studio site's first screen has one job: make a stranger believe, before
 * they have read anything, that the things being claimed actually exist. The
 * previous answer was six real product frames floating at depth behind the
 * headline. Every frame was real and the composition was carefully kept out of
 * the type's way, and it still failed, for a reason no amount of polish could
 * fix: SIX FOCAL POINTS IS NO FOCAL POINT. A reader arriving on that screen had
 * to choose what to look at, and a screen that asks the visitor to do the
 * art direction reads as a portfolio collage rather than as a position.
 *
 * So there is now exactly one object, and the six products are INSIDE it.
 *
 * WHAT IT IS. A tall, near-black slab standing in the paper with real product
 * captures passing through it — one at a time, held four seconds each, wound
 * down hard under a vignette so what you see first is texture and depth rather
 * than a screenshot. The intended sequence of reactions is:
 *
 *      1. what is that
 *      2. something is moving in it
 *      3. those are the products
 *
 * Which is the opposite order to the collage, where the reader got (3) instantly
 * and never got (1) at all.
 *
 * WHY IT IS AN OBJECT AND NOT A PICTURE. Three things do that work, and all
 * three are cheap:
 *
 *  1. IT HAS A SIDE. A second face is rotated 90° off the right edge in real 3D,
 *     so the slab has thickness. This is the single detail that stops it reading
 *     as a rectangle with a video in it — you can see that it is a solid.
 *  2. IT STANDS ON SOMETHING. A soft contact shadow beneath it, and the paper
 *     runs on all sides. An object with ground has weight.
 *  3. IT ANSWERS TO THE POINTER. Both faces rotate together off the cursor, so
 *     the side face widens and narrows as you move. Depth you can verify by
 *     moving your hand is depth; a drop shadow is a claim about depth.
 *
 * HOW IT MOVES, in one animation frame for the whole thing. The pointer and the
 * hero's scroll progress are written as three custom properties on the stage —
 * `--cx`, `--cy`, `--hp` — and every moving part is a `calc()` off them. That is
 * one rAF and one scroll subscription for the entire opening screen, versus a
 * React state update per frame, which is how a hero like this ends up costing
 * more than the rest of the page put together.
 *
 * As the reader scrolls, the core comes toward them and dissolves — the camera
 * pushes into the object and out the other side, into the first product. The
 * hero does not "fade out"; it is entered.
 *
 * NO WEBGL, and that is a decision rather than a limitation. Everything above is
 * six images, two rotated planes and a keyframe cycle. A canvas would add a
 * runtime, a loading state, a fallback and a frame budget to do the same thing
 * less crisply, on a screen whose entire argument is restraint.
 *
 * NOTHING HERE IS INVENTED. Every frame in the procession is a real capture of a
 * real running product, and every one of them appears again, at full size and
 * in context, in the proof act below. The opening screen introduces nothing it
 * cannot then prove.
 */

/**
 * The procession, ordered for contrast rather than by product index — a dark
 * console next to a lit aerial next to a red card wall. Six near-identical dark
 * interfaces in a row would read as one image failing to change.
 *
 * These are the same stills the proof act falls back to under reduced motion,
 * so they cost nothing new and they are already sized for the page.
 */
const FRAMES = [
  { src: "/work/video/drk-demo.jpg", product: "DRK" },
  { src: "/work/video/linton-hero.jpg", product: "Linton Villas" },
  { src: "/work/noise.jpg", product: "Noise" },
  { src: "/work/video/combat-demo.jpg", product: "Combat Reviews" },
  { src: "/work/pepay.jpg", product: "Pepay" },
  { src: "/work/video/bnbpay-demo.jpg", product: "BNBPay" },
] as const;

/** Seconds each frame holds. The whole cycle is this × FRAMES.length. */
const HOLD = 4;

export function Core({
  facts,
}: {
  facts: readonly { value: string; label: string }[];
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // `start start → end start` is the hero's own exit: 0 while the opening
  // screen is at rest, 1 once it has fully left. Deliberately not the shared
  // `ScrollStage`, whose range is an element's whole pass through the viewport
  // — the hero starts at the top of the document, so half of that range is
  // scroll that can never happen and the object would begin part-way through
  // its own move.
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const el = stageRef.current;
    if (!el || reduced) return;

    let frame = 0;
    // Where the pointer is, and where the object has caught up to. The gap
    // between them is the whole feel: tracking the cursor exactly reads as a
    // gimmick, lagging behind it reads as mass.
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    const onPointer = (event: PointerEvent) => {
      // Ignore touch. A finger is not a hovering pointer, and reacting to it
      // makes the object lurch the moment someone starts scrolling.
      if (event.pointerType !== "mouse") return;
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const draw = () => {
      frame = requestAnimationFrame(draw);
      x += (targetX - x) * 0.04;
      y += (targetY - y) * 0.04;
      el.style.setProperty("--cx", x.toFixed(4));
      el.style.setProperty("--cy", y.toFixed(4));
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    frame = requestAnimationFrame(draw);

    const stop = scrollYProgress.on("change", (value) => {
      el.style.setProperty("--hp", value.toFixed(4));
    });

    return () => {
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(frame);
      stop();
    };
  }, [reduced, scrollYProgress]);

  return (
    <div
      ref={stageRef}
      className="core-stage"
      style={{
        ["--cx" as string]: "0",
        ["--cy" as string]: "0",
        ["--hp" as string]: "0",
      }}
    >
      <div className="core-shell">
        <div className="core">
          {/* The front face: the aperture, and the only part that is clipped. */}
          <div className="core-face">
            <div className="core-reel">
              {FRAMES.map((frame, i) => (
                <span
                  key={frame.src}
                  className="core-layer"
                  style={{ animationDelay: `${-i * HOLD}s` }}
                >
                  <Image
                    src={frame.src}
                    alt=""
                    fill
                    // The core is at most 34rem wide on the largest screen it
                    // will ever be shown on. Asking for more than that is six
                    // full-size product captures on the first paint.
                    sizes="(min-width: 1024px) 34rem, 78vw"
                    // Only the first frame is on screen at first paint; the
                    // other five have four seconds or more to arrive.
                    priority={i === 0}
                    quality={82}
                    className="object-cover object-center"
                  />
                </span>
              ))}
            </div>

            {/* Wound down hard. The products are texture at this size, and a
                legible screenshot here would give the game away before the
                object has had a chance to be an object. */}
            <span aria-hidden className="core-veil" />
            {/* One diagonal fall of light, so the front has a surface. */}
            <span aria-hidden className="core-sheen" />
            {/* The inner edge, so the capture never meets the frame flat. */}
            <span aria-hidden className="core-rim" />
          </div>

          {/* The thickness. A real face at 90° to the front — this is what makes
              it a solid rather than a picture of one. */}
          <span aria-hidden className="core-edge" />
        </div>

        {/* Contact shadow. Not a glow: the object is standing on the paper. */}
        <span aria-hidden className="core-ground" />

        {/* Registration marks, held flat while the object turns behind them.
            They belong to the page, not to the slab, which is what makes the
            slab look measured rather than decorated. */}
        <span aria-hidden className="core-mark core-mark--tl" />
        <span aria-hidden className="core-mark core-mark--tr" />
        <span aria-hidden className="core-mark core-mark--bl" />
        <span aria-hidden className="core-mark core-mark--br" />
      </div>

      {/* The plate. Two figures struck into the base of the object, set to its
          own width rather than to the layout grid, so they read as part of the
          thing rather than as a statistics row underneath it. Both repeat a
          number from the count act verbatim. */}
      <div className="core-plate">
        {facts.map((fact) => (
          <p key={fact.label}>
            <span className="tnum text-ink">{fact.value}</span>
            <span className="text-ink-45">{fact.label}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
