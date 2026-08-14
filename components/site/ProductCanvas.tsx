"use client";

import { useScroll, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * The hero's living canvas: real fragments of the six products, composed at
 * depth behind the claim.
 *
 * The point is not decoration and it is not a gallery. A studio site's opening
 * screen has one job — make a stranger believe, before they have read anything,
 * that the things being claimed actually exist. A generic gradient or an
 * abstract 3D object says "we hired a designer". Six frames of a liquidity
 * console, a payment reel, a fight card and a drone pass over a development say
 * "these are running right now", and the reader has taken that in before the
 * headline finishes animating.
 *
 * So every fragment here is a real frame from a real product, and each one is
 * repeated later on the page in its own spread. The hero introduces nothing it
 * cannot then prove.
 *
 * COMPOSITION RULES, which are what keep this from becoming a screenshot collage:
 *
 *  1. NOTHING SITS WHERE THE HEADLINE GOES. The claim is bottom-left and
 *     enormous; the fragments occupy the top band and the right edge, and two of
 *     them run off the page. Anything that would land behind the type is not
 *     placed there and then faded — it is not placed there.
 *  2. THEY ARE EVIDENCE, NOT CONTENT. Held well back in opacity with a paper
 *     wash falling across them, so they read as depth. A reader should notice
 *     what they are on the second look, not the first.
 *  3. DEPTH IS EARNED BY PARALLAX, NOT BY BLUR. Each fragment answers to the
 *     scroll and to the pointer by a factor of its own distance. Blur is what
 *     you reach for when the composition has no real depth in it.
 *
 * HOW IT MOVES, in one animation frame. The pointer position and the scroll
 * progress are written as two custom properties on the container; every fragment
 * consumes them in its own transform, scaled by its depth. That is one rAF and
 * two style writes for the whole composition, no matter how many fragments —
 * versus a state update per fragment per frame, which is how a hero like this
 * ends up costing more than the rest of the page put together.
 *
 * Under `prefers-reduced-motion` the fragments are placed and never move again.
 *
 * NOT SHOWN ON A PHONE, AT ALL. This is the one decision here worth defending,
 * because the obvious move is to keep one fragment and shrink it. That was
 * tried: on a 393px screen the composition has nowhere to go that the type does
 * not already occupy, and the single surviving fragment landed across the
 * eyebrow, the location line and the top of the headline — a screenshot behind
 * 11px tracked caps, in the one place the page says what the studio does. There
 * is no arrangement of a picture and three lines of 9vw type in that space that
 * flatters either. So the phone gets the type alone, at full strength, and the
 * product evidence starts one screen later where it has the room to be seen
 * properly. A deliberately different composition, not a squeezed one.
 */

type Fragment = {
  src: string;
  /** Which product it is from. Not rendered — kept so the set stays auditable. */
  product: string;
  /** Percentages, relative to the hero box. */
  top: string;
  left?: string;
  right?: string;
  /** Width as a viewport-relative size. */
  width: string;
  /** Width ÷ height of the source, so nothing is squashed. */
  aspect: number;
  /** How far it travels. Nearer things move more. */
  depth: number;
  /** Degrees. Small — this is depth, not a scrapbook. */
  rotate: number;
  opacity: number;
};

/**
 * Ordered back to front. The two darkest and most detailed — the DRK console and
 * the Combat card stack — sit furthest from the type, because they are the two a
 * reader's eye goes to first and the headline has to win that contest.
 */
const FRAGMENTS: Fragment[] = [
  {
    src: "/work/video/drk-demo.jpg",
    product: "DRK",
    top: "11%",
    right: "-6%",
    width: "clamp(20rem, 34vw, 40rem)",
    aspect: 16 / 9,
    depth: 26,
    rotate: -1.4,
    opacity: 0.5,
  },
  {
    src: "/work/video/linton-hero.jpg",
    product: "Linton Villas",
    top: "48%",
    right: "3%",
    width: "clamp(13rem, 20vw, 24rem)",
    aspect: 16 / 9,
    depth: 40,
    rotate: 1.6,
    opacity: 0.42,
  },
  {
    src: "/work/video/combat-demo.jpg",
    product: "Combat Reviews",
    top: "9%",
    right: "31%",
    width: "clamp(11rem, 17vw, 20rem)",
    aspect: 1280 / 592,
    depth: 16,
    rotate: 1.1,
    opacity: 0.32,
  },
  {
    // Sits in the notch to the right of the headline's short first line, which
    // is the only pocket of space on the left half of the hero that the type
    // does not eventually occupy. It was previously at 6% from the left, where
    // it was directly behind the word "Complex" — faint, but still a picture
    // underneath a 9vw letterform, which is exactly what the wash exists to
    // prevent rather than to excuse.
    src: "/work/video/pepay-reel.jpg",
    product: "Pepay",
    top: "31%",
    right: "45%",
    width: "clamp(9rem, 12vw, 14rem)",
    aspect: 16 / 9,
    depth: 34,
    rotate: -2,
    opacity: 0.4,
  },
  {
    // The highest fragment, and the one that sets the top edge for all of them.
    // Nothing goes above 9%: the nav is fixed, transparent and sits in the top
    // 60px, and product detail running underneath the navigation is the fastest
    // way to make a hero look busy rather than deep.
    src: "/work/noise.jpg",
    product: "Noise",
    top: "7%",
    // Clear of the eyebrow, which runs to about a third of the way across. At
    // 17% it sat directly under "PRODUCT STRATEGY, DESIGN AND ENGINEERING",
    // which is 11px tracked type over a screenshot — unreadable in the one place
    // the page states what the studio does.
    left: "36%",
    width: "clamp(9rem, 12vw, 15rem)",
    aspect: 4 / 3,
    depth: 21,
    rotate: -0.8,
    opacity: 0.26,
  },
  {
    // The one phone in the set, and the only fragment that is a device rather
    // than a screen. It reads as scale against five rectangles.
    src: "/work/bnbpay-cards.png",
    product: "BNBPay",
    top: "27%",
    right: "25%",
    width: "clamp(5.5rem, 7.5vw, 9rem)",
    aspect: 440 / 953,
    depth: 48,
    rotate: 2.4,
    opacity: 0.4,
  },
];

export function ProductCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let frame = 0;
    // Where the pointer is, and where the composition has caught up to. The gap
    // between them is the whole feel: chasing the cursor exactly reads as a
    // gimmick, lagging behind it reads as weight.
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    const onPointer = (event: PointerEvent) => {
      // Ignore touch: a finger is not a hovering pointer, and reacting to it
      // makes the composition jump the moment someone starts scrolling.
      if (event.pointerType !== "mouse") return;
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const draw = () => {
      frame = requestAnimationFrame(draw);
      x += (targetX - x) * 0.045;
      y += (targetY - y) * 0.045;
      el.style.setProperty("--cx", x.toFixed(4));
      el.style.setProperty("--cy", y.toFixed(4));
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    frame = requestAnimationFrame(draw);

    const stop = scrollYProgress.on("change", (value) => {
      el.style.setProperty("--scroll", value.toFixed(4));
    });

    return () => {
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(frame);
      stop();
    };
  }, [reduced, scrollYProgress]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden lg:block"
      style={{ ["--cx" as string]: 0, ["--cy" as string]: 0, ["--scroll" as string]: 0 }}
    >
      {FRAGMENTS.map((fragment, i) => (
        <figure
          key={fragment.src}
          className={`absolute overflow-hidden border border-rule bg-void
                      shadow-[0_30px_60px_-40px_rgb(20_19_15/0.4)]
                      motion-safe:animate-[q-settle_1.4s_var(--ease-quad)_backwards]`}
          style={{
            top: fragment.top,
            left: fragment.left,
            right: fragment.right,
            width: fragment.width,
            aspectRatio: fragment.aspect,
            opacity: fragment.opacity,
            // Each fragment reads the two shared properties and scales them by
            // its own depth. `translate3d` keeps the whole composition on the
            // compositor rather than triggering layout.
            transform: `
              translate3d(
                calc(var(--cx) * ${fragment.depth}px),
                calc(var(--cy) * ${fragment.depth * 0.6}px + var(--scroll) * ${fragment.depth * 3}px),
                0
              )
              rotate(${fragment.rotate}deg)
            `,
            animationDelay: `${0.35 + i * 0.09}s`,
          }}
        >
          <Image
            src={fragment.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 34vw, 60vw"
            className="object-cover object-center"
          />
        </figure>
      ))}

      {/* The wash. Paper falling from the bottom-left, where the claim sits, so
          the fragments are strongest in the corner furthest from the type and
          have dissolved entirely by the time they reach it. Without this the
          composition and the headline compete, and the headline loses — six
          rectangles of detail beat three words every time. */}
      <div
        className="absolute inset-0 bg-[radial-gradient(125%_105%_at_14%_82%,var(--color-paper)_34%,transparent_74%)]"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-paper to-transparent" />
    </div>
  );
}
